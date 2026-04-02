// =============================================================================
//  src/paginas/paginaArtigo.js
//  Page Object de uma página de Artigo do Blog do Agi.
// =============================================================================

import { PaginaBase } from './paginaBase.js';

const SEL = {
  tituloArtigo:   'h1.entry-title, h1.post-title, article h1, .entry-title h1',
  conteudo:       '.entry-content, .post-content, article .content',
  imagemDestaque: '.post-thumbnail img, .wp-post-image, article .featured-image img',
  categorias:     '.cat-links a, .entry-categories a, .entry-meta .categories a',
};

export class PaginaArtigo extends PaginaBase {
  constructor(pagina) {
    super(pagina);
  }

  async paginaArtigoCarregada() {
    const temTitulo   = await this.estaVisivel(SEL.tituloArtigo);
    const temConteudo = await this.estaVisivel(SEL.conteudo);
    return temTitulo && temConteudo;
  }

  async obterTituloArtigo() {
    return this.obterTexto(SEL.tituloArtigo);
  }

  urlArtigoValida() {
    return this.urlContemDominioBlog();
  }

  async possuiImagemDestaque() {
    return this.estaVisivel(SEL.imagemDestaque);
  }

  async possuiCategorias() {
    const count = await this.contarElementos(SEL.categorias);
    return count > 0;
  }
}
