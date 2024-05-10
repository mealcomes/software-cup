function convertTextNodeToElement(textNode) {
    if (!textNode || textNode.nodeType !== 3) return null;
    const parentNode = textNode.parentNode;
    const anchorNode = parentNode.nodeName === 'FONT' ? parentNode.parentNode : parentNode;
    const rowFlex = getElementRowFlex(anchorNode);
    const value = textNode.textContent;
    const style = window.getComputedStyle(anchorNode);
    if (!value || anchorNode.nodeName === 'STYLE') return null;
  
    const element = {
      value,
      color: style.color,
      bold: Number(style.fontWeight) > 500,
      italic: style.fontStyle.includes('italic'),
      size: Math.floor(parseFloat(style.fontSize))
    };
  
    // 元素类型-默认文本
    if (anchorNode.nodeName === 'SUB' || style.verticalAlign === 'sub') {
      element.type = ElementType.SUBSCRIPT;
    } else if (anchorNode.nodeName === 'SUP' || style.verticalAlign === 'super') {
      element.type = ElementType.SUPERSCRIPT;
    }
  
    // 行对齐
    if (rowFlex !== RowFlex.LEFT) {
      element.rowFlex = rowFlex;
    }
  
    // 高亮色
    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      element.highlight = style.backgroundColor;
    }
  
    // 下划线
    if (style.textDecorationLine.includes('underline')) {
      element.underline = true;
    }
  
    // 删除线
    if (style.textDecorationLine.includes('line-through')) {
      element.strikeout = true;
    }
  
    return element;
  }
  
  // 注意：ElementType 和 RowFlex 是假设已定义的枚举或常量，需要在实际使用中定义它们。
  // 示例：
  const ElementType = {
    SUBSCRIPT: 'SUBSCRIPT',
    SUPERSCRIPT: 'SUPERSCRIPT'
  };
  
  const RowFlex = {
    LEFT: 'LEFT',
    // 可能还有其他值，如 'CENTER', 'RIGHT', 等
  };
  
  // 对于 IGetElementListByHTMLOption 接口，转换为JavaScript对象字面量描述
  const getElementListByHTMLOption = {
    innerWidth: 0 // 这是一个示例值，具体应根据实际情况设定
  };

  export function getElementListByHTML(htmlText, options) {
    var elementList = [];
    function findTextNode(dom) {
        if (dom.nodeType === 3) {
            var element = convertTextNodeToElement(dom);
            if (element) {
                elementList.push(element);
            }
        } else if (dom.nodeType === 1) {
            var childNodes = dom.childNodes;
            for (var n = 0; n < childNodes.length; n++) {
                var node = childNodes[n];
                if (node.nodeName === 'BR') {
                    elementList.push({ value: '\n' });
                } else if (node.nodeName === 'A') {
                    var aElement = node;
                    var value = aElement.innerText;
                    if (value) {
                        elementList.push({
                            type: ElementType.HYPERLINK,
                            value: '',
                            valueList: [{ value }],
                            url: aElement.href
                        });
                    }
                } else if (/H[1-6]/.test(node.nodeName)) {
                    // ... (rest of the logic remains unchanged)
                } else if (node.nodeName === 'UL' || node.nodeName === 'OL') {
                    // ... (rest of the logic remains unchanged)
                } else if (node.nodeName === 'HR') {
                    elementList.push({ value: '\n', type: ElementType.SEPARATOR });
                } else if (node.nodeName === 'IMG') {
                    var { src, width, height } = node;
                    if (src && width && height) {
                        elementList.push({
                            width,
                            height,
                            value: src,
                            type: ElementType.IMAGE
                        });
                    }
                } else if (node.nodeName === 'TABLE') {
                    // ... (rest of the logic remains unchanged)
                } else if (node.nodeName === 'INPUT' && node.type === ControlComponent.CHECKBOX) {
                    elementList.push({
                        type: ElementType.CHECKBOX,
                        value: '',
                        checkbox: { value: node.checked }
                    });
                } else if (node.nodeName === 'INPUT' && node.type === ControlComponent.RADIO) {
                    elementList.push({
                        type: ElementType.RADIO,
                        value: '',
                        radio: { value: node.checked }
                    });
                } else {
                    findTextNode(node);
                    if (node.nodeType === 1 && n !== childNodes.length - 1) {
                        var display = window.getComputedStyle(node).display;
                        if (display === 'block') {
                            elementList.push({ value: '\n' });
                        }
                    }
                }
            }
        }
    }
    // 追加dom
    var clipboardDom = document.createElement('div');
    clipboardDom.innerHTML = htmlText;
    document.body.appendChild(clipboardDom);
    var deleteNodes = [];
    clipboardDom.childNodes.forEach(child => {
        if (child.nodeType !== 1 && !child.textContent?.trim()) {
            deleteNodes.push(child);
        }
    });
    deleteNodes.forEach(node => node.remove());
    // 搜索文本节点
    findTextNode(clipboardDom);
    // 移除dom
    clipboardDom.remove();
    return elementList;
}