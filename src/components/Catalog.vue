<script setup>
</script>

<template>
  <div class="catalog" editor-component="catalog">
    <div class="catalog__header">
      <span>目录</span>
      <div class="catalog__header__close">
        <i></i>
      </div>
    </div>
    <div class="catalog__main"></div>
  </div>
</template>

<style>
.catalog {
  width: 220px;
  position: fixed;
  left: 10px;
  bottom: 80px;
  top: 120px;
  background: #F2F4F7;
  padding: 0 20px 40px 20px;
  border-radius: 5px;
}

.catalog .catalog__header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e6ed;
}

.catalog .catalog__header span {
  color: #3d4757;
  font-size: 14px;
  font-weight: bold;
}

.catalog .catalog__header i {
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: inline-block;
  background: url(../assets/images/close.svg) no-repeat;
  transition: all 0.2s;
}

.catalog .catalog__header>div:hover {
  background: rgba(235, 238, 241);
}

.catalog .catalog__main {
    height: calc(100% - 60px);
    padding: 10px 0;
    overflow-y: auto;
    overflow-x: hidden;
}

.catalog .catalog__main .catalog-item {
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;
}

.catalog .catalog__main>.catalog-item {
    padding-left: 0;
}

.catalog .catalog__main .catalog-item .catalog-item__content {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.catalog .catalog__main .catalog-item .catalog-item__content:hover>span {
    color: #4991f2;
}

.catalog .catalog__main .catalog-item .catalog-item__content span {
    color: #3d4757;
    line-height: 30px;
    font-size: 12px;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
}

</style>