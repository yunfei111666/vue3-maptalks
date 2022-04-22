<!--
 * @Description: 
 * @Project: 
 * @Author: yunfei
 * @Date: 2022-04-01 20:50:11
 * @LastEditors: yunfei
 * @LastEditTime: 2022-04-02 10:24:38
 * @Modified By: yunfei
 * @FilePath: /trunkverse/src/pages/edit/components/Run.vue
-->
<template>
    <div class="progress-bar">
        <i
            :class="['iconfont', status == 'run' ? 'icon-zanting' : 'icon-yunhang']"
            @click="runScene(status)"
        ></i>
        <el-progress
            :percentage="percentage"
            :stroke-width="12"
            :color="customColorMethod"
            :show-text="false"
        />
        <!-- :duration="180"
        :indeterminate="indeterminate"-->
    </div>
</template>
<script setup>
import { ref, toRef } from "vue";
const props = defineProps({
    status: String
});
const status = toRef(props, "status");
const parentEmitFunc = defineEmits(["runScene"]);
//进度百分比
const percentage = ref(0);
const customColorMethod = [
    { color: '#6BC278', percentage: 20 },
    { color: '#6BC278', percentage: 40 },
    { color: '#6BC278', percentage: 60 },
    { color: '#6BC278', percentage: 80 },
    { color: '#6BC278', percentage: 100 },
]
//记录状态
const isRun = ref(false);
//点击图标
const runScene = (val) => {
    if (val == 'run') {
        clearTime();
    } else {
        setAnimation();
    }
    parentEmitFunc('runScene', val == 'run' ? 'stop' : 'run')
}
//定时器
let timeTicket = null;
/**
 * 清空定时器
 */
const clearTime = () => {
    if (timeTicket) {
        isRun.value = false;
        clearInterval(timeTicket);
        timeTicket = null;
    }
};
/**
 * 进度百分比
 */
const setAnimation = () => {
    clearTime();
    timeTicket = setInterval(() => {
        isRun.value = true;
        percentage.value += 1;
        if (percentage.value > 100) return percentage.value = 100;
    }, 1000)
}
if (!isRun.value) {
    setAnimation()
} else {
    clearTime();
}

defineExpose({
    setAnimation,
    clearTime,
    isRun
});
</script>
<style lang="less" scoped>
.progress-bar {
    width: 100%;
    position: absolute;
    bottom: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
        font-size: 32px;
        color: #5098ff;
        margin-left: 26px;
    }
    .el-progress {
        width: 1814px;
        margin: auto;
    }
}
</style>