<template>
  <div class="header">
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="display: flex; justify-content: center; align-items: center;" @click="goback"><el-icon><Back /></el-icon><h4>返回</h4></div>
      <el-divider direction="vertical" />
      <h3 style="margin-left: 40px;">{{ store.fileName }}</h3>
    </div>
    <div style="display: flex; justify-content: center; align-items: center;">
      <el-popover placement="bottom" :width="300" trigger="click">
        <template #reference>
          <el-button :icon="Setting">模型设置</el-button>
        </template>
        <div>
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <span>随机程度</span>
            <el-slider v-model="store.randomDegree" :step="0.05" :max="1" style="width: 150px;"</el-slider>
          </div>
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <span>知识库</span>
            <el-switch v-model="store.knowledgeBase" active-text="开" inactive-text="关" />
          </div>
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <span>自定义提示词</span>
            <el-switch v-model="store.customPrompt" active-text="开" inactive-text="关" />
          </div>
        </div>
      </el-popover>
      <el-button :icon="DocumentAdd" @click="saveAsTemplate">存为模板</el-button>
      <el-button type="primary" :icon="Share">
        分享</el-button>
      <el-divider direction="vertical" />
      <el-avatar shape="square" :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
    </div>
  </div>
</template>

<script setup>
import {Back, Share, Setting, DocumentAdd} from '@element-plus/icons-vue'
import {useRouter} from 'vue-router';
import {editorInstance, store} from '@/store/index.js';
import {onBeforeUnmount, onMounted} from "vue";
import axios from 'axios';
import { ElMessage } from 'element-plus';

const router = useRouter()
const goback = () => {
  router.go(-1)
}

const saveAsTemplate = async () => {
  const res = await axios.put('/api/files/'+store.fileId, {
    is_template: true
  })
  console.log(res);
  ElMessage.success('保存成功')
}

onBeforeUnmount(async () => {
  if (editorInstance.value) {
    editorInstance.value.listener.visiblePageNoListChange = null
    editorInstance.value.listener.pageSizeChange = null
    editorInstance.value.listener.intersectionPageNoChange = null
    editorInstance.value.listener.pageScaleChange = null
    editorInstance.value.listener.controlChange = null
    editorInstance.value.listener.pageModeChange = null
    editorInstance.value = null
  }
})

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