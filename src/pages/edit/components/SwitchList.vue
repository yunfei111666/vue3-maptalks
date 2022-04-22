<template>
<div class="list" v-if="props.data.length > 0">
    <div class="history" v-if="props.type === 'history'">
        <div
            class="item" 
            v-for="(item, index) in props.data"
            :class="[ history ? (history === item.updateTime ? 'select' : '') : (index === 0 ? 'select' : '')]"
            :key="item.updateTime"
            @click="changeItem(item)"
        >
            <div>创建时间：{{timestampToTime(item.updateTime)}}</div>
            <div>模型数量：{{item.mapJSON?.gltfs.length}}</div>
        </div>
    </div>
    <div class="version" v-else>
        <div
            class="item"
            v-for="item in props.data"
            :class="Number(props.version) === item.scenario_version ? 'select' : ''"
            :key="item.scenario_version"
            @click="changeItem(item)"
        >
            <div>创建时间：{{transformTimestamp(item.created_at)}}</div>
            <div>版本ID:{{item.scenario_version}}</div>
        </div>
    </div>
</div>
<div v-else>
    <el-empty :image-size="200" />
</div>
</template>
<script setup>
import {transformTimestamp, timestampToTime} from '@/utils';
const props = defineProps({
    type: String,
    data: Array,
    version: String,
    history: Number,
})
const parentEmitFunc = defineEmits(['changeCurrentEditJson'])
const changeItem = (item) => {
    parentEmitFunc('changeCurrentEditJson', {type: props.type, item});
}
</script>
<style lang="less" scoped>
.list {
    width: 100%;
    height: 100%;
    overflow: auto;
    .item {
        height: 64px;
        width: 100%;
        border-top: 1px solid #E0E6EB;
        padding-left: 33px; 
        box-sizing: border-box;
        font-size: 14px;
        color: #0F151D;
        line-height: 28px;
        cursor: pointer;
    }
    .item:last-child {
        border-bottom: 1px solid #E0E6EB;
    }

    .select {
        background-color: #E9F3FF;
    }
}
</style>