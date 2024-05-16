// 对于 IGetElementListByHTMLOption 接口，转换为JavaScript对象字面量描述
export function isEnglish(text) {
    const regex = /^[A-Za-z ,.;:'"!?-]+$/;
    return regex.test(text);
}