<script setup>
import {ElMessage} from "element-plus";
import {ArrowDown, MagicStick} from '@element-plus/icons-vue'
import { store, editorInstance } from "@/store";
import { isEnglish } from "@/utils/convert";
import axios from "axios";

const handleCommand = async (command) => {
  // ElMessage(`click on item ${command}`);

  if (command === 'translate') {
    console.log('translate');
    const toTranslateText = editorInstance.value.command.getRangeText()
    const en = isEnglish(toTranslateText)
    console.log(toTranslateText, en);
    const result = await axios.post('/api4ai/translate', {
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
    const result = await axios.post('/api4ai/improve', {
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
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>



<style scoped>
</style>