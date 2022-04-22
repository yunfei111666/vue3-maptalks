<!--
 * @Author: yunfei
 * @since: 2022-03-07 10:35:35
 * @lastTime: 2022-04-02 10:35:59
 * @文件相对于项目的路径: /trunkverse/src/components/Map/index.vue
 * @LastAuthor: Do not edit
 * @message:
-->
<template>
  <div id="map"></div>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import * as maptalks from "maptalks";
import "../../../node_modules/maptalks/dist/maptalks.css";
import { GLTFMarker } from "@maptalks/gltf-layer";

import "@maptalks/transcoders.draco";
import { TransformControl } from "@maptalks/transform-control";

import GLLayer from "./layers/index.js";
import { bezierSpline } from "@turf/turf";
import axios from "axios";

import moduleType from "./tools/moduleType.js";

import { getLocation } from "@/utils/MapApi.js";
import { ElMessage } from "element-plus";
const store = useStore();
const data = reactive({
  map: null,
  mapOptions: {
    center: [116.397128, 39.916527],
    zoom: 14,
    maxZoom: 22,
    minZoom: 10,
    baseLayer: new maptalks.TileLayer("base", {
      urlTemplate:
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d", "e"],
    }),
    lights: {
      directional: {
        direction: [1, 0, -1],
        color: [1, 1, 1],
      },
      ambient: {
        resource: {
          url: "/hdr/env.hdr",
          sh: [
            0.4740761271613424, 0.32636671849687304, 0.4044497148741891,
            0.08187379159621136, 0.030704235761044394, 0.01511332705564738,
            0.08570310961685204, 0.03738635207263074, 0.01683266214668562,
            -0.014595591829761634, 0.009377656448102633, 0.02905287462827529,
            -0.02104581436390156, -0.01113561109748019, -0.011948922331715659,
            -0.007476310029341205, -0.00265320725689759,
            -0.00026044077485876094, 0.03280047272987781, 0.004875932913869457,
            -0.007195221951567642, -0.11838779485993862, -0.028116335670205633,
            0.03322169185980012, -0.0000775291512645797, 0.005759857399642361,
            0.01450746160716387,
          ],
        },
        exposure: 1,
        hsv: [0, 0, 0],
        orientation: 0,
        prefilterCubeSize: 128,
      },
    },
  },
  isAdd: false,
  addType: "",
  moduleList: {
    ego: [],
    people: [],
    vehicle: [],
    bicycle: [],
  },
});

const props = defineProps({
  wsData: Object,
});
watch(
  () => props.wsData,
  (count, prevCount) => {
    if (count != prevCount) {
      playWSData(prevCount.data);
    }
  }
);
onMounted(() => {
  init();
});
onUnmounted(() => {
  const { map } = data;
  if (map) {
    map.remove();
  }
});

const init = () => {
  const map = new maptalks.Map("map", {
    ...data.mapOptions,
  });
  GLLayer.addTo(map);

  initMapEvents(map);
  // initDraw(map);

  data.map = map;
  readLine();
  initPlanLine();
  // setMapJson();
  // mapRest(map);

  // 模型操作
};
// 初始化地图事件
const initMapEvents = (map) => {
  map.on("click", (e) => {
    console.log(data.addType);
    addModel(data.addType, e.coordinate);
  });
  // const transformControl = new TransformControl();
  // transformControl.addTo(map);
  // transformControl.on("transforming", (e) => {
  //   const target = transformControl.getTransformTarget();
  //   target.setTRS(e.translate, e.rotation, e.scale);
  // });
  // transformControl.on("transformend", (e) => {
  //   console.log(e);
  // });
  // const groupGLLayer = map.getLayer("glLayer");
  // const gltfLayer = getLayer("glbLayer");
  // map.on("dom:click", (e) => {
  //   const identifyData = e.coordinate
  //     ? groupGLLayer.identify(e.coordinate, {
  //         layers: [gltfLayer],
  //         orderByCamera: true,
  //       })[0]
  //     : groupGLLayer.identifyAtPoint(e.containerPoint, {
  //         layers: [gltfLayer],
  //         orderByCamera: true,
  //       })[0];
  //   const target = identifyData && identifyData.data;
  //   if (target) {
  //     transformControl.enable();
  //     transformControl.transform(target);
  //   } else {
  //     transformControl.disable();
  //   }
  // });
};

