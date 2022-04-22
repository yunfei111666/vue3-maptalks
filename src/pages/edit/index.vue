<template>
    <div class="tool-top">
        <div class="tool-left">
            <div class="text">{{ state.editType == "create" ? "新增场景" : "编辑场景" }}</div>
            <div class="scene-execute">
                <div class="btn-tool" ref="configButton" v-click-outside:[configButton]="sceneConfigClickOutside">
                    <div  @click.parent="toggleOpen">
                        <i class="iconfont icon-peizhi"></i>
                        <div class="tool-name">配置</div>
                    </div>
                    <SceneConfig
                        v-if="isOpen"
                        :configs="
                            state.sceneJson.rules.configs || { duration: 0, frequency: 0 }
                        "
                        @save-scene-config="saveSceneConfig"
                        @set-stop-outside-directive="setStopOutsideDirective"
                    />
                </div>
                <div class="btn-tool" @click="state.sceneListPageVisible = true">
                    <i class="iconfont icon-genghuanchangjing"></i>
                    <div class="tool-name">更换场景</div>
                </div>
                <div class="btn-tool" @click="runScene('run')">
                    <i class="iconfont icon-yunhang"></i>
                    <div class="tool-name">运行</div>
                </div>
                <div class="btn-tool" @click="runScene('stop')">
                    <i class="iconfont icon-zanting"></i>
                    <div class="tool-name">暂停</div>
                </div>
                <div class="btn-tool">
                    <i class="iconfont icon-huifang"></i>
                    <div class="tool-name">回放</div>
                </div>
            </div>
        </div>
        <div class="tool-right">
            <el-button type="primary" @click="state.sceneDetailInfoVisible = true">Save</el-button>
            <el-button type="primary" @click="changeSwitchList(true, 'version')">Version</el-button>
            <el-button type="primary" @click="changeSwitchList(true, 'history')">History</el-button>
        </div>
</div>
    <!-- 地图内操作组件 -->
    <EditMapDetail
        ref="editMapDetail"
        :wsData="state.wsData"
    />
    <!-- docker ip -->
    <IpBox :dockerIp="state.dockerIp" :ping="state.wsState.ping" @init-w-s="initWS"/>
    <!-- 切换场景列表弹框 -->
    <el-dialog
        title="更换场景"
        v-model="state.sceneListPageVisible"
        custom-class="no-footer-dialog-scene"
    >
        <Scene :isPopover="true" @change-scene-info-scene="changeSceneInfo" />
    </el-dialog>
    <!-- 新建 or 编辑场景弹框 -->
    <el-dialog
        @close="handleCloseAddOrEditDialog"
        v-model="state.sceneDetailInfoVisible"
        width="500px"
        custom-class="no-footer-dialog"
        destroy-on-close
        :title="state.editType == 'create' ? '新增场景' : '编辑场景'"
    >
        <EditSceneDetail
            ref="editSceneDetail"
            :sceneJson="state.sceneJson"
            @save-scene-data="saveSceneData"
        />
    </el-dialog>
    <!-- 版本历史 / 操作历史 -->
    <el-drawer modal-class="switch-list" v-model="state.switchListStatus" :size="358">
        <template #title>
            <h4>{{ state.switchListType === "version" ? "版本信息" : "历史记录" }}</h4>
        </template>
        <template #default>
            <SwitchList
                :data="store.state[`${state.switchListType}List`]"
                :type="state.switchListType"
                :version="state.sceneJson.current_version"
                :history="state.history"
                @change-current-edit-json="changeCurrentEditJson"
            />
        </template>
    </el-drawer>
    <!-- 运行进度条 -->
    <Run
        v-if="runProgressVisible"
        :status="runProgressStatus"
        @runScene="runScene"
        ref="screneRun"
    />
