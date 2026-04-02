// =============================================================================
//  src/paginas/paginaBase.js
//  Classe base para todos os Page Objects.
//  Encapsula interações comuns com o Playwright.
// =============================================================================

import { configuracao } from '../configuracao/configuracao.js';

export class PaginaBase {
  /**
   * @param {import('playwright').Page} pagina - Instância da Page do Playwright
   */
  constructor(pagina) {
    this.pagina = pagina;
    this.config = configuracao;
  }

  // ── Navegação ──────────────────────────────────────────────────────────────

  async navegarPara(url) {
    console.log(`🌐 Navegando para: ${url}`);
    await this.pagina.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout:   this.config.timeouts.navegacao,
    });
  }

  async aguardarCarregamento() {
    await this.pagina.waitForLoadState('domcontentloaded');
  }

  // ── Interação ──────────────────────────────────────────────────────────────

  async clicar(seletor) {
    await this.aguardarVisivel(seletor);
    await this.pagina.click(seletor);
  }

  async preencher(seletor, valor) {
    await this.aguardarVisivel(seletor);
    await this.pagina.fill(seletor, valor);
  }

  async pressionarTecla(seletor, tecla) {
    await this.pagina.press(seletor, tecla);
  }

  async limparEPreencher(seletor, valor) {
    await this.aguardarVisivel(seletor);
    await this.pagina.locator(seletor).clear();
    await this.pagina.fill(seletor, valor);
  }

  // ── Espera ─────────────────────────────────────────────────────────────────

  async aguardarVisivel(seletor) {
    await this.pagina.waitForSelector(seletor, {
      state:   'visible',
      timeout: this.config.timeouts.elemento,
    });
  }

  async aguardarExistir(seletor) {
    await this.pagina.waitForSelector(seletor, {
      state:   'attached',
      timeout: this.config.timeouts.elemento,
    });
  }

  // ── Leitura ────────────────────────────────────────────────────────────────

  estaVisivel(seletor) {
    return this.pagina.isVisible(seletor);
  }

  async obterTexto(seletor) {
    const texto = await this.pagina.textContent(seletor);
    return texto?.trim() ?? '';
  }

  async obterAtributo(seletor, atributo) {
    return this.pagina.getAttribute(seletor, atributo);
  }

  obterUrlAtual() {
    return this.pagina.url();
  }

  async obterTituloPagina() {
    return this.pagina.title();
  }

  async contarElementos(seletor) {
    return this.pagina.locator(seletor).count();
  }

  obterLocator(seletor) {
    return this.pagina.locator(seletor);
  }

  // ── Asserções auxiliares ───────────────────────────────────────────────────

  urlContemDominioBlog() {
    const url = this.obterUrlAtual();
    return url.includes('blog.agibank.com.br') ||
           url.includes('blogdoagi.com.br')    ||
           url.includes('agibank.com.br');
  }
}
