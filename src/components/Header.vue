<template>
  <div class="header">
    <div style="display: flex; justify-content: center; align-items: center;">
      <el-icon><Back /></el-icon><h4>返回</h4>
      <h2 style="margin-left: 50px;">实验报告</h2>
    </div>
    
  </div>
</template>

<script setup>
import {Back} from '@element-plus/icons-vue'
</script>

<style scoped>
.header {
  width: 100%;
  background-color: white;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: rgba(0, 0, 0, 0.08) solid 0.8px;
}
</style>