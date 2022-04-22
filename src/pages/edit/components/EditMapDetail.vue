<template>
  <!-- 地图 -->
  <div class="scene-map">
    <Map :wsData="props.wsData" ref="comp"></Map>
  </div>
  <div class="map-tools">
    <el-collapse v-model="state.showModelCard" accordion>
      <el-collapse-item
        v-for="(item, index) in modelCollapse"
        :name="item.id"
        :key="index"
      >
        <template #title>
          <div class="title">{{ item.name }}</div>
        </template>
        <div class="npc-button">
          <div
            v-for="(typeItem, index) in item.list"
            class="item"
            @click="addModelInfo(typeItem.type)"
            :key="index"
          >
            <i :class="`iconfont icon-${typeItem.icon} typeicon`"></i>
            <div class="text">{{ typeItem.name }}</div>
            <i class="iconfont icon-jinrujiantou jiantou"></i>
            <div
              class="operate-card"
              @click="(event) => event.stopPropagation()"
            >
              <MapModelList
                :data="comp ? comp.data.moduleList[typeItem.type] : []"
                @show-model-info="showModelInfo"
                @delete-model="deleteModel"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  <div class="map-scale">
    <i
      class="iconfont icon-jia"
      :class="[mapScale.current >= mapScale.max ? 'disable-icon' : '']"
      @click="changeMapZoom(1)"></i>
    <i class="iconfont icon-jianhao2"
      :class="[mapScale.current <= mapScale.min ? 'disable-icon' : '']"
      @click="changeMapZoom(-1)"></i>
  </div>
  <MapModelInfo
    v-if="state.selectModel"
    :selectModelInfo="state.selectModelInfo"
    @modify-model-property="modifyModelProperty"
    @delete-model="deleteModel"
  />
</template>
<script setup>
import { ref, reactive } from "vue";
import Map from "@/components/Map/index.vue";
import MapModelList from "@/pages/edit/components/MapModelList.vue";
import MapModelInfo from "@/pages/edit/components/MapModelInfo.vue";
import { getModelInfo } from "@/utils/map.js";
import { modelCollapse } from "@/pages/edit/components/canAddModelList.js";
const comp = ref({
  data: { moduleList: { ego: [], bicycle: [], people: [], vehicle: [] } },
});
const props = defineProps({
  rules: Object,
  wsData: Object,
});
const state = reactive({
  // 配置弹框选中值
  showModelCard: "",
  // 选中模型
  selectModel: false,
  // 那到数据后需要处理赋值
  modelList: {
    ego: [],
    bicycle: [],
    people: [],
    vehicle: [],
  },
  selectModelInfo: {
    name: "",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      width: 0,
      height: 0,
    },
    rotation: {
      x: 0,
      y: 0,
    },
    speed: {
      x: 0,
      y: 0,
    },
  },
});
const mapScale = ref({
  current: 14,
  max: 22,
  min: 10,
})

/**
 * 展示模型属性
 * @param {String} id
 * @param {String} name
 */
const showModelInfo = ({ id, name }) => {
  const model = comp.value.getGltf(id);
  const modelProperty = getModelInfo(model);
  Object.assign(modelProperty, { id, name });
  comp.value.setMapCenter(model.getCenter());
  state.selectModel = model;
  state.selectModelInfo = modelProperty;
};
/**
 * 修改模型属性
 * @param {String} type
 * @param {Any} value
 */
const modifyModelProperty = ({ type, value }) => {
  if (!state.selectModel) {
    return;
  }
  switch (type) {
    case "position":
      state.selectModel.setCoordinates(value);
      comp.value.setMapCenter(state.selectModel.getCenter());
      comp.value.getMapJson();
      break;
    default:
      console.log("属性暂时不能修改");
  }
};

/**
 * 增加模型
 * @param {String} type
 */