// 初始化画图工具
const initDraw = (map) => {
  const layer = new maptalks.VectorLayer("vector").addTo(map);

  const drawTool = new maptalks.DrawTool({
    mode: "Point",
  })
    .addTo(map)
    .disable();

  drawTool.on("drawend", function (param) {
    if (param.geometry.type == "LineString") {
      const line = param.geometry.toGeoJSON();
      const curved = bezierSpline(line, {
        resolution: 250000, //time in milliseconds between points
        sharpness: 1, //	a measure of how curvy the path should be between splines
      });
      let curverLine = maptalks.GeoJSON.toGeometry(curved);

      layer.addGeometry(curverLine);

      getMapJson();
    } else {
      layer.addGeometry(param.geometry);
    }
  });

  const items = [
    "Point",
    "LineString",
    "Polygon",
    "Circle",
    "Ellipse",
    "Rectangle",
    "FreeHandLineString",
    "FreeHandPolygon",
  ].map(function (value) {
    return {
      item: value,
      click: function () {
        drawTool.setMode(value).enable();
      },
    };
  });

  const toolbar = new maptalks.control.Toolbar({
    items: [
      {
        item: "Shape",
        children: items,
      },
      {
        item: "Disable",
        click: function () {
          drawTool.disable();
        },
      },
      {
        item: "Clear",
        click: function () {
          layer.clear();
        },
      },
    ],
  }).addTo(map);
};

const getMapJson = () => {
  let {historyList} = store.state;
  if (historyList.length > 19) historyList.pop();

  const { mapJson , gltfs } = getMapLayerInfo();
  historyList.unshift({
    updateTime: new Date().getTime(),
    mapJSON: {
      options: mapJson.options,
      gltfs: gltfs,
    },
  });
  store.commit("SAVE_HISTORY_LIST", historyList);
};
const getMapLayerInfo = () => {
  const glbLayer = getLayer("glbLayer");
  const gltfs = glbLayer.getGeometries();
  const mapJson = data.map.toJSON();
  return { mapJson, gltfs };
};

const setMapJson = (time) => {
  // 默认展示最新缓存
  // 传入时间戳 回退制定版本
  const {historyList} = store.state;

  if (historyList.length > 0) {
    // 模型列表重置
    data.moduleList = {
      ego: [],
      people: [],
      vehicle: [],
      bicycle: [],
    };
    let mapJSON = null;
    const filterMapJson = historyList.filter(
      (item) => item.updateTime === time
    );
    if (filterMapJson.length > 0) {
      mapJSON = filterMapJson[0].mapJSON;
    } else {
      mapJSON = historyList[0].mapJSON;
    }
    const optons = mapJSON.options;
    const gltfs = mapJSON.gltfs;
    const glbLayer = getLayer("glbLayer");
    glbLayer.clear();
    data.map.setView({
      center: optons.center,
      zoom: optons.zoom,
      pitch: optons.pitch,
      bearing: optons.bearing,
    });
    gltfs.forEach((data) => {
      const { coordinates, options } = data;
      const gltf = new GLTFMarker(coordinates, options);
      gltf.setZoomOnAdded(300);
      gltf.addTo(glbLayer);
    });
    getModelListByHistory(gltfs);
  }
};
// 解析history，拿到模型
const getModelListByHistory = (gltfs) => {
  gltfs.forEach((item) => {
    if (data.moduleList[item.options.symbol.type]) {
      const property = {
        id: item.options.id,
        name:
          moduleType[item.options.symbol.type].name +
          "_" +
          item.options.id.split("_")[1],
      }
      data.moduleList[item.options.symbol.type].push(property);
    }
  });
};

// 获取图层
const getLayer = (name) => {
  let { map } = data;
  const layer = map.getLayer("glLayer").getLayer(name);
  return layer;
};

