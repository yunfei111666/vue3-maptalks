<template>
    <el-form
        ref="ruleFormRef"
        :model="sceneInfo"
        :rules="rules"
        label-width="100px"
        class="save-ruleForm"
    >
        <el-form-item label="场景名称" prop="scenario_name">
            <el-input v-model="sceneInfo.scenario_name" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="场景描述" prop="description">
            <el-input v-model="sceneInfo.description" placeholder="请输入场景描述" />
        </el-form-item>
        <el-form-item label="场景标签" prop="tags">
            <el-select multiple v-model="sceneInfo.tags" placeholder="请选择标签" @change="setTags">
                <el-option
                    v-for="item in tagArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                />
            </el-select>
        </el-form-item>
        <el-form-item label="存储类型" prop="tags">
            <el-select
                v-model="saveType"
                placeholder="Select"
                @change="changeSaveType"
                :disabled="$route.query.type === 'create'"
            >
                <el-option
                    v-for="item in saveTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
        </el-form-item>
        <el-form-item class="dialog-footer">
            <el-button type="primary" @click="checkForm(ruleFormRef)">提交</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import {getSceneList} from '@/request/scene.js';
const route = useRoute();
const props = defineProps({
    sceneJson: Object,
});
const sceneInfo = reactive({
    scenario_name: props.sceneJson?.scenario_name,
    description: props.sceneJson?.description,
    tags: props.sceneJson?.tags || []
})
const parentEmitFunc = defineEmits(["saveSceneData"]);
const ruleFormRef = ref();
const saveType = ref("1");
const tagArr = ref(JSON.parse(localStorage.getItem("TAG_LIST")));
const saveTypeList = [
    {
        value: "1",
        label: "新建版本",
    },
    {
        value: "2",
        label: "覆盖版本",
    },
    {
        value: "3",
        label: "新建场景",
    },
];

const validateScenarioName = async (rule, value, callback) => {
    if (!value) {
        callback(new Error("场景名称不能为空"));
    }
    else if (value.length > 20) {
        callback(new Error("场景名称最长为20个字符"));
    }
    // 场景名称未改动
    else if(props.sceneJson.scenario_name === value && saveType.value !== '3'){
        callback();
    }
    else {
        const res = await getSceneList({
            scenario_name: value,
            startTime: "",
            endTime: "",
            tags: "",
        })
        if (res.length > 0 && res.filter(item => item.scenario_name === value).length > 0) {
            callback(new Error("场景名称已重复"));
        }
        else {
            callback();
        }
    }

};

const validateDescription = (rule, value, callback) => {
        if (value === "") {
        callback(new Error("输入场景描述不得超过20个字"));
    } else {
        callback();
    }
};
/**
 * 表单校验
 */
const rules = reactive({
    scenario_name: [{ validator: validateScenarioName, trigger: "blur" }],
    description: [{ validator: validateDescription, trigger: "blur" }],
});
/**
 * 表单提交
 */
const checkForm = (formEl) => {
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            const { scenario_name, description, tags } = sceneInfo;
            parentEmitFunc("saveSceneData", {
                scenario_name,
                description,
                tags: tags.join(','),
                sc_save_type: saveType.value,
            });
        } else {
            return false;
        }
    });
};
/**
 * 重置表单
 */
const resetForm = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
};
/**
 * tag切换
 */
const setTags = (val) => {
    return sceneInfo.tags = val
};
const changeSaveType = (val) => {

}
defineExpose({
    ruleFormRef,
    resetForm,
});
onMounted(
    () => {
        if (route.query.type === "update") {
            saveType.value = "1";
        } else if (route.query.type === "create") {
            saveType.value = "3";
        }
    }
);
</script>
<style lang="less" scoped>
.save-ruleForm {
    :deep(.el-input) {
        width: 300px;
    }
}
</style>