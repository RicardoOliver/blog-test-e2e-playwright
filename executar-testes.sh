#!/usr/bin/env bash
# =============================================================================
#  executar-testes.sh – Script de execução local (Linux / macOS)
#  Blog do Agi – Automação de Testes JS
#
#  Uso:
#    ./executar-testes.sh                          # Todos os testes
#    ./executar-testes.sh "@smoke"                 # Smoke
#    ./executar-testes.sh "@regressao" false        # Regressão com interface
#    ./executar-testes.sh "@pesquisa" true firefox  # Pesquisa em Firefox
# =============================================================================

set -euo pipefail

TAGS="${1:-not @Ignorar}"
HEADLESS="${2:-true}"
BROWSER="${3:-chromium}"
RELATORIO="${4:-false}"

# ── Cores ─────────────────────────────────────────────────────────────────────
C_CIANO='\033[0;36m'; C_VERDE='\033[0;32m'; C_AMARELO='\033[1;33m'
C_AZUL='\033[0;34m';  C_VERM='\033[0;31m';  C_SEM='\033[0m'

log_info()  { echo -e "${C_VERDE}[INFO]${C_SEM} $1"; }
log_aviso() { echo -e "${C_AMARELO}[AVISO]${C_SEM} $1"; }

# ── Cabeçalho ─────────────────────────────────────────────────────────────────
echo -e "\n${C_CIANO}╔══════════════════════════════════════════════════════════════╗"
echo    "║      BLOG DO AGI – AUTOMAÇÃO DE TESTES JS                   ║"
echo -e "╚══════════════════════════════════════════════════════════════╝${C_SEM}\n"

# ── Pré-requisitos ────────────────────────────────────────────────────────────
command -v node >/dev/null || { echo "Node.js não encontrado!"; exit 1; }
log_info "Node.js: $(node --version) | npm: $(npm --version)"

# ── Dependências ─────────────────────────────────────────────────────────────
[ -d "node_modules" ] || { log_aviso "Instalando dependências..."; npm install; }

# ── Browsers ─────────────────────────────────────────────────────────────────
PLAYWRIGHT_CACHE="${HOME}/.cache/ms-playwright"
[ -d "$PLAYWRIGHT_CACHE" ] || { log_aviso "Instalando browsers..."; npm run instalar-browsers; }

# ── Configuração ─────────────────────────────────────────────────────────────
echo -e "${C_AZUL}=== Configuração ===${C_SEM}"
echo -e "  Tags    : ${C_AMARELO}${TAGS}${C_SEM}"
echo -e "  Browser : ${C_AMARELO}${BROWSER}${C_SEM}"
echo -e "  Headless: ${C_AMARELO}${HEADLESS}${C_SEM}\n"

# ── Executar testes ───────────────────────────────────────────────────────────
log_info "Executando testes..."
INICIO=$(date +%s)

set +e
BROWSER="$BROWSER" HEADLESS="$HEADLESS" \
  npx cucumber-js --config cucumber.cjs --tags "$TAGS"
EXIT_CODE=$?
set -e

FIM=$(date +%s)
DURACAO=$((FIM - INICIO))

# ── Resultado ─────────────────────────────────────────────────────────────────
echo -e "\n${C_AZUL}=== Resultado ===${C_SEM}"
echo -e "  Duração: $((DURACAO / 60))m $((DURACAO % 60))s"

if [ $EXIT_CODE -eq 0 ]; then
  echo -e "\n${C_VERDE}╔══════════════════════════════════════╗"
  echo    "║   ✅ TESTES CONCLUÍDOS COM SUCESSO   ║"
  echo -e "╚══════════════════════════════════════╝${C_SEM}"
else
  echo -e "\n${C_VERM}╔══════════════════════════════════════╗"
  echo    "║   ❌ TESTES CONCLUÍDOS COM FALHAS    ║"
  echo -e "╚══════════════════════════════════════╝${C_SEM}"
fi

# ── Relatório ─────────────────────────────────────────────────────────────────
[ "$RELATORIO" == "true" ] && npm run relatorio:gerar

echo -e "\n${C_CIANO}📊 Relatórios:${C_SEM}"
echo -e "  Cucumber HTML : ${C_AMARELO}relatorios/cucumber-report.html${C_SEM}"
echo -e "  Screenshots   : ${C_AMARELO}relatorios/screenshots/${C_SEM}\n"

exit $EXIT_CODE
