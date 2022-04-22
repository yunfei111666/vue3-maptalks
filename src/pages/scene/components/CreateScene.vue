<!--
 * @Description: 
 * @Project: 
 * @Author: yunfei
 * @Date: 2022-03-25 10:48:42
 * @LastEditors: yunfei
 * @LastEditTime: 2022-03-28 10:59:18
 * @Modified By: yunfei
 * @FilePath: /trunkverse/src/pages/scene/components/CreateScene.vue
-->
<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <el-form-item label="场景名称" prop="name">
      <el-input
        class="name-input"
        v-model="ruleForm.name"
        type="text"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button @click="submitForm(ruleFormRef)">创建</el-button>
    </el-form-item>
    Î <StopFormDefaultSubmitVue />
  </el-form>
</template>
<script setup>
import { ref, reactive } from "vue";
import StopFormDefaultSubmitVue from "../../../components/StopFormDefaultSubmit.vue";
const ruleFormRef = ref();
const props = defineProps({
  sceneList: Array,
});
const parentEmitFunc = defineEmits(["changeNewSceneStatus", "createNewScene"]);

const checkName = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请填写名称"));
  }
  const repeatArr = props.sceneList.filter(
    (item) => item.scenario_name === value
  );
  if (repeatArr.length > 0) {
    return callback(new Error("名称已重复"));
  }
  return callback();
};
const ruleForm = reactive({
  name: "",
});

const rules = reactive({
  name: [{ validator: checkName, trigger: "blur" }],
});

const submitForm = (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      parentEmitFunc("createNewScene", ruleFormRef.value.model.name);
    } else {
      return false;
    }
  });
};
const closeDialog = () => {
  parentEmitFunc("changeNewSceneStatus", false);
};
</script>
<style lang="less" scoped>
.stopDefaultSport {
  display: none;
}
</style>