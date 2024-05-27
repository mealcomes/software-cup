<script setup>
import '@/assets/font_icon/iconfont.js'
import {onMounted, ref} from 'vue'
import axios from "axios";
import FileName from "@/components/home/FileIcon.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {useRouter} from "vue-router";

const router = useRouter()

const tableData = ref([])



onMounted(async () => {
  await reqFileList()
})


const reqFileList = async () => {
  const res = await axios.get('/api/files')
  res.data = res.data.filter(file => file.is_deleted === 1)
  tableData.value = res.data.map(file => {
    if(file.file_size / 1024 >= 1024){
      file.file_size = (file.file_size / 1024 / 1024).toFixed(2) + "MB"
    }
    else {
      file.file_size = (file.file_size / 1024).toFixed(2) + 'kB'
    }
    return {
      ...file,
      last_modified_time: new Date(file.last_modified_time).toLocaleString(),
      file_size: file.file_size
    }
  })
}

const rebackFile = async (row) => {
  const req = await axios.put(`/api/files/${row.id}`, {
    is_deleted: 0
  })
  if(req.status === 200 && req.data.status === 'ok'){
    await reqFileList()
    ElMessage.success('还原成功')
  } else {
    ElMessage.error('还原失败')
  }
}

async function handleReback(row){
  ElMessageBox.confirm(
      '确定还原该文件？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        try {
          await rebackFile(row)
        } catch (e) {
          console.log(e.message)
          ElMessage.error('还原失败')
        }
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消还原！',
        })
      })
}


</script>

<template>
  <h3 style="margin-left: 12px; margin-bottom: 10px;">回收站</h3>
  <el-table :data="tableData" style="width: 100%" size="large">
    <el-table-column prop="name" label="文件名" width="450">
      <template #default="scope">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <FileName :filename="scope.row.name"></FileName>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="author" label="创建者" width="150" />
    <el-table-column prop="last_modified_time" label="最近修改时间" width="300" />
    <el-table-column prop="file_size" label="文件大小" width="100" />
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="success" @click="handleReback(scope.row)">还原</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped>
.cell span{
  user-select: none;
}

:deep(.cell span:hover){
  cursor: auto;
  color: rgb(96,98,102) !important;
}
</style>