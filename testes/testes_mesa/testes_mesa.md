# 📋 Testes de Mesa – Blog do Agi (JavaScript)

**Projeto:** Automação de Testes – Blog do Agi (Playwright + JS)
**Módulo:** Pesquisa de Artigos e Navegação por Categorias
**Versão:** 1.0 | **Data:** 2025 | **Responsável:** Time de QA

---

## 🔍 Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Comportamento esperado aprovado |
| ❌ | Resultado esperado de erro |
| 📐 | Caso de limite (Boundary Value) |
| 🔥 | Edge case (comportamento extremo) |
| 💨 | Smoke test (crítico – bloqueante) |

---

## 📌 Funcionalidade 1 – Pesquisa de Artigos (Lupa)

### 🗂️ CT-001–010 — Caminho Feliz ✅

| ID | Descrição | Entrada | Passos | Resultado Esperado | Status |
|----|-----------|---------|--------|--------------------|--------|
| CT-001 💨 | Pesquisa por "emprestimo" retorna resultados | `emprestimo` | 1. Clicar na lupa 2. Digitar 3. Enter | Artigos listados; URL contém `?s=emprestimo` | 🔲 |
| CT-002 💨 | Pesquisa por "pix" retorna resultados | `pix` | 1. Clicar na lupa 2. Digitar 3. Enter | Artigos sobre Pix listados | 🔲 |
| CT-003 | Pesquisa por "consignado" | `consignado` | 1–3 | Artigos de consignado | 🔲 |
| CT-004 | Pesquisa por "conta corrente" | `conta corrente` | 1–3 | Resultados relevantes | 🔲 |
| CT-005 | Pesquisa com Enter submete corretamente | `cartao` | Enter no campo | Redirecionamento para resultados | 🔲 |
| CT-006 | URL contém parâmetro de busca | `pix` | Pesquisar | URL contém `?s=pix` | 🔲 |
| CT-007 | Clicar no 1º resultado abre artigo | — | Pesquisar → clicar 1º | Página de artigo carregada | 🔲 |
| CT-008 | Múltiplos resultados para "emprestimo" | `emprestimo` | Pesquisar | Mais de 1 artigo | 🔲 |
| CT-009 | Nova pesquisa atualiza resultados | `pix` → `consignado` | Pesquisar 2x | URL muda; resultados atualizados | 🔲 |
| CT-010 | Artigo aberto tem URL válida do blog | — | Clicar em resultado | URL contém `blog.agibank.com.br` | 🔲 |

---

### 🗂️ CT-011–020 — Cenários Negativos ❌

| ID | Descrição | Entrada | Passos | Resultado Esperado | Status |
|----|-----------|---------|--------|--------------------|--------|
| CT-011 ❌ | Termo inexistente → mensagem de sem resultado | `xyzxyzxyz123456789` | Pesquisar | Msg "nenhum resultado"; 0 artigos | 🔲 |
| CT-012 ❌ | Sequência aleatória | `aaaabbbbcccc` | Pesquisar | Nenhum resultado | 🔲 |
| CT-013 ❌ | Caracteres especiais | `@#$%&*()` | Pesquisar | Sem erro; URL válida | 🔲 |
| CT-014 ❌ | Script HTML (XSS) | `<script>alert('xss')</script>` | Pesquisar | Sem alert JS; sem execução de código | 🔲 |
| CT-015 ❌ | SQL Injection | `' OR '1'='1` | Pesquisar | Sem erro; resultado vazio | 🔲 |
| CT-016 ❌ | Número aleatório grande | `99999999999` | Pesquisar | Sem erro; URL válida | 🔲 |
| CT-017 ❌ | Emoji | `🤑💰` | Pesquisar | Sem erro | 🔲 |
| CT-018 ❌ | Tema inexistente no blog | `criptomoeda bitcoin` | Pesquisar | Mensagem de nenhum resultado | 🔲 |
| CT-019 ❌ | Hífen no início do termo | `-emprestimo` | Pesquisar | Sem erro; URL válida | 🔲 |
| CT-020 ❌ | Aspas duplas isoladas | `""` | Pesquisar | Sem erro; URL válida | 🔲 |

---

### 🗂️ CT-021–030 — Casos de Limite 📐

| ID | Descrição | Entrada | Resultado Esperado | Status |
|----|-----------|---------|-------------------|--------|
| CT-021 📐 | Campo vazio + Enter | `` (vazio) | Sem crash; URL válida | 🔲 |
| CT-022 📐 | 1 caractere | `a` | Página de resultados; URL com `?s=a` | 🔲 |
| CT-023 📐 | 2 caracteres | `pi` | Página de resultados | 🔲 |
| CT-024 📐 | Apenas espaços | `   ` | Sem crash; URL válida | 🔲 |
| CT-025 📐 | Espaço antes e depois | ` consignado ` | Resultados para "consignado" (trim) | 🔲 |
| CT-026 📐 | 80 caracteres | String 80 chars | Sem crash; URL válida | 🔲 |
| CT-027 📐 | Verificar paginação nos resultados | `emprestimo` | Paginação visível quando há muitos resultados | 🔲 |
| CT-028 📐 | Artigos têm título visível | Qualquer termo válido | Títulos não vazios | 🔲 |
| CT-029 📐 | Número de 4 dígitos | `2024` | Resultados ou sem erro | 🔲 |
| CT-030 📐 | Termo com ponto | `emprestimo.pessoal` | Sem crash; URL válida | 🔲 |

