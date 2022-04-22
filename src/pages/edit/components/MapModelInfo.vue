<template>
    <div class="page" >
        <div class="header">
            <div class="title">{{selectModelInfo.name}}</div>
            <el-button @click="deleteModel(selectModelInfo.id)">删除</el-button>
        </div>
        <div class="attribute-item" v-if="selectModelInfo.position">
            <div class="description">Position</div>
            <div class="input-value position-item">
                <el-input type="number"
                    v-model="selectModelInfo.position.x"
                    @mousewheel.native.prevent
                    @change="modifyModelProperty('position',{x:selectModelInfo.position.x, y:selectModelInfo.position.y})"
                    placeholder="x坐标">
                    <template #prepend>X:</template>
                </el-input>
                <el-input 
                    type="number"
                    v-model="selectModelInfo.position.y"
                    @mousewheel.native.prevent
                    @change="modifyModelProperty('position',{x:selectModelInfo.position.x, y:selectModelInfo.position.y})"
                    placeholder="y坐标">
                    <template #prepend>Y:</template>
                </el-input>
               
            </div>
        </div>
         <div class="attribute-item " v-if="selectModelInfo.size">
            <div class="description">Size</div>
            <div class="input-value area-item">
                <el-input type="number" v-model="selectModelInfo.size.width" @mousewheel.native.prevent placeholder="长度">
                    <template #prepend>W:</template>
                </el-input>
                <el-input type="number" v-model="selectModelInfo.size.height" @mousewheel.native.prevent placeholder="宽度">
                    <template #prepend>L:</template>
                </el-input>
            </div>
        </div>
         <div class="attribute-item" v-if="selectModelInfo.rotation">
            <div class="description">Rotation</div>
            <div class="input-value rotate-item">
                <el-input type="number" v-model="selectModelInfo.rotation.x" @mousewheel.native.prevent placeholder="x角">
                    <template #prepend>X:</template>
                </el-input>
                <el-input type="number" v-model="selectModelInfo.rotation.y" @mousewheel.native.prevent placeholder="y角">
                    <template #prepend>Y:</template>
                </el-input>
            </div>
        </div>
        <div class="attribute-item" v-if="selectModelInfo.speed">
            <div class="description">Speed</div>
            <div class="input-value">
                <el-input type="number" v-model="selectModelInfo.speed.x" @mousewheel.native.prevent placeholder="x角">
                    <template #prepend>X:</template>
                </el-input>
                <el-input type="number" v-model="selectModelInfo.speed.y" @mousewheel.native.prevent placeholder="y角">
                    <template #prepend>Y:</template>
                </el-input>
            </div>
        </div>
        <div class="attribute-item">
            <div class="description">planning_type</div>
            <div class="input-value">
                <el-input v-model="state.planing_type" placeholder="请输入规划类型" disabled/>
            </div>
        </div>
        <div class="attribute-item">
            <div class="description">control_type</div>
            <div class="input-value">
                <el-input v-model="state.control_type" placeholder="请输入控制类型" disabled/>
            </div>
        </div>
        <div class="attribute-item">
            <div class="description">vehicle_model</div>
            <div class="input-value">

                <el-input v-model="state.vehicle_model" disabled/>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive,toRef } from 'vue';
const props = defineProps({
    selectModelInfo: Object,
})
const parentEmitFunc = defineEmits(['modifyModelProperty','deleteModel'])
const selectModelInfo = toRef(props, 'selectModelInfo')
const value = ref(0)
const state = reactive({
    planing_type: '',
    control_type: '',
    vehicle_model: 'ART'
})
const modifyModelProperty = (type, value) => {
    parentEmitFunc('modifyModelProperty', {
        type,
        value
    })
}
const deleteModel = (id) => {
    parentEmitFunc('deleteModel', id)
}
</script>
<style lang="less" scoped>
.page {
    position: absolute;
    top: 100px;
    right: 22px;
    width: 334px;
    // height: 464px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px rgba(217, 226, 235, 0.5);
    border-radius: 8px;
    padding-bottom: 18px;

    .header {
        height: 40px;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #E0E6EB;
        padding: 0 18px;

        .title {
            font-size: 16px;
            font-weight: 500;
            color: #24262A;
        }
        .el-button {
            background-color: #5098FF;
            color: #fff;
        }
    }
    .attribute-item {
        padding: 0 18px;
        margin-top: 14px;

        .description {
            height: 22px;
            margin-bottom: 4px;
            font-size: 14px;
            font-weight: 400;
            color: #0F151D;
            line-height: 22px;
        }
        .input-value {
            height: 28px;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .el-input {
                width: calc(45%);

                :deep(.el-input-group__prepend) {
                    padding: 5px;
                    width: 25px;
                    box-sizing: border-box;
                    overflow: hidden;
                }
            }
        }
    }

}
</style>