// 添加模型
const addModel = (type, position) => {
  if (!data.isAdd) return;
    const glbLayer = getLayer("glbLayer");
    const gltfs = glbLayer.getGeometries();
    const numID =
      gltfs.length > 0
        ? Number(gltfs[gltfs.length - 1].getId().split("_")[1]) + 1
        : 1;

    const symbol = moduleType[type].symbol;
    const typeData = data.moduleList[type];
    const typeModule = moduleType[type];

    const postfix = "_" + numID;
    const id = typeModule.id + postfix;
    const name = typeModule.name + postfix;

    const glb = new GLTFMarker(position, {
      symbol: symbol,
    });
    glb.setId(id);
    glb.startEdit();
    glb.setZoomOnAdded(300);
    glb.addTo(glbLayer);
    data.isAdd = false;
    data.map.setCursor("default");
    typeData.push({
      name: name,
      id: id,
    });
  

  getMapJson();
};
// 通过ID查询gltf
const getGltf = (id) => {
  const gltf = data.map
    .getLayer("glLayer")
    .getLayer("glbLayer")
    .getGeometryById(id);
  // gltf.outline();
  return gltf;
};

// 移动地图中心位置至坐标点
const setMapCenter = (position) => {
  if (data.map) {
    data.map.setCenter(position);
  }
};

// 删除模型
const deleteModelById = (id) => {
  const model = getGltf(id);
  if (!model) {
    return;
  }
  model.remove();
  Object.keys(data.moduleList).forEach((key) => {
    data.moduleList[key].forEach((item, index) => {
      if (item.id === id) {
        data.moduleList[key].splice(index, 1);
      }
    });
  });
  data.map.setCenter([116.397128, 39.916527]);
  getMapJson();
};
const changeMapZoom = (num) => {
  const zoom = data.map.getZoom() + num;
  data.map.setZoom(zoom);
  return zoom;
};

// 事件方法
// 暴露事件方法
defineExpose({
  data,
  getGltf,
  add(type) {
    data.map.setCursor("move");
    data.isAdd = true;
    data.addType = type;
  },
  setMapCenter,
  deleteModelById,
  getMapJson,
  setMapJson,
  getMapLayerInfo,
  changeMapZoom,
});

// 地图回复默认设置
const mapRest = (map) => {
  const options = localStorage.mapOptions || data.mapOptions;
  map.setOptions(options);
};

const playWSData = (wsData) => {
  if (data.map && typeof wsData == "object") {
    const gltf = getLayer("glbLayer").getGeometryById("ego_1");
    if (gltf) {
      const center = wsData.ego.position.splice(0, 2);
      // let roation = (wsData.ego.rotation * 180) / Math.PI - 190;
      let roation =
        ((JSON.parse(wsData.ego.rotation) - Math.PI) * 180) / Math.PI;

      data.map.setCenter(center);
      gltf.setCoordinates(center);
      gltf.setRotation([0, 0, roation]);
      // data.map.setBearing(roation);
    }
  }
};

// 寻迹
const readLine = () => {
  axios.get("/geojson/highway.json").then((res) => {
    data.line = res.data;

    const lineLayer = getLayer("lineLayer");
    res.data.features.forEach((item) => {
      const line = maptalks.GeoJSON.toGeometry(item);
      line.addTo(lineLayer);
    });

    const style = {
      style: [
        {
          renderPlugin: {
            dataConfig: {
              type: "line",
            },
            sceneConfig: {},
            type: "line",
          },
          symbol: {
            // lineJoin处的模型填充方式，0则lineJoin为连续绘制纹理，为1则设为图片第一个像素处的颜色。
            lineJoinPatternMode: 1,
            // 填充图片之间的间隔宽度，单位为填充图片宽度的倍数
            lineWidth: 2,
            lineColor: "blue",
          },
        },
      ],
    };
    lineLayer.setStyle(style);

    // animation();
  });
};

