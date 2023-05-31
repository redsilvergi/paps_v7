let barChart = null;
let predChart = null;
let isContainerOpen = false;

const bounds = [
  [122.36271149876922, 32.42134584550646], // Southwest coordinates
  [145.40089984906, 50.27942609044964], // Northeast coordinates
];

// Basemap config
mapboxgl.accessToken =
  "pk.eyJ1Ijoiamlob29ucGFyayIsImEiOiJja2h6djd6aTcwbzN1MzRvYXM0a25sMGQ4In0.wW1kvXU8R_sn0PUMh6nmIA";
const map = new mapboxgl.Map({
  container: "map",
  // style: "mapbox://styles/jihoonpark/ckssk6a3k3ama17q7fy59ctzb",
  style: "mapbox://styles/jihoonpark/ckughwlbwcmue18npllanj1rm",
  center: [127.48007452536779, 36.4684016673714],
  zoom: 7,
  maxZoom: 22,
  minZoom: 7,
  antialias: true,
  maxBounds: bounds,
  clickTolerence: -200,
});

// Disable map rotation with mouse rmb and touch
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

map.on("load", () => {
  map.addSource("negsamplesbuffer", {
    type: "vector",
    url: "mapbox://jihoonpark.armnbia8",
  });

  map.addLayer({
    id: "negsamplesbuffer",
    type: "fill",
    source: "negsamplesbuffer",
    "source-layer": "negSamplesMB_buffer",
    layout: {
      visibility: "visible",
    },
    paint: {
      "fill-opacity": 1,
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "click"], false],
        "rgba(197, 197, 197, 0.5)",
        "rgba(255,255,255,0)",
      ],
    },
  });
});

const container = document.getElementById("container");
container.style.display = "none";

let bufferID = null;
map.on("click", "negsamplesbuffer", (e) => {
  if (e.features.length > 0) {
    if (bufferID !== null) {
      map.setFeatureState(
        {
          source: "negsamplesbuffer",
          sourceLayer: "negSamplesMB_buffer",
          id: bufferID,
        },
        {
          click: false,
        }
      );
    }
    bufferID = e.features[0].id;
    map.setFeatureState(
      {
        source: "negsamplesbuffer",
        sourceLayer: "negSamplesMB_buffer",
        id: bufferID,
      },
      {
        click: true,
      }
    );
    map.flyTo({
      center: e.lngLat,
    });

    if (!isContainerOpen) {
      container.style.display = "flex";
      isContainerOpen = true;
    }
  }
});

// Load negative samples point layer
map.on("load", function () {
  const layers = map.getStyle().layers;

  let labelLayerId;
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
      labelLayerId = layers[i].id;
      break;
    }
  }

  map.addSource("negSamplesCount", {
    type: "geojson",
    data: "./data/negSamplesCount.geojson",
  });

  map.addLayer({
    id: "사고예측지점",
    type: "circle",
    source: "negSamplesCount",
    layout: {
      visibility: "visible",
    },
    minzoom: 13,
    paint: {
      "circle-color": [
        "step",
        ["get", "pred"],
        "#66ff00",
        0.074,
        "#b3f101",
        0.219,
        "#fb780e",
        0.385,
        "#f94314",
        0.592,
        "#f70d1a",
        0.971,
        "#7D7D7D",
      ],
      "circle-opacity": 1,
      "circle-radius": {
        base: 5.5,
        stops: [
          [12, 7],
          [15, 11],
        ],
      },
    },
  });
});

