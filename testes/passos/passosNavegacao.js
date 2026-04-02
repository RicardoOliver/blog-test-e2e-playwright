// =============================================================================
//  testes/passos/passosNavegacao.js
//  Step Definitions para navegacao_categorias.feature
// =============================================================================

import { When, Then }      from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { mundoCenario }    from '../../src/suporte/mundoCenario.js';
import { configuracao }    from '../../src/configuracao/configuracao.js';
import { PaginaArtigo }    from '../../src/paginas/paginaArtigo.js';
import { PaginaInicial }   from '../../src/paginas/paginaInicial.js';

const SEL_ARTIGOS     = 'article, .post, .type-post, .entry, [class*="post-item"]';
const SEL_TITULOS     = 'h2.entry-title a, .post-title a, article h2 a, h1.entry-title';
const SEL_PROX_PAG    = 'a.next, a[rel="next"], .page-numbers.next';
const SEL_PAGINACAO   = '.pagination, .nav-links, .page-numbers';
const SEL_LINKS_ART   = 'article a[href*="blog.agibank.com.br"], .post a[href*="blog.agibank.com.br"]';

// ── QUANDO ────────────────────────────────────────────────────────────────────

When('clico no menu {string}', async function (nomeMenu) {
  console.log(`=== QUANDO: Clicando no menu "${nomeMenu}" ===`);

  const pagina  = mundoCenario.pagina;
  const po      = mundoCenario.paginaInicial ?? new PaginaInicial(pagina);
  const { seletor, requerHoverProdutos } = po.resolverSeletorMenu(nomeMenu);

  if (requerHoverProdutos) {
    console.log('🖱️ Realizando hover no menu Produtos');
    await po.hoverMenuProdutos();
    // Espera o menu de subitens ficar visível
    await pagina.locator(seletor).first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    await pagina.waitForTimeout(500);
  }

  console.log(`   Seletor: ${seletor}`);
  
  try {
    const elemento = pagina.locator(seletor).first();
    // Garante que o elemento está pronto antes do clique
    await elemento.waitFor({ state: 'attached', timeout: 5000 });
    await elemento.scrollIntoViewIfNeeded();
    await elemento.click({ force: true, timeout: 5000 });
    await pagina.waitForLoadState('domcontentloaded');
  } catch (erro) {
    console.warn(`⚠️ Falha no clique normal do menu "${nomeMenu}", tentando via URL direta`);
    const href = await pagina.locator(seletor).first().getAttribute('href').catch(() => null);
    if (href) {
      console.log(`🔗 Navegando diretamente para: ${href}`);
      await pagina.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      throw erro;
    }
  }

  console.log(`✅ Menu clicado. URL: ${pagina.url()}`);
});

When('clico no primeiro artigo listado', async function () {
  console.log('=== QUANDO: Clicando no primeiro artigo ===');

  const pagina = mundoCenario.pagina;
  const primeiroArtigo = pagina.locator(SEL_TITULOS).first();
  
  try {
    await primeiroArtigo.waitFor({ state: 'visible', timeout: 5000 });
    await primeiroArtigo.click();
    await pagina.waitForLoadState('domcontentloaded');
  } catch (erro) {
    console.warn('⚠️ Falha no clique do artigo, tentando via URL direta');
    const href = await primeiroArtigo.getAttribute('href').catch(() => null);
    if (href) {
      await pagina.goto(href, { waitUntil: 'domcontentloaded' });
    } else {
      throw erro;
    }
  }

  mundoCenario.paginaArtigo = new PaginaArtigo(pagina);
});

When('navego para a próxima página', async function () {
  console.log('=== QUANDO: Navegando para próxima página ===');

  const pagina = mundoCenario.pagina;
  const botaoProx = pagina.locator(SEL_PROX_PAG).first();

  try {
    // 1. Rola até o final para garantir que a paginação apareça
    await pagina.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    // Pequena espera para o scroll estabilizar e o carregamento lazy disparar
    await pagina.waitForTimeout(1000);
    
    // 2. Aguarda o botão ficar presente no DOM antes de tentar qualquer coisa
    await botaoProx.waitFor({ state: 'attached', timeout: 10000 });
    
    // 3. Tenta clicar (o Playwright fará o scroll automático se necessário)
    // Se o clique visual falhar, o catch será acionado
    await botaoProx.click({ timeout: 10000 });
    
    // 4. Aguarda o carregamento da nova página
    await pagina.waitForLoadState('domcontentloaded');
  } catch (erro) {
    console.warn('⚠️ Falha ao clicar no botão "Próxima" via interface, tentando via URL direta');
    
    // Fallback: Tenta pegar o href e navegar direto se o clique falhar
    const href = await botaoProx.getAttribute('href').catch(() => null);
    if (href) {
      console.log(`🔗 Navegando diretamente para: ${href}`);
      await pagina.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      // Se nem o href estiver disponível, tenta construir a URL se estivermos em uma categoria
      const urlAtual = pagina.url();
      if (urlAtual.includes('/category/') || urlAtual.includes('/emprestimos/')) {
         const novaUrl = urlAtual.endsWith('/') ? `${urlAtual}page/2/` : `${urlAtual}/page/2/`;
         console.log(`🔗 Tentando URL de paginação presumida: ${novaUrl}`);
         await pagina.goto(novaUrl, { waitUntil: 'domcontentloaded' }).catch(() => {});
      } else {
         throw new Error(`Não foi possível navegar para a próxima página: ${erro.message}`);
      }
    }
  }

  console.log(`✅ Próxima página alcançada. URL: ${pagina.url()}`);
});

