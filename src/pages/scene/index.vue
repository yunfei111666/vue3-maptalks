<template>
    <div class="tool-top">
        <div class="tool-left">
            <div v-if="!props.isPopover" class="text">场景管理</div>
            <div v-if="!props.isPopover" class="scene-count">场景数：{{ canShowSceneList.length }}</div>
            <el-input class="search-input" v-model="commonSearch" clearable placeholder="请输入搜索内容" />
            <el-button class="search-icon" :icon="Search" @click="setSceneList()"></el-button>
            <div class="senior-search" @click="handleAdvancedSearch()">高级搜索</div>
        </div>
        <div v-if="!props.isPopover" class="tool-right">
            <el-button @click="runSceneList()">运行</el-button>
            <el-button @click="deleteSceneList()">删除</el-button>
        </div>
    </div>
    <div v-loading="loading" class="scene-list" ref="sceneParent">
        <div v-if="!props.isPopover" class="create-scene scene-card" @click="createNewScene">
            <i class="iconfont icon-daoru"></i>
        </div>
        <SceneItemInfo
            :isPopover="isPopover"
            @change-scene-info="changeSceneInfo"
            @run-scene-list="runSceneList"
            @delete-scene-list="deleteSceneList"
            v-for="(item, index) in canShowSceneList"
            :key="index"
            :info="item"
        />
    </div>
    <!-- 高级搜索 -->
    <el-dialog
        v-model="seniorSearchStatus"
        width="30%"
        custom-class="senior-search-dialog"
        :lock-scroll="true"
        :show-close="false"
    >
        <div class="tag-tree">
            <SeniorSearch @set-scene-list="setSceneList" :tag-data="tagData" />
        </div>
    </el-dialog>
    <!-- 运行场景 -->
    <el-dialog
        v-model="runDialogVisible"
        width="1028px"
        title="运行中"
        custom-class="no-footer-dialog"
        :lock-scroll="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
    >
        <Run :runList="runList" @set-result="setResult" />
    </el-dialog>
    <!-- 运行结果 -->
    <el-dialog
        v-model="resultDialogVisible"
        width="1028px"
        title="运行结束"
        custom-class="no-footer-dialog"
        :lock-scroll="true"
        :close-on-click-modal="false"
        :destroy-on-close="true"
    >
        <Result :tableData="runList" />
    </el-dialog>
</template>
<script  setup>
import { ref, onBeforeMount, onUnmounted, onMounted, nextTick } from "vue";
import Selectable from "selectable.js";
import { useRouter } from "vue-router";
import SceneItemInfo from "@/pages/scene/components/SceneItemInfo.vue";
import SeniorSearch from "@/pages/scene/components/SeniorSearch.vue";
import { getTagData, getSceneList, deleteScene } from "@/request/scene.js";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { themeStyle } from "@/assets/theme";
import { Search } from "@element-plus/icons-vue";
import Run from "./components/Run.vue";
import Result from "./components/Result.vue";
const router = useRouter();
// loading实例
let loading = ref(false);
// tag内容
const tagData = ref([]);
const tagList = ref([]);
// 场景列表
const sceneList = ref([]);
const canShowSceneList = ref([]);
// id search
const commonSearch = ref("");
const props = defineProps({
    // 是否为场景内弹框
    isPopover: Boolean,
});
const parentEmitFunc = defineEmits(["changeSceneInfoScene"]);
// 关闭高级搜索弹框
const seniorSearchStatus = ref(false);
// 创建场景功能块
const newSceneDialog = ref(false);
//定时器
let timeTicket = null;
//运行场景弹框
let runDialogVisible = ref(false);
let runList = ref([]);
//运行结果弹框
let resultDialogVisible = ref(false);
/**
 * 运行结果弹框关闭
 */
const setResult = (val) => {
    runDialogVisible.value = false;
    resultDialogVisible.value = true;
}

/**
 *
 * 切换编辑场景中的弹框组件相关
 */
const changeSceneInfo = (id) => {
    parentEmitFunc("changeSceneInfoScene", id);
};

/**
 * 改变dialog状态
 * @param {Boolean} bool
 */
const changeNewSceneStatus = (bool) => {
    newSceneDialog.value = bool;
};
/**
 * 新建场景
 * @param {String} name
 */
const createNewScene = (name) => {
    router.push({ name: "edit", query: { type: "create" } });
};
/**
 * 高级搜索
 */
const handleAdvancedSearch = () => {
    let treeData = localStorage.getItem("TREE_DATA");
    if (!treeData) {
        getTagData({ type: "tree" }).then((res) => {
            localStorage.setItem("TREE_DATA", JSON.stringify(res));
            tagData.value = res;
            seniorSearchStatus.value = true;
        });
    } else {
        tagData.value = JSON.parse(treeData);
        seniorSearchStatus.value = true;
    }
};
/**
 * 初始化 checkbox 功能块
 */
