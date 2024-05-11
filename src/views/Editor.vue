<template>
  <Header></Header>
  <Menu></Menu>
  <div class="container">
    <Catalog></Catalog>
    <CanvasEditor></CanvasEditor>
    <chat-dialog-vue></chat-dialog-vue>
  </div>

  <Footer></Footer>
</template>

<script setup>
import Header from '@/components/editor/Header.vue';
import Menu from '@/components/editor/Menu.vue';
import Catalog from '@/components/editor/Catalog.vue';
import CanvasEditor from '@/components/editor/CanvasEditor.vue';
import Footer from '@/components/editor/Footer.vue';
import ChatDialogVue from '@/tools/ChatDialog.vue'
</script>

<style scoped>
#app {
  background-color: #f0f0f0 !important;
}
</style>