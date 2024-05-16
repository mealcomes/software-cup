<template>
    <div style="display: flex; align-items: center;">
        <svg v-if="props.filename" style="width: 20px; height: 20px;">
            <use v-bind:xlink:href="fileClass"></use>
        </svg>
        <span style="margin-left: 10px;">{{ props.filename }}</span>
    </div>
</template>

<script setup>
import '../../assets/font_icon/iconfont.js'
import {ref, watch} from 'vue'

const props = defineProps({
    filename: {
        type: String,
    }
})

watch(props, (newVal, oldVal) => {
    
})

const fileClass = ref('WORD')
const fileType = props.filename?.split('.')[props.filename.split('.').length - 1]
if (fileType === 'doc' || fileType === 'docx') {
    fileClass.value = '#icon-WORD'
} else if (fileType === 'ppt' || fileType === 'pptx') {
    fileClass.value = '#icon-ppt'
} else if (fileType === 'xls' || fileType === 'xlsx') {
    fileClass.value = '#icon-excel-'
} else if (fileType === 'pdf') {
    fileClass.value = '#icon-PDF'
} else if (fileType === 'md') {
    fileClass.value = '#icon-markdown'
}

</script>

<style scoped></style>