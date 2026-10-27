# LearningApp: especificação de produto e design

**Data:** 2026-10-27  
**Status:** Rascunho para aprovação  
**Escopo:** produto e arquitetura de alto nível; não autoriza implementação

## Intenção

Criar um app desktop para Windows que ajude iniciantes a aprender programação por trilhas estruturadas. O app mostra explicações e exercícios, cria projetos reais com Cargo em uma pasta escolhida pela pessoa e permite pedir a uma IA para revisar o trabalho. O código é escrito em outro editor. O app não é uma IDE.

A primeira trilha será de Rust para quem começa do zero. O app e as trilhas serão open source, com conteúdo criado pela comunidade e possibilidade de adicionar linguagens e trilhas no futuro.

## Objetivos

- Ensinar lógica de programação e uma linguagem por meio de explicações autorais, exercícios e mini projetos.
- Oferecer cerca de três exercícios de lógica em cada etapa e mini projetos como marcos.
- Criar cada exercício e mini projeto como Cargo project independente na pasta escolhida.
- Permitir que a pessoa peça uma revisão explícita pelo botão “Analisar exercício”.
- Executar verificações locais autorizadas para aquele exercício e incluir seus resultados na análise.
- Usar IA para explicar problemas e sugerir melhorias, sem alterar arquivos.
- Permitir trilhas locais mantidas pela comunidade, incluindo novas linguagens e trilhas de aprofundamento.

## Não objetivos

- Criar editor de código, IDE, terminal geral ou ambiente para resolver exercícios dentro do app.
- Monitorar arquivos ou iniciar revisões automaticamente.
- Permitir que a IA modifique código, aplique patches ou execute comandos arbitrários.
- Reproduzir ou importar conteúdo textual do roadmap.sh.
- Oferecer colaboração em nuvem, conta LearningApp ou progresso sincronizado na primeira versão.

## Usuários e fluxo principal

O público inicial são iniciantes sem experiência prévia em programação. A interface e o conteúdo iniciais serão em português do Brasil.

1. A pessoa instala o app, escolhe a trilha Rust e indica uma pasta local.
2. O app explica como instalar Rust estável usando rustup e verifica quando Cargo está disponível; não instala ferramentas silenciosamente.
3. A pessoa abre uma etapa, lê a explicação, vê o exercício e usa seu editor habitual.
4. Cada exercício ou mini projeto tem sua própria pasta e Cargo.toml, criados com Cargo stable.
5. Ao clicar em “Analisar exercício”, o app mostra os arquivos que pretende compartilhar, executa as verificações declaradas para o exercício e apresenta o resultado local.
6. Com consentimento explícito, o app envia à IA somente o contexto escolhido e a saída dessas verificações.
7. A IA retorna explicações e sugestões. A pessoa decide o que mudar no próprio editor.
8. O app registra localmente o progresso da trilha.

## Trilha inicial de Rust

Cada etapa terá por volta de três exercícios de lógica e um mini projeto que consolida o aprendizado. Exercícios e projetos serão pacotes Cargo independentes.

1. **Começar:** instalar Rust estável, entender Cargo, criar o primeiro projeto e executar um programa. Os primeiros exercícios introduzem sequência de instruções, entrada e saída e raciocínio passo a passo.
2. **Fundamentos:** variáveis, tipos, operadores, controle de fluxo, funções e estruturas de dados. Praticar decomposição de problemas, condições, repetição e transformação de dados.
3. **Rust essencial:** ownership, referências, structs, enums, tratamento de erros e testes. Praticar leitura de erros do compilador e modelagem de dados.
4. **Construir programas maiores:** módulos, crates, generics, traits e lifetimes. Organizar soluções e reutilizar comportamentos com tipos bem definidos.
5. **Serialização:** representar dados em formatos serializados e usar crates apropriadas, com exercícios e um mini projeto integrador.

