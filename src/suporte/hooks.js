// =============================================================================
//  src/suporte/hooks.js
//  Hooks do Cucumber: Before / After por cenário.
//  Gerencia ciclo de vida do Playwright e coleta de evidências.
// =============================================================================

import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { mkdirSync }                                  from 'fs';
import { configuracao }                               from '../configuracao/configuracao.js';
import { gerenciador }                                from './gerenciadorPlaywright.js';
import { mundoCenario }                               from './mundoCenario.js';

// ── Setup global ──────────────────────────────────────────────────────────────

setDefaultTimeout(30000);

BeforeAll(async function () {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║      BLOG DO AGI – AUTOMAÇÃO DE TESTES JS – INÍCIO          ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // Cria diretórios necessários
  const diretorios = [
    'relatorios/allure-results',
    'relatorios/screenshots',
    'relatorios/videos',
  ];
  diretorios.forEach((dir) => mkdirSync(dir, { recursive: true }));
});

AfterAll(async function () {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║      BLOG DO AGI – AUTOMAÇÃO DE TESTES JS – FIM             ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
});

// ── Antes de cada cenário ─────────────────────────────────────────────────────

Before(async function (cenario) {
  console.log(`\n┌── ▶ CENÁRIO: ${cenario.pickle.name}`);
  console.log(`│    Tags: ${cenario.pickle.tags.map((t) => t.name).join(', ') || '(nenhuma)'}`);

  // Inicializa Playwright e registra a página no mundo do cenário
  const pagina = await gerenciador.inicializar();
  mundoCenario.definirPagina(pagina);

  console.log('└── Playwright pronto\n');
});

// ── Após cada cenário ─────────────────────────────────────────────────────────

After(async function (cenario) {
  const passou = cenario.result?.status === Status.PASSED;
  const icone  = passou ? '✅' : '❌';

  console.log(`\n┌── ${icone} FIM: ${cenario.pickle.name}`);
  console.log(`│    Status: ${cenario.result?.status}`);

  try {
    // Captura URL final como evidência
    const urlFinal = gerenciador.pagina?.url?.() ?? 'indisponível';
    console.log(`│    URL Final: ${urlFinal}`);

    // Screenshot em caso de falha
    if (!passou && configuracao.evidencias.screenshotEmFalha) {
      const nomeArquivo = cenario.pickle.name
        .replace(/[^a-zA-Z0-9]/g, '_')
        .toLowerCase()
        .substring(0, 80);

      const buffer = await gerenciador.capturarScreenshot(nomeArquivo);

      if (buffer) {
        // Anexa ao relatório do Cucumber (aparece no HTML e Allure)
        await this.attach(buffer, 'image/png');
      }

      // Captura HTML da página para debug
      try {
        const html = await gerenciador.pagina.content();
        await this.attach(html, 'text/html');
      } catch { /* ignora se página já fechou */ }
    }
  } catch (erro) {
    console.warn(`│    Aviso ao coletar evidências: ${erro.message}`);
  } finally {
    await gerenciador.encerrar();
    mundoCenario.limpar();
    console.log('└── Playwright encerrado\n');
  }
});
