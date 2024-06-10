<template>
  <div class="chatdialog" :class="{ 'hidden': !isDialogOpen }">
    <!--     <el-tabs v-model="activeName" class="demo-tabs">-->
    <!--      <el-tab-pane label="在线编辑" name="second">Config</el-tab-pane>-->
    <!--    </el-tabs>-->
    <div style="margin: 20px 10px 10px;display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center; margin-right: 10px;">
        <el-icon ><Orange /></el-icon>
      <h4 style="margin-left: 10px;"> 多媒体素材中心</h4>

      </div>
      
      <!-- <el-image src="https://paper-store-1311634119.cos.ap-nanjing.myqcloud.com/cover.jpg"></el-image> -->
      <el-upload style="display: flex; justify-content: space-between; align-items: center;"
        :before-upload="beforeUpload" :show-file-list="false">
        <el-icon :size="20" style="margin-right: 10px; cursor: pointer;">
          <CirclePlus />
        </el-icon>
      </el-upload>
    </div>

    <!-- <div class="divider" style="border: 0.1px solid #e6e6e6;"></div> -->
    <el-divider style="margin-top: 5px; margin-bottom: 10px;"></el-divider>

    <el-dialog v-model="materialDialogVisible" :title="previewedMaterial?.material_name"
      :width="previewedMaterial?.material_type === 'audio' ? '50%' : '70%'" :z-index="9999">

      <div style="display: flex; justify-content: center; align-items: center;">
        <div v-if="previewedMaterial?.material_type === 'audio'">
          <audio :src="'https:' + previewedMaterial?.source_file_url" controls></audio>
          <el-descriptions :column="1" border class="margin-top" style="width: 70%; margin: 10px auto 0;">
            <el-descriptions-item>
              <template #label>
                语音识别结果
              </template>
              {{ previewedMaterial?.material_info }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div v-if="previewedMaterial?.material_type === 'image'"
          style="display: flex; justify-content: space-between; align-items: center;">
          <el-image :src="'https:' + previewedMaterial?.source_file_url" style="flex: 1;"></el-image>
          <div style="flex: 1;">
            <p v-for="text in previewedMaterial.material_info">{{ text.words }}</p>
          </div>
        </div>

        <div v-if="previewedMaterial?.material_type === 'pdf_file'"
          style="display: flex; justify-content: space-between; align-items: center;">

          <!-- <embed :src="'https:' + previewedMaterial?.source_file_url" style="flex: 1;"/> -->

          <!-- <div style="flex: 1;">
            <p v-for="text in previewedMaterial.material_info">{{ text.words }}</p>
          </div> -->
          <VuePdfEmbed annotation-layer text-layer :width="700" :source="'https:' + previewedMaterial?.source_file_url">
          </VuePdfEmbed>
        </div>

        <div v-if="previewedMaterial?.material_type === 'video'">
          <video :src="previewedMaterial?.source_file_url" controls style="width: 100%;"></video>
        </div>

      </div>
    </el-dialog>

    <el-checkbox-group v-model="pickedMaterialList" @change="pickedMtChange">
      <ElCard v-for="(material, index) in materialList" :key="material.id" style="margin: 10px; margin-top: 0;"
        shadow="hover">

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <el-checkbox
            :label="material.material_name.length < 10 ? material.material_name : material.material_name.slice(0, 10) + '...'"
            :value="index"></el-checkbox>
          <!-- <span>{{
            material.material_name.length < 10 ? material.material_name : material.material_name.slice(0, 10) + '...'
          }}</span> -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <el-icon :size="15" style="margin-right: 10px; cursor: pointer;" class="material_icon">
              <Document v-if="material.material_type === 'pdf_file'" />
              <VideoCamera v-if="material.material_type === 'video'" />
              <Headset v-if="material.material_type === 'audio'" />
              <Picture v-if="material.material_type === 'image'" />
            </el-icon>
            <el-icon :size="15" style="margin-right: 10px; cursor: pointer;" class="material_icon"
              @click="previewMaterial(material)">
              <Menu />
            </el-icon>
            <el-icon :size="15" style="margin-right: 10px; cursor: pointer;" class="material_icon"
              @click="deleteMaterial(store.fileId, material.id)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </ElCard>
      <!-- <el-divider style=""></el-divider> -->
    </el-checkbox-group>

    <beautiful-chat :participants="participants" :titleImageUrl="titleImageUrl" :onMessageWasSent="onMessageWasSent"
      :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :open="openChat"
      :close="closeChat" :showEdition="true" :showDeletion="true" :showLauncher="true" :showFile="true"
      :deletionConfirmation="true" :colors="colors" :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="true" :messageStyling="messageStyling" @onType="handleOnType" @edit="editMessage">
      <template v-slot:header>
        AI小助手
      </template>
    </beautiful-chat>
  </div>
</template>

<script setup>
import { Delete, Menu, Plus, VideoCamera, Headset, Picture, Document, Orange, CirclePlus} from "@element-plus/icons-vue";
import { ElCard, ElDialog, ElMessage, ElMessageBox } from "element-plus";
import { onMounted, ref, watch } from "vue";
import { afterCr, asr, ocr } from "@/utils/api4ai.js";
import axios from "axios";
import { editorInstance, store } from "@/store/index.js";
import VuePdfEmbed from "vue-pdf-embed";
import 'vue-pdf-embed/dist/style/index.css'

// optional styles
import 'vue-pdf-embed/dist/style/annotationLayer.css'
import 'vue-pdf-embed/dist/style/textLayer.css'

const page = ref(1)

const chatInput = ref("");
const vecstorePrompt = ref("")
const activeName = ref("ai");
const materialList = ref([])
const materialDialogVisible = ref(false)
const previewedMaterial = ref(null)
const pickedMaterialList = ref([])
const pickedMtChange = async (val) => {
  // console.log(val.map(item => materialList.value[item]));
  const mtNameList = val.map(item => materialList.value[item].material_name).join(", ");
  const ids = val.map(item => materialList.value[item].id).join(',')
  console.log(pickedMaterialList.value);
  // const res = await axios.get('/api4ai/chroma', {
  //   params: {
  //     file_id: store.fileId,
  //     material_id: ids,
  //     text: editorInstance.value.command.getRangeText()
  //   }
  // })
  // console.log(res);
  // vecstorePrompt.value = res.data.documents.join('\n')
  messageList.value = messageList.value.map((item, idx) => {
    if (idx === 0) {
      return {
        type: "text",
        author: `Chatbot`,
        authorIconUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
        data: {
          text: `已选择${mtNameList}`,
        }
      }
    }
    else return item
  })
}


const isResponding = ref(false)
const messagesRequest = ref([]);
const newMessagesCount = ref(0);
const isChatOpen = ref(false);
const isDialogOpen = ref(true);
const showTypingIndicator = ref("");
const alwaysScrollToBottom = ref(true);
const messageStyling = ref(true);
const titleImageUrl = "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png";
const messageList = ref([
  {
    type: "text",
    author: `Chatbot`,
    authorIconUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
    data: {
      text: `Hello! How can I help you?`,
      file: {
        name: '111',
        url: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      }
    },
  },
]);
const participants = [
  {
    id: "user",
    name: "User",
    imageUrl: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
  },
  {
    id: "chatbot",
    name: "Chatbot",
    imageUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
  },
];
const colors = ref({
  header: {
    bg: "rgb(64,158,255)",
    text: "#ffffff",
  },
  launcher: {
    bg: "rgb(64,158,255)",
  },
  messageList: {
    bg: "#ffffff",
  },
  sentMessage: {
    bg: "rgb(64,158,255)",
    text: "#ffffff",
  },
  receivedMessage: {
    bg: "#eaeaea",
    text: "#222222",
  },
  userInput: {
    bg: "#f4f7f9",
    text: "#565861",
  },
});

const previewMaterial = (material) => {
  console.log(material);
  materialDialogVisible.value = true
  previewedMaterial.value = material
}

onMounted(async () => {
  const chatty = document.querySelector('.sc-user-input--text')
  chatty.setAttribute('placeholder', '请输入您的问题')
  const materials = await axios.get(`/api/material?file_id=${store.fileId}`)
  console.log(materials);
  materialList.value = materials.data

  const textArea = document.querySelector('.ce-page-container')
  textArea.addEventListener('mouseup', function () {
    let content = editorInstance.value.command.getRangeText()
    if (content !== '') {
      let input = document.querySelector('.sc-user-input--text')
      input.innerHTML = content
    }
  });
})

const submitChat = () => {
  console.log(chatInput.value);
};

const beforeUpload = async (file) => {
  // file is material
  ElMessage.info('正在上传中...')
  // 判断文件是什么类型
  if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
    // 图片
    const result = await ocr(file, 'image')
    if (result.status === 200 && result.data.status === 'ok') {
      await afterCr(file, result, materialList, 'image')
    } else {
      ElMessage.error('上传失败！')
    }
  } else if (file.type === 'audio/mp3' || file.type === 'audio/wav' || file.type === 'audio/ogg' || file.type === 'audio/mpeg') {
    // 判断音频时长
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', async () => {
      const duration = audio.duration;
      if (duration > 50) {
        ElMessage.error('音频时长不能超过50秒');
      } else {
        const result = await asr(file)
        if (result.status === 200 && result.data.status === 'ok') {
          await afterCr(file, result, materialList, 'audio')
        } else {
          ElMessage.error('上传失败')
        }
      }
    });
  } else if (file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/flv') {
    // 视频
    console.log('视频');
  } else if (file.type === 'application/pdf') {
    // pdf文件
    const result = await ocr(file, 'pdf_file')
    if (result.status === 200 && result.data.status === 'ok') {
      await afterCr(file, result, materialList, 'pdf_file')
    } else {
      ElMessage.error('上传失败')
    }
  }

}

