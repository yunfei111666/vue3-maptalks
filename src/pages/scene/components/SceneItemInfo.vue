<template>
    <div
        class="scene-item"
        :class="props.isPopover ? 'cancel-margin' : 'scene-card'"
        :name="info.scenario_id"
        :style="{ width: props.isPopover ? '32%' : '19%' }"
        @click="handleClose"
    >
        <img :src="'http://' + info.imgUrl" alt class="img-thumbnail" />
        <div class="img-mask" :style="{ display: info.isSelect ? 'block' : '' }"></div>
        <div class="details-top">
            <div class="details-name">{{ info.scenario_name }}</div>
            <div class="details-id">{{ info.scenario_id }}</div>
            <div class="details-right">
                <i
                    v-if="!props.isPopover"
                    :class="[
                        'iconfont',
                        info.is_collect ? 'icon-shoucang' : 'icon-shoucang-',
                        'select-star',
                    ]"
                    @click="sceneCollect(info)"
                ></i>
            </div>
        </div>
        <div v-if="!props.isPopover" class="action-list">
            <i class="iconfont icon-bianjichangjing action-icon" @click.stop="editScene(info)"></i>
            <span></span>
            <i class="iconfont icon-yunhangchangjing action-icon" @click.stop="runScene(info)"></i>
            <span></span>
            <i class="iconfont icon-shanchuchangjing action-icon" @click.stop="deleteScene(info)"></i>
        </div>
        <div v-if="!props.isPopover" class="details-bottom">
            <div class="details-info">
                <div class="create-username">{{ info.update_user }}</div>
                <div class="create-time">{{ transformTimestamp(info.updated_at) }}</div>
            </div>
            <div class="tag-list" v-if="info.tags">
                <div
                    class="tag"
                    v-for="(item, index) in info.tagsList"
                    :key="index"
                >{{ item.label }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, toRef, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import { themeStyle } from "@/assets/theme";
import { transformTimestamp } from "@/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import { changeSceneCollect, getTagData } from "@/request/scene";
import {useStore} from 'vuex';

const store = useStore();
const router = useRouter();
const props = defineProps({
    info: Object,
    isPopover: Boolean,
});
const parentEmitFunc = defineEmits([
    "changeSceneInfo",
    "deleteSceneList",
    "runSceneList",
]);

let itemHeight = "240px";
const info = toRef(props, "info");
const sceneItemWidth = ref("19%");

const editScene = (item) => {
    router.push({ name: "edit", query: { type: "update", id: item.scenario_id } });
    store.commit('SAVE_SCENE_JSON', item)
};
const runScene = (item) => {
    parentEmitFunc("runSceneList", item.scenario_id);
};
const deleteScene = (item) => {
    parentEmitFunc("deleteSceneList", item.scenario_id);
};
const sceneCollect = (scene) => {
    info.value.is_collect = !scene.is_collect;
    changeSceneCollect({
        scenario_id: scene.scenario_id,
        is_collect: scene.is_collect,
    }).then((res) => {
        ElMessage({
            type: "success",
            message: res.msg,
        });
    });
};
const handleClose = (done) => {
    if (!props.isPopover) {
        return;
    }
    ElMessageBox.confirm(
        "更换场景后当前页面数据将被覆盖，请确认数据保存后再切换！ 确认更换场景吗？",
        "温馨提示",
        {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
        }
    )
        .then(() => {
            store.commit('SAVE_SCENE_JSON', info.value);
            store.commit('SAVE_HISTORY_LIST', []);
            store.commit('SAVE_VERSION_LIST', []);
            parentEmitFunc("changeSceneInfo", info.value.scenario_id);
            done();
        })
        .catch(() => {
            // catch error
        });
};

onBeforeMount(() => {
    if (props.isPopover) {
        sceneItemWidth.value = "32%";
    } else {
        itemHeight = "160px";
    }
});
</script>
<style lang="less" scoped>
.scene-item {
    height: 240px;
    border-radius: 8px;
    margin-bottom: 24px;
    position: relative;

    .img-mask {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: none;
        border-radius: 8px;
    }
    .img-thumbnail {
        width: 100%;
        height: 100%;
        border-radius: 8px;
    }

    .details-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 32px;
        display: flex;
        background: #b6c4d8;
        border-radius: 8px 8px 0 0;
        font-size: 16px;
        color: #212121;
        line-height: 32px;
        overflow: hidden;

        .details-name {
            padding-left: 10px;
            flex: 1;
            overflow: hidden;
            text-align: left;
        }
        .details-id {
            flex: 1;
            text-align: center;
        }
        .details-right {
            flex: 1;
            text-align: right;
            .select-star {
                width: 40px;
                height: 40px;
                display: inline-block;
                padding-right: 10px;
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
    .icon-shoucang {
        color: #f8e71c !important;
    }
    .action-list {
        height: 30px;
        visibility: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 38%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 30px;
        color: #fff;
        text-align: center;
        user-select: none;
        z-index: 2;
        span {
            display: block;
            width: 1px;
            height: 38px;
            background: #d8d8d8;
        }
        .action-icon {
            font-size: 38px;
            width: 85px;
            flex: 1;
            &:hover {
                cursor: pointer;
                transform: scale(1.1);
            }
        }
    }
    .details-bottom {
        width: 100%;
        height: 90px;
        position: absolute;
        bottom: 0;
        background: v-bind("themeStyle.style.scene.bottomBackground");
        border-radius: 0px 0px 8px 8px;
        display: none;
        color: v-bind("themeStyle.style.scene.bottomFontColor");

        .details-info {
            height: 22px;
            display: flex;
            font-size: 12px;
            margin: 7px 0 15px;
            line-height: 22px;
            justify-content: space-between;
            padding: 0 8px;
            .create-username {
                margin-bottom: 7px;
                width: 96px;
            }
        }
        .tag-list {
            width: 100%;
            max-height: 45px;
            margin-top: 1.5px;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            font-size: 12px;
            line-height: 20px;
            overflow-y: auto;
            .tag {
                height: 20px;
                background: #d2e2f6;
                border-radius: 8px;
                margin: 0 0 2.5px 6px;
                padding: 0 8px;
            }
        }
    }
}
.scene-item:hover {
    transition-duration: 0.08s;

    .details-top {
        z-index: 2;
    }
    .details-bottom {
        display: block;
        z-index: 2;
    }
    .action-list {
        visibility: visible;
    }
    .img-mask {
        display: block;
    }
}
.scene-card {
    margin-left: 1.25%;
}
.scene-card:nth-child(5n + 1) {
    margin-left: 0;
}
.cancel-margin {
    margin-left: 2%;
}
.cancel-margin:nth-child(3n + 1) {
    margin-left: 0;
}
//选中场景
.ui-selected {
    .details-top {
        background: rgba(110, 169, 255, 0.64);
    }
    .img-mask {
        background: rgba(108, 152, 215, 0.45);
    }
    .action-list {
        span {
            background: #fff;
        }
    }
}
</style>