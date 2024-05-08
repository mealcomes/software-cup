<script setup>

</script>

<template>
  <div class="footer" editor-component="footer">
    <div>
      <div class="catalog-mode" title="目录">
        <i></i>
      </div>
      <div class="page-mode">
        <i title="页面模式(分页、连页)"></i>
        <div class="options">
          <ul>
            <li data-page-mode="paging" class="active">分页</li>
            <li data-page-mode="continuity">连页</li>
          </ul>
        </div>
      </div>
      <span>可见页码：<span class="page-no-list">1</span></span>
      <span>页面：<span class="page-no">1</span>/<span class="page-size">1</span></span>
      <span>字数：<span class="word-count">0</span></span>
    </div>
    <div class="editor-mode" title="编辑模式(编辑、清洁、只读、表单)">编辑模式</div>
    <div>
      <div class="page-scale-minus" title="缩小(Ctrl+-)">
        <i></i>
      </div>
      <span class="page-scale-percentage" title="显示比例(点击可复原Ctrl+0)">100%</span>
      <div class="page-scale-add" title="放大(Ctrl+=)">
        <i></i>
      </div>
      <div class="paper-size">
        <i title="纸张类型"></i>
        <div class="options">
          <ul>
            <li data-paper-size="794*1123" class="active">A4</li>
            <li data-paper-size="1593*2251">A2</li>
            <li data-paper-size="1125*1593">A3</li>
            <li data-paper-size="565*796">A5</li>
            <li data-paper-size="412*488">5号信封</li>
            <li data-paper-size="450*866">6号信封</li>
            <li data-paper-size="609*862">7号信封</li>
            <li data-paper-size="862*1221">9号信封</li>
            <li data-paper-size="813*1266">法律用纸</li>
            <li data-paper-size="813*1054">信纸</li>
          </ul>
        </div>
      </div>
      <div class="paper-direction">
        <i title="纸张方向"></i>
        <div class="options">
          <ul>
            <li data-paper-direction="vertical" class="active">纵向</li>
            <li data-paper-direction="horizontal">横向</li>
          </ul>
        </div>
      </div>
      <div class="paper-margin" title="页边距">
        <i></i>
      </div>
      <div class="fullscreen" title="全屏显示">
        <i></i>
      </div>
      <div class="editor-option" title="编辑器设置">
        <i></i>
      </div>
    </div>
  </div>
</template>

<style>
.footer {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  z-index: 9;
  position: fixed;
  bottom: 0;
  left: 0;
  font-size: 12px;
  padding: 0 4px 0 20px;
  box-sizing: border-box;
  border-top: rgba(0, 0, 0, 0.08) solid 0.8px;
}

.footer>div:first-child {
  display: flex;
  align-items: center;
}

.footer .catalog-mode {
  padding: 1px;
  position: relative;
}

.footer .catalog-mode i {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  cursor: pointer;
  display: inline-block;
  background-image: url('../assets/images/catalog.svg');
}

.footer .page-mode {
  padding: 1px;
  position: relative;
}

.footer .page-mode i {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  cursor: pointer;
  display: inline-block;
  background-image: url('../assets/images/page-mode.svg');
}

.footer .options {
  width: 70px;
  position: absolute;
  left: 0;
  bottom: 25px;
  padding: 10px;
  background: #fff;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgb(56 56 56 / 20%);
  border: 1px solid #e2e6ed;
  border-radius: 2px;
  display: none;
}

.footer .options.visible {
  display: block;
}

.footer .options li {
  padding: 5px;
  margin: 5px 0;
  user-select: none;
  transition: all .3s;
  text-align: center;
  cursor: pointer;
}

.footer .options li:hover {
  background-color: #ebecef;
}

.footer .options li.active {
  background-color: #e2e6ed;
}

.footer>div:first-child>span {
  display: inline-block;
  margin-right: 5px;
  letter-spacing: 1px;
}

.footer>div:last-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer>div:last-child>div {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer>div:last-child>div:hover {
  background: rgba(25, 55, 88, .04);
}

.footer>div:last-child i {
  width: 16px;
  height: 16px;
  display: inline-block;
  cursor: pointer;
}

.footer .editor-option i {
  background-image: url('../assets/images/option.svg');
}

.footer .page-scale-minus i {
  background-image: url('../assets/images/page-scale-minus.svg');
}

.footer .page-scale-add i {
  background-image: url('../assets/images/page-scale-add.svg');
}

.footer .page-scale-percentage {
  cursor: pointer;
  user-select: none;
}

.footer .fullscreen i {
  background-image: url('../assets/images/request-fullscreen.svg');
}

.footer .fullscreen.exist i {
  background-image: url('../assets/images/exit-fullscreen.svg');
}

.footer .paper-margin i {
  background-image: url('../assets/images/paper-margin.svg');
}

.footer .editor-mode {
  cursor: pointer;
  user-select: none;
}

.footer .paper-size {
  position: relative;
}

.footer .paper-size i {
  background-image: url('../assets/images/paper-size.svg');
}

.footer .paper-size .options {
  right: 0;
  left: unset;
}

.footer .paper-direction {
  position: relative;
}

.footer .paper-direction i {
  background-image: url('../assets/images/paper-direction.svg');
}

.footer .paper-direction .options {
  right: 0;
  left: unset;
}
</style>