<template>
  <el-container class="common-layout">
    <common-aside />
    <el-container class="vertical-container">
      <common-header />
      <el-main>
        <!-- <router-view /> -->
        <h3 style="margin-left: 12px; margin-bottom: 10px;">最近使用</h3>
        <el-table :data="tableData" style="width: 100%" size="large">
          <el-table-column prop="filename" label="文件名" width="300">
            <template #default="scope">
              <div style="display: flex; align-items: center; height: 30px;">
                <svg style="width: 20px; height: 20px;">
                  <use xlink:href="#icon-ppt"></use>
                </svg>
                <span style="margin-left: 10px;">{{ scope.row.filename }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建者" width="200" />
          <el-table-column prop="time" label="最近修改时间" width="300" />
          <el-table-column prop="filesize" label="文件大小" width="200" />
          <el-table-column  label="操作">
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
import CommonHeader from "./ComponentsHome/CommonHeader.vue";
import CommonAside from "./ComponentsHome/CommonAside.vue";
import '../assets/font_icon/iconfont.js'
const tableData = [
  {
    filename: '计算机视觉综合实验报告.docx',
    creator: '杨焱超',
    time: '2024-05-01 12:00',
    filesize: '1.3MB'
  },
  {
    filename: '计算机视觉综合实验报告.docx',
    creator: '杨焱超',
    time: '2024-05-01 12:00',
    filesize: '1.3MB'
  },
  {
    filename: '计算机视觉综合实验报告.docx',
    creator: '杨焱超',
    time: '2024-05-01 12:00',
    filesize: '1.3MB'
  },
  {
    filename: '计算机视觉综合实验报告.docx',
    creator: '杨焱超',
    time: '2024-05-01 12:00',
    filesize: '1.3MB'
  },
]
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
</style>