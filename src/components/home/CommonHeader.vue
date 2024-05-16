<template>
  <el-header
    style="border-bottom: 0.8px solid rgb(220, 223, 230); height: 80px; padding-left: 30px; padding-right: 30px;">
    <div class='l-content' plain>
      <!-- 图标的展示 -->
      <!-- <el-image src="https://paper-store-1311634119.cos.ap-nanjing.myqcloud.com/test1-jpg?q-sign-algorithm=sha1&q-ak=AKID8w1lJKV4DFrxG1lbaPduknMS0RY8bkGukbt8cZoEhZIAHFm1Okjxl59qIkrzBLhg&q-sign-time=1715260160;1715263760&q-key-time=1715260160;1715263760&q-header-list=host&q-url-param-list=&q-signature=af684c13bb42e537e5efcd5e782c1e5cd31c1850&x-cos-security-token=CPFToFG8TzwYoFQJRUVXmOYXtRJ6Disaf0ba42c774af8c94408cab64140c00a0N78_Z1hWHZybRNZUa68HDsPT70om0oll9i0lV3N5exV0p3A0Qrp67I5uG3X00Dcx4Q4PHpoy2Kg2Yv6Hbvu72lFd6rj3YB1jG0SMPlhLlGdbE9n20nz8H913CDCFnZ_9G0Sb2IAyZFt9T_YHbbT37N0kA1u_Bwh7GxFXPYGOTwTi5IrACQdpOhigKC2DDxvn"></el-image> -->
      <el-dropdown trigger="click" :on-change="onFileUploaded" @command="newCommand">
        <el-button :icon="Plus" type="primary" size="">
          新建
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="doc">文档</el-dropdown-item>
            <el-dropdown-item command="table">表格</el-dropdown-item>
            <el-dropdown-item command="ppt">幻灯片</el-dropdown-item>
            <el-dropdown-item command="md">Markdown</el-dropdown-item>
          </el-dropdown-menu>
        </template>

      </el-dropdown>

      <el-upload :show-file-list="false" :on-success="handleSuccess" :before-upload="beforeUpload"
        :headers="headers" :limit="1" v-model:file-list="uploadFileList" accept=".xls,.xlsx,.doc,.docx,.ppt,.pptx,.md">
        <el-button :icon="Plus" type="success">
          导入
        </el-button>
      </el-upload>
      <el-button :icon="Money" @click="templateVisible = true">
        模板库
      </el-button>
      <el-dialog v-model="templateVisible" title="模板库" width="50%" style="height: 70%;">
        <el-button type="primary" style="margin-bottom: 10px;">新建模板</el-button>
        <div style="display: flex; justify-content: space-between;">
          <el-card style="width: 30% " shadow="hover">
            <file-name filename="123.xls"></file-name>
          </el-card>
          <el-card style="width: 30% " shadow="hover">
            <file-name filename="123.docx"></file-name>
          </el-card>
          <el-card style="width: 30% " shadow="hover">
            <file-name filename="123.ppt"></file-name>
          </el-card>
        </div>
      </el-dialog>
    </div>

    <div class='r-content'>
      <el-button class='vip' type="primary" :icon="Present" plain>
        开通超级会员
      </el-button>

      <el-dropdown>
        <span class="el-dropdown-link">
          <el-avatar shape="square" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            :size="32"></el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>切换账号</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
            <el-dropdown-item>会员中心</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-header>
</template>

<script setup>
import {Money, Plus, Present} from '@element-plus/icons-vue'
import {ref} from 'vue'
import FileName from './FileIcon.vue'
import {useRouter} from "vue-router";
import {store} from '@/store/index.js';
import mammoth from 'mammoth';
import axios from 'axios';
import {ElMessage} from 'element-plus';

const newCommand = async (command) => {
  if (command === 'doc') {
    const res = await axios.post('/api/files', {
      name: '未命名文件.docx',
      content: {
        header: [],
        main: [{value: ''}],
        footer: []
      },
      author: 'Asuka',
      file_size: 0
    })
    console.log(res);
    if (res.status === 201) {
      ElMessage({
        message: '新建成功',
        type: 'success',
      })
      store.fileId = res.data.id
      store.fileName = res.data.name
      store.editType = 'newFile'
      await router.push('/editor')
    } else {
      ElMessage({
        message: '新建失败',
        type: 'error',
      })
    }
    
  }
}

const router = useRouter();

const templateVisible = ref(false)
const uploadFileList = ref([])
const headers = ref({
  Authorization: 'Bearer ' + localStorage.getItem('token')
})

const handleSuccess = (response, file, fileList) => {
  // console.log(response, file, fileList)
  // store.fileToConvert = file
  // router.push({
  //   name: 'Editor',
  // })
}

const convert = async (file) => {
  const result = await mammoth.convertToHtml({
    arrayBuffer: file
  })
  console.log(result.value);
}

const beforeUpload = (file) => {
  console.log(file)
  convert(file)
  store.fileToConvert = file
  store.editType = 'docxFile'
  router.push({
    name: 'Editor',
  })
  return true
}

const onFileUploaded = (file) => {
  console.log(file)
}

</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  // background-color: #6495ED;
}

.l-content {
  display: flex;
  align-items: center;

  .el-button {
    margin-right: 20px;
  }
}

.r-content {
  width: 200px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>