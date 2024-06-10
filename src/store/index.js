import {reactive, ref} from 'vue'

export const store = reactive({
    fileToConvert: null,
    editType: '',
    fileId: 0,
    fileName: '',
    fileContent: null,
    randomDegree: 0.95,
    knowledgeBase: true,
    customPrompt: false,
    globalFileList: []
})

export const editorInstance = ref(null)