</template>
<script setup>
import {
    ref,
    onBeforeUnmount,
    reactive,
    onMounted,
    nextTick,
} from "vue";
import axios from "axios";
import Run from '@/pages/edit/components/Run.vue';
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import {
    ElMessageBox,
    ElMessage,
} from "element-plus";
import EditMapDetail from "./components/EditMapDetail.vue";
import EditSceneDetail from "@/pages/edit/components/EditSceneDetail.vue";
import SceneConfig from "@/pages/edit/components/SceneConfig.vue";
import SwitchList from "@/pages/edit/components/SwitchList.vue";
import IpBox from "@/pages/edit/components/IpBox.vue";
import Scene from "@/pages/scene/index.vue";
import { getCanvasBase64 } from "@/utils/common.js";
import { addScene, editScene, getSceneVersionById } from "@/request/scene.js";
import {timestampToTime } from "@/utils";
import {schema_version, traffic_lights, cones, traffic_signs, update_method,
 version_update_comment, minimal_frontend_version, minimal_backend_version} from '@/assets/mock/staticSceneData.js';
import { useStore } from "vuex";
import moduleType from "@/components/Map/tools/moduleType.js";
const store = useStore();
//运行进度条
const runProgressVisible = ref(false);
const runProgressStatus = ref('');
// 接口所需字段
const jsonKeyArr = [
    "scenario_id",
    "scenario_name",
    "scenario_version",
    "mapInfo",
    "rules",
    "tags",
    "tagsList",
    "description",
    "current_version",
];

const route = useRoute();
const router = useRouter();
//子组件 孙子组件方法 TODO
const editMapDetail = ref();
const editSceneDetail = ref();
// 配置模块
const configButton = ref();
const isOpen = ref(false);
const timePickerIsShow = ref(false);

const state = reactive({
    // ip value
    dockerIp: "10.11.100.69",
    // 选中模型
    selectModel: true,
    // 定时器
    timer: null,
    // 主动离开编辑页面
    isControlsLeave: false,
    // ip status
    ipConfigureStatus: false,
    // 更换场景弹框状态
    sceneListPageVisible: false,
    // 编辑场景信息弹框
    sceneDetailInfoVisible: false,
    // 场景初始json
    sceneJson: {
        scenario_id: "",
        scenario_name: "",
        mapInfo: {
            map: {
                name: "test",
                version: "0.1",
            },
            ego: {},
            npc: [],
        },
        rules: {
            metrics: [],
            event: [],
            configs: {
                duration: 0,
                frequency: 0,
            },
        },
        tags: [],
        tagsList: [],
        description: "",
        scenario_version: "",
        current_version: "",
        imgUrl: "",
        // 保存类型 1为新建版本 2为覆盖版本 3为新建场景
        sc_save_type: "3",
    },
    // 抽屉列表展示信息
    switchListStatus: false,
    switchListType: "version",
    history: 0,
    // 进入编辑页面类型 create，update
    editType: "create",

    ws: null,
    wsState: {
        ping: 0
    },
    wsData: {},
});
// 场景配置弹框控制
const toggleOpen = () => {
    isOpen.value = !isOpen.value;
}
//运行子组件
const screneRun = ref(null);
/**
     * 设置运行进度条展示
     */
const setRun = (order) => {
    if (order == 'run') {
        screneRun.value.clearTime()
    } else {
        screneRun.value.setAnimation()
    }
}
/**
 * 全局初始化
 */
const init = () => {
    const sceneJson = localStorage.getItem("sceneJson");
    if (!route.query.type && sceneJson) {
        firstCheckHistoryJson();
    } else if (route.query.type === "create" || route.query.type === "update") {
        initEditData(route.query.type);
    } else {
        initEditData("create");
    }
};
/**
 * 更换版本/历史
 */
