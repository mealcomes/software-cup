<script setup>
import '@/assets/font_icon/iconfont.js'
import {onMounted, ref} from 'vue'
import axios from "axios";
import FileName from "@/components/home/FileIcon.vue";
import {Delete, EditPen, Star, StarFilled} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus";
import {store} from "@/store";
import {useRouter} from "vue-router";

const router = useRouter()

const renameDialogVisible = ref(false)
const currentRow = ref(null)
const tableData = ref([])

const newFileName = ref('')


const submitNewName = async () => {
  try{
    const res = await axios.put(`/api/files/${currentRow.value.id}`, {
      name: newFileName.value
    })
    if (res.status === 200 && res.data.status === 'ok') {
      ElMessage.success('重命名成功')
      await reqFileList()
      renameDialogVisible.value = false
    } else {
      ElMessage.error('重命名失败')
    }
  }catch (e){
    console.log(e.message)
    ElMessage.error('重命名失败')
  }
}

onMounted(async () => {
  await reqFileList()
})


const reqFileList = async () => {
  const res = await axios.get('/api/files')
  store.globalFileList = res.data
  res.data = res.data.filter(file => file.is_deleted === 0 && file.is_template === 0)
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

const rename = (row) => {
  renameDialogVisible.value = true
  currentRow.value = row
  newFileName.value = row.name
}

const deleteFile = async (row) => {
  const req = await axios.put(`/api/files/${row.id}`, {
    is_deleted: 1,
    star_type: 0
  })
  if(req.status === 200 && req.data.status === 'ok'){
    await reqFileList()
    ElMessage.success('删除成功')
  } else {
    ElMessage.error('删除失败')
  }
}

async function handleDelete(index, row){
  ElMessageBox.confirm(
      '确定删除该文件？',
      'Warning',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        try {
          await deleteFile(row)
        } catch (e) {
          console.log(e.message)
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

async function handleCollection(row){
  try{
    const req = await axios.put(`/api/files/${row.id}`, {
      star_type: row.star_type === 0 ? 1 : 0
    })
    if (req.status === 200 && req.data.status === 'ok') {
      row.star_type = (row.star_type === 0 ? 1 : 0)
      ElMessage.success(row.star_type === 1 ? '收藏成功!' : '取消收藏成功!')
      // await reqFileList()
    } else {
      ElMessage.error(row.star_type === 1 ? '收藏失败!' : '取消收藏失败!')
    }
  }catch(e){
    console.log(e.message)
    ElMessage.error(row.star_type === 1 ? '收藏失败!' : '取消收藏失败!')
  }
}

const handleEdit = (index, row) => {
  store.editType = 'reditFile'
  store.fileId = row.id
  store.fileName = row.name
  store.fileContent = row.content
  router.push('/editor')
}
</script>

<template>
  <h3 style="margin-left: 12px; margin-bottom: 10px;">最近使用</h3>
  <el-dialog v-model="renameDialogVisible" title="文件重命名">
    <el-input v-model="newFileName" placeholder="请输入新的文件名" />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" autofocus @click="submitNewName">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-table :data="tableData" style="width: 100%" size="large">
    <el-table-column prop="name" label="文件名" width="450">
      <template #default="scope">
<!--                       <div style="display: flex; align-items: center; height: 30px;">-->
<!--                        <svg style="width: 20px; height: 20px;">-->
<!--                          <use xlink:href="#icon-ppt"></use>-->
<!--                        </svg>-->
<!--                        <span style="margin-left: 10px;">{{ scope.row.name }}</span>-->
<!--                      </div>-->
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <FileName :filename="scope.row.name" title="点击进入编辑" @click="handleEdit(scope.$index, scope.row)"></FileName>
          <div>
            <el-icon @click="rename(scope.row)" title="重命名" class="file-control-icon">
              <EditPen />
            </el-icon>

            <el-icon @click="handleDelete(scope.$index, scope.row)" title="删除" style="margin-left: 10px;" class="file-control-icon">
              <Delete />
            </el-icon>
            <el-icon style="margin-left: 10px;" @click="handleCollection(scope.row)" title="收藏" class="file-control-icon">
              <Star v-if="scope.row.star_type === 0" />
              <StarFilled v-else />
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
        <el-button size="small" type="success" @click="console.log(scope)">分享</el-button>
        <!--              <el-button size="small" type="success" @click="handleDelete(scope.$index, scope.row)">分享</el-button>-->
      </template>
    </el-table-column>
  </el-table>
</template>

<style lang="less">
.cell span{
  user-select: none;
}

.cell span:hover{
  cursor: pointer;
  color: #409eff;
}

.file-control-icon:hover {
  cursor: pointer;
  color: #409eff;
}
</style>