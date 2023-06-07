let barChart = null;
let predChart = null;
// let isContainerOpen = false;

const bounds = [
  [120.6, 29.1], // Southwest coordinates
  [134.3, 42.2], // Northeast coordinates
];

// Basemap config
mapboxgl.accessToken =
  "pk.eyJ1Ijoiamlob29ucGFyayIsImEiOiJja2h6djd6aTcwbzN1MzRvYXM0a25sMGQ4In0.wW1kvXU8R_sn0PUMh6nmIA";
// "pk.eyJ1IjoicmVkc2lsdmVyNTIyIiwiYSI6ImNsaHlkcDc4MzB4MGgzZHJwZjdqamFwODYifQ.m22renmKPUA4rupVepEgAg"; //eg
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/jihoonpark/ckssk6a3k3ama17q7fy59ctzb",
  // style: "mapbox://styles/redsilver522/clicjqwp6000c01r76j9p3fbh", //eg
  // style: "mapbox://styles/jihoonpark/ckughwlbwcmue18npllanj1rm",
  // center: [124.4, 34.5],
  center: [127.03, 36.51],
  zoom: 6,
  maxZoom: 22,
  minZoom: 3,
  antialias: true,
  // maxBounds: bounds,
  clickTolerence: -200,
});

// Disable map rotation with mouse rmb and touch
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

const nav_list = ["건물", "도로", "교차로", "안전지대"]; //횡단보도
nav_list.map((item) => {
  const toggleBtn = document.getElementById(`${item}`);
  toggleBtn.addEventListener("click", () => {
    const vis = map.getLayoutProperty(`${item}`, "visibility");
    vis === "visible"
      ? map.setLayoutProperty(`${item}`, "visibility", "none")
      : map.setLayoutProperty(`${item}`, "visibility", "visible");
    toggleBtn.classList.toggle("active");
  });
});

const zoom_list = [
  { loc: "전국", cor: [127.03, 36.51], zoom: 6 },
  { loc: "서울", cor: [127.03, 37.51], zoom: 13 },
  { loc: "부산", cor: [129.12, 35.16], zoom: 13 },
];

zoom_list.map((itemObj) => {
  let locationBtn = document.getElementById(itemObj.loc);
  locationBtn.addEventListener("click", () => {
    map.flyTo({
      center: itemObj.cor,
      zoom: itemObj.zoom,
    });
  });
});
// const toggle = document.getElementById("전국");
// toggle.addEventListener("click", () => {
//   // Reset the zoom and center when the '전국' element is clicked
//   map.flyTo({
//     center: [127.03, 37.51],
//     zoom: 9,
//   });
// });

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
        "#27374d",
        "02",
        "#27374d",
        "03",
        "#526d82",
        "04",
        "#526d82",
        "05",
        "#9db2bf",
        "06",
        "#526d82",
        "07",
        "#9db2bf",
        "08",
        "#9db2bf",
        "09",
        "#9db2bf",
        "10",
        "#9db2bf",
        "11",
        "#9db2bf",
        "12",
        "#526d82",
        "13",
        "#9db2bf",
        "14",
        "#9db2bf",
        "15",
        "#9db2bf",
        "16",
        "#9db2bf",
        "17",
        "#9db2bf",
        "18",
        "#9db2bf",
        "19",
        "#9db2bf",
        "20",
        "#9db2bf",
        "21",
        "#9db2bf",
        "#9db2bf",
      ],
      "fill-opacity": 0.5,
    },
  });
});

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
        "#e2d7d1",
        0.076,
        "#c69a9c",
        0.218,
        "#de6b56",
        0.282,
        "#de6b56",
        0.359,
        "#a02629",
        0.613,
        "#84231c",
      ],
      "fill-opacity": 0.5,
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