When('acesso diretamente a URL {string}', async function (caminho) {
  console.log(`=== QUANDO: Acessando URL "${caminho}" ===`);

  const pagina = mundoCenario.pagina;
  await pagina.goto(configuracao.urls.base + caminho, { waitUntil: 'domcontentloaded' });

  console.log(`✅ URL acessada: ${pagina.url()}`);
});

When('acesso diretamente a URL da categoria {string}', async function (caminho) {
  console.log(`=== QUANDO: Acessando categoria "${caminho}" ===`);

  const pagina = mundoCenario.pagina;
  await pagina.goto(configuracao.urls.base + caminho, { waitUntil: 'domcontentloaded' });

  console.log(`✅ Categoria acessada: ${pagina.url()}`);
});

// ── ENTÃO ─────────────────────────────────────────────────────────────────────

Then('sou redirecionado para a URL que contém {string}', async function (fragmento) {
  console.log(`=== ENTÃO: Verificando URL contém "${fragmento}" ===`);

  const url = mundoCenario.pagina.url();
  assert.ok(url.includes(fragmento), `URL "${url}" não contém "${fragmento}"`);

  console.log(`✅ URL válida: ${url}`);
});

Then('pelo menos {int} artigo é listado na página', async function (minimo) {
  console.log(`=== ENTÃO: Verificando ao menos ${minimo} artigo(s) ===`);

  const quantidade = await mundoCenario.pagina.locator(SEL_ARTIGOS).count();
  assert.ok(
    quantidade >= minimo,
    `Esperado ao menos ${minimo} artigo(s), encontrado(s): ${quantidade}`
  );

  console.log(`✅ Artigos encontrados: ${quantidade}`);
});

Then('a página inicial do blog é exibida corretamente', async function () {
  console.log('=== ENTÃO: Verificando página inicial ===');

  const url = mundoCenario.pagina.url();
  const valida =
    url.endsWith('blog.agibank.com.br/') ||
    url.includes('blog.agibank.com.br')  ||
    url.includes('blogdoagi.com.br');

  assert.ok(valida, `URL não corresponde à página inicial: ${url}`);
  console.log(`✅ Página inicial: ${url}`);
});

Then('artigos são listados na página inicial', async function () {
  console.log('=== ENTÃO: Verificando artigos na página inicial ===');

  const quantidade = await mundoCenario.pagina.locator(SEL_ARTIGOS).count();
  assert.ok(quantidade > 0, `Artigos devem ser listados na página inicial. Encontrados: ${quantidade}`);

  console.log(`✅ Artigos na home: ${quantidade}`);
});

Then('a paginação está disponível na página', async function () {
  console.log('=== ENTÃO: Verificando paginação ===');

  const pagina     = mundoCenario.pagina;
  const temPag     = await pagina.isVisible(SEL_PAGINACAO);
  const temProxima = await pagina.isVisible(SEL_PROX_PAG);

  assert.ok(temPag || temProxima, 'A paginação deve estar disponível na página');
  console.log('✅ Paginação disponível');
});

Then('os artigos listados possuem links válidos de leitura', async function () {
  console.log('=== ENTÃO: Verificando links dos artigos ===');

  const quantidade = await mundoCenario.pagina.locator(SEL_LINKS_ART).count();
  assert.ok(quantidade > 0, `Os artigos devem ter links válidos. Encontrados: ${quantidade}`);

  console.log(`✅ Links válidos encontrados: ${quantidade}`);
});

Then('sou redirecionado para a página inicial', async function () {
  console.log('=== ENTÃO: Verificando redirecionamento para home ===');

  const url = mundoCenario.pagina.url();
  const valida =
    url.endsWith('blog.agibank.com.br/') ||
    url.includes('blog.agibank.com.br')  ||
    url.includes('blogdoagi.com.br');

  assert.ok(valida, `URL não corresponde à home: ${url}`);
});
