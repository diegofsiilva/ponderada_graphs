# Ideia 3 - Fluxo de Recursos (Rastreadores --> Ocorrências de Incêndio)

**Trio responsável:** Ana Júlia Rodrigues Ribeiro, Lucas Michel Pereira, Teodoro Borges de Carvalho Neira

Esta documentação descreve a implementação técnica, o objetivo e as funcionalidades da visualização de dados desenvolvida para monitorar a alocação de recursos em operações de combate a incêndios.

## 1. Objetivo da Visualização

O objetivo principal desta ferramenta é fornecer uma representação visual clara e intuitiva da **alocação de recursos**, rastreando o fluxo desde as origens (**Rastreadores**) até os destinos finais (**Ocorrências de Incêndio**).

A visualização permite identificar rapidamente:
*   Quais rastreadores estão enviando recursos para quais ocorrências.
*   O **volume relativo** de recursos, representado pela espessura das linhas de conexão.
*   O balanço total de recursos enviados por cada unidade e recebidos por cada ponto crítico.

## 2. Meios e Tecnologias Utilizadas

A visualização foi construída utilizando as seguintes tecnologias:

| Componente | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Estrutura** | HTML5 | Define a semântica da página e os containers para o gráfico. |
| **Estilização** | CSS3 | Utiliza variáveis CSS, Flexbox e Grid para um layout responsivo. |
| **Gráficos** | SVG | Garante que a visualização seja vetorial e nítida em qualquer nível de zoom. |
| **Biblioteca Base** | [D3.js (v7)](https://d3js.org/) | Utilizada para manipulação de documentos baseada em dados e vinculação ao DOM. |
| **Plugin de Layout** | [d3-sankey](https://github.com/d3/d3-sankey) | Algoritmo específico para calcular as posições dos nós e a curvatura dos fluxos. |
| **Lógica** | JavaScript (ES6+) | Gerencia o processamento dos dados, interatividade e redimensionamento dinâmico. |

## 3. Componentes da Visualização

### 3.1. Diagrama de Sankey
A escolha do **Diagrama de Sankey** é ideal para este cenário, pois enfatiza as transferências entre sistemas. Os nós são organizados em duas colunas principais:
1.  **Esquerda (Origem):** Rastreadores (identificados como R-01 a R-05).
2.  **Direita (Destino):** Ocorrências de Incêndio (identificados como UP01 a UP04).

### 3.2. Paleta de cores
Para facilitar a leitura rápida, foi aplicada uma paleta de cores funcional:
*   **Azul (`#0ea5e9`):** Representa os Rastreadores.
*   **Vermelho (`#ef4444`):** Representa as Ocorrências de Incêndio.
*   **Verde Água (`#009c9c`):** Representa o fluxo de recursos em trânsito.

### 3.3. Interatividade
A visualização não é estática, oferecendo camadas adicionais de informação sob demanda:
*   **Tooltips Dinâmicos:** Ao passar o mouse sobre um fluxo ou nó, um balão informativo exibe detalhes precisos (ex: "Recursos: 10").
*   **Destaque Visual:** Os fluxos aumentam de opacidade ao serem selecionados, facilitando o rastreamento de caminhos específicos em redes complexas.
*   **Responsividade:** O gráfico se ajusta automaticamente ao tamanho da janela do navegador.

## 4. Estrutura de Dados

O motor da visualização consome um objeto JSON composto por dois arrays:
*   `nodes`: Define os nomes das entidades.
*   `links`: Define a conexão (`source` e `target`) e a magnitude do recurso (`value`).

> "A espessura de cada linha é proporcional ao valor numérico do recurso, permitindo uma análise qualitativa imediata da intensidade da operação."



# Ideia 4 - Mapa 3D de Recursos por UP

**Trio responsável:** Diego Figueiredo Silva, Rafael Josué e Átila Luís Flores Ramos Neto

---

## Relevância

A distribuição de recursos por Unidade de Patrulhamento (UP) é uma informação estratégica para qualquer operação de campo. Saber onde estão concentrados os recursos — e onde há escassez — é o primeiro passo para uma alocação mais eficiente.

O **Mapa 3D de Recursos por UP** transforma essa informação em uma visualização geográfica e interativa, permitindo que gestores identifiquem instantaneamente quais regiões estão bem cobertas e quais demandam atenção. Ao representar os dados como colunas tridimensionais sobre o mapa real do Mato Grosso do Sul, o usuário consegue comparar UPs não apenas por números, mas pela sua posição no território.

Essa abordagem contribui para diferentes níveis de decisão:

- **Alocação operacional:** identificar UPs com poucos recursos para priorizar reforços
- **Planejamento regional:** entender como os recursos se distribuem pelo território do MS
- **Comunicação:** apresentar dados de distribuição de forma clara para diferentes públicos
- **Análise comparativa:** comparar visualmente o porte de cada UP em relação às demais

---

## Como usar

A visualização é totalmente interativa e funciona diretamente no navegador, sem necessidade de instalação.

| Ação | Resultado |
|---|---|
| Arrastar o mouse | Rotaciona o mapa em 3D, permitindo ver o relevo das colunas de diferentes ângulos |
| Scroll do mouse | Aproxima ou afasta a câmera |
| Passar o mouse sobre uma coluna | Exibe o nome da UP e a quantidade exata de recursos alocados |

A legenda no canto superior esquerdo identifica cada UP pela cor correspondente à sua coluna no mapa.

---

## Como ler o mapa

O mapa comunica a informação por meio de dois elementos visuais principais:

**Colunas cilíndricas:** cada UP é representada por uma coluna posicionada na sua localização geográfica exata dentro do MS. A altura da coluna é proporcional à quantidade de recursos — uma coluna mais alta indica mais recursos alocados naquela UP. A comparação entre colunas permite perceber rapidamente as disparidades de distribuição.

**Mapa base colorido:** o fundo exibe os municípios reais do MS com cores distintas, servindo como referência geográfica. Isso permite associar cada UP à região do estado em que ela está inserida.

---

## Explicação Técnica

A implementação combina duas bibliotecas JavaScript para entregar uma experiência geográfica e tridimensional ao mesmo tempo.

### 1. Base Cartográfica

O mapa utiliza dados geográficos reais dos 79 municípios do Mato Grosso do Sul, obtidos do repositório público [geodata-br](https://github.com/tbrugz/geodata-br), que disponibiliza os polígonos oficiais dos municípios brasileiros em formato GeoJSON.

A renderização do mapa é feita com a biblioteca **D3.js**, que converte as coordenadas geográficas (latitude e longitude) para pixels, desenha cada município com uma cor distinta e compõe toda a base cartográfica em uma imagem. Essa imagem é então aplicada como textura sobre o plano 3D.

### 2. Visualização 3D

A camada tridimensional é construída com **Three.js**, uma biblioteca de renderização 3D para navegadores. Ela é responsável por:

- Criar e posicionar os cilindros sobre o mapa
- Aplicar iluminação e sombras que reforçam a percepção de profundidade
- Controlar a câmera rotativa que permite orbitar o mapa livremente
- Detectar quando o cursor passa sobre uma coluna (raycasting) para exibir o tooltip

### 3. Integração entre mapa e colunas

O ponto central da implementação é garantir que cada coluna apareça **exatamente sobre a posição geográfica correta** da UP no mapa. Para isso, a mesma projeção D3 que desenha o mapa é usada para calcular onde cada cilindro deve ser posicionado na cena 3D — criando uma correspondência precisa entre a textura do mapa e os objetos sobre ela.

---

<img src="/ideia4- rastreadores com mais recursos/mapa1.png">

---
## Como Executar

Para visualizar o mapa, abra o arquivo `index.html` correspondente em um navegador web moderno.

Para garantir que todas as dependências carreguem corretamente, recomenda-se utilizar a extensão **Live Server** no VS Code:

- Instale a extensão Live Server pelo marketplace do VS Code
- Abra o arquivo `.html` da visualização
- Clique com o botão direito no arquivo e selecione **"Open with Live Server"**
- O mapa abrirá automaticamente no navegador com interatividade completa