// Load negative samples point layer
map.on("load", function () {
  // const layers = map.getStyle().layers;

  // let labelLayerId;
  // for (let i = 0; i < layers.length; i++) {
  //   if (layers[i].type === "symbol" && layers[i].layout["text-field"]) {
  //     labelLayerId = layers[i].id;
  //     break;
  //   }
  // }

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

map.on("click", "사고예측지점", (e) => {
  // Store the clicked point coordinates
  let clickedPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);

  // Remove existing buffer layer if it exists
  if (map.getLayer("buffer")) {
    map.removeLayer("buffer");
    map.removeSource("buffer");
  }

  // Create a buffer of .4km around the clicked point
  const buffered = turf.buffer(clickedPoint, 400, { units: "meters" });

  // Add the buffer layer to the map
  map.addSource("buffer", {
    type: "geojson",
    data: buffered,
  });

  map.addLayer({
    id: "buffer",
    type: "fill",
    source: "buffer",
    layout: {},
    minzoom: 13,
    paint: {
      "fill-color": "#FFFFFF",
      "fill-opacity": 0.2,
    },
  });
  map.flyTo({
    center: [e.lngLat.lng, e.lngLat.lat],
  });
});

map.on("mouseenter", "사고예측지점", () => {
  map.getCanvas().style.cursor = "pointer";
  map.setPaintProperty("사고예측지점", "circle-radius", 12); // Increase the circle radius for better clickability
});

map.on("mouseleave", "사고예측지점", () => {
  map.getCanvas().style.cursor = "";
  map.setPaintProperty("사고예측지점", "circle-radius", 7); // Reset the circle radius to the original size
});

map.on("click", (e) => {
  // Check if the clicked point is inside the buffer
  if (map.getLayer("buffer")) {
    const clickedPoint = turf.point([e.lngLat.lng, e.lngLat.lat]);
    const bufferSource = map.getSource("buffer");

    if (turf.booleanContains(bufferSource._data, clickedPoint)) {
      return; // Clicked point is inside the buffer, do nothing
    }

    // Clicked point is outside the buffer, remove the buffer layer
    map.removeLayer("buffer");
    map.removeSource("buffer");

    document.getElementById("row").style.display = "none";
    document.getElementById("chart-container").style.display = "none";
    document
      .querySelectorAll(".tog_exp")
      .forEach((ele) => (ele.style.display = "block"));

    document.querySelector(".wth").style.borderTop = "0px";
  }
});

map.on("click", "사고예측지점", (e) => {
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
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
      "#f70d1a",
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

    for (i = 0; i < dataSort.slice(0, 5).length; i++) {
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
    const negChartContext = negChartCanvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (barChart != null) barChart.destroy();

    barChart = new Chart(negChartContext, chartOptions);
  }
  window.onload = function () {
    load();
  };

  document.getElementById("row").style.display = "block";
  document.getElementById("chart-container").style.display = "flex";

  const ctx = document.getElementById("negPredChart");
  const ctxContext = ctx.getContext("2d", {
    willReadFrequently: true,
  });

  if (predChart != null) predChart.destroy();

  predChart = new Chart(ctxContext, {
    type: "doughnut",
    data: {
      labels: ["위험도(사고발생확률)"],
      datasets: [
        {
          data: [[pred], 1 - [pred]],
          borderWidth: 1,
          backgroundColor: ["#f70d1a", "#b3f101"],
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

  const paps_exp = document.querySelectorAll(".tog_exp");
  paps_exp.forEach((element) => (element.style.display = "none"));

  document.querySelector(".wth").style.borderTop =
    "solid rgba(255, 255, 255, 0.3) 1px";
});

map.on("zoom", () => {
  updateScale();
  const currentZoom = map.getZoom();
  document.getElementById(
    "zoom_display"
  ).textContent = `ZOOM: ${currentZoom.toFixed(2)}`;
});

map.on("mousemove", (e) => {
  const coordinates = e.lngLat;
  document.querySelector("#lng").textContent = `LNG: ${coordinates.lng.toFixed(
    3
  )}`;
  document.querySelector("#lat").textContent = `LAT: ${coordinates.lat.toFixed(
    3
  )}`;
});

const mapScaleElement = document.getElementById("map_scale");

function getDistanceInKilometers(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
}

// Function to convert degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
function updateScale() {
  const bounds = map.getBounds(); // Get the current geographical bounds of the visible map area

  const west = bounds.getWest();
  const south = bounds.getSouth();
  const east = bounds.getEast();
  const north = bounds.getNorth();

  const widthKm = getDistanceInKilometers(south, west, south, east);
  const lengthKm = getDistanceInKilometers(south, west, north, west);

  // Display the width and length scale in kilometers
  // You can modify this part to update the scale on your map interface
  document.getElementById("wth").textContent = `WIDTH: ${widthKm.toFixed(
    2
  )} km`;
  document.getElementById("lth").textContent = `LENGTH: ${lengthKm.toFixed(
    2
  )} km`;
}
map.on("move", updateScale);