Concorrência, async, macros, CLI, web e Bevy ficam fora da trilha inicial e poderão ser trilhas ou pacotes independentes depois. A ordem pedagógica final deve privilegiar pré-requisitos e prática, e não copiar a ordem ou o grafo do roadmap.sh.

## Conteúdo e extensibilidade

- A aplicação consumirá pacotes de trilha versionados, em formato aberto a ser definido na implementação. Um pacote contém metadados, etapas, lições em Markdown, exercícios, projetos, verificações permitidas e referências.
- Cada exercício descreve objetivo, contexto, arquivos gerados, critérios de conclusão, comandos locais permitidos e links de aprofundamento.
- A comunidade poderá criar novos pacotes sem alterar o núcleo do app. Na v1, a pessoa poderá importar pacotes a partir de uma pasta ou arquivo local; um catálogo remoto fica para depois. A primeira versão inclui a trilha Rust oficial do app.
- As lições serão escritas originalmente em português. Usar documentação como fonte de estudo é permitido dentro do processo editorial; o pacote distribui apenas texto autoral e links para as fontes.
- roadmap.sh servirá como referência de pesquisa e poderá aparecer como link externo. Não baixar, raspar, copiar, traduzir, adaptar ou incluir conteúdo ou estruturas do site/repositório sem permissão escrita compatível com redistribuição.

## Integração com IA

- Primeiro provedor: OpenAI, por meio de “Sign in with ChatGPT” e uso elegível do plano em um app open source executado localmente.
- A integração usará o fluxo OAuth oficial e a Responses API com as permissões e restrições vigentes. Não solicitará uma chave de API como caminho principal nem reutilizará cookies ou sessão web.
- A pessoa escolhe os arquivos que irão para cada análise e confirma o envio. O app exclui por padrão diretórios e arquivos gerados ou sensíveis, como target, .git e arquivos de ambiente.
- O app envia código e resultados de verificações apenas depois da ação explícita; progresso e arquivos do exercício permanecem locais, salvo o contexto compartilhado para uma análise.
- A arquitetura separa o provedor de IA do núcleo para permitir provedores adicionais no futuro. Só a integração OpenAI faz parte da primeira versão.
- A disponibilidade da franquia depende do plano, elegibilidade e limites definidos pelo ChatGPT. A documentação atual descreve essa integração como prévia e lista recursos da API que não são suportados; a versão inicial deve manter as análises em texto e respostas em streaming, sem depender de ferramentas hospedadas não suportadas.

## Verificações locais e limites de execução

- O app só executa verificações depois que a pessoa clica em “Analisar exercício”.
- Cada pacote declara verificações locais específicas. Para a trilha Rust inicial, o conjunto base é cargo check e cargo test.
- O app mostra os comandos e a pasta de execução. Conteúdo de trilha de terceiros exige confirmação antes de executar verificações pela primeira vez.
- Se o caminho de destino já contiver um projeto, o app nunca o sobrescreve; pede à pessoa para escolher outro nome ou ignorar a criação.
- Não há execução de comandos inventados ou selecionados pela IA, shell genérico, execução em background ou escrita de arquivos pela IA.
- O app envia para a análise a saída das verificações selecionadas junto com os arquivos que a pessoa aprovou.

## Abordagens consideradas

1. **App desktop local com integração direta ao provedor** — escolhida. O app controla a trilha e os arquivos locais, e envia contexto ao provedor apenas na análise solicitada. Atende ao desejo de usar o plano ChatGPT sem cobrar do mantenedor uma chave central e não transforma o produto em IDE. Tem limites de elegibilidade, quota e recursos da integração OAuth.
2. **Delegação a agentes CLI instalados localmente** — não escolhida para v1. Dá liberdade para usar ferramentas já instaladas, mas exige configuração por usuário e varia por agente e sistema.
3. **API com chave própria como único caminho** — não escolhida para v1. É ampla e simples de integrar, mas requer conta e cobrança de API separadas da assinatura ChatGPT.

