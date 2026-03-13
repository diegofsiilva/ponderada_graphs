const WIDTH = 1200;
const HEIGHT = 760;
const MA_GEOJSON_URL = "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-21-mun.json";

const COLORS = {
  high: "#d93025",
  medium: "#fbbc04",
  low: "#4285f4"
};

// Novas UPs distribuidas no MA com ocorrencias dentro das faixas: 1-10, 11-25 e 26-60.
const UP_POINTS = [
  { up: "UP-Litoranea", occurrences: 8, lat: -2.5307, lon: -44.3068 },
  { up: "UP-Itapecuru", occurrences: 10, lat: -3.3925, lon: -44.3586 },
  { up: "UP-Munim", occurrences: 6, lat: -2.7586, lon: -42.8259 },
  { up: "UP-Mearim", occurrences: 14, lat: -4.2250, lon: -44.7833 },
  { up: "UP-Pindare", occurrences: 18, lat: -3.6667, lon: -45.3800 },
  { up: "UP-SertaoLeste", occurrences: 23, lat: -4.8580, lon: -43.3560 },
  { up: "UP-Tocantina", occurrences: 28, lat: -5.5264, lon: -47.4919 },
  { up: "UP-CarajasNorte", occurrences: 34, lat: -4.9471, lon: -47.5036 },
  { up: "UP-GeraisSul", occurrences: 41, lat: -7.5321, lon: -46.0374 },
  { up: "UP-Cocais", occurrences: 52, lat: -5.0942, lon: -42.8369 },
  { up: "UP-CentroNorte", occurrences: 31, lat: -5.9919, lon: -43.7033 },
  { up: "UP-Chapadas", occurrences: 58, lat: -6.0281, lon: -44.2495 }
];

const svg = d3.select("#chart");
const tooltip = d3.select("#tooltip");
const zoomInButton = d3.select("#zoom-in");
const zoomOutButton = d3.select("#zoom-out");
const zoomResetButton = d3.select("#zoom-reset");
const viewport = svg.append("g").attr("class", "viewport");
const mapLayer = viewport.append("g").attr("class", "map-layer");
const pointLayer = viewport.append("g").attr("class", "point-layer");

mapLayer.append("rect")
  .attr("class", "map-google-water")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

d3.json(MA_GEOJSON_URL).then((geojson) => {
  if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
    throw new Error("GeoJSON de MA invalido.");
  }

  const projection = d3.geoMercator().fitExtent(
    [[58, 36], [WIDTH - 58, HEIGHT - 36]],
    geojson
  );
  const geoPath = d3.geoPath(projection);

  const graticule = d3.geoGraticule()
    .extent(d3.geoBounds(geojson))
    .step([1, 1]);

  mapLayer.append("path")
    .datum(graticule())
    .attr("class", "map-google-graticule")
    .attr("d", geoPath);

  const municipalitySelection = mapLayer.selectAll("path.ma-municipality")
    .data(geojson.features)
    .join("path")
    .attr("class", "ma-municipality")
    .attr("fill", (d) => {
      const centroid = d3.geoCentroid(d);
      const norm = Math.max(0, Math.min(1, (centroid[1] + 10) / 9));
      return d3.interpolateRgb("#f9fafb", "#edf2f7")(norm);
    })
    .on("mousemove", (event, d) => {
      municipalitySelection.classed("is-active", false);
      d3.select(event.currentTarget).classed("is-active", true);
      const municipalityName = d.properties?.name ?? "Municipio";
      tooltip
        .html(`<strong>${municipalityName}</strong><br/>Estado: Maranhao`)
        .style("left", `${event.offsetX + 14}px`)
        .style("top", `${event.offsetY + 14}px`)
        .attr("hidden", null);
    })
    .on("mouseleave", (event) => {
      d3.select(event.currentTarget).classed("is-active", false);
      tooltip.attr("hidden", true);
    })
    .attr("d", geoPath);

  mapLayer.append("path")
    .datum({ type: "FeatureCollection", features: geojson.features })
    .attr("class", "ma-border")
    .attr("d", geoPath);

  const stateCentroid = projection(d3.geoCentroid({ type: "FeatureCollection", features: geojson.features }));
  if (stateCentroid) {
    mapLayer.append("text")
      .attr("class", "ma-state-label")
      .attr("x", stateCentroid[0])
      .attr("y", stateCentroid[1])
      .text("MARANHAO");
  }

  const radiusScale = d3.scaleSqrt()
    .domain(d3.extent(UP_POINTS, (d) => d.occurrences))
    .range([10, 26]);

  const getBucket = (value) => {
    if (value >= 26) return "high";
    if (value >= 11) return "medium";
    return "low";
  };

  UP_POINTS.forEach((d) => {
    const xy = projection([d.lon, d.lat]);
    d.bucket = getBucket(d.occurrences);
    d.radius = radiusScale(d.occurrences);
    d.x = xy ? xy[0] : WIDTH / 2;
    d.y = xy ? xy[1] : HEIGHT / 2;
  });

  const points = pointLayer.selectAll("g.up-point")
    .data(UP_POINTS)
    .join("g")
    .attr("class", "up-point")
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .on("mousemove", (event, d) => {
      tooltip
        .html(`<strong>${d.up}</strong><br/>Ocorrencias: ${d.occurrences}<br/>Faixa: ${translateBucket(d.bucket)}`)
        .style("left", `${event.offsetX + 14}px`)
        .style("top", `${event.offsetY + 14}px`)
        .attr("hidden", null);
    })
    .on("mouseleave", () => {
      tooltip.attr("hidden", true);
    });

  points.append("circle")
    .attr("class", "up-point-outer")
    .attr("r", (d) => d.radius)
    .attr("fill", (d) => COLORS[d.bucket]);

  points.append("circle")
    .attr("class", "up-point-core")
    .attr("r", (d) => Math.max(3, d.radius * 0.34))
    .attr("fill", "#ffffff");

  points.append("text")
    .attr("class", "up-point-label")
    .attr("y", (d) => -(d.radius + 6))
    .text((d) => d.up);

  const zoomBehavior = d3.zoom()
    .scaleExtent([1, 6])
    .translateExtent([[-300, -220], [WIDTH + 300, HEIGHT + 220]])
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .on("zoom", (event) => {
      viewport.attr("transform", event.transform);
    });

  svg.call(zoomBehavior)
    .on("dblclick.zoom", null);

  zoomInButton.on("click", () => {
    svg.transition().duration(220).call(zoomBehavior.scaleBy, 1.22);
  });

  zoomOutButton.on("click", () => {
    svg.transition().duration(220).call(zoomBehavior.scaleBy, 0.82);
  });

  zoomResetButton.on("click", () => {
    svg.transition().duration(260).call(zoomBehavior.transform, d3.zoomIdentity);
  });
}).catch((err) => {
  console.error("Erro ao carregar mapa de MA:", err);
  svg.append("text")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT / 2)
    .attr("text-anchor", "middle")
    .attr("class", "map-error")
    .text("Nao foi possivel carregar o mapa de MA");
});

function translateBucket(bucket) {
  if (bucket === "high") return "Muito requisitada";
  if (bucket === "medium") return "Requisicao media";
  return "Menor requisicao";
}
