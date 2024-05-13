import { reactive, ref } from 'vue'
import Editor from '@hufe921/canvas-editor'

export const store = reactive({
    fileToConvert: null,
    editType: '',
    fileId: 0,
    fileName: '',
    fileContent: null,
})

export const editorInstance = ref(null)