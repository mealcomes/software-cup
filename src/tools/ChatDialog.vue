<template>
  <div class="chatdialog" :class="{'hidden': !isDialogOpen}">
    <!-- <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="在线编辑" name="second">Config</el-tab-pane>
    </el-tabs> -->
    <div style="margin: 10px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center;">
      <h3>在线编辑成员</h3>
      <el-icon :size="20" style="margin-right: 10px; cursor: pointer;" @click="closeDialog"><CloseBold /></el-icon>
    </div>
    
    <div class="divider" style="border: 1px solid #e6e6e6;"></div>
    <!-- <el-divider style=""></el-divider> -->
    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :open="openChat"
      :close="closeChat"
      :showEdition="true"
      :showLauncher="true"
      :deletionConfirmation="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage"
    />
  </div>
</template>

<script setup>
import { Search, VideoPlay, VideoPause, CloseBold } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
const chatInput = ref("");
const activeName = ref("ai");

onMounted(() => {
  const chatty = document.querySelector('.sc-user-input--text')
  chatty.setAttribute('placeholder', '请输入您的问题')
})

const submitChat = () => {
  console.log(chatInput.value);
};

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

const titleImageUrl =
  "https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png";

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
  // called when the user clicks on the botton to close the chat
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
  border-left: rgba(0, 0, 0, 0.08) solid 0.8px;
  transition: right 0.3s ease;
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
</style>