<script setup>
import { ElMessage } from "element-plus";
import { ArrowDown, MagicStick } from '@element-plus/icons-vue'
import { editorInstance } from "@/store/index.js";
import { isEnglish } from "@/utils/convert.js";
import axios from "axios";
import { ref, reactive } from "vue";
import { store } from "@/store/index.js";

const resDialogVisible = ref(false)
const resImageUri = ref('')
const command = ref('')
const loading = ref(true)
const dialogVisible = ref(true)
const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const tmpCommand = ref('')
const formLabelWidth = '140px'
const form = reactive({
  prompt: '',
})


const handleCommand = (command) => {
  // ElMessage(`click on item ${command}`);
  if (store.customPrompt && command !== 'translate' && command !== 'format') {
    dialogFormVisible.value = true
    tmpCommand.value = command
  }
  else {
    do_command(command)
  }
  
}

const customPromptCommand = () => {
  dialogFormVisible.value = false
  do_command(tmpCommand.value)
}

const do_command = async (command) => {
  const dict = {
    'translate': '翻译',
    'polish': '润色',
    'continue': '续写',
    'summary': '摘要',
    'mindmap': '思维导图生成',
    'format': '整理',
    'chart': '图表生成'
  }
  if (editorInstance.value.command.getRangeText() === '')
    return ElMessage.warning('请先选择内容！')
  const msg = ElMessage({
    showClose: true,
    duration: 0,
    message: `正在进行${dict[command]}任务，请稍后...`
  })

  let result;
  try {
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
        content: toImproveText,
        prompt: form.prompt
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
      result = await axios.get(`/api4ai/mindmap?text=${toMindmapText}&prompt=${form.prompt}`)
      console.log(result);
      if (result.status === 200) {
        console.log(result.data.image_data_uri);
        resImageUri.value = result.data.image_data_uri
        resDialogVisible.value = true
      
        // editorInstance.value.command.executeInsertElementList([
        //   {
        //     width: result.data.width,
        //     height: result.data.height,
        //     type: 'image',
        //     value: result.data.image_data_uri
        //   }
        // ])
      }
    } else if (command === 'continue') {
      console.log('continue');
      const toContinueText = editorInstance.value.command.getRangeText()
      result = await axios.post('/api4ai/continuation', {
        content: toContinueText,
        prompt: form.prompt
      })
      console.log(result);
      if (result.status === 200 && result.data.status === "ok") {
        editorInstance.value.command.executeInsertElementList([
          {
            value: result.data.message
          }
        ])
      }
    } else if (command === 'summary') {
      console.log('summary');
      const toContinueText = editorInstance.value.command.getRangeText()
      result = await axios.post('/api4ai/summary', {
        content: toContinueText,
        prompt: form.prompt
      })
      console.log(result);
      if (result.status === 200 && result.data.status === "ok") {
        editorInstance.value.command.executeInsertElementList([
          {
            value: result.data.message
          }
        ])
      }
    } else if (command === 'format') {
      console.log('format');
      const toFormatText = editorInstance.value.command.getRangeText()
      result = await axios.post('/api4ai/format', {
        content: toFormatText
      })
      console.log(JSON.parse(result.data.message));
      if (result.status === 200 && result.data.status === "ok") {
        const format_json = JSON.parse(result.data.message)
        for (let i = 0; i < format_json.length; i++) {
          if (format_json[i].type === 'list') {
            format_json[i].listStyle = 'circle'
            format_json[i].listType = 'ul'
            for (let j = 0; j < format_json[i].valueList.length; j++) {
              if (format_json[i].valueList[j].value === '\\n') {
                format_json[i].valueList[j].value = '\n'
              }
            }
          }
        }
        editorInstance.value.command.executeInsertElementList(format_json)

      }
    } else if (command === 'chart') {
      console.log('chart');
      const toChartText = editorInstance.value.command.getRangeText()
      result = await axios.post('/api4ai/chart', {
        content: toChartText,
        prompt: form.prompt
      })
      console.log(result);
      if (result.status === 200) {
        resImageUri.value = result.data.image_data_uri
        resDialogVisible.value = true
        // let height, width;
        // function getImageSize(base64Image) {
        //   return new Promise((resolve, reject) => {
        //     let img = new Image();
        //     img.onload = function () {
        //       console.log(11111);
        //       editorInstance.value.command.executeInsertElementList([
        //         {
        //           width: this.width,
        //           height: this.height,
        //           type: 'image',
        //           value: base64Image
        //         }
        //       ])
        //       resolve({ width: this.width, height: this.height });
        //     };
        //     img.onerror = reject;
        //     img.src = base64Image;
        //     console.log(1);

            
        //   });
        // }
        // // console.log(result.data.image_data_uri);
        // getImageSize(result.data.img_data_uri)

      }
    }
  } catch (e) {
    msg.close()
    ElMessage.error('server error!')
    return
  }

  if (result.status === 200) {
    msg.close()
    ElMessage.success('操作成功')
  } else {
    msg.close()
    ElMessage.error(result.data.message)
  }
}


</script>

<template>
  <el-dialog v-model="resDialogVisible" @close="resDialogVisible = false" title="结果预览">
    <el-image :src="resImageUri"></el-image>
  </el-dialog>
  <el-dropdown @command="handleCommand">
    <el-button type="primary">
      <el-icon class="el-icon--left">
        <MagicStick />
      </el-icon>AI百宝箱<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="polish">润色</el-dropdown-item>
        <el-dropdown-item command="translate">翻译</el-dropdown-item>
        <el-dropdown-item command="continue">续写</el-dropdown-item>
        <el-dropdown-item command="summary">摘要</el-dropdown-item>
        <el-dropdown-item command="format">排版</el-dropdown-item>
        <el-dropdown-item command="chart">图表生成</el-dropdown-item>
        <el-dropdown-item command="mindmap">思维导图</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-dialog v-model="dialogFormVisible" title="自定义提示词" width="500" style="z-index: 9999;">
    <el-form :model="form">
      <el-form-item label="你的个性化需求：" :label-width="formLabelWidth">
        <el-input type="textarea" v-model="form.prompt" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="customPromptCommand">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>