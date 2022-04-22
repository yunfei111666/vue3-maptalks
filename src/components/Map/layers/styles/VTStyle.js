/*
 * @Author: yunfei
 * @since: 2022-03-09 14:34:10
 * @lastTime: 2022-04-01 21:05:43
 * @文件相对于项目的路径: /trunkverse/src/components/Map/layers/styles/VTStyle.js
 * @LastAuthor: Do not edit
 * @message:
 */
const others = [
  {
    filter: ["all", ["==", "$layer", "water"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      type: "water",
      dataConfig: {
        type: "fill",
      },
    },
    symbol: {
      ssr: true,
      texWaveNormal: "/material/water/normal.png",
      texWavePerturbation: "/material/water/perturbation.png",
      waterBaseColor: [0, 0.9450980392156862, 1, 1],
      contrast: 1,
      hsv: [0, 0, 1],
      uvScale: 0,
      animation: true,
      waterSpeed: 1,
      waterDirection: 0,
      visible: true,
    },
  },
  {
    filter: [
      "all",
      ["==", "$layer", "landuse"],
      ["==", "$type", "Polygon"],
      ["==", "class", "grass"],
    ],
    renderPlugin: {
      type: "lit",
      dataConfig: {
        type: "3d-extrusion",
        altitudeProperty: "height",
        minHeightProperty: "min_height",
        altitudeScale: 1,
        defaultAltitude: 5,
        topThickness: 0,
        top: true,
        side: true,
      },
      sceneConfig: {
        animation: null,
        animationDuration: 800,
      },
    },
    symbol: {
      bloom: false,
      ssr: false,
      polygonOpacity: 1,
      material: {
        baseColorTexture: "/material/grass/Stylized_15_Grass_basecolor.jpg",
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, 0],
        baseColorIntensity: 1,
        contrast: 1,
        outputSRGB: 1,
        metallicRoughnessTexture:
          "/material/grass/Stylized_15_Grass_roughness.jpg",
        roughnessFactor: 1,
        metallicFactor: 1,
        normalTexture: "/material/grass/Stylized_15_Grass_normalOgl.jpg",
        noiseTexture: null,
        uvScale: [1, 1],
        uvOffset: [0, 0],
        uvRotation: 0,
        uvOffsetAnim: [0, 0],
        normalMapFactor: 1,
        normalMapFlipY: 0,
        bumpTexture: null,
        bumpScale: 0.02,
        clearCoatThickness: 5,
        clearCoatFactor: 0,
        clearCoatIor: 1.4,
        clearCoatRoughnessFactor: 0.04,
        occlusionTexture:
          "/material/grass/Stylized_15_Grass_ambientocclusion.jpg",
        emissiveTexture: null,
        emissiveFactor: [0, 0, 0],
        emitColorFactor: 1,
        emitMultiplicative: 0,
      },
      visible: true,
    },
  },
  {
    filter: [
      "all",
      ["==", "$layer", "road"],
      ["==", "$type", "LineString"],
      ["==", "class", "motorway"],
    ],
    renderPlugin: {
      dataConfig: {
        type: "line",
      },
      sceneConfig: {},
      type: "line",
    },
    symbol: {
      lineBloom: true,
      lineCap: "butt",
      lineColor: [0.73, 0.73, 0.73, 1],
      lineDasharray: [0, 0, 0, 0],
      lineDashColor: [1, 1, 1, 0],
      lineDx: 0,
      lineDy: 0,
      lineGapWidth: 0,
      lineJoin: "miter",
      lineOpacity: 1,
      linePatternAnimSpeed: 0,
      linePatternFile: null,
      lineStrokeWidth: 0,
      lineStrokeColor: [0, 0, 0, 0],
      lineJoinPatternMode: 0,
      lineWidth: 2,
      visible: true,
    },
  },
];
const style = {
  style: [
    ...others,
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 9,
          defaultAltitude: 10,
          topThickness: 0,
          top: true,
          side: true,
        },
        sceneConfig: {
          animation: "swing",
          animationDuration: 2202,
        },
      },
      symbol: {
        bloom: false,
        ssr: false,
        polygonOpacity: 0.9,
        material: {
          baseColorTexture: "/material/BaseColor.png",
          baseColorFactor: [1, 0, 0, 1],
          hsv: [0, 0, 1],
          baseColorIntensity: 1,
          contrast: 1,
          outputSRGB: 1,
          metallicRoughnessTexture: "/material/BaseColor.png",
          roughnessFactor: 0,
          metallicFactor: 1,
          normalTexture: null,
          noiseTexture: null,
          uvScale: [1, 1],
          uvOffset: [0, 0],
          uvRotation: 0,
          uvOffsetAnim: [0, 0],
          normalMapFactor: 1.12,
          normalMapFlipY: 0,
          bumpTexture: null,
          bumpScale: 0,
          clearCoatThickness: 5,
          clearCoatFactor: 0.63,
          clearCoatIor: 1.4,
          clearCoatRoughnessFactor: 0.04,
          occlusionTexture: null,
          emissiveTexture: null,
          emissiveFactor: [0, 0, 0],
          emitColorFactor: 1,
          emitMultiplicative: 0,
        },
        visible: true,
      },
    },
  ],
  featureStyle: [],
};
export default style;
