<!--
 * @Description: 场景运行
 * @Project: 
 * @Author: michelle
 * @Date: 2022-04-01 10:18:40
 * @LastEditors: michelle
 * @LastEditTime: 2022-04-01 19:31:30
 * @Modified By: michelle
 * @FilePath: /trunkverse/src/pages/scene/components/Run.vue
-->
<template>
    <div class="content">
        <div class="main" v-if="runList.length">
            <div class="run-list" v-for="(item, index) in runList" :key="index">
                <div class="icon-list">
                    <i v-if="isClose" class="iconfont icon-wancheng"></i>
                    <i v-else-if="item.status === 'fail' && !isClose" class="iconfont icon-shibai"></i>
                    <i
                        v-else-if="item.status === 'finish' && !isClose"
                        class="iconfont icon-yunhangzhong"
                    ></i>
                    <span class="title">运行{{ index }} :</span>
                </div>
                <span
                    class="text"
                >{{ item.scenario_name }} {{ !isClose ? item.describe : '已运行成功！' }}</span>
                <span class="time">{{ transformTimestamp(item.updated_at) }}</span>
            </div>
        </div>
        <div class="progress-bar">
            <span>共运行场景：{{ runList.length }}个</span>
            <span>运行进度：{{ percentage }}%</span>
            <el-progress
                :indeterminate="indeterminate"
                :percentage="percentage"
                :stroke-width="12"
                color="#5098FF"
                :show-text="false"
                :duration="15"
            />
        </div>
    </div>
</template>
<script setup>
import { transformTimestamp } from "@/utils";
import { ref, toRef } from "vue";
const props = defineProps({
    runList: Array
});
const runList = toRef(props, "runList");
const parentEmitFunc = defineEmits(["setResult"]);
//进度百分比
const percentage = ref(100);
//动画变量
const indeterminate = ref(true);
//定时器
let timeTicket = null;
//状态
const isClose = ref(false);
/**
 * 清空定时器
 */
const clearTime = () => {
    if (timeTicket) {
        clearTimeout(timeTicket);
        timeTicket = null;
    }
};
/**
 * 进度百分比
 */
const setAnimation = () => {
    clearTime();
    timeTicket = setTimeout(() => {
        indeterminate.value = false;
        isClose.value = true;
        parentEmitFunc('setResult', 1)
    }, 4400)
}
setAnimation()
</script>
<style scoped lang="less">
.content {
    width: 100%;
    margin-bottom: -18px;
    .main {
        overflow-y: auto;
        height: 606px;
        .run-list {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;
            margin-bottom: 18px;
            .icon-list {
                display: flex;
                justify-content: center;
                align-items: center;
                i {
                    font-size: 24px;
                    margin-right: 10px;
                }
                .title {
                    margin-right: 10px;
                }
                .icon-wancheng {
                    color: #00b314;
                }
                .icon-yunhangzhong {
                    color: #5098ff;
                }
                .icon-shibai {
                    color: #f00;
                }
            }
            .text,
            .title,
            .time {
                flex: 1;
                font-size: 16px;
                font-family: SourceHanSansCN-Regular, SourceHanSansCN;
                font-weight: 400;
                color: #212121;
                line-height: 24px;
            }
            .time {
                flex: initial;
            }
        }
    }
    .progress-bar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: wrap;
        span {
            height: 22px;
            font-size: 16px;
            font-family: SourceHanSansCN-Regular, SourceHanSansCN;
            font-weight: 400;
            color: #212121;
            line-height: 22px;
            margin-bottom: 10px;
            &:first-child {
                margin-right: 80px;
            }
        }

        .el-progress {
            width: 100%;
        }
    }
}
</style>