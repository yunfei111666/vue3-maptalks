<template>
    <div class="dropdown" ref="dropdownRef" v-click-outside:[dropdownRef]="handleClickOutside">
        <div v-show="!isOpen"  class="btn" @click.prevent="toggleOpen">
            IP
        </div>
        <div class="ip-configure" v-if="isOpen" style="display:block" >
            <div class="change-ip">
                <div class="text">DockerIP：</div>
                <el-input v-model="dockerIp" placeholder="请输入docker ip" type="text"/>
                <el-button @click="changeIP">切换</el-button>
            </div>
            <div class="show-ping">
                <div class="text">Ping：</div>
                <div class="ping-number">{{ props.ping }} ms</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
const props = defineProps({
    ping: Number,
    dockerIp: String,
})
const dockerIp = ref(props.dockerIp);
const parentEmitFunc = defineEmits(['initWS'])

const isOpen = ref(false);
const dropdownRef = ref(null);
const toggleOpen = () => {
    isOpen.value = !isOpen.value;
}
const handleClickOutside = () => {
    if (isOpen.value) {
        dockerIp.value = props.dockerIp;
        isOpen.value = false;
    }
}
const changeIP = () => {
    parentEmitFunc('initWS');
    isOpen.value = false;
}
</script>
<style lang="less" scoped>
.dropdown {
    position: absolute;
    right: 24px;
    bottom: 111px;

    .btn {
        width: 42px;
        height: 42px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(217, 226, 235, 0.5);
        border-radius: 8px;
        font-size: 18px;
        font-weight: 500;
        color: #5098ff;
        line-height: 42px;
        text-align: center;
        cursor: pointer;
    }
    .ip-configure {
        width: 332px;
        height: 80px;
        padding: 0 16px;
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(217, 226, 235, 0.5);
        border-radius: 8px;
        overflow: hidden;
        .change-ip {
            height: 24px;
            width: 100%;
            margin-top: 16px;
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;

            .text {
                font-size: 14px;
                font-weight: 500;
                color: #24262a;
                line-height: 24px;
            }
            .el-input {
                width: 144px;
                height: 24px;
                background: #fafafb;
                border-radius: 4px;
                overflow: hidden;

                :deep(.el-input__inner) {
                    height: 100%;
                }
            }
            .el-button {
                width: 56px;
                height: 24px;
                background: #5098ff;
                border-radius: 4px;
                color: #fff;
                line-height: 24px;
                font-size: 14px;
                padding: 0;
                border: 0;
                outline: none;
                box-shadow: 0;
                &:hover {
                    box-shadow: 0px 2px 6px 0px #bcc9d5;
                }
            }
        }
        .el-button {
            width: 56px;
            height: 24px;
            background: #5098ff;

            border-radius: 4px;
            color: #fff;
            line-height: 24px;
            font-size: 14px;
            padding: 0;
            border: 0;
            outline: none;
            box-shadow: 0;
            &:hover {
                box-shadow: 0px 2px 6px 0px #bcc9d5;
            }
        }
    }
    .show-ping {
        display: flex;
        width: 241px;
        height: 22px;
        font-size: 14px;
        font-weight: 500;
        color: #24262a;
        line-height: 24px;
    }
}
.dropdown:hover {
    scale: 1.05;
}
</style>