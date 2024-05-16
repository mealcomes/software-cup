<script setup>
import {ElMessage} from "element-plus";
import {ArrowDown, MagicStick} from '@element-plus/icons-vue'
import {editorInstance} from "@/store/index.js";
import {isEnglish} from "@/utils/convert.js";
import axios from "axios";
import {ref} from "vue";

const loading = ref(true)
const dialogVisible = ref(true)

const handleCommand = async (command) => {
  // ElMessage(`click on item ${command}`);
  const dict = {
    'translate': '翻译',
    'polish': '润色',
    'continue': '续写',
    'summary': '摘要',
    'mindmap': '思维导图生成'
  }
  if(editorInstance.value.command.getRangeText() === '')
    return ElMessage.warning('请先选择内容！')
  const msg = ElMessage({
    showClose: true,
    duration: 0,
    message: `正在进行${dict[command]}任务，请稍后...`
  })

  let result;
  try{
    if (command === 'translate') {
      console.log('translate');
      const toTranslateText = editorInstance.value.command.getRangeText()
      const en = isEnglish(toTranslateText)
      console.log(toTranslateText, en);
      result = await axios.post('/api4ai/translate', {
        content: toTranslateText,
        target: en ? 'zh' : 'en'
      })
      console.log('translate: ', result);
      if (result.status === 200 && result.data.status === 'ok') {
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
      console.log('polish', result);
      if (result.status === 200 && result.data.status === 'ok') {
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
    } else if (command === 'continue') {
      console.log('continue');

      // // 创建一个表单元素
      // const form = document.createElement('form');
      // form.id = 'continue-rules'; // 设置表单的 ID
      //
      // // 创建一个输入框
      // const input = document.createElement('input');
      // input.type = 'text';
      // input.placeholder = '请输入续写要求';
      // input.name = 'continue-rules'; // 设置表单项的名称
      //
      // // 创建一个提交按钮
      // const submitButton = document.createElement('button');
      // submitButton.type = 'submit';
      // submitButton.textContent = '提交';
      //
      // // 将输入框和按钮添加到表单中
      // form.appendChild(input);
      // form.appendChild(submitButton);
      //
      // // 将表单添加到页面中
      // const app = document.getElementById('app');
      // app.appendChild(form);
      //
      // // 添加表单提交事件处理程序
      // form.addEventListener('submit', (event) => {
      //   event.preventDefault(); // 阻止默认提交行为
      //   const formData = new FormData(form); // 获取表单数据
      //   console.log('活动名称:', formData.get('activityName'));
      //   // 在这里可以执行其他逻辑，比如发送表单数据到服务器
      // });
      //
      // return

      const toContinueText = editorInstance.value.command.getRangeText()
      result = await axios.post('/api4ai/continuation', {
        content: toContinueText
      })
      console.log(result);
      if (result.status === 200 && result.data.status === "ok") {
          editorInstance.value.command.executeInsertElementList([
            {
              value: result.data.message
            }
          ])
      }
    }else if (command === 'summary') {
      console.log('summary');
      const toContinueText = editorInstance.value.command.getRangeText()
      result = await axios.post('/api4ai/summary', {
        content: toContinueText
      })
      console.log(result);
      if (result.status === 200 && result.data.status === "ok") {
        editorInstance.value.command.executeInsertElementList([
          {
            value: result.data.message
          }
        ])
      }
    }
  } catch (e){
    msg.close()
    ElMessage.error('server error!')
    return
  }

  if (result.status === 200 && result.data.status === 'ok') {
    msg.close()
    ElMessage.success('操作成功')
  } else {
    msg.close()
    ElMessage.error(result.data.message)
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