<template>
  <div class="tool-top">
    <div class="tool-left">
      <div class="text">用户列表</div>
      <el-input
        class="search-input"
        v-model="state.searchUser"
        placeholder="请输入用户名称"
        clearable
      />
      <el-button
        class="search-icon"
        :icon="Search"
        @click="filterUserList"
      ></el-button>
    </div>
    <div class="tool-right">
      <el-button type="primary" @click="state.createDialogStatus = true"
        >新增</el-button
      >
      <el-button type="primary" @click="deleteSelectUser()">删除</el-button>
    </div>
  </div>
  <div id="table-box" class="table-box">
    <el-table
      ref="userTable"
      :data="state.filterUser"
      style="width: 100%"
      :height="state.tableHeight"
      table-layout="fixed"
      @selection-change="handleSelectionChange"
      :key="state.tableHeight"
    >
      <el-table-column
        type="selection"
        align="right"
        width="55"
        :selectable="selectable"
      />
      <el-table-column property="username" label="用户名称" align="center" />
      <el-table-column property="password" label="用户密码" align="center" />
      <el-table-column label="创建时间" width="200" align="center">
        <template #default="scope">{{
          transformTimestamp(scope.row.created_at)
        }}</template>
      </el-table-column>
      <el-table-column label="是否可用" align="center">
        <template #default="scope">
          <!-- <el-select
            class="common-select"
            :disabled="scope.row.username === 'root'"
            :model-value="scope.row.is_use"
            @change="(value) => changeUserUseable(value, scope.row)"
          >
            <el-option
              v-for="(item, index) in USER_STATUS"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <el-switch
            v-model="scope.row.is_use"
            active-color="#5098FF"
            inactive-color="#BEBFC0"
            :disabled="scope.row.username == 'root'"
            @change="(value) => handleUseChange(value, scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template #default="scope">
          <el-select :model-value="scope.row.is_superuser" :disabled="true">
            <el-option
              v-for="item in USER_POWER"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            >
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="text"
            @click="deleteSelectUser(scope.row)"
            :disabled="scope.row.username == 'root'"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!-- 新建用户 -->
  <el-dialog
    v-model="state.createDialogStatus"
    width="600px"
    custom-class="no-footer-dialog"
    title="新增用户"
    @close="handleCloseDialog"
  >
    <createUserForm
      ref="sonRef"
      :userList="state.userList"
      @close-create-user-dialog="closeCreateUserDialog"
    />
  </el-dialog>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, reactive } from "vue";
import createUserForm from "./components/CreateUserForm.vue";
import { getUserList, deleteUser, updateUser } from "@/request/user.js";
import { filterArr, concatArray } from "@/utils/common.js";
import { transformTimestamp } from "@/utils";
import { Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
// 最大对比数量
const USER_POWER = [
  {
    value: true,
    label: "管理员",
  },
  {
    value: false,
    label: "用户",
  },
];
const userTable = ref(null);
// 响应状态合集
const state = reactive({
  searchUser: "",
  // 获得用户
  userList: [],
  // 过滤用户
  filterUser: [],
  tableHeight: 0,
  selectList: [],
  createDialogStatus: false,
});
//子组件
const sonRef = ref();
/**
 * 关闭弹框
 */
const handleCloseDialog = () => {
  state.sceneDetailInfoVisible = false;
  sonRef.value.resetForm(sonRef.value.ruleFormRef);
};
// 得到选中项
const handleSelectionChange = (selection) => {
  const result = concatArray(state.selectList, selection, "uid");
  state.selectList = result;
};
//是否禁用切换
const handleUseChange = (v, p) => {
  p.is_use = v;
  updateUser(p)
    .then((res) => {
      if (res.code === 200) {
        initUserList();
        ElMessage({ type: "success", message: "修改成功" });
      } else {
        ElMessage({ type: "error", message: "修改失败" });
      }
    })
    .catch((res) => {
      ElMessage({ message: "修改失败" });
    });
};
// 删除用户
const deleteSelectUser = (row) => {
  let ids = [];
  if (row) {
    ids.push(row.uid);
  } else {
    if (!state.selectList.length) {
      return ElMessage({
        type: "warning",
        message: "请先勾选哦",
      });
    } else {
      state.selectList.map((item) => {
        ids.push(item.uid);
      });
    }
  }
  ElMessageBox.confirm("确认删除吗？", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteUser({ uid: ids.join(",") }).then((res) => {
        if (res.code === 200) {
          state.selectList = [];
          initUserList();
          ElMessage({
            type: "success",
            message: "删除成功",
          });
        } else {
          ElMessage({
            type: "error",
            message: "删除失败",
          });
        }
      });
      done();
    })
    .catch(() => {});
};
// 表格动态高度
const getHeight = () => {
  const height = document.getElementById("table-box").offsetHeight;
  state.tableHeight = height - 100;
};
// 关闭dialog
const closeCreateUserDialog = (params) => {
  state.createDialogStatus = params;
  initUserList();
};
// 获取用户列表
const initUserList = () => {
  getUserList()
    .then((res) => {
      state.userList = res;
      filterUserList();
    })
    .catch((error) => {
      ElMessage({ type: "error", message: "获取用户列表失败" });
    });
};
/**
 * root账户禁止删除
 */
const selectable = (row, index) => {
  if (row.username == "root") return false;
  return true;
};
const filterUserList = () => {
  state.filterUser = filterArr(state.searchUser, state.userList, "username");
  state.filterUser.forEach((row) => {
    const obj = state.selectList.find((item) => {
      return row.taskId == item.taskId;
    });
    if (obj) {
      // TODO 表格不更新
      setTimeout(() => {
        if (state.selectList) {
          state.selectList.forEach((row) => {
            userTable.value.toggleRowSelection(row, true);
          });
        }
      });
    }
  });
};

onMounted(() => {
  getHeight();
  window.addEventListener("resize", getHeight);
  initUserList();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", getHeight);
});
</script>
<style lang="less" scoped>
@import "@/assets/css/commonHeader.less";
@import "@/assets/css/commonTable.less";
</style>