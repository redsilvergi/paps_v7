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
  // center: [126.97, 37.56], //서울
  center: [127.03, 36.51], //전국
  zoom: 6, //13
  maxZoom: 22,
  minZoom: 3,
  antialias: true,
  // maxBounds: bounds,
  clickTolerence: -20000,
});

// Disable map rotation with mouse rmb and touch
map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

const nav_list = ["건물", "도로", "교차로", "횡단보도", "안전지대"]; //횡단보도
nav_list.map((item) => {
  const toggleBtn = document.getElementById(`${item}`);
  toggleBtn.addEventListener("click", () => {
    const vis = map.getLayoutProperty(`${item}`, "visibility");
    vis === "visible"
      ? map.setLayoutProperty(`${item}`, "visibility", "none")
      : map.setLayoutProperty(`${item}`, "visibility", "visible");
    toggleBtn.classList.toggle("active");
    toggleBtn.classList.add("button-effect");
    setTimeout(() => {
      toggleBtn.classList.remove("button-effect");
    }, 200);
  });
});

const zoom_list = [
  { loc: "전국", cor: [127.03, 36.51], zoom: 6 },
  { loc: "서울", cor: [126.97, 37.56], zoom: 13 },
  { loc: "부산", cor: [129.04, 35.11], zoom: 13 },
];

zoom_list.map((itemObj) => {
  let locationBtn = document.getElementById(itemObj.loc);
  locationBtn.addEventListener("click", () => {
    map.flyTo({
      center: itemObj.cor,
      zoom: itemObj.zoom,
    });
    locationBtn.classList.add("button-effect");
    setTimeout(() => {
      locationBtn.classList.remove("button-effect");
    }, 200);
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
    maxzoom: 11,
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
      visibility: "none",
    },
    minzoom: 13,
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
      minzoom: 13,
      layout: {
        visibility: "none",
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
      visibility: "none",
    },
    minzoom: 13,
    paint: {
      "fill-color": "#ffffff",
      "fill-opacity": 0.7,
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
      visibility: "none",
    },
    minzoom: 13,
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
  let clickedPoint = turf.point([
    e.features[0].properties.x,
    e.features[0].properties.y,
  ]);

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

map.on("mouseenter", "사고예측지점", (e) => {
  const hoveredFeatureId = e.features[0].properties.field_1; // Assuming only one feature is hovered at a time

  // Set the feature state to change the circle-radius
  console.log(hoveredFeatureId);

  map.getCanvas().style.cursor = "pointer";
  // map.setPaintProperty("사고예측지점", "circle-radius", 12); // Increase the circle radius for better clickability
  //////////////////////////////////////////////
  let clickedPoint = turf.point([
    e.features[0].properties.x,
    e.features[0].properties.y,
  ]);

  // Remove existing buffer layer if it exists
  if (map.getLayer("buffer2")) {
    map.removeLayer("buffer2");
    map.removeSource("buffer2");
  }

  // Create a buffer of .4km around the clicked point
  const buffered = turf.buffer(clickedPoint, 400, { units: "meters" });

  // Add the buffer layer to the map
  map.addSource("buffer2", {
    type: "geojson",
    data: buffered,
  });

  map.addLayer({
    id: "buffer2",
    type: "fill",
    source: "buffer2",
    layout: {},
    minzoom: 13,
    paint: {
      "fill-color": "white",
      "fill-opacity": 0.6,
    },
  });
});

map.on("mouseleave", "사고예측지점", () => {
  // map.getCanvas().style.cursor = "";
  // map.setPaintProperty("사고예측지점", "circle-radius", 7); // Reset the circle radius to the original size
  map.removeLayer("buffer2");
  map.removeSource("buffer2");
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
  const pred = e.features[0].properties.pred;

  document.getElementById("panel_int_value").innerHTML =
    e.features[0].properties.int_co;
  document.getElementById("panel_pedx_value").innerHTML =
    e.features[0].properties.pedx_co;
  document.getElementById("panel_szone_value").innerHTML =
    e.features[0].properties.szone_co;

  console.log(e.features[0].properties);
  const datapoints = [
    "nain10k0",
    "nach10k0",
    "pedx0",
    "lduse_com0",
    "lduse_res0",
    "barrier0",
    "bldentr0",
    "byyn0",
    "city0",
    "int0",
    "onsd0",
    "pvqt0",
    "rddv0",
    "rvwd0",
    "sub_train0",
  ].map((property) => e.features[0].properties[property]);

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

  const bc = [];
  const bgc = [];
  // const dp = [];
  const lb = [];
  const dpabs = [];

  const yaxis = {
    label: "변수기여도(SHAP)",
    data: dpabs,
    color: "#ffffff",
    backgroundColor: bgc,
    gridLines: {
      drawOnChartArea: false,
      display: true,
      lineWidth: 1,
      color: "#FFF",
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

  let merged = datapoints.map((item, i) => {
    return {
      border: item < 0 ? "#fff" : "#fff",
      background: item < 0 ? "#b3f101" : "#f70d1a",
      // datapoint: item,
      datapointabs: Math.abs(item),
      label: labels[i],
    };
  });

  const dataSort = merged
    .sort((b, a) => a.datapointabs - b.datapointabs)
    .slice(0, 5);

  dataSort.map((data) => {
    bc.push(data.border);
    bgc.push(data.background);
    // dp.push(data.datapoint);
    lb.push(data.label);
    dpabs.push(data.datapointabs);
  });

  const chartOptions = {
    type: "bar",
    data: xaxis,
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            color: "white",
          },
        },
        y: {
          ticks: {
            color: "#fff",
            callback: function (value, index, values) {
              return this.getLabelForValue(index);
            },
          },
        },
      },
      aspectRatio: 1.3,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 12,
              weight: "bold",
            },
            color: "white",
          },
        },
      },
    },
    // responsive: false,
    maintainAspectRatio: false,
  };

  const negChartCanvas = document.getElementById("negChart");
  if (barChart != null) barChart.destroy();

  barChart = new Chart(negChartCanvas, chartOptions);
  function responsiveFonts() {
    if (window.innerWidth < 1495) {
      Chart.defaults.font.size = 10;
    } else {
      Chart.defaults.font.size = 12;
    }
    barChart.update();
  }
  window.addEventListener("resize", responsiveFonts);
  if (window.innerWidth < 1495) {
    Chart.defaults.font.size = 10;
  } else {
    Chart.defaults.font.size = 12;
  }
  //////////////
  //////////////
  //////////////
  //////////////
  //////////////
  //////////////
  document.getElementById("row").style.display = "block";
  document.getElementById("chart-container").style.display = "flex";

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
          cutout: "70%",
          circumference: 180,
          rotation: 270,
          backgroundColor: ["#f70d1a", "#b3f101"],
          borderColor: ["#fff", "#fff"],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16,
              weight: "bold",
            },
            color: "white",
          },
        },
      },
      aspectRatio: 1.5,
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
