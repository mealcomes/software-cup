<script>
  import CanvasEditor from '@/components/CanvasEditor.vue'
  import Menu from '@/components/Menu.vue'
  import Catalog from "@/components/Catalog.vue";
  import Footer from "@/components/Footer.vue";
  export default {
    components: {
      CanvasEditor: CanvasEditor,
      Menu: Menu,
      Catalog: Catalog,
      Footer: Footer
    }
  }
</script>

<template>
  <Menu></Menu>
  <div class="container">
    <Catalog></Catalog>
    <CanvasEditor></CanvasEditor>
  </div>
  <Footer></Footer>
</template>

<style scoped>
.container{
  margin: 80px;
}
</style>