const changeCurrentEditJson = ({ type, item }) => {
    if (type === "version") {
        switchListMessageBox(`是否要切换到版本${item.scenario_version}，切换操作记录会丢失`, () => {
            state.sceneJson.current_version = String(item.scenario_version);
            state.history = 0;
            store.commit('SAVE_SCENE_JSON', item);
            store.commit('SAVE_HISTORY_LIST', []);
            analysisJson();
        });
    } else if (type === "history") {
        switchListMessageBox(`是否要切换到${timestampToTime(item.updateTime)}的操作记录`, () => {
            editMapDetail.value.changeHistoryMap(item.updateTime);
            state.history = item.updateTime;
        });
    }
};
// messageBox
const switchListMessageBox = (msg, callback) => {
    ElMessageBox.confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            console.log('123123');
            state.switchListStatus = false;
            callback();
        })
        .catch(() => {
            ElMessage({
                type: "info",
                message: "取消切换",
            });
        });
}

/**
 * 历史记录处理
 */
const firstCheckHistoryJson = () => {
    ElMessageBox.confirm("具有历史操作记录，是否使用？", "提示", {
        confirmButtonText: "使用",
        cancelButtonText: "清空",
        type: "warning",
        customClass: "history-record-message",
        closeOnClickModal: false,
    })
        .then(() => {
            initEditData("update");
        })
        .catch(() => {
            store.commit('SAVE_SCENE_JSON', '');
            store.commit('SAVE_HISTORY_LIST', []);
            store.commit('SAVE_VERSION_LIST', []);
            initEditData("create");
        });
};
/**
 * 初始化
 */
const initEditData = (editType) => {
    // 初始化store
    store.commit('INIT_EDIT_DATA');
    state.editType = editType;
    // 更新需要解析localStorage内容
    if (editType === "update") {
        // 解析json
        analysisJson();
    }
    else if(store.state.historyList){
      editMapDetail.value.changeHistoryMap();
    }
};
/**
 * json解析 TODO 判断逻辑优化
 */
const analysisJson = () => {
    let newJson = {};
    const {sceneJson, historyList} = store.state;
    // 存在场景json 不具备历史操作记录 # 第一次进入编辑
    if (sceneJson && historyList.length === 0) {
        newJson = sceneJson;
        if (newJson && newJson.mapInfo && newJson.mapInfo.map.gltfs) {
            const list = [
                {
                    updateTime: new Date().getTime(),
                    mapJSON: {
                        gltfs: newJson.mapInfo.map.gltfs,
                        options: newJson.mapInfo.map.options,
                    },
                },
            ];
            store.commit("SAVE_HISTORY_LIST", list);
            editMapDetail.value.changeHistoryMap();
        }
    }
    // 存在场景json 具有历史操作记录  # 编辑界面刷新
    else if (sceneJson && historyList.length > 0) {
        newJson = sceneJson;
        editMapDetail.value.changeHistoryMap();
    }
    // 其他 # 创建、手动输入链接、手动删除localStorage sceneJson刷新
    else {
        router.push({ query: { type: 'create' } });
        initEditData('create');
        return;
    }
    // 场景基本信息获取
    jsonKeyArr.forEach((key) => {
        if (newJson[key]) {
            state.sceneJson[key] = newJson[key];
            // TODO 这里请求版本信息阻塞加载
            if (key === "scenario_id") {
                // 请求版本信息
                getSceneVersionById({ scenario_id: newJson[key] }).then((res) => {
                    store.commit("SAVE_VERSION_LIST", res);
                });
            }
        }
    });
    state.sceneJson.current_version = store.state.sceneJson.current_version || String(store.state.sceneJson.scenario_version);
};
/**
 * 关闭 新增 or 编辑弹框
 */
const handleCloseAddOrEditDialog = () => {
    state.sceneDetailInfoVisible = false;
    editSceneDetail.value.resetForm(editSceneDetail.value.ruleFormRef);
};

// 配置弹框显隐
const sceneConfigClickOutside = () => {
    // timepicker 是否打开
    if (timePickerIsShow.value) {
        return;
    }
    if (isOpen.value) {
        isOpen.value = false;
    }
};
// time picker显示时停止click outside执行
const setStopOutsideDirective = (bool) => {
    timePickerIsShow.value = bool;
}
// 侧边栏
const changeSwitchList = (bool, type = "version") => {
    state.switchListType = type;
    state.switchListStatus = bool;
};
// 保存场景配置
const saveSceneConfig = ({ duration, frequency }) => {
    state.sceneJson.rules.configs.duration = duration;
    state.sceneJson.rules.configs.frequency = frequency;
    isOpen.value = false;
};

