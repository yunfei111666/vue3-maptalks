<template>
    <div class="header">
        <el-input
            v-model="filterValue"
            placeholder="请输入名称"
            :suffix-icon="Search"
            @input="getFilterArr"
        />
        <i class="iconfont icon-shanchuchangjing" @click="deleteSelectedModel"></i> 
    </div>
    <div class="list" v-if="filterDataList.length">
        <el-checkbox-group  v-model="checkGroup">
            <el-checkbox v-for="item in filterDataList" :key="item.id" :label="item.name">
                <span  @click.stop.prevent="goModelPosition(item)">{{item.name}}</span>
            </el-checkbox>
        </el-checkbox-group>
    </div>
    <div class="not-data" v-else>
        <el-empty :image-size="50" />
    </div>
</template>
<script setup >
import { ref, reactive, toRef, watchEffect, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
const props = defineProps({
    data: Array,
})
const parentEmitFunc = defineEmits(['showModelInfo', 'deleteModel']);
const filterDataList = ref([]);

const filterValue = ref('');
const checkGroup = ref([]);

const deleteSelectedModel = () => {
    if (checkGroup.value.length > 0) {
        const deleteArr = checkGroup.value.map(item => {
            const filterName = props.data.filter(data => data.name === item);
            if (filterName.length > 0) {
                return filterName[0].id;
            }
        })
        parentEmitFunc('deleteModel',  deleteArr.join(','))
        checkGroup.value = [];
    }
}
const goModelPosition = (item) => {
    parentEmitFunc('showModelInfo', item);
}
const getFilterArr = () => {
    if (props.data) {
        filterDataList.value = props.data.filter(item => {
            if (item.name.indexOf(filterValue.value) > -1) {
                return item;
            }
        })
    }
}
watch(() => props.data, () => {
    getFilterArr()
},
{
    deep: true
})

</script>
<style lang="less" scoped>
.header {
    height: 27px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #E0E6EB;
    font-size: 10px;

    :deep(.el-input) {
        width: 116px;
        height: 20px;
        background: #F9FDFF;
        border-radius: 4px;
        // border: 1px solid #E0E6EB;
        margin-left: 5px;
        font-size: 10px;
        overflow: hidden;
        .el-input__inner {
            height: 20px;
            line-height: 1;
            padding-right: 25px;
        }
    }
    .icon-shanchuchangjing {
        display: block;
        margin-right: 10px;
        font-size: 14px;
        color: #5098FF;
    }
}
.list {
    height: calc(100% - 27px);
    width: 100%;
    overflow: scroll;
    .el-checkbox-group {
        width: 100%;
        .el-checkbox {
            margin-left: 9px;

        }
    }
}
</style>