map.on(
  "click",
  "사고예측지점",
  (e) => {
    const int = e.features[0].properties.int_co;
    const pedx = e.features[0].properties.pedx_co;
    const szone = e.features[0].properties.szone_co;
    const pred = e.features[0].properties.pred;
    const col1 = e.features[0].properties.nain10k0;
    const col2 = e.features[0].properties.nach10k0;
    const col3 = e.features[0].properties.pedx0;
    const col4 = e.features[0].properties.lduse_com0;
    const col5 = e.features[0].properties.lduse_res0;
    const col6 = e.features[0].properties.barrier0;
    const col7 = e.features[0].properties.bldentr0;
    const col8 = e.features[0].properties.byyn0;
    const col9 = e.features[0].properties.city0;
    const col10 = e.features[0].properties.int0;
    const col11 = e.features[0].properties.onsd0;
    const col12 = e.features[0].properties.pvqt0;
    const col13 = e.features[0].properties.rddv0;
    const col14 = e.features[0].properties.rvwd0;
    const col15 = e.features[0].properties.sub_train0;

    document.getElementById("panel_int_value").innerHTML = int;
    document.getElementById("panel_pedx_value").innerHTML = pedx;
    document.getElementById("panel_szone_value").innerHTML = szone;

    window.onload = function () {
      load();
    };

    {
      const datapoint = [
        col1,
        col2,
        col3,
        col4,
        col5,
        col6,
        col7,
        col8,
        col9,
        col10,
        col11,
        col12,
        col13,
        col14,
        col15,
      ];
      const labels = [
        "구간통과성",
        "구간접근성",
        "횡단보도",
        "상업밀도",
        "주거밀도",
        "중앙분리대",
        "출입구밀도",
        "자전거도로",
        "도시밀도",
        "교차로밀도",
        "일방통행",
        "도로포장",
        "도로위계",
        "도로폭원",
        "지하철역",
      ];

      const backgroundColor = [
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
        "#CF6679",
      ];

      const borderColor = [
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
        "rgb(255, 99, 132)",
      ];

      const bc = [];
      const bgc = [];
      const dp = [];
      const lb = [];
      const dpabs = [];

      const yaxis = {
        label: "변수기여도(SHAP)",
        data: dp,
        yAxisID: "yaxislabel",
        color: "#ffffff",
        backgroundColor: bgc,
        gridLines: {
          drawOnChartArea: false,
          display: true,
          lineWidth: 1,
          color: "#FFF",
        },
        ticks: {
          beginAtZero: true,
          max: 1.0,
          stepSize: 0.2,
        },
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 1,
        borderColor: bc,
      };

      const xaxis = {
        labels: lb,
        datasets: [yaxis],
      };

      let merged = borderColor.map((border, i) => {
        return {
          border: borderColor[i],
          background: backgroundColor[i],
          datapoint: datapoint[i],
          datapointabs: Math.abs(datapoint[i]),
          label: labels[i],
        };
      });

      const dataSort = merged.sort(function (b, a) {
        return a.datapointabs - b.datapointabs;
      });

      for (i = 0; i < dataSort.slice(0,5).length; i++) {
        bc.push(dataSort[i].border);
        bgc.push(dataSort[i].background);
        dp.push(dataSort[i].datapoint);
        lb.push(dataSort[i].label);
      }

      const chartOptions = {
        type: "bar",
        data: xaxis,
        y: [
          {
            id: "yaxislabel",
          },
        ],
        options: {
          indexAxis: "x",
          scales: {
            xaxis: [
              {
                ticks: {
                  autoSkip: false,
                  fontSize: "5px",
                  padding: 0,
                  maxRotation: 90,
                },
                grid: {
                  offset: true,
                },
              },
            ],
          },
        },
        responsive: false,
        maintainAspectRatio: true,
      };

      const negChartCanvas = document.getElementById("negChart");
      const negChartContext = negChartCanvas.getContext("2d");

      if (barChart != null) barChart.destroy();

      barChart = new Chart(negChartContext, chartOptions);
    }

    window.onload = function () {
      load();
    };

    const ctx = document.getElementById("negPredChart");

    if (predChart != null) predChart.destroy();

    predChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["위험도(사고발생확률)"],
        datasets: [
          {
            data: [[pred], 1 - [pred]],
            borderWidth: 1,
            backgroundColor: ["#CF6679", "#9ACA2C"],
            borderColor: ["rgb(255, 99, 132)", "rgb(75, 192, 192)"],
          },
        ],
      },
      options: {
        circumference: 180,
        rotation: 270,
        cutoutPercentage: 99,
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          clip: {
            top: -100,
          },
        },
      },
    });
  },

  // Nationwide building polygon data
  map.on("load", () => {
    map.addSource("bld", {
      type: "vector",
      url: "mapbox://jihoonpark.mtsrecipe",
    });
    map.addLayer({
      id: "건물",
      type: "fill",
      source: "bld",
      "source-layer": "hello_world",
      layout: {
        visibility: "visible",
      },
      minzoom: 13,
      paint: {
        "fill-color": [
          "match",
          ["get", "BDTYP_CD"],
          "01",
          "#c08484",
          "02",
          "#c08484",
          "03",
          "#fee6c2",
          "04",
          "#fee6c2",
          "05",
          "#8D8D8D",
          "06",
          "#fee6c2",
          "07",
          "#8D8D8D",
          "08",
          "#8D8D8D",
          "09",
          "#8D8D8D",
          "10",
          "#8D8D8D",
          "11",
          "#8D8D8D",
          "12",
          "#fee6c2",
          "13",
          "#8D8D8D",
          "14",
          "#8D8D8D",
          "15",
          "#8D8D8D",
          "16",
          "#8D8D8D",
          "17",
          "#8D8D8D",
          "18",
          "#8D8D8D",
          "19",
          "#8D8D8D",
          "20",
          "#8D8D8D",
          "21",
          "#8D8D8D",
          "#8D8D8D",
        ],
        "fill-opacity": 0.5,
      },
    });
  })
);

