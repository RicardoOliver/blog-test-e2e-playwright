// =============================================================================
//  src/paginas/paginaPesquisa.js
//  Page Object da Página de Resultados de Pesquisa.
//  URL: https://blog.agibank.com.br/?s={termo}
// =============================================================================

import { PaginaBase } from './paginaBase.js';

const SEL = {
  artigosResultado:  'article, .post, .search-entry, .type-post',
  titulosResultado:  'h2.entry-title a, .post-title a, article h2 a, .entry-title a',
  semResultado:      '.no-results, .not-found, [class*="no-result"], .search-no-results',
  mensagemSemResult: '.no-results p, .not-found p, .page-content p',
  campoPesquisa:     'input[type="search"], input[name="s"]',
  botaoPesquisa:     'button.search-toggle, .search-icon',
  proximaPagina:     'a.next, a[rel="next"], .page-numbers.next',
  linksArtigos:      'article a[href], .post a[href]',
};

export class PaginaPesquisa extends PaginaBase {
  constructor(pagina) {
    super(pagina);
  }

  // ── Verificações ───────────────────────────────────────────────────────────

  async possuiResultados() {
    const temMsgSem = await this.estaVisivel(SEL.semResultado);
    const qtd       = await this.contarElementos(SEL.artigosResultado);
    return !temMsgSem && qtd > 0;
  }

  async exibeMensagemSemResultados() {
    return this.estaVisivel(SEL.semResultado);
  }

  async obterQuantidadeResultados() {
    return this.contarElementos(SEL.artigosResultado);
  }

  async obterTitulosResultados() {
    const locator = this.obterLocator(SEL.titulosResultado);
    const count   = await locator.count();
    const titulos = [];
    for (let i = 0; i < count; i++) {
      const texto = await locator.nth(i).textContent();
      if (texto?.trim()) titulos.push(texto.trim());
    }
    return titulos;
  }

  urlContemTermoPesquisa(termo) {
    const urlDecodificada = decodeURIComponent(this.obterUrlAtual()).toLowerCase();
    const termoLower      = termo.toLowerCase();
    const termoComMais    = termoLower.replace(/\s+/g, '+');

    return urlDecodificada.includes(`s=${termoLower}`) ||
           urlDecodificada.includes(`s=${termoComMais}`) ||
           urlDecodificada.includes(termoLower);
  }

  paginaResultadosCarregada() {
    return this.urlContemDominioBlog();
  }

  async obterMensagemSemResultados() {
    if (await this.estaVisivel(SEL.mensagemSemResult)) {
      return this.obterTexto(SEL.mensagemSemResult);
    }
    return '';
  }

  async artigosComLinksValidos() {
    const count = await this.contarElementos(SEL.linksArtigos);
    return count > 0;
  }

  // ── Interações ─────────────────────────────────────────────────────────────

  async clicarPrimeiroResultado() {
    await this.aguardarVisivel(SEL.titulosResultado);
    await this.obterLocator(SEL.titulosResultado).first().click();
    await this.aguardarCarregamento();
  }

  async realizarNovaPesquisa(novoTermo) {
    console.log(`🔍 Realizando nova pesquisa por: "${novoTermo}"`);
    const campo = this.pagina.locator(SEL.campoPesquisa).first();
    
    try {
      // Se houver um botão de lupa na página de resultados para abrir o campo
      const botao = this.pagina.locator(SEL.botaoPesquisa).first();
      if (await botao.isVisible()) {
        await botao.click();
      }

      // Preenche o campo (que já está visível na página de resultados por padrão no tema Astra)
      await campo.waitFor({ state: 'attached', timeout: 5000 });
      await campo.fill(novoTermo);
      await campo.press('Enter');
      await this.aguardarCarregamento();
    } catch (erro) {
      console.warn('⚠️ Falha ao usar campo de pesquisa da página de resultados, usando fallback URL');
      const urlPesquisa = `https://blog.agibank.com.br/?s=${encodeURIComponent(novoTermo)}`;
      await this.pagina.goto(urlPesquisa, { waitUntil: 'domcontentloaded' });
    }
    
    return new PaginaPesquisa(this.pagina);
  }

  async possuiProximaPagina() {
    return this.estaVisivel(SEL.proximaPagina);
  }
}
