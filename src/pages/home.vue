<template>
    <div class="common-layout">
        <Header ref=""/>
        <div class="container">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import Header from '@/components/Header.vue';
import {themeStyle} from '@/assets/theme';

</script>
<style lang="less" scoped>
.common-layout {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;   
    background: v-bind('themeStyle.style.mainBackgroundColor');


    .container {
        height: calc(100% - 88px);
        margin-top: 24px;
        background: v-bind('themeStyle.style.containerBackgroundColor');
        box-shadow: v-bind('themeStyle.style.containerBoxShadow');
        border-radius: 8px;
        overflow: hidden;
        position: relative;
    }
}
</style>