<!--
 * @Author: yunfei
 * @Date: 2022-04-01 10:26:08
 * @LastEditTime: 2022-04-01 19:08:44
 * @FilePath: /trunkverse/src/pages/task/components/LookDetail.vue
 * @LastAuthor: Do not edit
 * @Description: 
-->
<template>
  <el-dialog
    v-model="taskLookDialogStatus"
    title="查看详情"
    width="50%"
    :before-close="closeDialog"
  >
    <div class="top-view">
      <div class="tools-progress">
        <el-progress stroke-width="12" :percentage="90" />
      </div>
      <div class="tool-right rerunBtn">
        <el-button type="primary">Re run</el-button>
      </div>
    </div>
    <div class="dialog-table-box task-table">
      <el-table
        ref="multipleTableRef"
        :data="state.tableDetailData"
        style="width: 100"
        table-layout="fixed"
      >
        <el-table-column property="sceneName" label="场景名称" align="center" />
        <el-table-column label="运行时间" width="200" align="center">
          <template #default="scope">{{ scope.row.runTime }}</template>
        </el-table-column>
        <el-table-column label="通过率" align="center">
          <template #default="scope">
            <div v-if="scope.row.passRate >= 80" class="pass-rate">
              {{ scope.row.passRate }}%
            </div>
            <div v-else>{{ scope.row.passRate }}%</div>
          </template>
        </el-table-column>
        <el-table-column
          property="metricResult"
          label="metric结果"
          align="center"
        />
        <el-table-column label="操作" align="center">
          <template>
            <div class="look-detail">
              <span @click="lookScene(true)"> 查看场景 </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, toRef, onBeforeMount, onMounted } from "vue";
import { tableDetailData } from "@/assets/mock/taskTableDetail.js";

const state = reactive({
  tableDetailData: tableDetailData,
});

const props = defineProps({
  taskLookDialogStatus: Boolean,
  taskId: String,
});
const taskLookDialogStatus = toRef(props, "taskLookDialogStatus");
const myEmitFun = defineEmits(["lookDetailClick"]);

const closeDialog = () => {
  myEmitFun("lookDetailClick", false);
};
onBeforeMount(() => {});
onMounted(() => {});
</script>
<style lang="less" scoped>
@import "@/assets/css/commonHeader.less";
@import "@/assets/css/commonDialogTable.less";
.top-view {
  width: 100%;
}
.tools-progress {
  display: inline-block;
  width: 90%;
  height: 40px;
}
.rerunBtn {
  position: relative;
  top: -4px;
  display: inline-block;
  width: 10%;
  text-align: right;
}
</style>