let selectable = "";
let sceneParent = ref(null);
// 选中场景数组,只记录id    增加响应式为了checkbox显示
let selectedOperateArr = [];
// 初始化checkbox list操作区域
const initSceneBox = () => {
    if (document.querySelectorAll(".scene-item").length) {
        selectable = new Selectable({
            filter: ".scene-item", //可选择的元素节点
            appendTo: sceneParent.value, //追加到父容器
            saveState: true,
            ignore: [".details-operation,.select-star"], // 忽视的元素节点
            // lasso: { //框选的样式
            //     borderColor: "rgba(255, 255, 255, 1)",
            //     backgroundColor: "rgba(255, 255, 255, 0.1)",
            // },
        });
        //监听选中元素
        selectable.on("end", () => {
            const selectList = selectable.getSelectedItems();
            filterSelectScene(selectList);
        });
    }
};
// 拿到当前选择的所有节点
const filterSelectScene = (currentSceneList) => {
    const isSame = selectDataContrast(currentSceneList, selectedOperateArr);
    if (isSame) {
        setSceneListSelectStatus(selectedOperateArr, false);
        selectedOperateArr = [];
        selectable.clear();
        return;
    }
    setSceneListSelectStatus(selectedOperateArr, false);
    selectedOperateArr = [];
    currentSceneList.forEach((item) => {
        if (item.node) {
            selectedOperateArr.push(Number(item.node.getAttribute("name")));
        }
    });
    setSceneListSelectStatus(selectedOperateArr, true);
};
// 修改了sceneList的isSelect属性，只影响checkbox显隐
const setSceneListSelectStatus = (compareArr, status) => {
    canShowSceneList.value.forEach((item) => {
        compareArr.find((element) => {
            if (element === item.scenario_id) {
                item.isSelect = status;
            }
        });
    });
};
// 对比两次选择的场景列表
const selectDataContrast = (currentList, oldList) => {
    if (currentList.length !== oldList.length) {
        return false;
    } else {
        for (let i = 0; i < currentList.length; i++) {
            const isHave = oldList.find(
                (item) => item == Number(currentList[i].node.getAttribute("name"))
            );
            if (!isHave) {
                return false;
            }
        }
        return true;
    }
};
/**
 * 场景运行
 * */
const runSceneList = (id) => {
    const runId = id ? String(id) : selectedOperateArr;
    if (!runId) {
        return ElMessage({
            message: '请先选择一个场景再运行哦~',
            type: "warning",
        });
    } else {
        runList.value = [];
        if (Array.isArray(runId)) {
            runId.forEach(info => {
                runList.value.push(canShowSceneList.value.find(item => { return item.scenario_id == info }))
            })
        } else {
            runList.value.push(canShowSceneList.value.find(item => { return item.scenario_id == runId }))
        }
        runList.value.map(item => {
            item.status = 'finish';
            item.describe = '正在运行中,请稍等~';
        })
        nextTick(() => {
            runDialogVisible.value = true;
        })
    }
};

/**
 * 删除场景
 **/
const deleteSceneList = (id) => {
    const deleteId = id ? String(id) : selectedOperateArr.join();
    if (deleteId) {
        ElMessageBox.confirm("确定删除吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            customClass: "edit-page-message",
        })
            .then(() => {
                deleteScene({ scenario_id: deleteId })
                    .then((res) => {
                        setSceneList();
                        ElMessage({
                            message: res.msg,
                            type: "success",
                        });
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
            .catch(() => {
            });
    } else {
        ElMessage({
            message: "您还未选中哦~",
            type: "warning",
        });
    }
};
/**
 * 获取场景列表
 */
const setSceneList = async (
    params = {
        scenario_name: "",
        startTime: "",
        endTime: "",
        tags: "",
    }
) => {
    loading.value = true;
    seniorSearchStatus.value = false;
    params.scenario_name = commonSearch.value || "";
    sceneList.value = await getSceneList(params);
    canShowSceneList.value = sceneList.value || [];
    //只遍历需要展示的
    canShowSceneList.value.forEach((item) => {
        item.tags = item.tags.split(",");
        let strArr = item.tags;
        let newArr = [];
        strArr.forEach(key => {
            newArr.push(parseInt(key))
        })
        item.tags = newArr;
        item.tagsList = [];
        item.tags.forEach((key) => {
            let com = tagList.value.find((item) => item.id == Number(key));
            if (com) {
                item.tagsList.push({
                    value: com.id,
                    label: com.name,
                });
            }
        });
    });
    if (!props.isPopover) {
    // 延时解决checkbox获取所有div内容功能缺失
        setTimeout(() => {
            initSceneBox();
        }, 1000);
    }
    loading.value = false;
};
/**
 * 获取一维标签列表
 */
const getTagList = () => {
    getTagData({ type: "list" }).then((res) => {
        tagList.value = res;
        localStorage.setItem("TAG_LIST", JSON.stringify(res));
        setSceneList();
    });
};
/**
 * 清空定时器
 */
const clearTime = () => {
    if (timeTicket) {
        clearTimeout(timeTicket);
        timeTicket = null;
    }
};
onBeforeMount(() => {
    getTagList();
});
onMounted(() => {
    clearTime();
});
onUnmounted(() => {
    loading.value = false;
    selectable && selectable.destroy();
    clearTime();
});
</script>
<style lang="less" scoped>
@import "@/assets/css/commonHeader.less";

.scene-list {
    max-height: calc(100% - 78px);
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px;
    overflow-y: auto;

    .create-scene {
        width: 19%;
        height: 240px;
        background: v-bind("themeStyle.style.sceneCreateCardBackground");
        border-radius: 8px;
        margin-bottom: 24px;
        text-align: center;
        cursor: pointer;

        .iconfont {
            font-size: 118px;
            line-height: 240px;
            color: v-bind("themeStyle.style.sceneCreateCardFontColor");
        }
    }
}
.scene-card {
    margin-left: 1.25%;
}
.scene-card:nth-child(5n + 1) {
    margin-left: 0;
}
</style>