// =============================================================================
//  src/paginas/paginaInicial.js
//  Page Object da Página Inicial do Blog do Agi.
//  URL: https://blog.agibank.com.br
// =============================================================================

import { PaginaBase }    from './paginaBase.js';
import { PaginaPesquisa } from './paginaPesquisa.js';

// ── Seletores ─────────────────────────────────────────────────────────────────
const SEL = {
  campoPesquisa:     'input[type="search"], input[name="s"], .search-form input',
  botaoPesquisa:     'button.search-toggle, a[href="#"][aria-label="Pesquisar"], .search-icon, header .search',
  botaoSubmeter:     'button[type="submit"], input[type="submit"], .search-submit',
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
      const visivel = await this.estaVisivel(SEL.botaoPesquisa);
      if (visivel) await this.clicar(SEL.botaoPesquisa);
    } catch {
      console.warn('Botão de pesquisa não encontrado, tentando diretamente no campo');
    }
    return this;
  }

  async preencherPesquisa(termo) {
    console.log(`✏️  Preenchendo pesquisa: "${termo}"`);
    await this.aguardarVisivel(SEL.campoPesquisa);
    await this.preencher(SEL.campoPesquisa, termo);
    return this;
  }

  async submeterPesquisaEnter() {
    console.log('⏎  Submetendo pesquisa com Enter');
    await this.pressionarTecla(SEL.campoPesquisa, 'Enter');
    await this.aguardarCarregamento();
    return new PaginaPesquisa(this.pagina);
  }

  async pesquisar(termo) {
    await this.abrirCampoPesquisa();
    await this.preencherPesquisa(termo);
    return this.submeterPesquisaEnter();
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

  // ── Resolução de seletor de menu ───────────────────────────────────────────

  resolverSeletorMenu(nomeMenu) {
    const mapa = {
      'empréstimos':            SEL.menuEmprestimos,
      'emprestimos':            SEL.menuEmprestimos,
      'pix':                    SEL.menuPix,
      'suas finanças':          SEL.menuFinancas,
      'suas financas':          SEL.menuFinancas,
      'sua segurança':          SEL.menuSeguranca,
      'sua seguranca':          SEL.menuSeguranca,
      'produtos':               SEL.menuProdutos,
      'empréstimo consignado':  SEL.submenuConsignado,
      'emprestimo consignado':  SEL.submenuConsignado,
      'empréstimo pessoal':     SEL.submenuPessoal,
      'emprestimo pessoal':     SEL.submenuPessoal,
      'conta corrente':         SEL.submenuContaCorr,
      'cartões':                SEL.submenuCartoes,
      'cartoes':                SEL.submenuCartoes,
    };
    const chave = nomeMenu.toLowerCase().trim();
    return mapa[chave] ?? `a[href*="/${chave.replace(/\s+/g, '-').replace(/[áàã]/g, 'a').replace(/[éê]/g, 'e').replace(/ç/g, 'c').replace(/[óô]/g, 'o')}/""]`;
  }
}
