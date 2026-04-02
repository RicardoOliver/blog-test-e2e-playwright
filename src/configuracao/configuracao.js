// =============================================================================
//  src/configuracao/configuracao.js
//  Configuração centralizada do projeto.
//  Lê variáveis de ambiente com valores padrão seguros.
// =============================================================================

import 'dotenv/config';

/**
 * Objeto de configuração imutável do projeto.
 * Todos os valores podem ser sobrescritos via variáveis de ambiente.
 *
 * @example
 * // Executar com Firefox:
 * BROWSER=firefox npx cucumber-js
 *
 * // Executar com interface visível:
 * HEADLESS=false npx cucumber-js
 */
export const configuracao = Object.freeze({
  // ── Browser ────────────────────────────────────────────────────────────────
  browser: {
    tipo:            process.env.BROWSER           || 'chromium',
    headless:        process.env.HEADLESS           !== 'false',
    slowMotion:      Number(process.env.SLOW_MOTION || 0),
    viewport: {
      width:  Number(process.env.VIEWPORT_LARGURA  || 1280),
      height: Number(process.env.VIEWPORT_ALTURA   || 720),
    },
  },

  // ── URLs ───────────────────────────────────────────────────────────────────
  urls: {
    base: process.env.URL_BASE || 'https://blog.agibank.com.br',
  },

  // ── Timeouts (ms) ─────────────────────────────────────────────────────────
  timeouts: {
    navegacao: Number(process.env.TIMEOUT_NAVEGACAO || 60000),
    elemento:  Number(process.env.TIMEOUT_ELEMENTO  || 10000),
    padrao:    Number(process.env.TIMEOUT_PADRAO    || 30000),
  },

  // ── Evidências ─────────────────────────────────────────────────────────────
  evidencias: {
    screenshotEmFalha: process.env.SCREENSHOT_EM_FALHA !== 'false',
    diretorio:         process.env.SCREENSHOT_DIRETORIO || 'relatorios/screenshots',
  },

  // ── Locale ─────────────────────────────────────────────────────────────────
  locale:   process.env.LOCALE   || 'pt-BR',
  timezone: process.env.TIMEZONE || 'America/Sao_Paulo',
});
