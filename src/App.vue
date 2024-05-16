<script setup>

// export default {
//   components: {
//     CanvasEditor: CanvasEditor,
//     Menu: Menu,
//     Catalog: Catalog,
//     Footer: Footer,
//     ArrowDown: ArrowDown,
//     Header,
//     ChatDialogVue,
//     Home
//   },
//   methods: {
//     handleClick() {
//       console.log(1);
//       const dropDownDom = document.querySelector(".el-dropdown__popper");
//       dropDownDom.style.display = "fixed";
//     },
//   },
// };
</script>

<template>
  <RouterView></RouterView>
</template>

<style>
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
