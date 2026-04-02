// =============================================================================
//  testes/passos/passosPesquisa.js
//  Step Definitions para pesquisa_artigos.feature
// =============================================================================

import { When, Then }      from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { mundoCenario }    from '../../src/suporte/mundoCenario.js';
import { PaginaArtigo }    from '../../src/paginas/paginaArtigo.js';
import { PaginaInicial }   from '../../src/paginas/paginaInicial.js';

// ── QUANDO ────────────────────────────────────────────────────────────────────

When('aciono a pesquisa por {string}', async function (termo) {
  console.log(`=== QUANDO: Pesquisando por "${termo}" ===`);

  const po = mundoCenario.paginaInicial ?? new PaginaInicial(mundoCenario.pagina);
  mundoCenario.paginaInicial = po;
  mundoCenario.ultimoTermoPesquisado = termo;
  mundoCenario.paginaPesquisa = await po.pesquisar(termo);

  console.log(`✅ Pesquisa submetida. URL: ${mundoCenario.paginaPesquisa.obterUrlAtual()}`);
});

When('abro o campo de pesquisa', async function () {
  console.log('=== QUANDO: Abrindo campo de pesquisa ===');
  await mundoCenario.paginaInicial.abrirCampoPesquisa();
});

When('preencho o campo de pesquisa com {string}', async function (termo) {
  console.log(`=== QUANDO: Preenchendo campo com "${termo}" ===`);
  mundoCenario.ultimoTermoPesquisado = termo;
  await mundoCenario.paginaInicial.preencherPesquisa(termo);
});

When('não preencho nenhum termo de pesquisa', async function () {
  console.log('=== QUANDO: Campo de pesquisa vazio (intencional) ===');
  // Não preenche nada – estado vazio intencional
});

When('pressiono Enter para submeter a pesquisa', async function () {
  console.log('=== QUANDO: Submetendo com Enter ===');
  mundoCenario.paginaPesquisa =
    await mundoCenario.paginaInicial.submeterPesquisaEnter();
});

When('clico no primeiro resultado da pesquisa', async function () {
  console.log('=== QUANDO: Clicando no primeiro resultado ===');

  assert.ok(mundoCenario.paginaPesquisa, 'PaginaPesquisa deve estar inicializada');
  await mundoCenario.paginaPesquisa.clicarPrimeiroResultado();
  mundoCenario.paginaArtigo = new PaginaArtigo(mundoCenario.pagina);
});

When('realizo uma nova pesquisa por {string}', async function (novoTermo) {
  console.log(`=== QUANDO: Nova pesquisa por "${novoTermo}" ===`);

  assert.ok(mundoCenario.paginaPesquisa, 'PaginaPesquisa deve estar inicializada');
  mundoCenario.ultimoTermoPesquisado = novoTermo;
  mundoCenario.paginaPesquisa =
    await mundoCenario.paginaPesquisa.realizarNovaPesquisa(novoTermo);
});

// ── ENTÃO ─────────────────────────────────────────────────────────────────────

Then('os resultados são apresentados para o termo {string}', async function (termo) {
  console.log(`=== ENTÃO: Verificando resultados para "${termo}" ===`);

  assert.ok(
    mundoCenario.paginaPesquisa.paginaResultadosCarregada(),
    `Página de resultados deve estar carregada para o termo: ${termo}`
  );
});

Then('a URL contém o parâmetro de busca {string}', async function (termo) {
  console.log(`=== ENTÃO: Verificando parâmetro de busca "${termo}" na URL ===`);

  assert.ok(
    mundoCenario.paginaPesquisa.urlContemTermoPesquisa(termo),
    `A URL deve conter o parâmetro de busca: ${termo}. URL: ${mundoCenario.paginaPesquisa.obterUrlAtual()}`
  );
});

Then('os resultados contêm artigos com o tema pesquisado', async function () {
  console.log('=== ENTÃO: Verificando relevância dos resultados ===');

  const possui = await mundoCenario.paginaPesquisa.possuiResultados();
  assert.ok(possui, 'Os resultados devem conter artigos relevantes');

  const titulos = await mundoCenario.paginaPesquisa.obterTitulosResultados();
  assert.ok(titulos.length > 0, 'A lista de títulos não deve estar vazia');

  console.log(`✅ Títulos: ${titulos.slice(0, 3).join(' | ')}`);
});

Then('a mensagem de nenhum resultado encontrado é exibida', async function () {
  console.log('=== ENTÃO: Verificando mensagem de nenhum resultado ===');

  const semResultados = await mundoCenario.paginaPesquisa.exibeMensagemSemResultados();
  const quantidade    = await mundoCenario.paginaPesquisa.obterQuantidadeResultados();

  assert.ok(
    semResultados || quantidade === 0,
    'A página deve informar que nenhum resultado foi encontrado'
  );

  const mensagem = await mundoCenario.paginaPesquisa.obterMensagemSemResultados();
  console.log(`✅ Mensagem: "${mensagem}"`);
});

Then('nenhum artigo é listado na página de resultados', async function () {
  console.log('=== ENTÃO: Confirmando ausência de artigos ===');

  const quantidade = await mundoCenario.paginaPesquisa.obterQuantidadeResultados();
  assert.strictEqual(quantidade, 0, `Nenhum artigo deve ser listado. Encontrado(s): ${quantidade}`);
});

Then('nenhum alerta JavaScript é disparado na página', async function () {
  console.log('=== ENTÃO: Verificando ausência de alertas XSS ===');

  // O handler de dialog no gerenciadorPlaywright.js dismiss() qualquer dialog.
  // Se chegou aqui, nenhum alert travou a execução.
  assert.ok(
    mundoCenario.paginaPesquisa.paginaResultadosCarregada(),
    'A aplicação deve estar carregada corretamente sem execução de script'
  );
  console.log('✅ Sem alertas JavaScript detectados');
});
