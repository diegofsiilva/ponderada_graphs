# Ideia 2 - UPs Mais Requisitadas no Mapa (MS)

**Dupla responsavel:** Nicole e Bernardo


## 1. Objetivo da Visualizacao

O objetivo principal desta ferramenta e apresentar, de forma geografica e intuitiva, onde estao as UPs com maior e menor volume de ocorrencias.

A visualizacao permite identificar rapidamente:
* Quais UPs estao em cada faixa de ocorrencia.
* A intensidade relativa de ocorrencias por UP, representada pelo tamanho do circulo.
* A distribuicao espacial das unidades dentro do territorio do MS.

## 2. Meios e Tecnologias Utilizadas

| Componente | Tecnologia | Descricao |
| :--- | :--- | :--- |
| **Estrutura** | HTML5 | Define a pagina, o container do mapa e os controles de interacao. |
| **Estilizacao** | CSS3 | Aplica paleta visual, destaque dos pontos e layout responsivo. |
| **Graficos** | SVG | Garante renderizacao vetorial e nitida do mapa e dos pontos. |
| **Biblioteca Base** | [D3.js (v7)](https://d3js.org/) | Faz carga de dados, projecao geografica, desenho dos municipios e interatividade. |
| **Logica** | JavaScript (ES6+) | Controla faixas de cor, escala de tamanho, tooltip e zoom/pan. |
| **Dados Geograficos** | GeoJSON (geodata-br) | Poligonos reais dos municipios do Mato Grosso do Sul. |

## 3. Componentes da Visualizacao

### 3.1. Mapa geografico de base
O mapa exibe os municipios reais do MS como referencia espacial para leitura dos pontos de UP.

### 3.2. Paleta de cores por faixa de ocorrencia
Para facilitar a leitura rapida, foi aplicada uma classificacao fixa:
* **Azul (`#4285f4`):** de 1 a 10 ocorrencias.
* **Amarelo (`#fbbc04`):** de 11 a 25 ocorrencias.
* **Vermelho (`#d93025`):** de 26 a 60 ocorrencias.

### 3.3. Interatividade
A visualizacao oferece recursos de exploracao:
* **Tooltip em municipios:** exibe o nome do municipio ao passar o mouse.
* **Tooltip em UPs:** exibe UP, ocorrencias e faixa de classificacao.
* **Zoom e pan:** navegacao por scroll, arraste e botoes (`+`, `-`, `Reset`).
* **Destaque visual:** municipio em hover fica ressaltado para facilitar leitura.

## 4. Estrutura de Dados

O mapa consome duas fontes principais:
* `GeoJSON`: municipios do MS.
* `UP_POINTS`: lista das unidades com ocorrencias.

Cada UP e representada por um objeto com:

| Campo | Descricao |
| :--- | :--- |
| `up` | Nome/identificador da UP |
| `lat` / `lon` | Coordenadas geograficas |
| `occurrences` | Quantidade de ocorrencias |

## 5. Possiveis Evolucoes

* Integracao com API para atualizacao automatica das ocorrencias.
* Filtros por faixa, regiao ou municipio.
* Painel lateral com ranking das UPs.


