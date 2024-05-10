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
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';
import Catalog from '@/components/Catalog.vue';
import CanvasEditor from '@/components/CanvasEditor.vue';
import Footer from '@/components/Footer.vue';
import ChatDialogVue from '@/tools/ChatDialog.vue'
</script>

<style scoped>
#app {
  background-color: #f0f0f0 !important;
}
</style>