---

### 🗂️ CT-031–040 — Edge Cases 🔥

| ID | Descrição | Entrada | Resultado Esperado | Status |
|----|-----------|---------|-------------------|--------|
| CT-031 🔥 | Acento | `empréstimo` | Resultados; URL com parâmetro | 🔲 |
| CT-032 🔥 | Maiúsculas | `EMPRESTIMO` | Mesmos resultados que minúsculas | 🔲 |
| CT-033 🔥 | Capitalização mista | `EmPrEsTiMo` | Resultados normais | 🔲 |
| CT-034 🔥 | Pesquisa sequencial (2 termos) | `pix` → `consignado` | URL atualiza; resultados mudam | 🔲 |
| CT-035 🔥 | Hífen entre palavras | `pix-transferencia` | Sem crash; URL válida | 🔲 |
| CT-036 🔥 | Barra | `emprestimo/consignado` | Sem crash | 🔲 |
| CT-037 🔥 | & comercial | `emprestimo&consignado` | Sem crash; URL válida | 🔲 |
| CT-038 🔥 | Espaço codificado `%20` | `emprestimo%20pessoal` | Sem crash; URL válida | 🔲 |
| CT-039 🔥 | Caracteres Unicode | `câmbio` | Resultados ou sem erro | 🔲 |
| CT-040 🔥 | Termo muito longo (500 chars) | String 500 chars | Sem travar; comportamento gracioso | 🔲 |

---

## 📌 Funcionalidade 2 – Navegação por Categorias

### 🗂️ CT-041–050 — Caminho Feliz ✅

| ID | Descrição | Passos | Resultado Esperado | Status |
|----|-----------|--------|--------------------|--------|
| CT-041 💨 | Acessar Empréstimos pelo menu | Clicar "Empréstimos" | URL `/emprestimos/`; artigos listados | 🔲 |
| CT-042 💨 | Acessar Pix pelo menu | Clicar "Pix" | URL `/pix/`; artigos listados | 🔲 |
| CT-043 | Acessar Suas Finanças | Clicar "Suas finanças" | URL `/suas-financas/` | 🔲 |
| CT-044 | Acessar Empréstimo Consignado | Clicar submenu | URL `/emprestimo-consignado/` | 🔲 |
| CT-045 | Acessar Conta Corrente | Clicar submenu | URL `/conta-corrente/` | 🔲 |
| CT-046 | Artigo dentro de categoria | Clicar em artigo | Página do artigo carregada | 🔲 |
| CT-047 💨 | Home exibe artigos | Abrir blog | Artigos visíveis na home | 🔲 |
| CT-048 | Paginação em categoria | Clicar próxima página | URL `/page/2/`; artigos listados | 🔲 |
| CT-049 | Navegar entre 2 categorias | Empréstimos → Pix | URL atualiza; artigos mudam | 🔲 |
| CT-050 | Pesquisar a partir de categoria | Menu → Lupa → Pesquisar | Resultados de pesquisa exibidos | 🔲 |

---

### 🗂️ CT-051–058 — Negativos e Edge Cases ❌🔥

| ID | Descrição | Entrada | Resultado Esperado | Status |
|----|-----------|---------|-------------------|--------|
| CT-051 ❌ | URL categoria inexistente | `/categoria-inexistente-xyz/` | Sem crash; URL válida (404 amigável) | 🔲 |
| CT-052 ❌ | URL artigo inexistente | `/artigo-inexistente-xyz/` | Sem crash; URL válida | 🔲 |
| CT-053 📐 | Todas as categorias têm artigos | Cada categoria | Ao menos 1 artigo por categoria | 🔲 |
| CT-054 📐 | Paginação `/page/2/` direta | `/emprestimos/page/2/` | Sem crash; artigos listados | 🔲 |
| CT-055 🔥 | Links dos artigos são válidos | Qualquer categoria | Links apontam para blog.agibank.com.br | 🔲 |
| CT-056 🔥 | Segunda página via paginação | Navegar próxima página | Artigos carregados | 🔲 |
| CT-057 🔥 | Navegar de categoria em categoria | 3 menus em sequência | Cada URL atualiza corretamente | 🔲 |
| CT-058 🔥 | Pesquisa dentro de categoria filtra corretamente | Empréstimos → pesquisar | Resultados exibidos | 🔲 |

---

## 📊 Resumo de Cobertura

| Funcionalidade | Total | Happy | Neg. | Limite | Edge |
|---------------|:-----:|:-----:|:----:|:------:|:----:|
| Pesquisa de Artigos | 30 | 10 | 10 | 10 | 10 |
| Navegação | 18 | 10 | 2 | 3 | 3 |
| **Total** | **48** | **20** | **12** | **13** | **13** |

---

## 🎯 Matriz de Risco

| Cenário | Prob. | Impacto | Prioridade |
|---------|:-----:|:-------:|:----------:|
| XSS no campo de busca | Baixa | Alto | 🔴 |
| Campo vazio quebrando app | Média | Alto | 🔴 |
| Categoria inexistente → 500 | Baixa | Alto | 🔴 |
| Pesquisa sem resultado sem msg | Alta | Médio | 🟡 |
| Case sensitivity | Alta | Baixo | 🟢 |
| Paginação inválida | Baixa | Baixo | 🟢 |
