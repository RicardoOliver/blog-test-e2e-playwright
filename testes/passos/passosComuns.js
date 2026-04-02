// =============================================================================
//  testes/passos/passosComuns.js
//  Steps compartilhados entre Pesquisa e Navegação.
//  Evita definições duplicadas que causariam erro no Cucumber.
// =============================================================================

import { Given, Then }   from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { mundoCenario }  from '../../src/suporte/mundoCenario.js';
import { PaginaInicial } from '../../src/paginas/paginaInicial.js';

// ── DADO ──────────────────────────────────────────────────────────────────────

Given('que estou na página inicial do Blog do Agi', async function () {
  console.log('=== DADO: Abrindo página inicial ===');

  const paginaInicial = new PaginaInicial(mundoCenario.pagina);
  await paginaInicial.abrirPaginaInicial();

  mundoCenario.paginaInicial = paginaInicial;

  assert.ok(
    paginaInicial.paginaInicialCarregada(),
    `A página inicial do Blog do Agi deve estar carregada. URL: ${paginaInicial.obterUrlAtual()}`
  );

  console.log(`✅ Página inicial carregada: ${paginaInicial.obterUrlAtual()}`);
});

// ── ENTÃO – verificações compartilhadas ──────────────────────────────────────

Then('a página de resultados é exibida', async function () {
  console.log('=== ENTÃO: Verificando página de resultados ===');

  assert.ok(mundoCenario.paginaPesquisa, 'PaginaPesquisa deve estar inicializada');
  assert.ok(
    mundoCenario.paginaPesquisa.paginaResultadosCarregada(),
    `A página de resultados deve estar carregada. URL: ${mundoCenario.paginaPesquisa.obterUrlAtual()}`
  );
});

Then('é exibido pelo menos {int} resultado de pesquisa', async function (minimo) {
  console.log(`=== ENTÃO: Verificando ao menos ${minimo} resultado(s) ===`);

  const quantidade = await mundoCenario.paginaPesquisa.obterQuantidadeResultados();
  assert.ok(
    quantidade >= minimo,
    `Esperado ao menos ${minimo} resultado(s), encontrado(s): ${quantidade}`
  );

  console.log(`✅ Quantidade de resultados: ${quantidade}`);
});

Then('sou redirecionado para a página do artigo', async function () {
  console.log('=== ENTÃO: Verificando URL do artigo ===');

  assert.ok(
    mundoCenario.paginaArtigo?.urlArtigoValida(),
    `URL do artigo deve pertencer ao Blog do Agi. URL: ${mundoCenario.pagina.url()}`
  );
});

Then('a página do artigo é exibida corretamente', async function () {
  console.log('=== ENTÃO: Verificando página do artigo ===');

  const carregada = await mundoCenario.paginaArtigo?.paginaArtigoCarregada();
  assert.ok(carregada, 'A página do artigo deve ter título e conteúdo visíveis');

  const titulo = await mundoCenario.paginaArtigo.obterTituloArtigo();
  console.log(`✅ Artigo aberto: ${titulo}`);
});

Then('a aplicação não exibe erro grave', async function () {
  console.log('=== ENTÃO: Verificando ausência de erros graves ===');

  const url = mundoCenario.pagina.url();
  const dominioValido =
    url.includes('blog.agibank.com.br') ||
    url.includes('blogdoagi.com.br')    ||
    url.includes('agibank.com.br');

  assert.ok(dominioValido, `A URL deve permanecer no domínio do blog. URL atual: ${url}`);
});

Then('a URL permanece válida no domínio do blog', async function () {
  console.log('=== ENTÃO: Verificando domínio da URL ===');

  const url = mundoCenario.pagina.url();
  const dominioValido =
    url.includes('blog.agibank.com.br') ||
    url.includes('blogdoagi.com.br')    ||
    url.includes('agibank.com.br');

  assert.ok(dominioValido, `URL fora do domínio esperado: ${url}`);
  console.log(`✅ URL válida: ${url}`);
});