// Nationwide road line data
map.on("load", () => {
  map.addSource("road", {
    type: "vector",
    url: "mapbox://jihoonpark.mtsreciperoad",
  });
  map.addLayer({
    id: "도로",
    type: "line",
    source: "road",
    "source-layer": "hello_world",
    layout: {
      visibility: "visible",
    },
    minzoom: 14,
    paint: {
      "line-color": [
        "step",
        ["get", "AI_w10k_NA"],
        "#f70d1a",
        0.069,
        "#f82817",
        0.5,
        "#f94314",
        1.2,
        "#fb780e",
        1.3669,
        "#d9ea02",
        1.4,
        "#b3f101",
        1.5002,
        "#8df801",
        3.88512,
        "#66ff00",
      ],
      "line-opacity": 1,
      "line-width": {
        base: 0,
        stops: [
          [14, 1],
          [15, 2],
          [17, 3],
        ],
      },
    },
  });
});

// Nationwide intersection point data
map.on("load", () => {
  map.loadImage("/img/road-intersection.png", (error, image) => {
    if (error) throw error;

    map.addImage("intimg", image);

    map.addSource("intersection", {
      type: "vector",
      url: "mapbox://jihoonpark.4m628fcr",
    });

    map.addLayer({
      id: "교차로",
      type: "symbol",
      source: "intersection",
      "source-layer": "intersection",
      minzoom: 14,
      layout: {
        visibility: "visible",
        "icon-image": "intimg",
        "icon-size": {
          base: 0,
          stops: [
            [12, 0.018],
            [15, 0.022],
            [17, 0.032],
          ],
        },
      },
    });
  });
});

// Nationwide hex polygon data
map.on("load", () => {
  map.addSource("predhex", {
    type: "vector",
    url: "mapbox://jihoonpark.d6hcwygc",
  });
  map.addLayer({
    id: "predhex",
    type: "fill",
    source: "predhex",
    "source-layer": "predhex-3na3xr",
    layout: {
      visibility: "visible",
    },
    minzoom: 4,
    maxzoom: 12,
    paint: {
      "fill-color": [
        "step",
        ["get", "pred_mean"],
        "#66ff00",
        0.076,
        "#b3f101",
        0.218,
        "#fb780e",
        0.282,
        "#f94314",
        0.359,
        "#f70d1a",
        0.613,
        "#7D7D7D",
      ],
      "fill-opacity": 0.5,
    },
  });
});

// Nationwide pedx polygon data
map.on("load", () => {
  map.addSource("pedx", {
    type: "vector",
    url: "mapbox://jihoonpark.17p5frl2",
  });
  map.addLayer({
    id: "횡단보도",
    type: "fill",
    source: "pedx",
    "source-layer": "pedx",
    layout: {
      visibility: "visible",
    },
    minzoom: 14,
    paint: {
      "fill-color": "#34495E",
      "fill-opacity": 0.75,
    },
  });
});

// Nationwide safetyzone polygon data
map.on("load", () => {
  map.addSource("safetyzone", {
    type: "vector",
    url: "mapbox://jihoonpark.9no13wq6",
  });
  map.addLayer({
    id: "안전지대",
    type: "fill",
    source: "safetyzone",
    "source-layer": "safetyzone",
    layout: {
      visibility: "visible",
    },
    minzoom: 14,
    paint: {
      "fill-color": "#FDDA0D",
      "fill-opacity": 0.6,
    },
  });
});

// After the last frame rendered before the map enters an "idle" state.
map.on("idle", () => {
  if (
    !map.getLayer("건물") ||
    !map.getLayer("도로") ||
    !map.getLayer("교차로") ||
    !map.getLayer("횡단보도") ||
    !map.getLayer("안전지대")
  ) {
    return;
  }

  // Enumerate ids of the layers.
  const toggleableLayerIds = ["건물", "도로", "교차로", "횡단보도", "안전지대"];

  for (const id of toggleableLayerIds) {
    if (document.getElementById(id)) {
      continue;
    }

    const link = document.createElement("a");
    link.id = id;
    link.href = "#";
    link.textContent = id;
    link.className = "active";

    link.onclick = function (e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(clickedLayer, "visibility");

      if (visibility === "visible") {
        map.setLayoutProperty(clickedLayer, "visibility", "none");
        this.className = "";
      } else {
        this.className = "active";
        map.setLayoutProperty(clickedLayer, "visibility", "visible");
      }
    };

    const layers = document.getElementById("menu");
    layers.appendChild(link);
  }
});