/**
 * 取消场景列表弹框，传给孙子组件
 */

const changeSceneInfo = (id) => {
    router.replace({
        query: {
            type: "update",
            id: id,
        },
    });
    state.sceneListPageVisible = false;
    init();
};
/**
 * 更新docker ip
 */
const changeDockerIp = () => {
    state.ipConfigureStatus = false;
};
/**
 * 新增保存
 */
const setAddScene = (param, loading) => {
    addScene(param)
        .then((res) => {
            successCallBack(res, loading);
        })
        .catch((error) => {
            loading.close();
        });
};
/**
 * 编辑保存
 */
const setEditScene = (param, loading) => {
    editScene(param)
        .then((res) => {
            successCallBack(res, loading);
        })
        .catch((error) => {
            loading.close();
        });
};
/**
 * 成功后回调处理
 */
const successCallBack = (res, loading) => {
    loading.close();
    state.isControlsLeave = true;
    if (res.code === 200) {
        store.commit("SAVE_HISTORY_LIST", []);
        router.push("/");
        ElMessage({
            message: res.msg,
            type: "success",
        });
    }
};
/**
 * 存储场景
 * params {number} scenario_id
 * params {string} description
 * params {string} tags
 * params {string} sc_save_type
 */
const saveSceneData = ({ scenario_name, description, tags, sc_save_type }) => {
    // 参数文档 https://trunk.feishu.cn/wiki/wikcndkqJhRgn7tpZoEE0pvs1Id
    state.sceneDetailInfoVisible = false;
    const loading = ElLoading.service();
    const imgData = getCanvasBase64("map");
    const param = {};
    param.scenario_name = scenario_name;
    param.description = description;
    param.tags = tags;
    param.imgUrl = imgData;

    const modelJson = getModelForHistory();
    if (modelJson) {
        const { ego, npc } = modelJson;
        state.sceneJson.mapInfo.npc = npc;
        state.sceneJson.mapInfo.ego = ego;
    }
    param.mapInfo = state.sceneJson.mapInfo;
    param.rules = state.sceneJson.rules;
    const staticInfo = staticSceneInfo();
    Object.assign(param, staticInfo);
    if (state.editType === "create") {
        setAddScene(param, loading);
    } else if (state.editType === "update") {
        param.sc_save_type = sc_save_type;
        param.scenario_id = state.sceneJson.scenario_id;
        param.current_version = String(state.sceneJson.current_version);
        setEditScene(param, loading);
    } else {
        state.wsData = data;
    }
};
const getModelForHistory = () => {
    const { mapJson, gltfs } = editMapDetail.value.getMapInfo();
    state.sceneJson.mapInfo.map.options = mapJson.options;
    state.sceneJson.mapInfo.map.gltfs = gltfs;
    return getTypeModelByGltfs(gltfs);
};
const getTypeModelByGltfs = (list) => {
    const obj = { ego: [], npc: [] };
    list.forEach((item) => {
        const property = {
            id: item._id,
            name: moduleType[item.options.symbol.type].name + "_" +
                item._id.split("_")[1],
            position: [item._coordinates.x, item._coordinates.y, 0],
        }
        // TODO 部分属性还未获取
        if (item.options.symbol.type === 'ego') {
            property.target_point = [0.0, 0.0, 0.0];  // x, y z, for planning.
            property.yaw = 0.0;  // rad
            property.speed = [0.0, 0.0, 0.0];  // x, y z
            property.size = [3.0, 5.0, 5.0];  // m
            property.planning_type = ''; // pnc and model settings
            property.control_type = '';
            property.vehicle_model = 'ART';
            obj.ego.push(property);
        }
        else {
            property.yaw = 0.0;
            property.speed = [0.0, 0.0, 0.0];
            property.size = [3.0, 5.0, 5.0];
            property.trailer = {};
            property.type = "truck/bus/pedestrian";
            property.planning_type = "";
            property.control_type = "";
            property.vehicle_model = "perfect control";
            property.exsiting_period = [[0, 10], [20, 30]];
            property.perception_period = [[0, 10]];
            obj.npc.push(property);
        }
    });
    // 
    obj.traffic_lights = traffic_lights;
    obj.cones = cones;
    obj.traffic_signs = traffic_signs;
    return obj;
};

