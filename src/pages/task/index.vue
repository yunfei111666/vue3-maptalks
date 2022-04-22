<template>
  <div class="tool-top">
    <div class="tool-left">
      <div class="text">任务列表</div>
      <el-input
        clearable
        class="search-input"
        v-model="state.taskNameSearch"
        placeholder="请输入任务名称"
      />
      <el-button
        class="search-icon"
        :icon="Search"
        @click="filterTaskInfo"
      ></el-button>
    </div>
    <div class="tool-right">
      <el-button type="primary" @click="diffSelectTask(true)">Diff</el-button>
    </div>
  </div>
  <div id="mask-list" class="table-box task-table">
    <el-table
      ref="multipleTableRef"
      :data="state.filterTask"
      style="width: 100"
      :height="state.tableHeight"
      @select="handleSelectionChange"
      table-layout="fixed"
      :key="state.tableHeight"
    >
      <el-table-column class="checkbox" type="selection" align="right" />
      <el-table-column property="taskId" label="任务ID" align="center" />
      <el-table-column property="taskName" label="任务名称" align="center" />
      <el-table-column property="createUser" label="创建人" align="center" />
      <el-table-column label="创建时间" width="200" align="center">
        <template #default="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
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

      <el-table-column label="任务状态" align="center">
        <template #default="scope">
          <i
            v-if="scope.row.taskStatus === 'run'"
            class="iconfont icon-wancheng"
          ></i>
          <i
            v-else-if="scope.row.taskStatus === 'fail'"
            class="iconfont icon-shibai"
          ></i>
          <i v-else class="iconfont icon-yunhangzhong"> </i>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <div class="look-detail">
            <span @click="lookDetailClick(true, scope.row.taskId)"> 查看 </span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <TaskDiffPage
    :taskDiffDialogStatus="state.taskDiffDialogStatus"
    :selectList="state.selectList"
    @diff-select-task="diffSelectTask"
  />
  <LookDetail 
    :taskLookDialogStatus="state.taskLookDialogStatus"
    :taskId="state.taskId"
    @lookDetailClick="lookDetailClick"
  />
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, nextTick } from "vue";
import TaskDiffPage from "@/pages/task/components/TaskDiffPage.vue";
import LookDetail from "@/pages/task/components/LookDetail.vue";
import { filterArr,concatArray } from "@/utils/common.js";
import { tableData } from "@/assets/mock/taskTable";
import { Search } from "@element-plus/icons-vue";
const state = reactive({
  taskDiffDialogStatus: false,
  taskLookDialogStatus: false,
  taskId:"",
  taskNameSearch: "",
  tableHeight: 0,
  selectList: [],
  taskList: tableData,
  filterTask: tableData,
});
// 得到选中项
const multipleTableRef = ref(null);
const handleSelectionChange = (selection) => {
    const result = concatArray(state.selectList, selection, 'taskId');
    const resultLength = result.length;
    if (resultLength > 2) {
      for(let i =0;i < resultLength - 2; i++) {
        multipleTableRef.value.toggleRowSelection(result[i], undefined);
        state.selectList = selection.splice(resultLength - 2)
      }
    }
    else {
      state.selectList = result;

    }
};
const diffSelectTask = (params) => {
  state.taskDiffDialogStatus = params;
};
const lookDetailClick = (params,taskId) => {
  state.taskLookDialogStatus = params;
  state.taskId = taskId
};
// 表格动态高度
const getHeight = () => {
  const height = document.getElementById("mask-list").offsetHeight;
  state.tableHeight = height - 100;
};
// 过滤任务列表
const filterTaskInfo = () => {
  state.filterTask = filterArr(
    state.taskNameSearch,
    state.taskList,
    "taskName"
  );
  state.filterTask.forEach(row => {
    const obj = state.selectList.find(item => {
      return row.taskId == item.taskId;
    });
    if (obj) {
      // TODO 表格不更新
      setTimeout(() => {
        multipleTableRef.value.toggleRowSelection(obj, true);
      })
    }
  });
};

onMounted(() => {
  getHeight();
  window.addEventListener("resize", getHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getHeight);
});

</script>
<style lang="less" scoped>
@import "@/assets/css/commonHeader.less";
@import "@/assets/css/commonTable.less";
</style>