<!--
 * @Description: 
 * @Project: 
 * @Author: michelle
 * @Date: 2022-03-24 18:27:20
 * @LastEditors: michelle
 * @LastEditTime: 2022-03-28 17:41:45
 * @Modified By: michelle
 * @FilePath: /trunkverse/src/pages/scene/components/SeniorSearch.vue
-->
<template>
  <div class="header">
    <div class="text">高级搜索</div>
    <div class="button-group">
      <el-button @click="resetSelectValue">重置</el-button>
      <el-button @click="startSeniorSearch">确定</el-button>
    </div>
  </div>

  <div class="time-select">
    <div class="text">日期范围</div>
    <el-date-picker
      v-model="searchTime"
      type="daterange"
      start-placeholder="请选择开始日期"
      end-placeholder="请选择结束日期"
      :default-value="[new Date(2022, 3, 1), new Date(2010, 4, 1)]"
    />
  </div>
  <div class="tag-select">
    <div class="text">标签</div>
    <el-tree
      ref="tree"
      :data="props.tagData"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[props.tagData[0].id]"
      :props="defaultProps"
      @check="handleNodeClick"
      @filter="hideNodeList()"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";
const parentEmitFunc = defineEmits(["setSceneList"]);
const props = defineProps({
  tagData: Array,
});
const tree = ref(null);
const searchTime = ref("");
const searchTags = ref([]);
const defaultProps = {
  children: "children",
  label: "name",
};
const handleNodeClick = (current, tree) => {
  searchTags.value = tree.checkedKeys;
};
const startSeniorSearch = () => {
  const [startTime, endTime] = searchTime.value;
  const searchParams = {};
  if (startTime) {
    searchParams.startTime = String(new Date(startTime).getTime());
    searchParams.endTime = String(new Date(endTime).getTime());
  } else {
    searchParams.startTime = "";
    searchParams.endTime = "";
  }
  searchParams.tags = searchTags.value.join();
  parentEmitFunc("setSceneList", searchParams);
};
const resetSelectValue = () => {
  searchTime.value = "";
  searchTags.value = [];
  tree.value.setCheckedKeys([]);
};
</script>
<style lang="less" scoped>
.button-group {
  :deep(.el-button) {
    span {
      font-size: 12px;
    }
  }
}
</style>