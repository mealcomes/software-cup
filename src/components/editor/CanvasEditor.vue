<script setup>
import {debounce, nextTick} from "@/utils/index.js";
import Editor, {
  BlockType,
  ControlType,
  EditorMode,
  ElementType,
  ListStyle,
  ListType,
  RowFlex
} from "@hufe921/canvas-editor";
import {onMounted} from 'vue'
import docxPlugin from "@hufe921/canvas-editor-plugin-docx";
import Dialog from "@/pojo/dialog/Dialog.js";
import {useRoute} from "vue-router";
import {editorInstance, store} from "@/store/index.js";
import axios from "axios";
import {ElMessage} from "element-plus";

const route = useRoute()
const wordFile = store.fileToConvert
console.log(route.query);

// const props = defineProps({
//   file: Object
// })

onMounted(async () => {
  const isApple =
    typeof navigator !== 'undefined' && /Mac OS X/.test(navigator.userAgent)
  const editor = new Editor(
    document.querySelector('.editor'),
    {
      main: [
        {
          value: ''
        }
      ],
      IPageNumber: [
        {
          format: 'page-number'
        }
      ]
    },
    {}
  )
  console.log(11);
  editor.listener.contentChange = () => {
    console.log(11);
  }
  editor.listener.contentChange = () => {
    console.log(11);
    console.log(editor.command.getValue());
  }
  editor.listener.saved = () => {
    console.log(save);
  }

  editorInstance.value = editor

  if (store.editType === 'docxFile') {
    editor.use(docxPlugin)
    await editor.command.executeImportDocx({
      arrayBuffer: wordFile
    })
    const fileContent = await editor.command.getValue()
    const res = await axios.post('/api/files', {
      name: store.fileToConvert.name,
      content: fileContent.data,
      author: 'Asuka',
      file_size: store.fileToConvert.size,
    })

    if (res.status === 201) {
      ElMessage.success('导入成功')
      store.fileId = res.data.id
      store.fileName = res.data.name
    } else {
      ElMessage.error('导入失败')
    }
  } else if (store.editType === 'reditFile') {
    editor.command.executeSetValue(store.fileContent)
  }
  const data = await editor.command.getValue()
  console.log(data);


  // 菜单弹窗销毁
  window.addEventListener(
    'click',
    evt => {
      const visibleDom = document.querySelector('.visible')
      if (!visibleDom || visibleDom.contains(evt.target)) return
      visibleDom.classList.remove('visible')
    },
    {
      capture: true
    }
  )

  // | 撤销 | 重做 | 格式刷 | 清除格式 |
  const undoDom = document.querySelector('.menu-item__undo')
  undoDom.title = `撤销(${isApple ? '⌘' : 'Ctrl'}+Z)`
  undoDom.onclick = function () {
    console.log('undo')
    editor.command.executeUndo()
  }

  // 反向撤销
  const redoDom = document.querySelector('.menu-item__redo')
  redoDom.title = `重做(${isApple ? '⌘' : 'Ctrl'}+Y)`
  redoDom.onclick = function () {
    console.log('redo')
    editor.command.executeRedo()
  }

  //格式刷
  const painterDom = document.querySelector('.menu-item__painter')
  let isFirstClick = true
  let painterTimeout
  painterDom.onclick = function () {
    if (isFirstClick) {
      isFirstClick = false
      painterTimeout = window.setTimeout(() => {
        console.log('painter-click')
        isFirstClick = true
        editor.command.executePainter({
          isDblclick: false
        })
      }, 200)
    } else {
      window.clearTimeout(painterTimeout)
    }
  }

  painterDom.ondblclick = function () {
    console.log('painter-dblclick')
    isFirstClick = true
    window.clearTimeout(painterTimeout)
    editor.command.executePainter({ isDblclick: true })
  }

  // 清除样式
  document.querySelector('.menu-item__format').onclick =
    function () {
      console.log('format')
      editor.command.executeFormat()
    }

  // | 字体 | 字体变大 | 字体变小 | 加粗 | 斜体 | 下划线 | 删除线 | 上标 | 下标 | 字体颜色 | 背景色 |
  const fontDom = document.querySelector('.menu-item__font')
  const fontSelectDom = fontDom.querySelector('.select')
  const fontOptionDom = fontDom.querySelector('.options')
  fontDom.onclick = function () {
    console.log('font')
    fontOptionDom.classList.toggle('visible')
  }
  fontOptionDom.onclick = function (evt) {
    const li = evt.target
    editor.command.executeFont(li.dataset.family)
    // fontOptionDom.querySelectorAll('li')
    //     .forEach(child => {child.classList.remove('active')})
    // li.classList.add('active')
    // fontSelectDom.innerText = li.innerText
  }

  //字号
  const sizeSetDom = document.querySelector('.menu-item__size')
  const sizeSelectDom = sizeSetDom.querySelector('.select')
  const sizeOptionDom = sizeSetDom.querySelector('.options')
  sizeSetDom.title = `设置字号`
  sizeSetDom.onclick = function () {
    console.log('size')
    sizeOptionDom.classList.toggle('visible')
  }
  sizeOptionDom.onclick = function (evt) {
    const li = evt.target
    editor.command.executeSize(Number(li.dataset.size))
  }

  // 增大字号
  const sizeAddDom = document.querySelector('.menu-item__size-add')
  sizeAddDom.title = `增大字号(${isApple ? '⌘' : 'Ctrl'}+[)`
  sizeAddDom.onclick = function () {
    console.log('size-add')
    editor.command.executeSizeAdd()
  }

  // 减小字号
  const sizeMinusDom = document.querySelector('.menu-item__size-minus')
  sizeMinusDom.title = `减小字号(${isApple ? '⌘' : 'Ctrl'}+])`
  sizeMinusDom.onclick = function () {
    console.log('size-minus')
    editor.command.executeSizeMinus()
  }

  // 加粗
  const boldDom = document.querySelector('.menu-item__bold')
  boldDom.title = `加粗(${isApple ? '⌘' : 'Ctrl'}+B)`
  boldDom.onclick = function () {
    console.log('bold')
    editor.command.executeBold()
  }

  // 斜体
  const italicDom = document.querySelector('.menu-item__italic')
  italicDom.title = `斜体(${isApple ? '⌘' : 'Ctrl'}+I)`
  italicDom.onclick = function () {
    console.log('italic')
    editor.command.executeItalic()
  }

  // 下划线
  const underlineDom = document.querySelector('.menu-item__underline')
  underlineDom.title = `下划线(${isApple ? '⌘' : 'Ctrl'}+U)`
  const underlineOptionDom = underlineDom.querySelector('.options')
  underlineDom.querySelector('.select').onclick = function () {
    underlineOptionDom.classList.toggle('visible')
  }
  underlineDom.querySelector('i').onclick = function () {
    console.log('underline')
    editor.command.executeUnderline()
    underlineOptionDom.classList.remove('visible')
  }
  underlineDom.querySelector('ul').onmousedown = function (evt) {
    const li = evt.target
    const decorationStyle = li.dataset.decorationStyle
    editor.command.executeUnderline({
      style: decorationStyle
    })
    underlineOptionDom.querySelectorAll('li')
      .forEach(child => { child.classList.remove('active') })
    li.classList.add('active')
    underlineOptionDom.classList.remove('visible')
  }

  // 删除下划线
  const strikeoutDom = document.querySelector('.menu-item__strikeout')
  strikeoutDom.onclick = function () {
    console.log('strikeout')
    editor.command.executeStrikeout()
  }

  // 上标
  const superscriptDom = document.querySelector('.menu-item__superscript')
  superscriptDom.title = `上标(${isApple ? '⌘' : 'Ctrl'}+Shift+,)`
  superscriptDom.onclick = function () {
    console.log('superscript')
    editor.command.executeSuperscript()
  }

  // 下标
  const subscriptDom = document.querySelector('.menu-item__subscript')
  subscriptDom.title = `下标(${isApple ? '⌘' : 'Ctrl'}+Shift+.)`
  subscriptDom.onclick = function () {
    console.log('subscript')
    editor.command.executeSubscript()
  }

  // 字体颜色
  const colorControlDom = document.querySelector('#color')
  const colorDom = document.querySelector('.menu-item__color')
  const colorSpanDom = colorDom.querySelector('span')
  colorControlDom.oninput = function () {
    editor.command.executeColor(colorControlDom.value)
    colorSpanDom.style.backgroundColor = colorControlDom.value
  }
  colorDom.onclick = function () {
    console.log('color')
    colorControlDom?.click()
  }

  // 背景色
  const highlightControlDom = document.querySelector('#highlight')
  const highlightDom = document.querySelector('.menu-item__highlight')
  const highlightSpanDom = highlightDom.querySelector('span')
  highlightControlDom.oninput = function () {
    editor.command.executeHighlight(highlightControlDom.value)
    highlightSpanDom.style.backgroundColor = highlightControlDom.value
  }
  highlightDom.onclick = function () {
    console.log('highlight')
    highlightControlDom?.click()
  }

  // 切换标题
  const titleDom = document.querySelector('.menu-item__title')
  const titleSelectDom = titleDom.querySelector('.select')
  const titleOptionDom = titleDom.querySelector('.options')
  titleOptionDom.querySelectorAll('li').forEach((li, index) => {
    li.title = `Ctrl+${isApple ? 'Option' : 'Alt'}+${index}`
  })
  titleDom.onclick = function () {
    console.log('title')
    titleOptionDom.classList.toggle('visible')
  }
  titleOptionDom.onclick = function (evt) {
    const li = evt.target
    const level = li.dataset.level
    editor.command.executeTitle(level || null)
    // titleOptionDom.querySelectorAll('li')
    //     .forEach(child => {child.classList.remove('active')})
    // li.classList.add('active')
    // titleSelectDom.innerText = li.innerText
  }

  // 左对齐
  const leftDom = document.querySelector('.menu-item__left')
  leftDom.title = `左对齐(${isApple ? '⌘' : 'Ctrl'}+L)`
  leftDom.onclick = function () {
    console.log('left')
    editor.command.executeRowFlex(RowFlex.LEFT)
  }

  // 居中对齐
  const centerDom = document.querySelector('.menu-item__center')
  centerDom.title = `居中对齐(${isApple ? '⌘' : 'Ctrl'}+E)`
  centerDom.onclick = function () {
    console.log('center')
    editor.command.executeRowFlex(RowFlex.CENTER)
  }

  // 右对齐
  const rightDom = document.querySelector('.menu-item__right')
  rightDom.title = `右对齐(${isApple ? '⌘' : 'Ctrl'}+R)`
  rightDom.onclick = function () {
    console.log('right')
    editor.command.executeRowFlex(RowFlex.RIGHT)
  }

  // 两端对齐
  const alignmentDom = document.querySelector('.menu-item__alignment')
  alignmentDom.title = `两端对齐(${isApple ? '⌘' : 'Ctrl'}+J)`
  alignmentDom.onclick = function () {
    console.log('alignment')
    editor.command.executeRowFlex(RowFlex.ALIGNMENT)
  }

  // 行间距
  const rowMarginDom = document.querySelector('.menu-item__row-margin')
  const rowOptionDom = rowMarginDom.querySelector('.options')
  rowMarginDom.onclick = function () {
    console.log('row-margin')
    rowOptionDom.classList.toggle('visible')
  }
  rowOptionDom.onclick = function (evt) {
    const li = evt.target
    editor.command.executeRowMargin(Number(li.dataset.rowmargin))
  }

  // 列表
  const listDom = document.querySelector('.menu-item__list')
  listDom.title = `列表(${isApple ? '⌘' : 'Ctrl'}+Shift+U)`
  const listOptionDom = listDom.querySelector('.options')
  listDom.onclick = function () {
    console.log('list')
    listOptionDom.classList.toggle('visible')
  }
  listOptionDom.onclick = function (evt) {
    const li = evt.target
    const listType = li.dataset.listType || null
    const listStyle = (li.dataset.listStyle)
    editor.command.executeList(listType, listStyle)
  }

  // | 表格 | 图片 | 超链接 | 分割线 | 代码块 | 分隔符 | 控件 | 复选框 | LaTeX | 日期选择器
  const tableDom = document.querySelector('.menu-item__table')
  const tablePanelContainer = document.querySelector('.menu-item__table__collapse')
  const tableClose = document.querySelector('.table-close')
  const tableTitle = document.querySelector('.table-select')
  const tablePanel = document.querySelector('.table-panel')
  // 绘制行列
  const tableCellList = []
  for (let i = 0; i < 10; i++) {
    const tr = document.createElement('tr')
    tr.classList.add('table-row')
    const trCellList = []
    for (let j = 0; j < 10; j++) {
      const td = document.createElement('td')
      td.classList.add('table-cel')
      tr.append(td)
      trCellList.push(td)
    }
    tablePanel.append(tr)
    tableCellList.push(trCellList)
  }
  let colIndex = 0
  let rowIndex = 0
  // 移除所有格选择
  function removeAllTableCellSelect() {
    tableCellList.forEach(tr => {
      tr.forEach(td => td.classList.remove('active'))
    })
  }
  // 设置标题内容
  function setTableTitle(payload) {
    tableTitle.innerText = payload
  }
  // 恢复初始状态
  function recoveryTable() {
    // 还原选择样式、标题、选择行列
    removeAllTableCellSelect()
    setTableTitle('插入')
    colIndex = 0
    rowIndex = 0
    // 隐藏panel
    tablePanelContainer.style.display = 'none'
  }
  tableDom.onclick = function () {
    console.log('table')
    tablePanelContainer.style.display = 'block'
  }
  tablePanel.onmousemove = function (evt) {
    const celSize = 16
    const rowMarginTop = 10
    const celMarginRight = 6
    const { offsetX, offsetY } = evt
    // 移除所有选择
    removeAllTableCellSelect()
    colIndex = Math.ceil(offsetX / (celSize + celMarginRight)) || 1
    rowIndex = Math.ceil(offsetY / (celSize + rowMarginTop)) || 1
    // 改变选择样式
    tableCellList.forEach((tr, trIndex) => {
      tr.forEach((td, tdIndex) => {
        if (tdIndex < colIndex && trIndex < rowIndex) {
          td.classList.add('active')
        }
      })
    })
    // 改变表格标题
    setTableTitle(`${rowIndex}×${colIndex}`)
  }
  tableClose.onclick = function () {
    recoveryTable()
  }
  tablePanel.onclick = function () {
    // 应用选择
    editor.command.executeInsertTable(rowIndex, colIndex)
    recoveryTable()
  }

  // 图片
  const imageDom = document.querySelector('.menu-item__image')
  const imageFileDom = document.querySelector('#image')
  imageDom.onclick = function () {
    imageFileDom.click()
  }
  imageFileDom.onchange = function () {
    const file = imageFileDom.files[0]
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = function () {
      // 计算宽高
      const image = new Image()
      const value = fileReader.result
      image.src = value
      image.onload = function () {
        editor.command.executeImage({
          value,
          width: image.width,
          height: image.height
        })
        imageFileDom.value = ''
      }
    }
  }

  // 分割符
  const separatorDom = document.querySelector('.menu-item__separator')
  const separatorOptionDom = separatorDom.querySelector('.options')
  separatorDom.onclick = function () {
    console.log('separator')
    separatorOptionDom.classList.toggle('visible')
  }
  separatorOptionDom.onmousedown = function (evt) {
    let payload = []
    const li = evt.target
    const separatorDash = li.dataset.separator?.split(',').map(Number)
    if (separatorDash) {
      const isSingleLine = separatorDash.every(d => d === 0)
      if (!isSingleLine) {
        payload = separatorDash
      }
    }
    editor.command.executeSeparator(payload)
    separatorOptionDom.querySelectorAll('li')
      .forEach(child => { child.classList.remove('active') })
    li.classList.add('active')
  }

  // 分页符
  const pageBreakDom = document.querySelector('.menu-item__page-break')
  pageBreakDom.onclick = function () {
    console.log('pageBreak')
    editor.command.executePageBreak()
  }

  // 控件
  const controlDom = document.querySelector('.menu-item__control')
  const controlOptionDom = controlDom.querySelector('.options')
  controlDom.onclick = function () {
    console.log('control')
    controlOptionDom.classList.toggle('visible')
  }
  controlOptionDom.onmousedown = function (evt) {
    controlOptionDom.classList.toggle('visible')
    const li = evt.target
    const type = li.dataset.control
    switch (type) {
      case ControlType.TEXT:
        new Dialog({
          title: '文本控件',
          data: [
            {
              type: 'text',
              label: '占位符',
              name: 'placeholder',
              required: true,
              placeholder: '请输入占位符'
            },
            {
              type: 'text',
              label: '默认值',
              name: 'value',
              placeholder: '请输入默认值'
            }
          ],
          onConfirm: payload => {
            const placeholder = payload.find(
              p => p.name === 'placeholder'
            )?.value
            if (!placeholder) return
            const value = payload.find(p => p.name === 'value')?.value || ''
            editor.command.executeInsertElementList([
              {
                type: ElementType.CONTROL,
                value: '',
                control: {
                  type,
                  value: value ? [
                    {
                      value
                    }
                  ]
                    : null,
                  placeholder
                }
              }
            ])
          }
        })
        break
      case ControlType.SELECT:
        new Dialog({
          title: '列举控件',
          data: [
            {
              type: 'text',
              label: '占位符',
              name: 'placeholder',
              required: true,
              placeholder: '请输入占位符'
            },
            {
              type: 'text',
              label: '默认值',
              name: 'code',
              placeholder: '请输入默认值'
            },
            {
              type: 'textarea',
              label: '值集',
              name: 'valueSets',
              required: true,
              height: 100,
              placeholder: `请输入值集JSON，例：\n[{\n"value":"有",\n"code":"98175"\n}]`
            }
          ],
          onConfirm: payload => {
            const placeholder = payload.find(
              p => p.name === 'placeholder'
            )?.value
            if (!placeholder) return
            const valueSets = payload.find(p => p.name === 'valueSets')?.value
            if (!valueSets) return
            const code = payload.find(p => p.name === 'code')?.value
            editor.command.executeInsertElementList([
              {
                type: ElementType.CONTROL,
                value: '',
                control: {
                  type,
                  code,
                  value: null,
                  placeholder,
                  valueSets: JSON.parse(valueSets)
                }
              }
            ])
          }
        })
        break
      case ControlType.CHECKBOX:
        new Dialog({
          title: '复选框控件',
          data: [
            {
              type: 'text',
              label: '默认值',
              name: 'code',
              placeholder: '请输入默认值，多个值以英文逗号分割'
            },
            {
              type: 'textarea',
              label: '值集',
              name: 'valueSets',
              required: true,
              height: 100,
              placeholder: `请输入值集JSON，例：\n[{\n"value":"有",\n"code":"98175"\n}]`
            }
          ],
          onConfirm: payload => {
            const valueSets = payload.find(p => p.name === 'valueSets')?.value
            if (!valueSets) return
            const code = payload.find(p => p.name === 'code')?.value
            editor.command.executeInsertElementList([
              {
                type: ElementType.CONTROL,
                value: '',
                control: {
                  type,
                  code,
                  value: null,
                  valueSets: JSON.parse(valueSets)
                }
              }
            ])
          }
        })
        break
      default:
        break
    }
  }

  // 复选框
  const checkboxDom = document.querySelector('.menu-item__checkbox')
  checkboxDom.onclick = function () {
    console.log('checkbox')
    editor.command.executeInsertElementList([
      {
        type: ElementType.CHECKBOX,
        checkbox: {
          value: false
        },
        value: ''
      }
    ])
  }

  // latex
  const latexDom = document.querySelector('.menu-item__latex')
  latexDom.onclick = function () {
    console.log('LaTeX')
    new Dialog({
      title: 'LaTeX',
      data: [
        {
          type: 'textarea',
          height: 100,
          name: 'value',
          placeholder: '请输入LaTeX文本'
        }
      ],
      onConfirm: payload => {
        const value = payload.find(p => p.name === 'value')?.value
        if (!value) return
        editor.command.executeInsertElementList([
          {
            type: ElementType.LATEX,
            value
          }
        ])
      }
    })
  }

  // 日期
  const dateDom = document.querySelector('.menu-item__date')
  const dateDomOptionDom = dateDom.querySelector('.options')
  dateDom.onclick = function () {
    console.log('date')
    dateDomOptionDom.classList.toggle('visible')
    // 定位调整
    const bodyRect = document.body.getBoundingClientRect()
    const dateDomOptionRect = dateDomOptionDom.getBoundingClientRect()
    if (dateDomOptionRect.left + dateDomOptionRect.width > bodyRect.width) {
      dateDomOptionDom.style.right = '0px'
      dateDomOptionDom.style.left = 'unset'
    } else {
      dateDomOptionDom.style.right = 'unset'
      dateDomOptionDom.style.left = '0px'
    }
    // 当前日期
    const date = new Date()
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    const dateTimeString = `${dateString} ${hour}:${minute}:${second}`
    dateDomOptionDom.querySelector('li:first-child').innerText = dateString
    dateDomOptionDom.querySelector('li:last-child').innerText = dateTimeString
  }
  dateDomOptionDom.onmousedown = function (evt) {
    const li = evt.target
    const dateFormat = li.dataset.format
    dateDomOptionDom.classList.toggle('visible')
    editor.command.executeInsertElementList([
      {
        type: ElementType.DATE,
        value: '',
        dateFormat,
        valueList: [
          {
            value: li.innerText.trim()
          }
        ]
      }
    ])
  }

  // 内容块
  const blockDom = document.querySelector('.menu-item__block')
  blockDom.onclick = function () {
    console.log('block')
    new Dialog({
      title: '内容块',
      data: [
        {
          type: 'select',
          label: '类型',
          name: 'type',
          value: 'iframe',
          required: true,
          options: [
            {
              label: '网址',
              value: 'iframe'
            },
            {
              label: '视频',
              value: 'video'
            }
          ]
        },
        {
          type: 'number',
          label: '宽度',
          name: 'width',
          placeholder: '请输入宽度（默认页面内宽度）'
        },
        {
          type: 'number',
          label: '高度',
          name: 'height',
          required: true,
          placeholder: '请输入高度'
        },
        {
          type: 'input',
          label: '地址',
          name: 'src',
          required: false,
          placeholder: '请输入地址'
        },
        {
          type: 'textarea',
          label: 'HTML',
          height: 100,
          name: 'srcdoc',
          required: false,
          placeholder: '请输入HTML代码（仅网址类型有效）'
        }
      ],
      onConfirm: payload => {
        const type = payload.find(p => p.name === 'type')?.value
        if (!type) return
        const width = payload.find(p => p.name === 'width')?.value
        const height = payload.find(p => p.name === 'height')?.value
        if (!height) return
        // 地址或HTML代码至少存在一项
        const src = payload.find(p => p.name === 'src')?.value
        const srcdoc = payload.find(p => p.name === 'srcdoc')?.value
        const block = {
          type: type
        }
        if (block.type === BlockType.IFRAME) {
          if (!src && !srcdoc) return
          block.iframeBlock = {
            src,
            srcdoc
          }
        } else if (block.type === BlockType.VIDEO) {
          if (!src) return
          block.videoBlock = {
            src
          }
        }
        const blockElement = {
          type: ElementType.BLOCK,
          value: '',
          height: Number(height),
          block
        }
        if (width) {
          blockElement.width = Number(width)
        }
        editor.command.executeInsertElementList([blockElement])
      }
    })
  }

  // | 搜索&替换 | 打印 |
  const searchCollapseDom = document.querySelector('.menu-item__search__collapse')
  const searchInputDom = document.querySelector('.menu-item__search__collapse__search input')
  const replaceInputDom = document.querySelector('.menu-item__search__collapse__replace input')
  const searchDom = document.querySelector('.menu-item__search')
  searchDom.title = `搜索与替换(${isApple ? '⌘' : 'Ctrl'}+F)`
  const searchResultDom = searchCollapseDom.querySelector('.search-result')
  function setSearchResult() {
    const result = editor.command.getSearchNavigateInfo()
    if (result) {
      const { index, count } = result
      searchResultDom.innerText = `${index}/${count}`
    } else {
      searchResultDom.innerText = ''
    }
  }
  searchDom.onclick = function () {
    console.log('search')
    searchCollapseDom.style.display = 'block'
    const bodyRect = document.body.getBoundingClientRect()
    const searchRect = searchDom.getBoundingClientRect()
    const searchCollapseRect = searchCollapseDom.getBoundingClientRect()
    if (searchRect.left + searchCollapseRect.width > bodyRect.width) {
      searchCollapseDom.style.right = '0px'
      searchCollapseDom.style.left = 'unset'
    } else {
      searchCollapseDom.style.right = 'unset'
    }
    searchInputDom.focus()
  }
  searchCollapseDom.querySelector('span').onclick =
    function () {
      searchCollapseDom.style.display = 'none'
      searchInputDom.value = ''
      replaceInputDom.value = ''
      editor.command.executeSearch(null)
      setSearchResult()
    }
  searchInputDom.oninput = function () {
    editor.command.executeSearch(searchInputDom.value || null)
    setSearchResult()
  }
  searchInputDom.onkeydown = function (evt) {
    if (evt.key === 'Enter') {
      editor.command.executeSearch(searchInputDom.value || null)
      setSearchResult()
    }
  }
  searchCollapseDom.querySelector('button').onclick =
    function () {
      const searchValue = searchInputDom.value
      const replaceValue = replaceInputDom.value
      if (searchValue && replaceValue && searchValue !== replaceValue) {
        editor.command.executeReplace(replaceValue)
      }
    }
  searchCollapseDom.querySelector('.arrow-left').onclick =
    function () {
      editor.command.executeSearchNavigatePre()
      setSearchResult()
    }
  searchCollapseDom.querySelector('.arrow-right').onclick =
    function () {
      editor.command.executeSearchNavigateNext()
      setSearchResult()
    }

  // 打印
  const printDom = document.querySelector('.menu-item__print')
  printDom.title = `打印(${isApple ? '⌘' : 'Ctrl'}+P)`
  printDom.onclick = function () {
    console.log('print')
    editor.command.executePrint()
  }

  // 目录显隐 | 页面模式 | 纸张缩放 | 纸张大小 | 纸张方向 | 页边距 | 全屏 | 设置
  const editorOptionDom = document.querySelector('.editor-option')
  editorOptionDom.onclick = function () {
    const options = editor.command.getOptions()
    new Dialog({
      title: '编辑器配置',
      data: [
        {
          type: 'textarea',
          name: 'option',
          width: 350,
          height: 300,
          required: true,
          value: JSON.stringify(options, null, 2),
          placeholder: '请输入编辑器配置'
        }
      ],
      onConfirm: payload => {
        const newOptionValue = payload.find(p => p.name === 'option')?.value
        if (!newOptionValue) return
        const newOption = JSON.parse(newOptionValue)
        Object.keys(newOption).forEach(key => {
          Reflect.set(options, key, newOption[key])
        })
        editor.command.executeForceUpdate()
      }
    })
  }

  async function updateCatalog() {
    const catalog = await editor.command.getCatalog()
    const catalogMainDom =
      document.querySelector('.catalog__main')
    catalogMainDom.innerHTML = ''
    if (catalog) {
      const appendCatalog = (
        parent,
        catalogItems
      ) => {
        for (let c = 0; c < catalogItems.length; c++) {
          const catalogItem = catalogItems[c]
          const catalogItemDom = document.createElement('div')
          catalogItemDom.classList.add('catalog-item')
          // 渲染
          const catalogItemContentDom = document.createElement('div')
          catalogItemContentDom.classList.add('catalog-item__content')
          const catalogItemContentSpanDom = document.createElement('span')
          catalogItemContentSpanDom.innerText = catalogItem.name
          catalogItemContentDom.append(catalogItemContentSpanDom)
          // 定位
          catalogItemContentDom.onclick = () => {
            editor.command.executeLocationCatalog(catalogItem.id)
          }
          catalogItemDom.append(catalogItemContentDom)
          if (catalogItem.subCatalog && catalogItem.subCatalog.length) {
            appendCatalog(catalogItemDom, catalogItem.subCatalog)
          }
          // 追加
          parent.append(catalogItemDom)
        }
      }
      appendCatalog(catalogMainDom, catalog)
    }
  }
  let isCatalogShow = true
  const catalogDom = document.querySelector('.catalog')
  const catalogModeDom = document.querySelector('.catalog-mode')
  const catalogHeaderCloseDom = document.querySelector('.catalog__header__close')
  const switchCatalog = () => {
    isCatalogShow = !isCatalogShow
    if (isCatalogShow) {
      catalogDom.style.display = 'block'
      updateCatalog()
    } else {
      catalogDom.style.display = 'none'
    }
  }
  catalogModeDom.onclick = switchCatalog
  catalogHeaderCloseDom.onclick = switchCatalog

  const pageModeDom = document.querySelector('.page-mode')
  const pageModeOptionsDom = pageModeDom.querySelector('.options')
  pageModeDom.onclick = function () {
    pageModeOptionsDom.classList.toggle('visible')
  }
  pageModeOptionsDom.onclick = function (evt) {
    const li = evt.target
    editor.command.executePageMode(li.dataset.pageMode)
    pageModeOptionsDom.querySelectorAll('li')
      .forEach(child => child.classList.remove('active'))
    li.classList.add('active')
  }

  // 纸张大小复原
  document.querySelector('.page-scale-percentage').onclick = function () {
    console.log('page-scale-recovery')
    editor.command.executePageScaleRecovery()
  }
  // 纸张缩小
  document.querySelector('.page-scale-minus').onclick =
    function () {
      console.log('page-scale-minus')
      editor.command.executePageScaleMinus()
    }
  //纸张放大
  document.querySelector('.page-scale-add').onclick =
    function () {
      console.log('page-scale-add')
      editor.command.executePageScaleAdd()
    }

  // 纸张大小
  const paperSizeDom = document.querySelector('.paper-size')
  const paperSizeDomOptionsDom = paperSizeDom.querySelector('.options')
  paperSizeDom.onclick = function () {
    paperSizeDomOptionsDom.classList.toggle('visible')
  }
  paperSizeDomOptionsDom.onclick = function (evt) {
    const li = evt.target
    const paperType = li.dataset.paperSize
    const [width, height] = paperType.split('*').map(Number)
    editor.command.executePaperSize(width, height)
    // 纸张状态回显
    paperSizeDomOptionsDom.querySelectorAll('li')
      .forEach(child => child.classList.remove('active'))
    li.classList.add('active')
  }

  // 纸张方向
  const paperDirectionDom = document.querySelector('.paper-direction')
  const paperDirectionDomOptionsDom = paperDirectionDom.querySelector('.options')
  paperDirectionDom.onclick = function () {
    paperDirectionDomOptionsDom.classList.toggle('visible')
  }
  paperDirectionDomOptionsDom.onclick = function (evt) {
    const li = evt.target
    const paperDirection = li.dataset.paperDirection
    editor.command.executePaperDirection(paperDirection)
    // 纸张方向状态回显
    paperDirectionDomOptionsDom.querySelectorAll('li')
      .forEach(child => child.classList.remove('active'))
    li.classList.add('active')
  }

  // 页面边距
  const paperMarginDom = document.querySelector('.paper-margin')
  paperMarginDom.onclick = function () {
    const [topMargin, rightMargin, bottomMargin, leftMargin] = editor.command.getPaperMargin()
    new Dialog({
      title: '页边距',
      data: [
        {
          type: 'text',
          label: '上边距',
          name: 'top',
          required: true,
          value: `${topMargin}`,
          placeholder: '请输入上边距'
        },
        {
          type: 'text',
          label: '下边距',
          name: 'bottom',
          required: true,
          value: `${bottomMargin}`,
          placeholder: '请输入下边距'
        },
        {
          type: 'text',
          label: '左边距',
          name: 'left',
          required: true,
          value: `${leftMargin}`,
          placeholder: '请输入左边距'
        },
        {
          type: 'text',
          label: '右边距',
          name: 'right',
          required: true,
          value: `${rightMargin}`,
          placeholder: '请输入右边距'
        }
      ],
      onConfirm: payload => {
        const top = payload.find(p => p.name === 'top')?.value
        if (!top) return
        const bottom = payload.find(p => p.name === 'bottom')?.value
        if (!bottom) return
        const left = payload.find(p => p.name === 'left')?.value
        if (!left) return
        const right = payload.find(p => p.name === 'right')?.value
        if (!right) return
        editor.command.executeSetPaperMargin([
          Number(top),
          Number(right),
          Number(bottom),
          Number(left)
        ])
      }
    })
  }

  // 全屏
  const fullscreenDom = document.querySelector('.fullscreen')
  fullscreenDom.onclick = toggleFullscreen
  window.addEventListener('keydown', evt => {
    if (evt.key === 'F11') {
      toggleFullscreen()
      evt.preventDefault()
    }
  })
  document.addEventListener('fullscreenchange', () => {
    fullscreenDom.classList.toggle('exist')
  })
  function toggleFullscreen() {
    console.log('fullscreen')
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // 编辑器使用模式
  let modeIndex = 0
  const modeList = [
    {
      mode: EditorMode.EDIT,
      name: '编辑模式'
    },
    {
      mode: EditorMode.CLEAN,
      name: '清洁模式'
    },
    {
      mode: EditorMode.READONLY,
      name: '只读模式'
    },
    {
      mode: EditorMode.FORM,
      name: '表单模式'
    },
    {
      mode: EditorMode.PRINT,
      name: '打印模式'
    }
  ]
  const modeElement = document.querySelector('.editor-mode')
  modeElement.onclick = function () {
    // 模式选择循环
    modeIndex === modeList.length - 1 ? (modeIndex = 0) : modeIndex++
    // 设置模式
    const { name, mode } = modeList[modeIndex]
    modeElement.innerText = name
    editor.command.executeMode(mode)
    // 设置菜单栏权限视觉反馈
    const isReadonly = mode === EditorMode.READONLY
    const enableMenuList = ['search', 'print']
    document.querySelectorAll('.menu-item>div').forEach(dom => {
      const menu = dom.dataset.menu
      isReadonly && (!menu || !enableMenuList.includes(menu))
        ? dom.classList.add('disable')
        : dom.classList.remove('disable')
    })
  }

  // 内部事件监听
  editor.listener.rangeStyleChange = function (payload) {
    // 控件类型
    payload.type === ElementType.SUBSCRIPT
      ? subscriptDom.classList.add('active')
      : subscriptDom.classList.remove('active')
    payload.type === ElementType.SUPERSCRIPT
      ? superscriptDom.classList.add('active')
      : superscriptDom.classList.remove('active')
    payload.type === ElementType.SEPARATOR
      ? separatorDom.classList.add('active')
      : separatorDom.classList.remove('active')
    separatorOptionDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    if (payload.type === ElementType.SEPARATOR) {
      const separator = payload.dashArray.join(',') || '0,0'
      const curSeparatorDom = separatorOptionDom.querySelector(`[data-separator=${separator}]`)
      if (curSeparatorDom) {
        curSeparatorDom.classList.add('active')
      }
    }

    // 富文本
    fontOptionDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    const curFontDom = fontOptionDom.querySelector(`[data-family='${payload.font}']`)
    if (curFontDom) {
      fontSelectDom.innerText = curFontDom.innerText
      fontSelectDom.style.fontFamily = payload.font
      curFontDom.classList.add('active')
    }
    sizeOptionDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    const curSizeDom = sizeOptionDom.querySelector(
      `[data-size='${payload.size}']`
    )
    if (curSizeDom) {
      sizeSelectDom.innerText = curSizeDom.innerText
      curSizeDom.classList.add('active')
    } else {
      sizeSelectDom.innerText = `${payload.size}`
    }
    payload.bold
      ? boldDom.classList.add('active')
      : boldDom.classList.remove('active')
    payload.italic
      ? italicDom.classList.add('active')
      : italicDom.classList.remove('active')
    payload.underline
      ? underlineDom.classList.add('active')
      : underlineDom.classList.remove('active')
    payload.strikeout
      ? strikeoutDom.classList.add('active')
      : strikeoutDom.classList.remove('active')
    if (payload.color) {
      colorDom.classList.add('active')
      colorControlDom.value = payload.color
      colorSpanDom.style.backgroundColor = payload.color
    } else {
      colorDom.classList.remove('active')
      colorControlDom.value = '#000000'
      colorSpanDom.style.backgroundColor = '#000000'
    }
    if (payload.highlight) {
      highlightDom.classList.add('active')
      highlightControlDom.value = payload.highlight
      highlightSpanDom.style.backgroundColor = payload.highlight
    } else {
      highlightDom.classList.remove('active')
      highlightControlDom.value = '#ffff00'
      highlightSpanDom.style.backgroundColor = '#ffff00'
    }

    // 行布局
    leftDom.classList.remove('active')
    centerDom.classList.remove('active')
    rightDom.classList.remove('active')
    alignmentDom.classList.remove('active')
    if (payload.rowFlex && payload.rowFlex === 'right') {
      rightDom.classList.add('active')
    } else if (payload.rowFlex && payload.rowFlex === 'center') {
      centerDom.classList.add('active')
    } else if (payload.rowFlex && payload.rowFlex === 'alignment') {
      alignmentDom.classList.add('active')
    } else {
      leftDom.classList.add('active')
    }

    // 行间距
    rowOptionDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    const curRowMarginDom = rowOptionDom.querySelector(`[data-rowmargin='${payload.rowMargin}']`)
    curRowMarginDom.classList.add('active')

    // 功能
    payload.undo
      ? undoDom.classList.remove('no-allow')
      : undoDom.classList.add('no-allow')
    payload.redo
      ? redoDom.classList.remove('no-allow')
      : redoDom.classList.add('no-allow')
    payload.painter
      ? painterDom.classList.add('active')
      : painterDom.classList.remove('active')

    // 标题
    titleOptionDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    if (payload.level) {
      const curTitleDom = titleOptionDom.querySelector(`[data-level='${payload.level}']`)
      titleSelectDom.innerText = curTitleDom.innerText
      curTitleDom.classList.add('active')
    } else {
      titleSelectDom.innerText = '正文'
      titleOptionDom.querySelector('li:first-child').classList.add('active')
    }

    // 列表
    listOptionDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    if (payload.listType) {
      listDom.classList.add('active')
      const listType = payload.listType
      const listStyle =
        payload.listType === ListType.OL ? ListStyle.DECIMAL : payload.listType
      const curListDom = listOptionDom.querySelector(`[data-list-type='${listType}'][data-list-style='${listStyle}']`)
      if (curListDom) {
        curListDom.classList.add('active')
      }
    } else {
      listDom.classList.remove('active')
    }
  }

  //  页面: * / *
  editor.listener.visiblePageNoListChange = function (payload) {
    document.querySelector('.page-no-list').innerText = payload.map(i => i + 1).join('、')
  }
  editor.listener.pageSizeChange = function (payload) {
    document.querySelector('.page-size').innerText = `${payload}`
  }
  editor.listener.intersectionPageNoChange = function (payload) {
    document.querySelector('.page-no').innerText = `${payload + 1}`
  }

  // - 100% +
  editor.listener.pageScaleChange = function (payload) {
    document.querySelector('.page-scale-percentage').innerText = `${Math.floor(payload * 10 * 10)}%`
  }

  editor.listener.controlChange = function (payload) {
    const disableMenusInControlContext = [
      'table',
      'hyperlink',
      'separator',
      'page-break'
    ]
    // 菜单操作权限
    disableMenusInControlContext.forEach(menu => {
      const menuDom = document.querySelector(
        `.menu-item__${menu}`
      )
      payload
        ? menuDom.classList.add('disable')
        : menuDom.classList.remove('disable')
    })
  }

  editor.listener.pageModeChange = function (payload) {
    const activeMode = pageModeOptionsDom.querySelector(
      `[data-page-mode='${payload}']`
    )
    pageModeOptionsDom
      .querySelectorAll('li')
      .forEach(li => li.classList.remove('active'))
    activeMode.classList.add('active')
  }

  //字数动态变化
  const handleContentChange = async function () {
    // 字数
    const wordCount = await editor.command.getWordCount()
    document.querySelector('.word-count').innerText = `${wordCount || 0
      }`
    // 目录
    if (isCatalogShow) {
      await nextTick(() => {
        updateCatalog()
      })
    }
  }
  editor.listener.contentChange = debounce(handleContentChange, 200)
  handleContentChange()

  editor.listener.saved = async function (payload) {
    console.log('elementList: ', payload)
    // console.log(editor.command.getRange());
    // editor.command.executeAppendElementList([
    //   {
    //     value: 'abc'
    //   }
    // ])
    const res = await axios.put(`/api/files/${store.fileId}`, {
      content: payload.data
    })
    console.log(res);
    if (res.status === 200) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('保存失败')
    }
  }

})

</script>

<template>
  <div class="editor"></div>
</template>

<style scoped>
.editor>div {
  margin: 80px auto;
  z-index: 10;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

.ce-page-container canvas {
  box-shadow: rgb(158 161 165 / 40%) 0 2px 12px 0;
  border-radius: 5px;
}
</style>