const addModelInfo = (type) => {
  switch (type) {
    case "ego":
      break;
    case "vehicle":
      break;
    case "bicycle":
      break;
    case "people":
      break;
    default:
      return;
  }
  comp.value.add(type);
};
// string id    ’,‘拼接
const deleteModel = (id) => {
  const spliceIdArr = id.split(",");
  spliceIdArr.forEach((item) => {
    comp.value.deleteModelById(item);
  });
  state.selectModel = false;
};

const changeHistoryMap = (time) => {
  comp.value.setMapJson(time);
}
const getMapInfo = () => {
  return comp.value.getMapLayerInfo();
}
const changeMapZoom = (num) => {
  const zoom = comp.value.changeMapZoom(num);
  mapScale.value.current = zoom;
}
const getMapJson = () => {
  comp.value.getMapJson();
}
defineExpose({
  changeHistoryMap,
  getMapInfo,
  getMapJson,
})
</script>
<style lang="less" scoped>
.scene-map {
  width: 100%;
  height: calc(100% - 63px);
  background: #fcfeff;
  box-shadow: 0px 1px 8px 2px rgba(183, 187, 194, 0.5);
  border-radius: 8px;
}
.map-tools {
  position: absolute;
  top: 78px;
  left: 0;
  width: 56px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 1px 0px 8px 2px rgba(183, 187, 194, 0.42);
  border-radius: 0px 8px 8px 0px;
  padding-top: 4px;
  padding-bottom: 14px;
  user-select: none;

  :deep(.el-collapse) {
    border: 0;

    .el-collapse-item {
      position: relative;
      margin: 12px 4px;
      width: calc(100% - 8px);

      > div {
        width: 100%;
        .el-collapse-item__header {
          border: none;
          width: 100%;
          box-sizing: border-box;
          height: 32px;
          background: #d1e6ff;
          border-radius: 4px;
          font-size: 12px;
          text-align: right;

          .title {
            width: 48px;
            text-align: center;
          }

          .el-collapse-item__arrow {
            display: none;
          }
        }
      }

      .el-collapse-item__wrap {
        position: absolute;
        left: 56px;
        top: -2px;
        width: 150px;
        overflow: visible;
        background: none;
        border-bottom: 0;
        .el-collapse-item__content {
          padding-bottom: 0;

          .npc-button {
            width: 150px;
            background: #ffffff;
            box-shadow: 0px 2px 16px 2px rgba(176, 179, 181, 0.39);
            border-radius: 8px;
            border: 1px solid #dedede;
            padding: 4px 0;

            .item {
              width: 100%;
              height: 24px;
              display: flex;
              align-items: center;
              margin: 4px 0;
              font-size: 14px;
              position: relative;
              cursor: pointer;

              .typeicon {
                display: block;
                width: 40px;
                font-size: 16px;
                text-align: center;
                color: #cadcff;
              }
              .text {
                color: #2a2a2a;
              }
              .jiantou {
                position: absolute;
                right: 10px;
              }

              .operate-card {
                position: absolute;
                right: -160px;
                top: -10px;
                width: 156px;
                height: 224px;
                background: #ffffff;
                box-shadow: 0px 2px 16px 2px rgba(176, 179, 181, 0.39);
                border-radius: 8px;
                border: 1px solid #dedede;
                display: none;
              }
            }

            .item:hover {
              background-color: #edf5ff;
              border-radius: 4px;
              .operate-card {
                display: block;
              }
            }
          }
        }
      }
    }
  }
}
.map-scale {
    position: absolute;
    left: 18px;
    bottom: 164px;
    width: 44px;
    // height: 100px;
    padding: 10px 0;
    background: #ffffff;
    border-radius: 22px;
    user-select: none;

    .iconfont {
        // font-size: 20px;
        color: #5098ff;
        display: block;
        width: 100%;
        height: 50px;
        text-align: center;
        line-height: 50px;
        font-weight: bold;
        cursor: pointer;
    }
  .disable-icon {
    cursor: not-allowed;
    color: #ccc;
  }
}

</style>
