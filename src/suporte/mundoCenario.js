// =============================================================================
//  src/suporte/mundoCenario.js
//  Contexto compartilhado entre Step Definitions em um cenário.
//  Armazena referências a Page Objects e estado da execução atual.
// =============================================================================

/**
 * Mundo do Cenário (equivalente ao ContextoCenario do Java).
 * Singleton de escopo de cenário — limpo no hook @After.
 *
 * Uso nos Step Definitions:
 *   import { mundoCenario } from '../../src/suporte/mundoCenario.js';
 *   const pagina = mundoCenario.pagina;
 */
class MundoCenario {
  constructor() {
    this._pagina             = null;
    this._paginaInicial      = null;
    this._paginaPesquisa     = null;
    this._paginaArtigo       = null;
    this._ultimoTermoPesquisado = null;
  }

  // ── Página do Playwright ───────────────────────────────────────────────────

  definirPagina(pagina) {
    this._pagina = pagina;
  }

  get pagina() {
    if (!this._pagina) throw new Error('Página não inicializada. Verifique os Hooks.');
    return this._pagina;
  }

  // ── Page Objects ───────────────────────────────────────────────────────────

  get paginaInicial()               { return this._paginaInicial;  }
  set paginaInicial(po)             { this._paginaInicial = po;    }

  get paginaPesquisa()              { return this._paginaPesquisa; }
  set paginaPesquisa(po)            { this._paginaPesquisa = po;   }

  get paginaArtigo()                { return this._paginaArtigo;   }
  set paginaArtigo(po)              { this._paginaArtigo = po;     }

  // ── Estado ─────────────────────────────────────────────────────────────────

  get ultimoTermoPesquisado()       { return this._ultimoTermoPesquisado; }
  set ultimoTermoPesquisado(termo)  { this._ultimoTermoPesquisado = termo; }

  // ── Limpeza ────────────────────────────────────────────────────────────────

  limpar() {
    this._pagina                = null;
    this._paginaInicial         = null;
    this._paginaPesquisa        = null;
    this._paginaArtigo          = null;
    this._ultimoTermoPesquisado = null;
  }
}

export const mundoCenario = new MundoCenario();
