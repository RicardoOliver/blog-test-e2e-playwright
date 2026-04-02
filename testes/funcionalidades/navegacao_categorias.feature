# language: pt
# =============================================================================
#  Funcionalidade: Navegação por Categorias do Blog do Agi
#  Módulo: Menu principal / Categorias
#
#  ✅ Caminho feliz   ❌ Negativos   📐 Limite   🔥 Edge Cases
# =============================================================================

Funcionalidade: Navegação por categorias do Blog do Agi
  Como um visitante do Blog do Agi
  Quero navegar pelas categorias de artigos disponíveis no menu
  Para encontrar conteúdos específicos sobre produtos financeiros

  Contexto:
    Dado que estou na página inicial do Blog do Agi

  # ===========================================================================
  # ✅ CAMINHO FELIZ
  # ===========================================================================

  @navegacao @caminho-feliz @smoke
  Cenário: Acessar categoria Empréstimos exibe artigos
    Quando clico no menu "Empréstimos"
    Então sou redirecionado para a URL que contém "/emprestimos/"
    E pelo menos 1 artigo é listado na página

  @navegacao @caminho-feliz @smoke
  Cenário: Acessar categoria Pix exibe artigos
    Quando clico no menu "Pix"
    Então sou redirecionado para a URL que contém "/pix/"
    E pelo menos 1 artigo é listado na página

  @navegacao @caminho-feliz @regressao
  Cenário: Acessar categoria Suas Finanças exibe artigos
    Quando clico no menu "Suas finanças"
    Então sou redirecionado para a URL que contém "/suas-financas/"
    E pelo menos 1 artigo é listado na página

  @navegacao @caminho-feliz @regressao
  Cenário: Acessar submenu Empréstimo Consignado exibe artigos
    Quando clico no menu "Empréstimo Consignado"
    Então sou redirecionado para a URL que contém "/emprestimo-consignado/"
    E pelo menos 1 artigo é listado na página

  @navegacao @caminho-feliz @regressao
  Cenário: Acessar submenu Conta Corrente exibe artigos
    Quando clico no menu "Conta Corrente"
    Então sou redirecionado para a URL que contém "/conta-corrente/"
    E pelo menos 1 artigo é listado na página

  @navegacao @caminho-feliz @regressao
  Cenário: Clicar em artigo dentro de categoria abre a página do artigo
    Quando clico no menu "Empréstimos"
    E pelo menos 1 artigo é listado na página
    Quando clico no primeiro artigo listado
    Então sou redirecionado para a página do artigo
    E a página do artigo é exibida corretamente

  @navegacao @caminho-feliz @smoke
  Cenário: Página inicial exibe artigos e está carregada corretamente
    Então a página inicial do blog é exibida corretamente
    E artigos são listados na página inicial

  @navegacao @caminho-feliz @regressao
  Cenário: Paginação da categoria funciona corretamente
    Quando clico no menu "Empréstimos"
    Então a paginação está disponível na página
    Quando navego para a próxima página
    Então sou redirecionado para a URL que contém "/page/"
    E pelo menos 1 artigo é listado na página

  # ===========================================================================
  # ❌ CENÁRIOS NEGATIVOS
  # ===========================================================================

  @navegacao @negativo @regressao
  Cenário: Acessar URL de categoria inexistente não quebra o site
    Quando acesso diretamente a URL "/categoria-inexistente-xyz/"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @navegacao @negativo @regressao
  Cenário: Acessar artigo com URL inválida exibe tratamento de erro
    Quando acesso diretamente a URL "/artigo-que-nao-existe-xyz-abc-123/"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  # ===========================================================================
  # 📐 CASOS DE LIMITE
  # ===========================================================================

  @navegacao @limite @regressao
  Esquema do Cenário: Todas as categorias principais têm artigos
    Quando acesso diretamente a URL da categoria "<urlCategoria>"
    Então pelo menos 1 artigo é listado na página

    Exemplos:
      | urlCategoria       |
      | /emprestimos/      |
      | /pix/              |
      | /suas-financas/    |
      | /sua-seguranca/    |
      | /produtos/         |

  @navegacao @limite @regressao
  Cenário: Navegar até a segunda página de uma categoria lista artigos
    Quando clico no menu "Empréstimos"
    Então a paginação está disponível na página
    Quando navego para a próxima página
    Então pelo menos 1 artigo é listado na página

  # ===========================================================================
  # 🔥 EDGE CASES
  # ===========================================================================

  @navegacao @edge-case @regressao
  Cenário: Navegar entre categorias sem voltar para home
    Quando clico no menu "Empréstimos"
    Então sou redirecionado para a URL que contém "/emprestimos/"
    Quando clico no menu "Pix"
    Então sou redirecionado para a URL que contém "/pix/"
    E pelo menos 1 artigo é listado na página

  @navegacao @edge-case @regressao
  Cenário: Pesquisa a partir de página de categoria funciona
    Quando clico no menu "Empréstimos"
    Então sou redirecionado para a URL que contém "/emprestimos/"
    Quando aciono a pesquisa por "consignado"
    Então a página de resultados é exibida
    E é exibido pelo menos 1 resultado de pesquisa

  @navegacao @edge-case @regressao
  Cenário: URL de categoria com paginação direta é acessível
    Quando acesso diretamente a URL da categoria "/emprestimos/page/2/"
    Então a aplicação não exibe erro grave
    E a URL permanece válida no domínio do blog

  @navegacao @edge-case @regressao
  Cenário: Artigos listados possuem links válidos de leitura
    Quando clico no menu "Pix"
    Então sou redirecionado para a URL que contém "/pix/"
    E os artigos listados possuem links válidos de leitura
