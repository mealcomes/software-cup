<script setup>
import {ElMessage} from "element-plus";
import {ArrowDown, MagicStick} from '@element-plus/icons-vue'

const handleCommand = (command) => {
  ElMessage(`click on item ${command}`);
}
</script>


<template>
  <el-dropdown @command="handleCommand">
    <el-button type="primary">
      <el-icon class="el-icon--left"><MagicStick /></el-icon>AI百宝箱<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="a">润色</el-dropdown-item>
        <el-dropdown-item command="b">翻译</el-dropdown-item>
        <el-dropdown-item command="c">续写</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>



<style scoped>
</style>