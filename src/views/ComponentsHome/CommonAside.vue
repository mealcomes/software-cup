<template>
  <el-aside width="250px" style="background-color: rgb(249,250,251); " class="side">
    <div style="width: auto; height: 150px; flex-direction: column; display: flex; align-items: center; border-right: 0.8px solid rgb(220, 223, 230);">
      <h3 style="color: black; margin-bottom: 20px;">XX文档</h3>
      <el-input style="width: 90%;" placeholder="请输入内容">
        <template #prefix>
        <el-icon class="el-input__icon"><search /></el-icon>
      </template>
      </el-input>
    </div>
    <el-menu style="height: calc(100vh - 60px); background-color: rgb(249,250,251);" default-active="1">
      <el-menu-item index="1">
        <el-icon><House /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><Star /></el-icon>
        <span>星标文件</span>
      </el-menu-item>
      <el-divider></el-divider>
      <el-menu-item index="3">
        <el-icon><House /></el-icon>
        <span>回收站</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>

<script setup>
// import { useRouter } from "vue-router";
import { Search, House, Star } from "@element-plus/icons-vue";
// import { ref } from "vue";
// const router = useRouter();
// const isCollapse = ref(false);
// const handleOpen = (key, keyPath) => {
//   console.log(key, keyPath);
// };
// const handleClose = (key, keyPath) => {
//   console.log(key, keyPath);
//
</script>

<style lang='less' scoped>
.el-menue {
  border-right: none;
}

h3 {
  color: #fff;
  margin-top: 20px;
  text-align: center;
  font-size: 18px;
}

.search {
  margin-top: 20px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.side::-webkit-scrollbar {
  display: none;
}
</style>