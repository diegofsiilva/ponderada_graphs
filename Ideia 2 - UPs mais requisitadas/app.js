const WIDTH = 1200;
const HEIGHT = 760;
const MS_GEOJSON_URL = "https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-50-mun.json";

const COLORS = {
  high: "#d93025",
  medium: "#fbbc04",
  low: "#4285f4"
};

// UPs distribuidas no MS com ocorrencias dentro das faixas: 1-10, 11-25 e 26-60.
const UP_POINTS = [
  { up: "UP-CampoGrande", occurrences: 9, lat: -20.4697, lon: -54.6201 },
  { up: "UP-Corumba", occurrences: 7, lat: -19.0094, lon: -57.6533 },
  { up: "UP-Paranaiba", occurrences: 10, lat: -19.6774, lon: -51.1909 },
  { up: "UP-Dourados", occurrences: 14, lat: -22.2231, lon: -54.8120 },
  { up: "UP-TresLagoas", occurrences: 17, lat: -20.7874, lon: -51.7037 },
  { up: "UP-Coxim", occurrences: 25, lat: -18.5031, lon: -54.7503 },
  { up: "UP-PontaPora", occurrences: 27, lat: -22.5361, lon: -55.7256 },
  { up: "UP-Aquidauana", occurrences: 33, lat: -20.4715, lon: -55.7877 },
  { up: "UP-Jardim", occurrences: 41, lat: -21.4803, lon: -56.1381 },
  { up: "UP-Bonito", occurrences: 49, lat: -21.1261, lon: -56.4836 },
  { up: "UP-Navirai", occurrences: 32, lat: -23.0660, lon: -54.1993 },
  { up: "UP-Amambai", occurrences: 58, lat: -23.1063, lon: -55.2253 }
];

const svg = d3.select("#chart");
const tooltip = d3.select("#tooltip");
const zoomInButton = d3.select("#zoom-in");
const zoomOutButton = d3.select("#zoom-out");
const zoomResetButton = d3.select("#zoom-reset");
const selectedName = d3.select("#selected-name");
const selectedCount = d3.select("#selected-count");
const selectedRange = d3.select("#selected-range");
const selectionHint = d3.select("#selection-hint");
const viewport = svg.append("g").attr("class", "viewport");
const mapLayer = viewport.append("g").attr("class", "map-layer");
const pointLayer = viewport.append("g").attr("class", "point-layer");
const interactionLayer = svg.append("g").attr("class", "interaction-layer");

let currentTransform = d3.zoomIdentity;

mapLayer.append("rect")
  .attr("class", "map-google-water")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", WIDTH)
  .attr("height", HEIGHT);

