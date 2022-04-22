/*
 * @Author: yunfei
 * @since: 2022-03-09 10:24:47
 * @lastTime: 2022-04-01 21:34:50
 * @文件相对于项目的路径: /trunkverse/src/components/Map/layers/index.js
 * @LastAuthor: Do not edit
 * @message:
 */

import {
  GeoJSONVectorTileLayer,
  VectorTileLayer,
  PointLayer,
  LineStringLayer,
} from "@maptalks/vt";
import { GroupGLLayer } from "@maptalks/gl";
import { GLTFLayer } from "@maptalks/gltf-layer";

import { VTStyle, GeoJsonSyle } from "./styles/index.js";

const options = {
  mapboxURL:
    "https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.mvt?access_token=pk.eyJ1IjoiemhlbmZ1IiwiYSI6ImNqamY2OXF0azA1M3kzdnF0enRoZm83aXQifQ.WpJebxPjCnmszaxHDRBrtw",
  glConfig: {
    hitDetect: false,
    geometryEvents: false,
    sceneConfig: {
      environment: {
        enable: false,
        mode: 0,
        level: 0,
        brightness: 1,
      },
      shadow: {
        type: "esm",
        enable: false,
        quality: "high",
        opacity: 0.3,
        color: [0, 0, 0],
        blurOffset: 1,
      },
      postProcess: {
        enable: true,
        antialias: {
          enable: true,
          taa: true,
          jitterRatio: 0.25,
        },
        ssr: {
          enable: false,
        },
        bloom: {
          enable: true,
          threshold: 0.05,
          factor: 0.6,
          radius: 0.8,
        },
        ssao: {
          enable: false,
          bias: 0.08,
          radius: 0.08,
          intensity: 1.5,
        },
        sharpen: {
          enable: false,
          factor: 0.2,
        },
        outline: {
          enable: true,
          outlineFactor: 0.3,
          highlightFactor: 0.2,
          outlineWidth: 1,
          outlineColor: [1, 1, 0],
        },
        ground: {
          enable: false,
          renderPlugin: { type: "lit" },
          symbol: {
            polygonOpacity: 0.9,
            material: {
              baseColorFactor: [0.48235, 0.48235, 0.48235, 0.9],
              hsv: [0, 0, -0.532],
              roughnessFactor: 0.22,
              metallicFactor: 0.58,
            },
          },
        },
      },
    },
  },
};

const { mapboxURL, glConfig } = options;

// 天气

const weather = {
  enable: false,
  fog: {
    enable: false,
    start: 0.1,
    end: 100,
    color: [0.9, 0.9, 0.9],
  },
  snow: {
    enable: false,
    snowGroundTexture: "/weather/perlin.png",
  },
  rain: {
    enable: false,
    density: 2000,
    windDirectionX: 0,
    windDirectionY: 0,
    rainTexture: "/weather/rain.png",
  },
};
glConfig.sceneConfig.weather = weather;
// geojson图层
const geojsonLayer = new GeoJSONVectorTileLayer("geojson", {
  data: "/geojson/highway.json",
  hitDetect: false,
  geometryEvents: false,
});

// 街景瓦片
const vectorLayer = new VectorTileLayer("vectorLayer", {
  urlTemplate: mapboxURL,
  spatialReference: "preset-vt-3857",
  hitDetect: false,
  geometryEvents: false,
});

// marker 图层

const markerLayer = new PointLayer("markerLayer", {
  hitDetect: false,
  geometryEvents: false,
});

// glb 图层

const glbLayer = new GLTFLayer("glbLayer", {
  hitDetect: false,
  geometryEvents: false,
});
const lineLayer = new LineStringLayer("lineLayer", {
  hitDetect: false,
  geometryEvents: false,
});

const planLineLayer = new GeoJSONVectorTileLayer("planLineLayer", {
  data: "/geojson/line2.geojson",
  hitDetect: false,
  geometryEvents: false,
  style: {
    style: [
      {
        filter: true,
        renderPlugin: {
          dataConfig: {
            type: "line",
          },
          sceneConfig: {},
          type: "line",
        },
        symbol: {
          lineBloom: false,
          lineCap: "butt",
          lineColor: [0.73, 0.73, 0.73, 1],
          lineDasharray: [0, 0, 0, 0],
          lineDashColor: [1, 1, 1, 0],
          lineDx: 0,
          lineDy: 0,
          lineGapWidth: 127,
          lineJoin: "miter",
          lineOpacity: 1,
          linePatternAnimSpeed: 0.21,
          linePatternFile: "/arrow.png",
          lineStrokeWidth: 1,
          lineStrokeColor: [0, 0, 0, 0],
          lineJoinPatternMode: 1,
          lineWidth: 5,
          linePatternGap: 1.9,
          visible: true,
        },
      },
    ],
    featureStyle: [],
  },
});

geojsonLayer.setStyle(GeoJsonSyle);
vectorLayer.setStyle(VTStyle);

const GLLayer = new GroupGLLayer(
  "glLayer",
  [vectorLayer, markerLayer, glbLayer, lineLayer, planLineLayer],
  glConfig
);

export default GLLayer;
