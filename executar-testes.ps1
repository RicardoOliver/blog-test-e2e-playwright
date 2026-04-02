# =============================================================================
#  executar-testes.ps1 – Script de execução local (Windows PowerShell)
#  Blog do Agi – Automação de Testes JS
#
#  Uso:
#    .\executar-testes.ps1                          # Todos os testes
#    .\executar-testes.ps1 -Tags "@smoke"           # Smoke
#    .\executar-testes.ps1 -Tags "@regressao" -Headed
#    .\executar-testes.ps1 -Tags "@pesquisa" -Browser firefox
# =============================================================================

param(
    [string]$Tags    = "not @Ignorar",
    [string]$Browser = "chromium",
    [switch]$Headed  = $false,
    [switch]$Relatorio = $false
)

$ErrorActionPreference = "Stop"

# ── Cores ─────────────────────────────────────────────────────────────────────
function Escrever-Info   ($msg) { Write-Host "[INFO] $msg"  -ForegroundColor Cyan   }
function Escrever-Sucesso($msg) { Write-Host "[OK]   $msg"  -ForegroundColor Green  }
function Escrever-Aviso  ($msg) { Write-Host "[AVISO] $msg" -ForegroundColor Yellow }
function Escrever-Erro   ($msg) { Write-Host "[ERRO] $msg"  -ForegroundColor Red    }

# ── Cabeçalho ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      BLOG DO AGI – AUTOMAÇÃO DE TESTES JS                   ║" -ForegroundColor Cyan
Write-Host "║      Playwright + Cucumber BDD (PT-BR)                      ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# ── Verificar Node.js ─────────────────────────────────────────────────────────
Escrever-Info "Verificando pré-requisitos..."
try {
    $nodeVer = node --version
    Escrever-Sucesso "Node.js: $nodeVer"
} catch {
    Escrever-Erro "Node.js não encontrado. Instale em https://nodejs.org"
    exit 1
}

# ── Instalar dependências ─────────────────────────────────────────────────────
if (-not (Test-Path "node_modules")) {
    Escrever-Info "Instalando dependências..."
    npm install
    Escrever-Sucesso "Dependências instaladas."
}

# ── Verificar browsers ────────────────────────────────────────────────────────
Escrever-Info "Verificando browsers do Playwright..."
$playwrightCache = "$env:USERPROFILE\AppData\Local\ms-playwright"
if (-not (Test-Path $playwrightCache)) {
    Escrever-Aviso "Browsers não encontrados. Instalando..."
    npm run instalar-browsers
}

# ── Configuração da execução ──────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Configuração ===" -ForegroundColor Blue
Write-Host "   Tags    : $Tags"    -ForegroundColor Yellow
Write-Host "   Browser : $Browser" -ForegroundColor Yellow
Write-Host "   Headed  : $Headed"  -ForegroundColor Yellow
Write-Host ""

# ── Definir variáveis de ambiente ─────────────────────────────────────────────
$env:BROWSER  = $Browser
$env:HEADLESS = if ($Headed) { "false" } else { "true" }

# ── Executar testes ───────────────────────────────────────────────────────────
Escrever-Info "Executando testes..."
$inicio = Get-Date

try {
    npx cucumber-js --config cucumber.cjs --tags $Tags
    $exitCode = $LASTEXITCODE
} catch {
    $exitCode = 1
}

$fim      = Get-Date
$duracao  = $fim - $inicio

# ── Resultado ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "=== Resultado ===" -ForegroundColor Blue
Write-Host ("   Duração: {0:mm}m {0:ss}s" -f $duracao)

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║   ✅ TESTES CONCLUÍDOS COM SUCESSO   ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║   ❌ TESTES CONCLUÍDOS COM FALHAS    ║" -ForegroundColor Red
    Write-Host "╚══════════════════════════════════════╝" -ForegroundColor Red
}

# ── Gerar relatório Allure (opcional) ─────────────────────────────────────────
if ($Relatorio) {
    Escrever-Info "Gerando relatório Allure..."
    npm run relatorio:gerar
    Escrever-Sucesso "Relatório em: relatorios\allure-report\index.html"
}

Write-Host ""
Write-Host "📊 Relatórios disponíveis em:" -ForegroundColor Cyan
Write-Host "   Cucumber HTML : relatorios\cucumber-report.html" -ForegroundColor Yellow
Write-Host "   Screenshots   : relatorios\screenshots\"          -ForegroundColor Yellow

exit $exitCode
