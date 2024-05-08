<template>
  <div class="chatdialog">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="AI辅助" name="ai">User</el-tab-pane>
      <el-tab-pane label="在线编辑" name="second">Config</el-tab-pane>
    </el-tabs>
    <el-input
      v-model="chatInput"
      style="width: 94%; position:absolute; bottom: 10px"
      class="input-with-select"
    >
      <template #append>
        <el-button :icon="VideoPlay" @click="submitChat"/>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { Search, VideoPlay, VideoPause } from '@element-plus/icons-vue'
import { ref } from 'vue'
const chatInput = ref('')
const activeName = ref('ai')
const submitChat = () => {
  console.log(chatInput.value);
}
</script>

<style scoped>
.chatdialog {
  width: 280px;
  height: 82.4%;
  position: fixed;
  right: 0;
  top: 90px;
  background-color: white;
  border-left: rgba(0, 0, 0, 0.08) solid 0.8px;
  padding: 10px;
}
</style>