async function deleteMaterial(file_id, id) {
  ElMessageBox.confirm(
    '确定删除该素材？',
    'Warning',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const msg = ElMessage({
        showClose: true,
        duration: 0,
        message: `删除中，请稍后...`
      })
      try {
        const deleteFileInfo = await axios.post('/api/delete', {
          id: id
        })
        if (deleteFileInfo.status === 200 && deleteFileInfo.data.status === 'ok') {
          const res = await axios.delete(`/api/material?file_id=${file_id}&id=${id}`)

          msg.close()
          if (res.status === 200 && res.data.status === 'ok') {
            ElMessage.success('删除成功')
          } else {
            ElMessage.error('删除失败')
          }
          const materials = await axios.get('/api/material', {
            params: {
              file_id: store.fileId
            }
          })
          materialList.value = materials.data
        } else {
          msg.close()
          ElMessage.error('删除失败')
        }

      } catch (e) {
        console.log(e);
        msg.close()
        ElMessage.error('删除失败')
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除！',
      })
    })
}


const onMessageWasSent = async (message) => {
  if (!isResponding.value) {
    messageList.value = [...messageList.value, message]
    messagesRequest.value.push({ 'role': 'user', 'content': message.data.text })
  }
}

//监听消息列表
watch(messageList, async (newList, oldValue) => {
  let message = newList[newList.length - 1]
  if (message.author === 'Chatbot')
    return;
  isResponding.value = true;
  // let tmp = document.getElementsByClassName('sc-user-input');
  // let form = tmp[0]
  // if (!form) {
  //   console.error('表单未找到');
  //   return;
  // }
  // // 遍历表单内的所有元素
  // for (let i = 0; i < form.elements.length; i++) {
  //   // 设置每个元素的disabled属性为true
  //   console.log(i, form.elements[i].disabled)
  //   form.elements[i].disabled = true;
  // }
  // let input = document.getElementsByClassName('sc-user-input')
  // console.log(input[0])
  // console.log(input[0].disabled)
  // console.log('前：', input[0].disabled)
  // input[0].disabled = true
  // console.log('后：', input[0].disabled)
  const ids = pickedMaterialList.value.map(item => materialList.value[item].id).join(',')
  const res = await axios.get('/api4ai/chroma', {
    params: {
      file_id: store.fileId,
      material_id: ids,
      text: messagesRequest.value[messagesRequest.value.length-1].content
    }
  })
  console.log(res);
  vecstorePrompt.value = res.data.content.documents.join('\n')
  // messagesRequest.
  try {
    let response = await fetch('/api4ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: messagesRequest.value,
        prompt: "这是背景知识，你可以选择性的使用这些知识来回答用户的问题：\n" + vecstorePrompt.value
      })
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const reader = response.body.getReader();
    const textDecoder = new TextDecoder();
    let result = true;
    let output = ''
    let flag = false
    while (result) {
      const { done, value } = await reader.read();

      if (done) {
        result = false;
        break;
      }
      const chunkText = textDecoder.decode(value);
      output += chunkText;
      if (!flag) {
        messageList.value.push({
          type: "text",
          author: `Chatbot`,
          authorIconUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
          data: {
            text: chunkText
          },
        },)
        flag = !flag
      } else {
        messageList.value[messageList.value.length - 1].data.text += chunkText
      }
    }
    if (!isChatOpen.value)
      newMessagesCount.value += 1
    messagesRequest.value.push({ 'role': 'assistant', 'content': output })
  } catch (e) {
    messageList.value.push({
      type: "text",
      author: `Chatbot`,
      authorIconUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
      data: {
        text: "服务器错误，请稍后重试!"
      },
    },)
    messagesRequest.value.splice(0)
  } finally {
    isResponding.value = false
    // input[0].disabled = false
  }
})

