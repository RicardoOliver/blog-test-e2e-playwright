# 🧪 Blog do Agi – Automação de Testes (JavaScript)

<div align="center">

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?logo=nodedotjs)
![Playwright](https://img.shields.io/badge/Playwright-1.51.1-2EAD33?logo=playwright)
![Cucumber](https://img.shields.io/badge/Cucumber-11.x-brightgreen?logo=cucumber)
![Allure](https://img.shields.io/badge/Allure-3.x-orange)
![CI](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)

**Playwright + JavaScript + Cucumber BDD (PT-BR) + Allure Reports**

</div>

---

## 📋 Funcionalidades Testadas

| # | Funcionalidade | Cenários |
|---|---------------|:--------:|
| 1 | **Pesquisa de Artigos** (lupa superior direita) | 23 |
| 2 | **Navegação por Categorias** (menu principal) | 16 |
| — | **Total** | **39** |

### Cobertura por tipo (Estimada)

| ✅ Happy Path | ❌ Negativos | 📐 Limite | 🔥 Edge Cases |
|:---:|:---:|:---:|:---:|
| 15 | 8 | 8 | 8 |

---

## 🏗️ Estrutura do Projeto

```
blog-agi-testes-js/
├── .github/workflows/ci.yml          # Pipeline CI/CD (4 jobs + Quality Gate)
├── .env                              # Configurações de ambiente (não versionar em prod)
├── .gitignore
├── cucumber.cjs                      # Configuração central do Cucumber (perfis)
├── package.json                      # Dependências Node.js
├── README.md
│
├── src/
│   ├── configuracao/
│   │   └── configuracao.js          # Configuração tipada (browser, URLs, timeouts)
│   ├── paginas/
│   │   ├── paginaBase.js            # Page Object base com utilitários
│   │   ├── paginaInicial.js         # Home + lupa de pesquisa
│   │   ├── paginaPesquisa.js        # Resultados de busca
│   │   └── paginaArtigo.js          # Página de artigo individual
│   └── suporte/
│       ├── gerenciadorPlaywright.js  # Ciclo de vida do Playwright (browser/context/page)
│       ├── hooks.js                  # Before/After + screenshots + evidências
│       └── mundoCenario.js          # Contexto compartilhado entre steps
│
└── testes/
    ├── funcionalidades/
    │   ├── pesquisa_artigos.feature      # BDD – Pesquisa (23 cenários)
    │   └── navegacao_categorias.feature  # BDD – Navegação (16 cenários)
    ├── passos/
    │   ├── passosComuns.js          # Steps compartilhados (Given + Thens globais)
    │   ├── passosPesquisa.js        # Steps de pesquisa
    │   └── passosNavegacao.js       # Steps de navegação
    └── testes_mesa/
        └── testes_mesa.md           # 48 casos de teste documentados
```

---

## ⚙️ Pré-requisitos

| Ferramenta | Versão |
|-----------|:------:|
| Node.js   | 18+    |
| npm       | 9+     |
| Java (JRE)| 8+ (para o Allure) |
| Allure CLI| via npm install |

---

## 🚀 Instalação e Execução

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/blog-agi-testes-js.git
cd blog-agi-testes-js

# 2. Instalar dependências (Inclui Allure e Cucumber)
npm install

# 3. Instalar browsers do Playwright (Chromium, Firefox, Webkit)
npm run instalar-browsers

# 4. Executar todos os testes
npm test

# 5. Gerar e abrir relatório Allure (requer Java instalado para o binário do Allure)
npm run relatorio
```

---

## 🏷️ Perfis e Tags

```bash
# Smoke Tests (críticos)
npm run test:smoke

# Regressão completa
npm run test:regressao

# Por funcionalidade
npm run test:pesquisa
npm run test:navegacao

# Por tipo de teste
npm run test:negativo
npm run test:limite
npm run test:edge-case

# Com interface visível (desenvolvimento)
npm run test:headed

# Firefox
npm run test:firefox

# Tags customizadas
npx cucumber-js --config cucumber.cjs --tags "@smoke and not @Ignorar"
npx cucumber-js --config cucumber.cjs -p regressao
```

---

## 🔧 Configurações via Variáveis de Ambiente

```bash
# Browser (chromium | firefox | webkit)
BROWSER=firefox npm test

# Modo headless
HEADLESS=false npm test

# Combinação
BROWSER=webkit HEADLESS=false npm run test:smoke
```

---

## 🚦 Pipeline CI/CD

| Job | Tipo | Bloqueia |
|-----|------|:--------:|
| 📦 Instalar e Validar | Setup + dry-run | Sim |
| 💨 Smoke Tests | Testes críticos | **Sim** |
| 🔄 Regressão (matrix) | Pesquisa + Navegação | Não |
| 🚦 **Quality Gate** | Avalia resultados | **Sim** |
| 📊 Evidências/Allure | Artifacts do GitHub | Não |

---

## 🌐 Relatórios no GitHub

- Allure (GitHub Pages): https://ricardooliver.github.io/blog-test-e2e-playwright/allure-report/
- Artifacts (Actions): https://github.com/RicardoOliver/blog-test-e2e-playwright/actions
- Ative no repositório:
  - Settings → Actions → General → Workflow permissions → Read and write permissions
  - Settings → Pages → Deploy from a branch → gh-pages (root)

---

## 📊 Relatórios

| Relatório | Local |
|-----------|-------|
| Allure HTML interativo | `relatorios/allure-report/` |
| Cucumber JSON | `relatorios/cucumber-report.json` |
| Cucumber HTML | `relatorios/cucumber-report.html` |
| Screenshots (falhas) | `relatorios/screenshots/` |

---

## 🧩 Stack

| Lib | Versão | Papel |
|-----|:------:|-------|
| [playwright](https://playwright.dev) | 1.51.1 | Automação de browser |
| [@cucumber/cucumber](https://cucumber.io) | 11.x | Framework BDD |
| [allure-cucumberjs](https://allurereport.org) | 3.x | Relatórios |
| [dotenv](https://npmjs.com/package/dotenv) | 16.x | Configuração via .env |
