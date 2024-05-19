<template>
  <div class="chatdialog" :class="{ 'hidden': !isDialogOpen }">
    <!-- <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="在线编辑" name="second">Config</el-tab-pane>
    </el-tabs> -->
    <div style="margin: 20px 10px 10px;display: flex; justify-content: space-between; align-items: center;">
      <h4>多媒体素材中心</h4>
      <!-- <el-image src="https://paper-store-1311634119.cos.ap-nanjing.myqcloud.com/cover.jpg"></el-image> -->
      <el-upload style="display: flex; justify-content: space-between; align-items: center;"
        :before-upload="beforeUpload" :show-file-list="false">
        <el-icon :size="20" style="margin-right: 10px; cursor: pointer;">
          <Plus />
        </el-icon>
      </el-upload>

    </div>

    <div class="divider" style="border: 1px solid #e6e6e6;"></div>
    <el-dialog v-model="materialDialogVisible" :title="previewedMaterial?.material_name" :width="previewedMaterial?.material_type === 'audio'? '50%' : '70%'"
      :z-index="9999">
    >
      <div style="display: flex; justify-content: center; align-items: center;">
        <div v-if="previewedMaterial?.material_type === 'audio'">
          <audio
            :src="'https:' + previewedMaterial?.source_file_url" controls></audio>
          <el-descriptions :column="1" border class="margin-top" style="width: 70%; margin: 10px auto 0;">
            <el-descriptions-item>
              <template #label>
                语音识别结果
              </template>
              {{ previewedMaterial?.material_info.result }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div v-if="previewedMaterial?.material_type === 'image'" style="display: flex; justify-content: space-between; align-items: center;">
          <el-image 
            :src="'https:' + previewedMaterial?.source_file_url" style="flex: 1;"></el-image>
          <div style="flex: 1;">
            <p v-for="text in previewedMaterial.material_info">{{ text.words }}</p>
          </div>
        </div>

        <div v-if="previewedMaterial?.material_type === 'pdf_file'" style="display: flex; justify-content: space-between; align-items: center;">

          <embed :src="'https:' + previewedMaterial?.source_file_url" style="flex: 1;"/>

          <div style="flex: 1;">
            <p v-for="text in previewedMaterial.material_info">{{ text.words }}</p>
          </div>
        </div>

        <div v-if="previewedMaterial?.material_type === 'video'">
          <video :src="previewedMaterial?.source_file_url" controls
            style="width: 100%;"></video>
        </div>

      </div>

    </el-dialog>
    <ElCard v-for="material in materialList" :key="material.id" style="margin: 10px;" shadow="hover">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>{{ material.material_name.length < 10 ? material.material_name : material.material_name.slice(0, 10)
            + '...' }}</span>
            <div style="display: flex; justify-content: space-between; align-items: center;">
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
    <beautiful-chat :participants="participants" :titleImageUrl="titleImageUrl" :onMessageWasSent="onMessageWasSent"
      :messageList="messageList" :newMessagesCount="newMessagesCount" :isOpen="isChatOpen" :open="openChat"
      :close="closeChat" :showEdition="true" :showLauncher="true" :deletionConfirmation="true" :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom" :disableUserListToggle="false" :messageStyling="messageStyling"
      @onType="handleOnType" @edit="editMessage" />
  </div>
</template>

<script setup>
import {Delete, Menu, Plus} from "@element-plus/icons-vue";
import {ElCard, ElDialog, ElMessage, ElMessageBox} from "element-plus";
import {onMounted, ref} from "vue";
import {afterCr, asr, ocr} from "@/utils/api4ai.js";
import axios from "axios";
import {store} from "@/store/index.js";


const chatInput = ref("");
const activeName = ref("ai");
const materialList = ref([])
const materialDialogVisible = ref(false)
const previewedMaterial = ref(null)

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
})

const submitChat = () => {
  console.log(chatInput.value);
};

const fileMaterialUpload = (command) => {
  if (command === 'file') {

  } else if (command === 'image') {

  } else if (command === 'audio') {

  } else if (command === 'video') {

  }
}

