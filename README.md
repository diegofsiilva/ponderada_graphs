# ponderada_graphs

## Ideia 2 - UPs mais requisitadas no mapa do MS

### Relevancia
Esta visualizacao ajuda a identificar rapidamente quais UPs recebem mais ocorrencias e quais recebem menos.
Com isso, fica mais facil priorizar reforco operacional e comunicar o cenario de forma clara.

### Como ler o mapa
- Ponto azul: UP com 1-10 ocorrencias
- Ponto amarelo: UP com 11-25 ocorrencias
- Ponto vermelho: UP com 26-60 ocorrencias
- Quanto maior o circulo, maior a quantidade de ocorrencias

### Explicacao tecnica 
- D3.js renderiza o mapa real do Mato Grosso do Sul via GeoJSON (municipios)
- A projecao geografica converte latitude/longitude para posicoes no SVG
- Cada UP e desenhada como um ponto com cor por faixa e tamanho proporcional ao volume

### Estrutura dos dados das UPs
Cada UP possui:

| Campo | Descricao |
|---|---|
| `up` | Nome/identificador da UP |
| `lat` e `lon` | Coordenadas geograficas |
| `occurrences` | Quantidade de ocorrencias |

### Possiveis evolucoes
- Carregar dados reais por API
- Adicionar filtros por faixa de ocorrencias
- Permitir clique na UP para abrir detalhes operacionais
