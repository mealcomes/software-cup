<script>
import CanvasEditor from "@/components/CanvasEditor.vue";
import Menu from "@/components/Menu.vue";
import Catalog from "@/components/Catalog.vue";
import Footer from "@/components/Footer.vue";
import { ArrowDown } from "@element-plus/icons-vue";
import Header from "./components/Header.vue";
import Dropdown from "v-dropdown";
import ChatDialogVue from './tools/ChatDialog.vue';
export default {
  components: {
    CanvasEditor: CanvasEditor,
    Menu: Menu,
    Catalog: Catalog,
    Footer: Footer,
    ArrowDown: ArrowDown,
    Header,
    ChatDialogVue
  },
  methods: {
    handleClick() {
      console.log(1);
      const dropDownDom = document.querySelector(".el-dropdown__popper");
      dropDownDom.style.display = "fixed";
    },
  },
};
</script>

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

<style scoped>
.container {
  margin: 120px;
}
.example-showcase .el-dropdown + .el-dropdown {
  margin-left: 15px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
