<template>
    <div :class="`item-box ${style === route.name ? 'select-box' : ''}`" @click="selectItem(style)">
        <i :class="`iconfont icon-${getRouteStyle(style).meta.icon} icon`"></i>
        <div class="text">
            {{getRouteStyle(style).meta.title}}
        </div>
    </div>
</template>
<script setup>
import { ref, toRef, reactive } from 'vue';
import {themeStyle} from '@/assets/theme';
import {useRoute} from 'vue-router';
import {routes} from '@/router';

const route = useRoute();

const props = defineProps({
    info: String,
})
const style = toRef(props, 'info');
const  myEmitFunc = defineEmits(["selectItem"])

const getRouteStyle = (name) => {
    const list = routes[0].children.filter(item => item.name === name);
    return list[0];
}

const selectItem = (name) => {
    myEmitFunc("selectItem", getRouteStyle(name))
}



</script>
<style lang="less" scoped>
.item-box {
    width: 224px;
    height: 100%;
    display: flex;
    justify-content:center;
    align-items: center;
    font-size: 18px;
    color: v-bind('themeStyle.style.tabItem.fontColor');
    background: v-bind('themeStyle.style.tabItem.backgroundColor');
    line-height: 1;
    cursor: pointer;
    .icon {
        font-size: 22px;
        margin-right: 8px;
    }
}
.select-box {
    background: v-bind('themeStyle.style.tabItem.selectBackgroundColor');
    border-radius: 8px;
    color: v-bind('themeStyle.style.tabItem.selectFontColor');
}



</style>