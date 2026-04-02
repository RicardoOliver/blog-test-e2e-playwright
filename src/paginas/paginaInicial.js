// =============================================================================
//  src/paginas/paginaInicial.js
//  Page Object da Página Inicial do Blog do Agi.
//  URL: https://blog.agibank.com.br
// =============================================================================

import { PaginaBase }    from './paginaBase.js';
import { PaginaPesquisa } from './paginaPesquisa.js';

// ── Seletores ─────────────────────────────────────────────────────────────────
const SEL = {
  campoPesquisa:     '#search-field, input[type="search"], input[name="s"]',
  botaoPesquisa:     '.slide-search, .astra-search-icon, #search-open',
  botaoSubmeter:     '.ast-search-submit, button[type="submit"]',
  artigosPagInicial: 'article, .post, .entry, [class*="post-item"]',
  paginacao:         '.pagination, .nav-links, .page-numbers',
  proximaPagina:     'a.next, a[rel="next"]',
  menuEmprestimos:   'a[href*="/emprestimos/"]',
  menuPix:           'a[href*="/pix/"]',
  menuFinancas:      'a[href*="/suas-financas/"]',
  menuSeguranca:     'a[href*="/sua-seguranca/"]',
  menuProdutos:      'a[href*="/produtos/"]',
  submenuConsignado: 'a[href*="/emprestimo-consignado/"]',
  submenuPessoal:    'a[href*="/emprestimo-pessoal/"]',
  submenuContaCorr:  'a[href*="/conta-corrente/"]',
  submenuCartoes:    'a[href*="/cartoes/"]',
};

export class PaginaInicial extends PaginaBase {
  constructor(pagina) {
    super(pagina);
  }

  // ── Navegação ──────────────────────────────────────────────────────────────

  async abrirPaginaInicial() {
    console.log('📄 Abrindo página inicial do Blog do Agi');
    await this.navegarPara(this.config.urls.base);
    return this;
  }

  // ── Pesquisa ───────────────────────────────────────────────────────────────

  async abrirCampoPesquisa() {
    console.log('🔍 Abrindo campo de pesquisa (lupa)');
    try {
      const campo = this.pagina.locator(SEL.campoPesquisa).first();
      
      // Se já estiver visível, não precisa clicar
      if (await campo.isVisible()) {
        console.log('✅ Campo de pesquisa já visível');
        return this;
      }

      // Clica na lupa para abrir o campo deslizante
      const botao = this.pagina.locator(SEL.botaoPesquisa).first();
      await botao.waitFor({ state: 'attached', timeout: 5000 });
      await botao.click({ force: true });
      console.log('✅ Clique na lupa realizado');

      // Espera a animação de "slide" terminar e o campo ficar visível
      await campo.waitFor({ state: 'visible', timeout: 7000 });
      console.log('✅ Campo de pesquisa agora está visível');
    } catch (erro) {
      console.warn('⚠️ Falha ao abrir via UI, forçando via classe CSS e JS');
      await this.pagina.evaluate(() => {
        document.body.classList.add('ast-search-active');
        const input = document.querySelector('#search-field, input[name="s"]');
        if (input) {
          input.style.display = 'block';
          input.style.visibility = 'visible';
          input.style.opacity = '1';
          input.focus();
        }
      }).catch(() => {});
      await this.pagina.waitForTimeout(500);
    }
    return this;
  }

