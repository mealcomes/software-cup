import { reactive } from 'vue'
import Editor from '@hufe921/canvas-editor'

export const store = reactive({
    editor: new Editor(),
})