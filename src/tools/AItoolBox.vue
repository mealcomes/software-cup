<script setup>
import {ElMessage} from "element-plus";
import {ArrowDown, MagicStick} from '@element-plus/icons-vue'
import { store, editorInstance } from "@/store";
import { isEnglish } from "@/utils/convert";
import axios from "axios";
import { ref } from "vue";

const loading = ref(true)

const handleCommand = async (command) => {
  // ElMessage(`click on item ${command}`);
  const dict = {
    'translate': '翻译',
    'polish': '润色',
    'summary': '摘要',
    'mindmap': '思维导图生成'
  }
  const msg = ElMessage({
    showClose: true,
    duration: 0,
    message: `正在进行${dict[command]}任务，请稍后`
  })
  let result;
  if (command === 'translate') {
    console.log('translate');
    const toTranslateText = editorInstance.value.command.getRangeText()
    const en = isEnglish(toTranslateText)
    console.log(toTranslateText, en);
    result = await axios.post('/api4ai/translate', {
      content: toTranslateText,
      target: en ? 'zh' : 'en'
    })
    console.log(result);
    if (result.status === 200) {
      editorInstance.value.command.executeInsertElementList([
        {
          value: result.data.message
        }
      ])
    }
  } else if (command === 'polish') {
    console.log('improve');
    const toImproveText = editorInstance.value.command.getRangeText()
    result = await axios.post('/api4ai/improve', {
      content: toImproveText
    })
    console.log(result);
    if (result.status === 200) {
      editorInstance.value.command.executeInsertElementList([
        {
          value: result.data.message
        }
      ])
    }
  } else if (command === 'mindmap') {
    console.log('mindmap');
    const toMindmapText = editorInstance.value.command.getRangeText()
    result = await axios.get(`/api4ai/mindmap?text=${toMindmapText}`)
    console.log(result);
    if (result.status === 200) {
      console.log(result.data.image_data_uri);
      editorInstance.value.command.executeInsertElementList([
        {
          width: result.data.width,
          height: result.data.height,
          type: 'image',
          value: result.data.image_data_uri
        }
      ])
    }
  }
  if (result.status === 200) {
    msg.close()
    ElMessage.success('操作成功')
  } else {
    msg.close()
    ElMessage.error('操作失败')
  }
}


</script>


<template>
  <el-dropdown @command="handleCommand">
    <el-button type="primary">
      <el-icon class="el-icon--left"><MagicStick /></el-icon>AI百宝箱<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="polish">润色</el-dropdown-item>
        <el-dropdown-item command="translate">翻译</el-dropdown-item>
        <el-dropdown-item command="continue">续写</el-dropdown-item>
        <el-dropdown-item command="summary">摘要</el-dropdown-item>
        <el-dropdown-item command="mindmap">思维导图</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>



<style scoped>
</style>