const beforeUpload = async (file) => {
  // file is material
  ElMessage.info('正在上传中...')
  // 判断文件是什么类型
  if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif') {
    // 图片
    const result = await ocr(file, 'image')
    if(result.status === 200 && result.data.status === 'ok') {
      await afterCr(file, result, materialList, 'image')
    }
    else{
      ElMessage.error('上传失败！')
    }
  }
  else if (file.type === 'audio/mp3' || file.type === 'audio/wav' || file.type === 'audio/ogg' || file.type === 'audio/mpeg') {
    // 判断音频时长
    const audio = new Audio(URL.createObjectURL(file));
    audio.addEventListener('loadedmetadata', async () => {
      const duration = audio.duration;
      if (duration > 50) {
        ElMessage.error('音频时长不能超过50秒');
      } else {
        const result = await asr(file)
        if(result.status === 200 && result.data.status === 'ok'){
          await afterCr(file, result, materialList, 'audio')
        }
        else{
          ElMessage.error('上传失败')
        }
      }
    });
  }
  else if (file.type === 'video/mp4' || file.type === 'video/avi' || file.type === 'video/flv') {
    // 视频
    console.log('视频');
  }
  else if (file.type === 'application/pdf') {
    // pdf文件
    const result = await ocr(file, 'pdf_file')
    if(result.status === 200 && result.data.status === 'ok') {
      await afterCr(file, result, materialList, 'pdf_file')
    }
    else{
      ElMessage.error('上传失败')
    }
  }

}

async function deleteMaterial(file_id, id){
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
          const res = await axios.delete(`/api/material?file_id=${file_id}&id=${id}`)
          const materials = await axios.get('/api/material', {
            params: {
              file_id: store.fileId
            }
          })
          materialList.value = materials.data

          msg.close()
          if(res.status === 200 && res.data.status === 'ok'){
            ElMessage.success('删除成功')
          }
          else {
            ElMessage.error('删除失败')
          }
        } catch (e) {
          console.log(e);
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

const participants = [
  {
    id: "user",
    name: "User",
    imageUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
  },
  {
    id: "chatbot",
    name: "Chatbot",
    imageUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
  },
];

const titleImageUrl = "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png";

const onMessageWasSent = (message) =>
  (messageList.value = [...messageList.value, message]);

const messageList = ref([
  {
    type: "text",
    author: `Chatbot`,
    authorIconUrl: "https://avatars3.githubusercontent.com/u/1915989?s=230&v=4",
    data: {
      text: `Hello! How can I help you?`,
    },
  },
]);

const newMessagesCount = ref(0);
const isChatOpen = ref(false);
const isDialogOpen = ref(true);
const showTypingIndicator = ref("");
const alwaysScrollToBottom = ref(false);
const messageStyling = ref(true);

const closeDialog = () => {
  isDialogOpen.value = false;
}

const colors = ref({
  header: {
    bg: "#4e8cff",
    text: "#ffffff",
  },
  launcher: {
    bg: "#4e8cff",
  },
  messageList: {
    bg: "#ffffff",
  },
  sentMessage: {
    bg: "#4e8cff",
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
  // called when the user clicks on the fab button to open the chat
  isChatOpen.value = true;
  newMessagesCount.value = 0;
};
const handleOnType = () => {
  console.log("Emit typing event");
};

const closeChat = () => {
  // called when the user clicks on the button to close the chat
  isChatOpen.value = false;
};

const toggleChat = () => {
  isChatOpen.value ? closeChat() : openChat();
};

const editMessage = (message) => {
  const m = messageList.value.find((m) => m.id === message.id);
  m.isEdited = true;
  m.data.text = message.data.text;
};
</script>

<style>
.chatdialog {
  width: 280px;
  height: 82.4%;
  position: fixed;
  right: 0;
  top: 90px;
  background-color: white;
  border-left: rgba(0, 0, 0, 0.08) solid 1px;
  transition: right 0.3s ease;
  overflow: scroll;
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

.sc-launcher,
.sc-open-icon,
.sc-closed-icon {
  position: fixed;
  bottom: 60px !important;
}

.sc-chat-window {
  top: 14.5% !important;
  right: 0.5% !important;
  width: 22.5% !important;
  height: 67.5% !important;
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