d3.json(MS_GEOJSON_URL).then((geojson) => {
  if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
    throw new Error("GeoJSON de MS invalido.");
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
        .html(`<strong>${municipalityName}</strong><br/>Estado: Mato Grosso do Sul`)
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
      .text("MATO GROSSO DO SUL");
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

  const pointIndex = d3.quadtree()
    .x((d) => d.x)
    .y((d) => d.y)
    .addAll(UP_POINTS);

  const points = pointLayer.selectAll("g.up-point")
    .data(UP_POINTS)
    .join("g")
    .attr("class", "up-point")
    .attr("transform", (d) => `translate(${d.x},${d.y})`);

  points.append("circle")
    .attr("class", "up-point-outer")
    .attr("r", 0)
    .attr("fill", (d) => COLORS[d.bucket])
    .transition()
    .duration(700)
    .delay((_, i) => i * 70)
    .attr("r", (d) => d.radius);

  points.append("circle")
    .attr("class", "up-point-core")
    .attr("r", 0)
    .attr("fill", "#ffffff")
    .transition()
    .duration(700)
    .delay((_, i) => 140 + (i * 70))
    .attr("r", (d) => Math.max(3, d.radius * 0.34));

  points.append("text")
    .attr("class", "up-point-label")
    .attr("y", (d) => -(d.radius + 6))
    .style("opacity", 0)
    .text((d) => d.up);

  points.select("text")
    .transition()
    .duration(450)
    .delay((_, i) => 360 + (i * 45))
    .style("opacity", 1);

  const brushBehavior = d3.brush()
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .filter((event) => event.shiftKey && !event.button)
    .on("start brush", ({ selection }) => {
      if (!selection) {
        points.classed("is-brushed", false);
        selectionHint.text("Clique no mapa para selecionar a UP mais proxima ou use Shift + arrastar para criar uma caixa de brush.");
        return;
      }

      const [[x0, y0], [x1, y1]] = selection;
      const brushed = [];

      points.classed("is-brushed", (d) => {
        const px = currentTransform.applyX(d.x);
        const py = currentTransform.applyY(d.y);
        const isInside = x0 <= px && px <= x1 && y0 <= py && py <= y1;

        if (isInside) {
          brushed.push(d);
        }

        return isInside;
      });

      if (brushed.length > 0) {
        const topPoint = brushed.reduce((max, point) => point.occurrences > max.occurrences ? point : max, brushed[0]);
        setActivePoint(topPoint, `${brushed.length} UP(s) dentro da area selecionada.`);
      } else {
        selectionHint.text("Nenhuma UP encontrada dentro da area do brush.");
      }
    })
    .on("end", ({ selection }) => {
      if (!selection) {
        points.classed("is-brushed", false);
      }
    });

  interactionLayer
    .append("g")
    .attr("class", "brush-layer")
    .call(brushBehavior);

  svg.on("mousemove", (event) => {
    if (event.shiftKey && event.buttons === 1) {
      tooltip.attr("hidden", true);
      return;
    }

    const [screenX, screenY] = d3.pointer(event, svg.node());
    const worldX = currentTransform.invertX(screenX);
    const worldY = currentTransform.invertY(screenY);
    const nearest = pointIndex.find(worldX, worldY);

    if (!nearest) {
      tooltip.attr("hidden", true);
      return;
    }

    const dx = currentTransform.applyX(nearest.x) - screenX;
    const dy = currentTransform.applyY(nearest.y) - screenY;
    const distance = Math.hypot(dx, dy);

    if (distance <= Math.max(28, nearest.radius + 12)) {
      tooltip
        .html(`<strong>${nearest.up}</strong><br/>Ocorrencias: ${nearest.occurrences}<br/>Faixa: ${translateBucket(nearest.bucket)}`)
        .style("left", `${screenX + 14}px`)
        .style("top", `${screenY + 14}px`)
        .attr("hidden", null);
      return;
    }

    tooltip.attr("hidden", true);
  });

  svg.on("mouseleave", () => {
    tooltip.attr("hidden", true);
  });

  svg.on("click", (event) => {
    const [screenX, screenY] = d3.pointer(event, svg.node());
    const worldX = currentTransform.invertX(screenX);
    const worldY = currentTransform.invertY(screenY);
    const nearest = pointIndex.find(worldX, worldY);

    if (!nearest) {
      return;
    }

    const dx = currentTransform.applyX(nearest.x) - screenX;
    const dy = currentTransform.applyY(nearest.y) - screenY;
    const distance = Math.hypot(dx, dy);

    if (distance <= Math.max(24, nearest.radius + 12)) {
      setActivePoint(nearest, "UP encontrada por picking com quadtree().");
    }
  });

  const zoomBehavior = d3.zoom()
    .scaleExtent([1, 6])
    .translateExtent([[-300, -220], [WIDTH + 300, HEIGHT + 220]])
    .extent([[0, 0], [WIDTH, HEIGHT]])
    .on("zoom", (event) => {
      currentTransform = event.transform;
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

  setActivePoint(
    UP_POINTS.reduce((max, point) => point.occurrences > max.occurrences ? point : max, UP_POINTS[0]),
    "UP com maior numero de ocorrencias no conjunto de dados."
  );

  function setActivePoint(point, hintText) {
    points.classed("is-selected", (d) => d.up === point.up);

    selectedName.text(point.up);
    selectedCount.text(point.occurrences);
    selectedRange.text(translateBucket(point.bucket));
    selectionHint.text(hintText);
  }
}).catch((err) => {
  console.error("Erro ao carregar mapa de MS:", err);
  svg.append("text")
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT / 2)
    .attr("text-anchor", "middle")
    .attr("class", "map-error")
    .text("Nao foi possivel carregar o mapa de MS");
});

function translateBucket(bucket) {
  if (bucket === "high") return "Muito requisitada";
  if (bucket === "medium") return "Requisicao media";
  return "Menor requisicao";
}
