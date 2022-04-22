<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="80px"
    class="demo-ruleForm"
    :key="new Date().getTime()"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model.number="ruleForm.username" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="ruleForm.password"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="重复密码" prop="rePassword">
      <el-input
        v-model="ruleForm.rePassword"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item class="dialog-footer">
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >提交</el-button
      >
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { ref, reactive } from "vue";
import { createUser } from "@/request/user.js";
import { ElMessage } from "element-plus";
const nameRegex = new RegExp("^[A-Za-z0-9_@.]{3,20}$");
const ruleFormRef = ref();
const props = defineProps({
  userList: Array,
});
const parentEmitFunc = defineEmits(["closeCreateUserDialog"]);
const checkUsername = (rule, value, callback) => {
  const repeatNameArr = props.userList.filter(
    (item) => item.username === ruleForm.username
  );
  if (value === "") {
    callback(new Error("请输入用户名"));
  } else if (!nameRegex.test(value)) {
    callback(new Error("输入用户名不符合规范"));
  } else if (repeatNameArr.length > 0) {
    callback(new Error("用户名已重复"));
  } else {
    callback();
  }
};

const validatePass = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else if (!nameRegex.test(value)) {
    callback(new Error("输入密码不符合规范"));
  } else {
    callback();
  }
};
const validatePass2 = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请重复输入密码"));
  } else if (value !== ruleForm.password) {
    callback(new Error("两次密码不一致"));
  } else {
    callback();
  }
};

const ruleForm = reactive({
  username: "",
  password: "",
  rePassword: "",
});

const rules = reactive({
  username: [{ validator: checkUsername, trigger: "blur" }],
  password: [{ validator: validatePass, trigger: "blur" }],
  rePassword: [{ validator: validatePass2, trigger: "blur" }],
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      createUser({
        username: ruleForm.username,
        password: ruleForm.password,
      })
        .then((res) => {
          if (res.code === 200) {
            parentEmitFunc("closeCreateUserDialog", false);
            ElMessage({
              type: "success",
              message: "创建成功",
            });
          } else {
            ElMessage({
              type: "error",
              message: res.detail && res.detail.msg,
            });
          }
        })
        .catch((error) => {
          ElMessage({
            type: "error",
            message: "创建失败",
          });
        });
    } else {
      return false;
    }
  });
};
const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
defineExpose({
  ruleFormRef,
  resetForm,
});
</script>
<style lang="less" scoped>
</style>