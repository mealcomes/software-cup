<template>
  <div class="header">
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="display: flex; justify-content: center; align-items: center;" @click="goback"><el-icon><Back /></el-icon><h4>返回</h4></div>
      <el-divider direction="vertical" />
      <h3 style="margin-left: 40px;">{{ store.fileName }}</h3>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
      <el-button type="primary" :icon="Share">
        分享</el-button>
      <el-divider direction="vertical" />
      <el-avatar shape="square" :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    </div>
  </div>
</template>

<script setup>
import {Back, Share} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router';
import {store} from '@/store/index.js';

const router = useRouter()
const goback = () => {
  router.go(-1)
}
</script>

<style scoped>
.header {
  width: 98.2%;
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
.header div div:hover {
  cursor: pointer;
  color: #409eff;
}
</style>