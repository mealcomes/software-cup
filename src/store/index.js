import {reactive, ref} from 'vue'

export const store = reactive({
    fileToConvert: null,
    editType: '',
    fileId: 0,
    fileName: '',
    fileContent: null,
})

export const editorInstance = ref(null)