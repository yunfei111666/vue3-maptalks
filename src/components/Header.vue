<template>
  <div class="header">
    <div class="left">
      <i class="iconfont icon-logo logo"></i>
    </div>
    <div class="center">
      <TabItem
        v-for="item in store.state.menuList"
        :info="item"
        :key="item"
        @selectItem="selectRoute"
      />
    </div>
    <div class="right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar
            class="user-icon"
            :size="40"
            src="https://joeschmoe.io/api/v1/random"
          ></el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="exitAccount">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue";
import TabItem from "@/components/TabItem.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { themeStyle, whiteStyle, blackStyle } from "@/assets/theme";
import { logout } from "@/request/user.js";

const store = useStore();
const router = useRouter();
// 路由切换
const selectRoute = (params) => {
  router.push(params.path);
};

// 主题切换
const themeActive = () => {
  let localTheme = store.state.theme || localStorage.getItem("theme");
  if (localTheme === "black") {
    localTheme = "white";
  } else {
    localTheme = "black";
  }
  setSceneStyle(localTheme);
};
// 更改style
const setSceneStyle = (localTheme) => {
  let theme = localTheme || store.state.theme || localStorage.getItem("theme");
  store.commit("CHANGE_THEME", theme);
  themeStyle.style = theme == "black" ? blackStyle : whiteStyle;
  localStorage.setItem("theme", theme);
};

//退出登陆
const exitAccount = () => {
  logout().then((res) => {
    store.commit('menuList', []);
    localStorage.clear();
    location.reload();
  });
};

onBeforeMount(() => {
  setSceneStyle();
});
</script>
<style lang="less" scoped>
.header {
  height: 64px;
  width: 100%;
  display: flex;
  align-items: center;
  background: v-bind("themeStyle.style.header.backgroundColor");
  box-shadow: v-bind("themeStyle.style.header.borderShadow");

  .left {
    width: 354px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .logo {
      display: block;
      width: 270px;
      height: 22px;
      font-size: 24px;
      color: v-bind("themeStyle.style.header.fontColor");
    }
  }
  .center {
    flex-grow: 1;
    height: 100%;
    display: flex;
  }
  .right {
    height: 64px;
    margin-right: 24px;
    display: flex;
    align-items: center;

    .iconfont {
      display: block;
      height: 40px;
      width: 40px;
      margin-right: 20px;
      font-size: 30px;
      line-height: 40px;
      color: v-bind("themeStyle.style.header.themeFontColor");
      text-align: center;
      background: v-bind("themeStyle.style.header.themeFontBackGround");
      box-shadow: v-bind("themeStyle.style.header.themeFontBoxShadow");
      border-radius: 50%;
      cursor: pointer;
    }

    .user-icon {
      height: 40px;
      width: 40px;
    }
  }
}
</style>