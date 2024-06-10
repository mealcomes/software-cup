<template>
  <el-container class="common-layout">
    <common-aside/>
    <el-container class="vertical-container">
      <common-header/>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import CommonHeader from "../components/home/CommonHeader.vue";
import CommonAside from "../components/home/CommonAside.vue";
import Reveal from "reveal.js";

</script>

<style lang="less">
.vertical-container {
  //flex-wrap: wrap;
  flex-direction: column !important;
  //height: 100vh;
}

.common-layout {
  // height: 100vh;
  width: 100vw;
}

#app, body {
  background-color: rgb(242, 244, 247);
}

// .icon {
//   width: 10px;
//   height: 10px;
//   vertical-align: -0.15em;
//   fill: currentColor;
//   overflow: hidden;
// }

</style>