const sentMessage = (text) => {
  if (text.length > 0) {
    newMessagesCount.value = isChatOpen.value
      ? newMessagesCount.value
      : newMessagesCount.value + 1;
    onMessageWasSent({
      author: `me`,
      type: "text",
      data: {
        text,
      },
    });
  }
};

const openChat = () => {
  isChatOpen.value = true;
  newMessagesCount.value = 0;
};
const handleOnType = () => {
  console.log("Emit typing event");
};

const closeChat = () => {
  isChatOpen.value = false;
};

const toggleChat = () => {
  isChatOpen.value ? closeChat() : openChat();
};

const editMessage = (message) => {
  console.log('editMessage')
  const m = messageList.value.find((m) => m.id === message.id);
  m.isEdited = true;
  m.data.text = message.data.text;
};
</script>

<style>
.chatdialog {
  width: 280px;
  height: 84.6%;
  position: fixed;
  right: 0;
  top: 90px;
  background-color: white;
  border-left: rgba(0, 0, 0, 0.08) solid 1px;
  transition: right 0.3s ease;
  overflow: scroll;
  /* padding: 0; */
}

.hidden {
  right: -280px;
}

.chatdialog .el-tabs__header {
  margin: 0;
}

.chatdialog .el-tabs__item {
  font-size: 14px;
  font-weight: 500;
  color: #909399;
}

.chatdialog .el-tabs__item.is-active {
  color: #409eff;
}

.chatdialog::-webkit-scrollbar {
  display: none;
}

.sc-launcher,
.sc-open-icon,
.sc-closed-icon {
  position: fixed;
  bottom: 60px !important;
  left: 30px !important;
}

.sc-chat-window {
  top: 14.5% !important;
  left: 0.5% !important;
  width: 350px !important;
  height: 67.5% !important;
  z-index: 999;
}

.sc-header {
  min-height: 10% !important;
}

.sc-message--text {
  font-size: 14px;
  font-weight: 400;
  color: #303133;
}

.sc-message--text:hover {
  color: #409eff;
  cursor: pointer;
}

.material_icon:hover {
  color: #409eff
}

.sc-message--text:active {
  color: #66b1ff;
}

.sc-message--text:visited {
  color: #9093
}
</style>