// 规划路线
const initPlanLine = () => {
  // axios.get("/geojson/line1.geojson").then((res) => {
  //   const json = res.data;
  //   const lineLayer = getLayer("planLineLayer");
  //   const options = {
  //     data: json,
  //     spatialReference: null,
  //     style: {
  //       style: [
  //         {
  //           filter: true,
  //           renderPlugin: {
  //             dataConfig: {
  //               type: "line",
  //             },
  //             sceneConfig: {},
  //             type: "line",
  //           },
  //           symbol: {
  //             lineBloom: false,
  //             lineCap: "butt",
  //             lineColor: [0.73, 0.73, 0.73, 1],
  //             lineDasharray: [0, 0, 0, 0],
  //             lineDashColor: [1, 1, 1, 0],
  //             lineDx: 0,
  //             lineDy: 0,
  //             lineGapWidth: 127,
  //             lineJoin: "miter",
  //             lineOpacity: 1,
  //             linePatternAnimSpeed: 0.21,
  //             linePatternFile: "/arrow.png",
  //             lineStrokeWidth: 1,
  //             lineStrokeColor: [0, 0, 0, 0],
  //             lineJoinPatternMode: 1,
  //             lineWidth: 5,
  //             linePatternGap: 1.9,
  //             visible: true,
  //           },
  //         },
  //       ],
  //       featureStyle: [],
  //     },
  //     zIndex: 1,
  //   };
  //   lineLayer.setOptions(options);
  // });
  // axios.get("/geojson/line1.geojson").then((res) => {
  //   data.line = res.data;
  //   const lineLayer = getLayer("planLineLayer");
  //   const options = {
  //     data: "/geojson/line1.geojson",
  //     spatialReference: null,
  //     style: {
  //       style: [
  //         {
  //           filter: true,
  //           renderPlugin: {
  //             dataConfig: {
  //               type: "line",
  //             },
  //             sceneConfig: {},
  //             type: "line",
  //           },
  //           symbol: {
  //             lineBloom: false,
  //             lineCap: "butt",
  //             lineColor: [0.73, 0.73, 0.73, 1],
  //             lineDasharray: [0, 0, 0, 0],
  //             lineDashColor: [1, 1, 1, 0],
  //             lineDx: 0,
  //             lineDy: 0,
  //             lineGapWidth: 127,
  //             lineJoin: "miter",
  //             lineOpacity: 1,
  //             linePatternAnimSpeed: 0.21,
  //             linePatternFile: "/arrow.png",
  //             lineStrokeWidth: 1,
  //             lineStrokeColor: [0, 0, 0, 0],
  //             lineJoinPatternMode: 1,
  //             lineWidth: 5,
  //             linePatternGap: 1.9,
  //             visible: true,
  //           },
  //         },
  //       ],
  //       featureStyle: [],
  //     },
  //     zIndex: 1,
  //   };
  //   lineLayer.setOptions(options);
  // const line = maptalks.GeoJSON.toGeometry(data.line);
  // line.addTo(lineLayer);
  // const style = {
  //   style: [
  //     {
  //       filter: true,
  //       renderPlugin: {
  //         dataConfig: {
  //           type: "line",
  //         },
  //         sceneConfig: {},
  //         type: "line",
  //       },
  //       symbol: {
  //         lineBloom: false,
  //         lineCap: "butt",
  //         lineColor: "green",
  //         // lineDasharray: [0, 0, 0, 0],
  //         // lineDashColor: [1, 1, 1, 0],
  //         // lineDx: 0,
  //         // lineDy: 0,
  //         // lineGapWidth: 0,
  //         // lineJoin: "miter",
  //         lineOpacity: {
  //           stops: [
  //             [1, 1],
  //             [10, 1],
  //             [15, 1],
  //             [20, 1],
  //             [22, 0.6],
  //           ],
  //         },
  //         // linePatternAnimSpeed: 0.1,
  //         // linePatternFile: "/arrow.png",
  //         // lineStrokeWidth: 1,
  //         // lineStrokeColor: [0, 0, 0, 0],
  //         // lineJoinPatternMode: 1,
  //         // linePatternGap: 25,
  //         lineWidth: {
  //           stops: [
  //             [1, 2],
  //             [10, 2],
  //             [15, 2],
  //             [20, 2],
  //             [22, 25],
  //           ],
  //         },
  //         visible: true,
  //       },
  //     },
  //   ],
  // };
  // lineLayer.setStyle(style);
  // animation();
  // });
};

// 动画

const animation = () => {
  requestAnimationFrame(animation);

  if (data.line) {
    if (data.map) {
      data.map.setCenter(data.line.geometry.coordinates[data.num]);
      data.num++;
    }
  }
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
  position: relative;
}
#mapTools {
  position: absolute;
  top: 100px;
  left: 100px;
  cursor: pointer;
}
</style>
