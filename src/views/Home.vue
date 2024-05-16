<template>
  <el-container class="common-layout">
    <common-aside />
    <el-container class="vertical-container">
      <common-header />
      <el-main>
        <!-- <router-view /> -->
        <h3 style="margin-left: 12px; margin-bottom: 10px;">最近使用</h3>
        <el-dialog v-model="renameDialogVisible" title="文件重命名">
          <el-input v-model="newFileName" placeholder="请输入新的文件名" />
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="renameDialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitNewName">
                确认
              </el-button>
            </div>
          </template>
        </el-dialog>
        <el-table :data="tableData" style="width: 100%" size="large">
          <el-table-column prop="name" label="文件名" width="450">
            <template #default="scope">
              <!-- <div style="display: flex; align-items: center; height: 30px;">
                <svg style="width: 20px; height: 20px;">
                  <use xlink:href="#icon-ppt"></use>
                </svg>
                <span style="margin-left: 10px;">{{ scope.row.name }}</span>
              </div> -->
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <FileName :filename="scope.row.name"></FileName>
                <div>
                  <el-icon @click="rename(scope.row)" class="file-control-icon">
                    <EditPen />
                  </el-icon>

                  <el-icon style="margin-left: 10px;" class="file-control-icon">
                    <Delete />
                  </el-icon>
                  <el-icon style="margin-left: 10px;" class="file-control-icon">
                    <Star />
                  </el-icon>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="创建者" width="150" />
          <el-table-column prop="last_modified_time" label="最近修改时间" width="300" />
          <el-table-column prop="file_size" label="文件大小" width="100" />
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
              <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)">分享</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import CommonHeader from "../components/home/CommonHeader.vue";
import CommonAside from "../components/home/CommonAside.vue";
import '../assets/font_icon/iconfont.js'
import {onMounted, ref, watch} from 'vue'
import axios from "axios";
import FileName from "@/components/home/FileIcon.vue";
import {Delete, EditPen, Star} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus";
import {store} from "@/store";
import {useRouter} from "vue-router";

const router = useRouter()

const renameDialogVisible = ref(false)
const currentRow = ref(null)

const newFileName = ref('')
watch(currentRow, (newVal, oldVal) => {
  newFileName.value = newVal.name
})

const submitNewName = async () => {
  const res = await axios.put(`/api/files/${currentRow.value.id}`, {
    name: newFileName.value
  })
  if (res.status === 200) {
    ElMessage.success('重命名成功')
    reqFileList()
    renameDialogVisible.value = false
  } else {
    ElMessage.error('重命名失败')
  }
}

const reqFileList = async () => {
  const res = await axios.get('/api/files')
  console.log(res);
  tableData.value = res.data.map(file => {
    return {
      ...file,
      last_modified_time: new Date(file.last_modified_time).toLocaleString(),
      file_size: (file.file_size / 1024 / 1024).toFixed(2) + 'MB'
    }
  })
}

const rename = (row) => {
  console.log(row);
  renameDialogVisible.value = true
  currentRow.value = row
}

const hoverTableItem = (row) => {
  console.log(row);
}

onMounted(() => {
  reqFileList()
})

const handleEdit = (index, row) => {
  console.log(row);
  store.editType = 'reditFile'
  store.fileId = row.id
  store.fileName = row.name
  store.fileContent = row.content
  router.push('/editor')
}

const tableData = ref([])
</script>

<style lang="less">
.vertical-container {
  // flex-wrap: wrap;
  flex-direction: column !important;
  // height: 100vh;
}

.common-layout {
  // height: 100vh;
  width: 100vw;
}

// .icon {
//   width: 10px;
//   height: 10px;
//   vertical-align: -0.15em;
//   fill: currentColor;
//   overflow: hidden;
// }
.file-control-icon:hover {
  cursor: pointer;
  color: #409eff;
}
#app, body {
  background-color: rgb(242,244,247);
}
</style>