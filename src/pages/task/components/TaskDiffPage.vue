<!--
 * @Description: 
 * @Project: 
 * @Author: michelle
 * @Date: 2022-03-25 10:48:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-04-01 21:16:55
 * @Modified By: michelle
 * @FilePath: /trunkverse/src/pages/task/components/TaskDiffPage.vue
-->
<template>
  <el-dialog
    v-model="taskDiffDialogStatus"
    title="任务对比"
    width="50%"
    :before-close="closeDialog"
  >
    <!-- <span>{{ props.selectList }}</span> -->
    <div class="dialog-table-box task-table">
      <el-table
        ref="multipleTableRef"
        :data="taskTableDiff"
        style="width: 100%"
        table-layout="fixed"
      >
        <el-table-column prop="sceneId" label="场景\任务" width="100px" align="center"/>
        <el-table-column label="任务一" align="center">
          <el-table-column label="版本信息" align="center">
            <template #default="scope">
              <div v-if="scope.row.versionsOne != scope.row.versionsTwo" class="pass-versions">
                {{ scope.row.versionsOne }}
              </div>
              <div v-else>{{ scope.row.versionsOne }}</div>
            </template>
            </el-table-column>
          <el-table-column label="metric结果" align="center">
            <template #default="scope">
              <div v-if="scope.row.typeOne == 'success'" class="pass-metric-success">
                <p>{{ scope.row.metricResultOne }}</p>
                <p>{{ scope.row.metricResultOne }}</p>
                <p>{{ scope.row.metricResultOne }}</p>
              </div>
              <div v-else class="pass-metric-exception">
                <p>{{ scope.row.metricResultOne }}</p>
                <p>{{ scope.row.metricResultOne }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="任务二" align="center">
          <el-table-column label="版本信息" align="center">
            <template #default="scope">
              <div v-if="scope.row.versionsOne != scope.row.versionsTwo" class="pass-versions">
                {{ scope.row.versionsTwo }}
              </div>
              <div v-else>{{ scope.row.versionsTwo }}</div>
            </template>
            </el-table-column>
          <el-table-column label="metric结果" align="center">
            <template #default="scope">
              <div v-if="scope.row.typeTwo == 'success'" class="pass-metric-success">
                {{ scope.row.metricResultTwo }}
              </div>
              <div v-else class="pass-metric-exception">
                <p>{{ scope.row.metricResultTwo }}</p>
                <p>{{ scope.row.metricResultTwo }}</p>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, toRef } from "vue";
import { taskTableDiff } from "@/assets/mock/taskTableDiff";

const props = defineProps({
  taskDiffDialogStatus: Boolean,
  selectList: Array,
});
const taskDiffDialogStatus = toRef(props, "taskDiffDialogStatus");
const myEmitFunc = defineEmits(["diffSelectTask"]);

const closeDialog = () => {
  myEmitFunc("diffSelectTask", false);
};
</script>
<style lang="less" scoped>
@import "@/assets/css/commonHeader.less";
@import "@/assets/css/commonDialogTable.less";
.el-table__cell{
  text-align: center;
}

</style>
