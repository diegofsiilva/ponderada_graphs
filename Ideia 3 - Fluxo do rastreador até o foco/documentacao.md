# Fluxo de Recursos (Rastreadores --> Ocorrências de Incêndio)

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