Para conteúdo, foi considerada a importação e adaptação das explicações do roadmap.sh. Essa opção foi descartada porque os termos publicados proíbem redistribuição, cópia, modificação e scraping. A direção escolhida é conteúdo próprio com referências e links externos.

Para organização dos exercícios, foi considerada a agregação por etapa em um Cargo workspace. Foi escolhido um Cargo project independente para cada exercício e mini projeto, para facilitar o uso em editor externo, a revisão focada e o isolamento entre soluções.

## Privacidade e segurança

- A pasta escolhida delimita os projetos que o app cria e inspeciona.
- Antes do envio, a pessoa consegue revisar a lista de arquivos e o resultado local que será compartilhado.
- Tokens OAuth são armazenados no armazenamento seguro do Windows. Eles não aparecem em logs ou nos pacotes de trilha.
- Pacotes de comunidade são dados não confiáveis: suas instruções não podem conceder acesso fora da pasta do exercício nem executar silenciosamente comandos. Comandos declarados são mostrados antes da primeira execução.
- O app nunca envia arquivos automaticamente e nunca edita os projetos gerados.

## Restrições e premissas

- Primeira plataforma: Windows 10/11 x64, distribuído por instalador. macOS e Linux ficam para depois.
- Rust é a única trilha oficial incluída na versão inicial.
- É necessário ter Rust stable/Cargo instalado para gerar e verificar os projetos; o app orienta a instalação e detecta a ferramenta.
- A integração de uso do plano ChatGPT para apps open source é uma dependência externa sujeita a elegibilidade, quotas, capacidades e alterações de política. O formato dos pacotes e o núcleo de aprendizagem devem continuar úteis sem IA.
- A licença do app e dos pacotes autorais deve permitir uso, alteração e redistribuição open source; dependências e conteúdo de terceiros devem ser revisados separadamente.

## Critérios de sucesso

- Uma pessoa sem experiência consegue seguir a primeira etapa sem precisar abrir uma IDE fornecida pelo app.
- Cada exercício pode ser aberto e executado isoladamente com Cargo.
- A revisão só ocorre mediante solicitação e usa apenas os arquivos escolhidos e resultados de verificações autorizadas.
- A IA explica e sugere sem modificar o conteúdo local.
- Um novo pacote de trilha pode ser instalado sem mudar o núcleo da aplicação.
- O pacote Rust não incorpora conteúdo protegido do roadmap.sh.

## Decisões deixadas para a implementação

- Framework e arquitetura interna do app desktop para Windows.
- Esquema e validador de pacotes, inclusive versionamento e instalação de trilhas.
- Experiência visual da trilha, progresso, seleção de arquivos e revisão.
- Armazenamento local do progresso e histórico opcional de revisões.
- Segurança técnica da execução de Cargo e proteção dos tokens OAuth, de acordo com as APIs documentadas no momento do desenvolvimento.
- Processo de autoria, revisão e publicação de pacotes comunitários.

## Decisões pendentes da pessoa autora

- Comportamento quando o login com ChatGPT não estiver disponível ou a pessoa não for elegível: sem IA na v1 ou chave de API como alternativa.
- Licença do código e licença do conteúdo educacional autoral.

## Referências verificadas

- roadmap.sh Rust: https://roadmap.sh/rust
- roadmap.sh sobre redistribuição do conteúdo: https://roadmap.sh/about
- Termos roadmap.sh (atualizados em 27 de março de 2025): https://roadmap.sh/terms
- Licença do repositório de conteúdo: https://github.com/nilbuild/developer-roadmap/blob/master/license
- Integração OpenAI para app open source: https://developers.openai.com/siwc/token-sharing-open-source
- Limitações atuais de uso do plano: https://developers.openai.com/siwc/token-sharing-open-source/preview-limitations
- Rust getting started: https://rust-lang.org/learn/get-started/
- Rust Book: https://doc.rust-lang.org/book/
- Cargo Book: https://doc.rust-lang.org/stable/cargo/guide/