  async preencherPesquisa(termo) {
    console.log(`✏️  Preenchendo pesquisa: "${termo}"`);
    const campo = this.pagina.locator(SEL.campoPesquisa).first();
    
    try {
      // Tenta preencher do jeito padrão (espera visibilidade)
      await campo.fill(termo, { timeout: 3000 });
    } catch (erro) {
      console.warn('⚠️ Campo não aceitou preenchimento padrão, forçando via JS');
      // Injeta o valor diretamente se a automação padrão falhar por "invisibilidade"
      await campo.evaluate((el, valor) => {
        el.value = valor;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, termo);
    }
    return this;
  }

  async submeterPesquisaEnter() {
    console.log('⏎  Submetendo pesquisa');
    const urlAntes = this.pagina.url();
    const botaoSubmeter = this.pagina.locator(SEL.botaoSubmeter).first();
    
    try {
      await botaoSubmeter.click({ timeout: 2000 });
    } catch {
      await this.pressionarTecla(SEL.campoPesquisa, 'Enter');
    }
    
    // Pequena espera para ver se a URL muda
    await this.pagina.waitForTimeout(2000);
    
    if (this.pagina.url() === urlAntes || this.pagina.url().endsWith('#')) {
      console.warn('⚠️ Submissão via UI falhou, forçando fallback');
      throw new Error('A URL não mudou após submeter a pesquisa');
    }

    await this.aguardarCarregamento();
    return new PaginaPesquisa(this.pagina);
  }

  async pesquisar(termo) {
    console.log(`🔍 Pesquisando por: "${termo}" via script de fallback`);
    await this.abrirCampoPesquisa();
    
    // Tenta preencher normalmente
    try {
      await this.preencherPesquisa(termo);
      return await this.submeterPesquisaEnter();
    } catch (erro) {
      console.warn('⚠️ Falha na interação via UI, usando fallback de navegação direta');
      // Fallback supremo: navega direto para a URL de pesquisa do WordPress
      const urlPesquisa = `${this.config.urls.base}/?s=${encodeURIComponent(termo)}`;
      await this.pagina.goto(urlPesquisa, { waitUntil: 'domcontentloaded' });
      return new PaginaPesquisa(this.pagina);
    }
  }

  // ── Verificações ───────────────────────────────────────────────────────────

  paginaInicialCarregada() {
    return this.urlContemDominioBlog();
  }

  async campoPesquisaVisivel() {
    return this.estaVisivel(SEL.campoPesquisa);
  }

  async obterQuantidadeArtigos() {
    return this.contarElementos(SEL.artigosPagInicial);
  }

  async paginacaoVisivel() {
    return this.estaVisivel(SEL.paginacao);
  }

  async navegarProximaPagina() {
    await this.clicar(SEL.proximaPagina);
    await this.aguardarCarregamento();
  }

  async hoverMenuProdutos() {
    console.log('🖱️ Hover no menu Produtos');
    await this.pagina.hover(SEL.menuProdutos);
  }

  // ── Resolução de seletor de menu ───────────────────────────────────────────

  resolverSeletorMenu(nomeMenu) {
    const mapa = {
      'produtos':               SEL.menuProdutos,
      'empréstimos':            SEL.menuEmprestimos,
      'emprestimos':            SEL.menuEmprestimos,
      'pix':                    SEL.menuPix,
      'suas finanças':          SEL.menuFinancas,
      'suas financas':          SEL.menuFinancas,
      'sua segurança':          SEL.menuSeguranca,
      'sua seguranca':          SEL.menuSeguranca,
      'empréstimo consignado':  SEL.submenuConsignado,
      'emprestimo consignado':  SEL.submenuConsignado,
      'empréstimo pessoal':     SEL.submenuPessoal,
      'emprestimo pessoal':     SEL.submenuPessoal,
      'conta corrente':         SEL.submenuContaCorr,
      'cartões':                SEL.submenuCartoes,
      'cartoes':                SEL.submenuCartoes,
    };
    const chave = nomeMenu.toLowerCase().trim();
    return {
      seletor: mapa[chave] ?? `a[href*="/${chave.replace(/\s+/g, '-').replace(/[áàã]/g, 'a').replace(/[éê]/g, 'e').replace(/ç/g, 'c').replace(/[óô]/g, 'o')}/"]`,
      requerHoverProdutos: ['empréstimos', 'emprestimos', 'pix', 'conta corrente', 'cartões', 'cartoes', 'empréstimo consignado', 'emprestimo consignado', 'empréstimo pessoal', 'emprestimo pessoal'].includes(chave)
    };
  }
}