// 初始化websocket
const initWS = () => {
    if (state.ws) {
        state.ws.close();
    }
    state.ws = new WebSocket("ws://" + state.dockerIp + ":8849/ws");
    state.ws.onmessage = function (e) {
        const data = JSON.parse(e.data);
        if (data.type == "state") {
            state.wsState = data;
        } else {
            state.wsData = data;
        }
    };
};

// 运行
const runScene = (order) => {
    let data = {
        mapInfo: getModelForHistory(),
        rules: state.sceneJson.rules,
    }
    // 运行与保存的map信息不同
    data.mapInfo.map = {
        name: 'test',
        version: '0.1'
    };
    data.description = state.sceneJson.description;
    data.scenario_id = state.sceneJson.scenario_id;
    data.scenario_name = state.sceneJson.scenario_name;
    data.scenario_version = state.sceneJson.scenario_version || state.sceneJson.current_version;
    data.tags = state.sceneJson.tags;
    Object.assign(data, staticSceneInfo());
    runProgressStatus.value = order;
    axios({
        method: "post",
        url: "http://" + state.dockerIp + ":8848/" + order + "_simulation",
        timeout: 5000,
        data
    })
        .then((res) => {
            ElMessage({
                message: `场景指令_${order}_下发成功！`,
                type: "success",
            });
            runProgressVisible.value = true;
            nextTick(() => {
                if (order == 'stop' && screneRun.value.isRun) {
                    screneRun.value.clearTime()
                }
                if (order == 'run' && !screneRun.value.isRun) {
                    screneRun.value.setAnimation()
                }
            })
        })
        .catch((res) => {
            ElMessage({
                message: `场景指令_${order}_下发失败！`,
                type: "error",
            });
        });
};
// TODO 缺少部分场景信息，手动添加
const staticSceneInfo = () => {
    return {
        schema_version,
        update_method,
        version_update_comment,
        minimal_frontend_version,
        minimal_backend_version,
    }
}
// TODO 获取地图模型信息


onMounted(() => {
    init();
    initWS();
});

// 编辑界面离开时询问
onBeforeRouteLeave((to, from, next) => {
    // if 和 settimeout 解决点击浏览器前进后退按钮，弹出框闪现问题
    if (from.name === "edit" && !state.isControlsLeave) {
        state.timer = setTimeout(() => {
            ElMessageBox.confirm(
                `离开${state.editType == "update" ? "编辑" : "新增"
                }页面将不会保存您的修改. 是否继续?`,
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    customClass: "edit-page-message",
                }
            )
                .then(() => {
                    store.commit('SAVE_SCENE_JSON', '');
                    store.commit('SAVE_HISTORY_LIST', []);
                    store.commit('SAVE_VERSION_LIST', []);
                    next();
                })
                .catch(() => { });
        }, 200);
    } else if (state.isControlsLeave) {
        store.commit('SAVE_SCENE_JSON', '');
        store.commit('SAVE_HISTORY_LIST', []);
        store.commit('SAVE_VERSION_LIST', []);
        next();
    } else {
        next();
    }
});

onBeforeUnmount(() => {
    clearTimeout(state.timer);
    if (state.ws) {
        state.ws.close();
    }
});
</script>
<style lang="less" scoped>
@import "@/assets/css/commonHeader.less";
</style>
