<!--
 * @Description: 运行结果
 * @Project: 
 * @Author: michelle
 * @Date: 2022-04-01 10:18:40
 * @LastEditors: michelle
 * @LastEditTime: 2022-04-01 19:37:29
 * @Modified By: michelle
 * @FilePath: /trunkverse/src/pages/scene/components/Result.vue
-->
<template>
    <div class="result-box">
        <el-table
            border
            ref="resultTable"
            :data="tableData"
            style="width: 100%"
            table-layout="fixed"
        >
            <el-table-column property="scenario_name" label="场景名称" align="center" width="200" />
            <el-table-column property="scenario_id" label="场景ID" align="center" width="100" />
            <el-table-column property="password" label="运行结果" align="center">
                <template #default="scope">
                    <p class="icon-wancheng">metric1</p>
                    <p class="icon-wancheng">metric3</p>
                    <p class="icon-wancheng">metric1</p>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script setup>
import { ref, toRef } from "vue";
const props = defineProps({
    tableData: Array
});
const tableData = toRef(props, "tableData");

</script>
<style scoped lang="less">
.icon-wancheng {
    color: #00b314;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    line-height: 22px;
}
.result-box {
    margin: -30px -20px;
    height: 520px;
    overflow-y: auto;
    :deep(.el-table th.el-table__cell) {
        background: #f6faff;
    }
    :deep(.el-table__header) {
        height: 64px;
        border-radius: 8px 8px 0px 0px;
    }
}
</style>