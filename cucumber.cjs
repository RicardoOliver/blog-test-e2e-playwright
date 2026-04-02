// =============================================================================
//  cucumber.js – Configuração Central do Cucumber
//  Blog do Agi – Automação de Testes (JavaScript)
// =============================================================================

const relatorioAllure = [
  'allure-cucumberjs/reporter',
  {
    resultsDir: 'relatorios/allure-results',
    testMode: false,
  },
].join(':');

const relatorioJson = 'json:relatorios/cucumber-report.json';
const relatorioHtml = 'html:relatorios/cucumber-report.html';
const relatorioConsole = 'progress';

module.exports = {
  // ─── Perfil padrão (headless, todos os testes) ───────────────────────────
  default: {
    paths: ['testes/funcionalidades/**/*.feature'],
    require: [
      'testes/passos/**/*.js',
      'src/suporte/**/*.js',
    ],
    requireModule: [],
    language: 'pt',
    format: [
      relatorioConsole,
      relatorioJson,
      relatorioHtml,
      relatorioAllure,
    ],
    formatOptions: {
      snippetInterface: 'async-await',
    },
    tags: 'not @Ignorar',
    parallel: 1,
    retry: 0,
    timeout: 60000,
  },

  // ─── Perfil: Smoke (testes críticos) ─────────────────────────────────────
  smoke: {
    paths: ['testes/funcionalidades/**/*.feature'],
    require: [
      'testes/passos/**/*.js',
      'src/suporte/**/*.js',
    ],
    language: 'pt',
    format: [relatorioConsole, relatorioJson, relatorioAllure],
    tags: '@smoke',
    parallel: 1,
    timeout: 30000,
  },

  // ─── Perfil: Regressão completa ───────────────────────────────────────────
  regressao: {
    paths: ['testes/funcionalidades/**/*.feature'],
    require: [
      'testes/passos/**/*.js',
      'src/suporte/**/*.js',
    ],
    language: 'pt',
    format: [relatorioConsole, relatorioJson, relatorioHtml, relatorioAllure],
    tags: '@regressao and not @Ignorar',
    parallel: 1,
    timeout: 60000,
  },

  // ─── Perfil: Headed (desenvolvimento local) ───────────────────────────────
  headed: {
    paths: ['testes/funcionalidades/**/*.feature'],
    require: [
      'testes/passos/**/*.js',
      'src/suporte/**/*.js',
    ],
    language: 'pt',
    format: [relatorioConsole],
    tags: 'not @Ignorar',
    parallel: 1,
    timeout: 90000,
  },
};
