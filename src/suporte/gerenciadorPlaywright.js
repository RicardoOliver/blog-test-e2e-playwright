// =============================================================================
//  src/suporte/gerenciadorPlaywright.js
//  Gerenciador centralizado do ciclo de vida do Playwright.
//  Cria e destrói: chromium/firefox/webkit → Browser → Context → Page
// =============================================================================

import { chromium, firefox, webkit } from 'playwright';
import { configuracao }              from '../configuracao/configuracao.js';

class GerenciadorPlaywright {
  constructor() {
    this._browser  = null;
    this._contexto = null;
    this._pagina   = null;
  }

  // ── Inicialização ──────────────────────────────────────────────────────────

  /**
   * Inicia Playwright, Browser, Context e Page.
   * Chamado no hook @Before de cada cenário.
   */
  async inicializar() {
    const { browser, urls, timeouts, locale, timezone } = configuracao;

    console.log(`\n🚀 Iniciando Playwright | Browser: ${browser.tipo} | Headless: ${browser.headless}`);

    const opcoes = {
      headless:  browser.headless,
      slowMo:    browser.slowMotion,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--lang=pt-BR'],
    };

    this._browser = await this._iniciarBrowser(browser.tipo, opcoes);

    this._contexto = await this._browser.newContext({
      viewport:         { width: browser.viewport.width, height: browser.viewport.height },
      locale,
      timezoneId:       timezone,
      ignoreHTTPSErrors: true,
    });

    this._contexto.setDefaultTimeout(timeouts.padrao);
    this._contexto.setDefaultNavigationTimeout(timeouts.navegacao);

    this._pagina = await this._contexto.newPage();

    // Handler para dialogs (previne XSS tests de travar)
    this._pagina.on('dialog', async (dialog) => {
      console.warn(`⚠️  Dialog interceptado – tipo: ${dialog.type()} | mensagem: ${dialog.message()}`);
      await dialog.dismiss();
    });

    console.log('✅ Playwright inicializado com sucesso');
    return this._pagina;
  }

  async _iniciarBrowser(tipo, opcoes) {
    switch (tipo.toLowerCase()) {
      case 'firefox': return await firefox.launch(opcoes);
      case 'webkit':  return await webkit.launch(opcoes);
      default:        return await chromium.launch(opcoes);
    }
  }

  // ── Getters ────────────────────────────────────────────────────────────────

  /** Retorna a Page ativa. Lança erro se não inicializado. */
  get pagina() {
    if (!this._pagina) {
      throw new Error('Playwright não foi inicializado. Verifique os Hooks.');
    }
    return this._pagina;
  }

  get contexto() { return this._contexto; }
  get browser()  { return this._browser;  }

  // ── Utilitários ────────────────────────────────────────────────────────────

  /**
   * Captura screenshot da página atual.
   * @param {string} nomeArquivo - Nome base do arquivo (sem extensão)
   * @returns {Promise<Buffer>} - Buffer com a imagem PNG
   */
  async capturarScreenshot(nomeArquivo) {
    try {
      const { mkdirSync } = await import('fs');
      const { join }      = await import('path');

      const dir = configuracao.evidencias.diretorio;
      mkdirSync(dir, { recursive: true });

      const caminho = join(dir, `${nomeArquivo}_${Date.now()}.png`);
      const buffer  = await this._pagina.screenshot({ path: caminho, fullPage: true });
      console.log(`📸 Screenshot salva: ${caminho}`);
      return buffer;
    } catch (erro) {
      console.error(`Erro ao capturar screenshot: ${erro.message}`);
      return null;
    }
  }

  // ── Encerramento ───────────────────────────────────────────────────────────

  /**
   * Encerra todos os recursos do Playwright.
   * Chamado no hook @After de cada cenário.
   */
  async encerrar() {
    console.log('🛑 Encerrando Playwright...');
    try {
      if (this._pagina && !this._pagina.isClosed()) {
        await this._pagina.close();
      }
    } catch { /* ignora erros de fechamento */ }

    try {
      if (this._contexto) await this._contexto.close();
    } catch { /* ignora */ }

    try {
      if (this._browser) await this._browser.close();
    } catch { /* ignora */ }

    this._pagina   = null;
    this._contexto = null;
    this._browser  = null;
    console.log('✅ Playwright encerrado');
  }
}

// Exporta uma instância singleton por processo
// O World do Cucumber garante isolamento entre cenários via hooks
export const gerenciador = new GerenciadorPlaywright();
