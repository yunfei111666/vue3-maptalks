<template #default>
<div class="edit-configure">
    <div class="header" >
        <div class="title">配置</div>
        <i class="iconfont icon-chahao" ></i>
    </div>
    <div class="content">
        <div class="configure-item">
            <div class="text">运行时间：</div>
            <el-time-picker
                v-model="duration"
                placeholder="请输入运行时长"
                @visible-change="selectVisibleChange"
            />
        </div>

        <div class="configure-item">
            <div class="text">刷新率：</div>
            <el-input-number
                v-model="frequency"
                :min="0"
                :max="60"
                :step="1"
                :controls="false"
            />
        </div>
        <div class="button-group">
            <el-button @click="saveInfo">Save</el-button>
        </div>
    </div>  
</div>

</template>
<script setup>
import {onMounted, ref} from 'vue';
import {dateToSecond, secondToDate} from '@/utils';
const props = defineProps({
    configs: Object
})
const frequency = ref(60);
const duration = ref();

const parentEmitFunc = defineEmits(['saveSceneConfig', 'setStopOutsideDirective']);
const saveInfo = () => {
    parentEmitFunc('saveSceneConfig', {
        duration: dateToSecond(duration.value.getTime()),
        frequency: Number(frequency.value)
    })
}
const selectVisibleChange = (bool) => {
    parentEmitFunc('setStopOutsideDirective', bool);
}
onMounted(() => {
    frequency.value = props.configs.frequency;
    duration.value = secondToDate(props.configs.duration);
})

</script>
<style lang="less" scoped>
.edit-configure {
    width: 332px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 2px rgba(217, 226, 235, 0.5);
    border-radius: 8px;
    position: absolute;
    z-index: 2;
    top: 70px;

    .header {
        width: 100%;
        height: 40px;
        border-bottom: 1px solid #E0E6EB;
        padding: 0 12px 0 18px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-weight: 500;
        color: #24262A;

        .iconfont {
            cursor: pointer;
        }
    }

    .content {
        width: 100%;
        height: 159px;
        box-sizing: border-box;
        padding: 0 28px 0 22px;
        position: relative;

        .configure-item {
            height: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            font-size: 14px;
            color: #212121;

            :deep(.el-input) {
                width: 207px;
                background: #FAFAFB;
                border-radius: 4px;

                .el-input__inner {
                    // width: 207px;
                    text-align: left;
                }
            }
            .el-input-number {
                width: 207px;
            }
        }

        .button-group {
            display: flex;
            justify-content: end;
            margin-top: 30px;

            .el-button {
                width: 68px;
                height: 28px;
                border-radius: 4px;
            }

            .el-button:last-child {
                color: #fff;
                background: #5098FF;
                box-shadow: 0px 2px 6px 0px #BCC9D5;
            }
        }
    }

}
</style>