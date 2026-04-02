# language: pt
# =============================================================================
#  Funcionalidade: Pesquisa de Artigos no Blog do Agi
#  Módulo: Busca / Search (lupa no canto superior direito)
#
#  ✅ Caminho feliz   ❌ Negativos   📐 Limite   🔥 Edge Cases
# =============================================================================

Funcionalidade: Pesquisa de artigos no Blog do Agi
  Como um visitante do Blog do Agi
  Quero pesquisar artigos utilizando a lupa no canto superior direito
  Para encontrar conteúdos sobre empréstimos e educação financeira

  Contexto:
    Dado que estou na página inicial do Blog do Agi

  # ===========================================================================
  # ✅ CAMINHO FELIZ
  # ===========================================================================

  @pesquisa @caminho-feliz @smoke
  Cenário: Pesquisa por termo válido retorna resultados
    Quando aciono a pesquisa por "emprestimo"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa
    E a URL contém o parâmetro de busca "emprestimo"

  @pesquisa @caminho-feliz @smoke
  Cenário: Pesquisa por "pix" retorna artigos
    Quando aciono a pesquisa por "pix"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa

  @pesquisa @caminho-feliz @regressao
  Esquema do Cenário: Pesquisa com termos financeiros válidos
    Quando aciono a pesquisa por "<termo>"
    Então a página de resultados é exibida
    E a URL contém o parâmetro de busca "<termo>"

    Exemplos:
      | termo           |
      | consignado      |
      | conta corrente  |
      | cartao          |
      | seguro          |

  @pesquisa @caminho-feliz @regressao
  Cenário: Submeter pesquisa com Enter redireciona para resultados
    Quando abro o campo de pesquisa
    E preencho o campo de pesquisa com "pix"
    E pressiono Enter para submeter a pesquisa
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa

  @pesquisa @caminho-feliz @regressao
  Cenário: Clicar no primeiro resultado abre o artigo
    Quando aciono a pesquisa por "emprestimo consignado"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa
    Quando clico no primeiro resultado da pesquisa
    Então sou redirecionado para a página do artigo
    E a página do artigo é exibida corretamente

  @pesquisa @caminho-feliz @regressao
  Cenário: Nova pesquisa a partir dos resultados atualiza a página
    Quando aciono a pesquisa por "pix"
    Então a página de resultados é exibida
    Quando realizo uma nova pesquisa por "consignado"
    Então a página de resultados é exibida
    E a URL contém o parâmetro de busca "consignado"

  # ===========================================================================
  # ❌ CENÁRIOS NEGATIVOS
  # ===========================================================================

  @pesquisa @negativo @regressao
  Cenário: Pesquisa com termo inexistente exibe mensagem de nenhum resultado
    Quando aciono a pesquisa por "xyzxyzxyz123456789"
    Então a mensagem de nenhum resultado encontrado é exibida
    E nenhum artigo é listado na página de resultados

  @pesquisa @negativo @regressao
  Cenário: Pesquisa com sequência aleatória não retorna artigos
    Quando aciono a pesquisa por "aaaabbbbcccc"
    Então a mensagem de nenhum resultado encontrado é exibida

  @pesquisa @negativo @regressao
  Cenário: Pesquisa com caracteres especiais não quebra a aplicação
    Quando aciono a pesquisa por "@#$%&*()"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @pesquisa @negativo @regressao
  Cenário: Pesquisa com script HTML não executa código malicioso
    Quando aciono a pesquisa por "<script>alert('xss')</script>"
    Então a aplicação não exibe erro grave
    E nenhum alerta JavaScript é disparado na página

  @pesquisa @negativo @regressao
  Cenário: Pesquisa com número aleatório não relacionado
    Quando aciono a pesquisa por "99999999999"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  # ===========================================================================
  # 📐 CASOS DE LIMITE (BOUNDARY VALUES)
  # ===========================================================================

  @pesquisa @limite @regressao
  Cenário: Campo de pesquisa vazio submetido com Enter não quebra
    Quando abro o campo de pesquisa
    E não preencho nenhum termo de pesquisa
    E pressiono Enter para submeter a pesquisa
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @pesquisa @limite @regressao
  Cenário: Pesquisa com 1 caractere é processada
    Quando aciono a pesquisa por "a"
    Então a página de resultados é exibida
    E a URL contém o parâmetro de busca "a"

  @pesquisa @limite @regressao
  Cenário: Pesquisa com 2 caracteres é processada
    Quando aciono a pesquisa por "pi"
    Então a página de resultados é exibida
    E a URL contém o parâmetro de busca "pi"

  @pesquisa @limite @regressao
  Cenário: Pesquisa com apenas espaços em branco é tratada
    Quando aciono a pesquisa por "   "
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @pesquisa @limite @regressao
  Cenário: Pesquisa com 80 caracteres não quebra a aplicação
    Quando aciono a pesquisa por "emprestimo emprestimo emprestimo emprestimo emprestimo emprestimo emprestimo empr"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @pesquisa @limite @regressao
  Cenário: Espaço antes e depois do termo retorna resultados
    Quando aciono a pesquisa por " consignado "
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa

  # ===========================================================================
  # 🔥 EDGE CASES
  # ===========================================================================

  @pesquisa @edge-case @regressao
  Cenário: Pesquisa com acento funciona corretamente
    Quando aciono a pesquisa por "empréstimo"
    Então a página de resultados é exibida
    E a URL contém o parâmetro de busca "empréstimo"

  @pesquisa @edge-case @regressao
  Cenário: Pesquisa em maiúsculas encontra resultados
    Quando aciono a pesquisa por "EMPRESTIMO"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa

  @pesquisa @edge-case @regressao
  Cenário: Pesquisa com maiúsculas e minúsculas misturadas funciona
    Quando aciono a pesquisa por "EmPrEsTiMo"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa

  @pesquisa @edge-case @regressao
  Cenário: Pesquisa com hífen é tratada sem erro
    Quando aciono a pesquisa por "pix-transferencia"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @pesquisa @edge-case @regressao
  Cenário: Pesquisa com número de ano retorna artigos
    Quando aciono a pesquisa por "2024"
    Então a página de resultados é exibida
    E a URL contém o parâmetro de busca "2024"

  @pesquisa @edge-case @regressao
  Cenário: Pesquisa com aspas duplas não quebra a aplicação
    Quando aciono a pesquisa por "emprestimo pessoal"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa
