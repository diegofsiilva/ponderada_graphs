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

## Estrutura dos dados

Cada UP é representada por um registro com as seguintes informações:

| Campo | Descrição |
|---|---|
| `id` | Identificador da UP |
| `lat` / `lng` | Coordenadas geográficas |
| `recursos` | Quantidade de recursos alocados |
| `cor` | Cor de identificação no mapa |

Para atualizar ou substituir os dados das UPs, basta editar o array `TRACKERS` no início do arquivo HTML com as informações reais de cada unidade.

---

## Possíveis evoluções

- Integração com uma API para carregamento dinâmico dos dados de recursos
- Filtro interativo por quantidade mínima de recursos
- Exibição de informações adicionais ao clicar em uma UP (fazenda, núcleo, área)
- Expansão da visualização para outras regiões de operação
- Adição de uma linha do tempo para acompanhar a variação de recursos ao longo do período

<img src="/ideia4- rastreadores com mais recursos/mapa1.png">
