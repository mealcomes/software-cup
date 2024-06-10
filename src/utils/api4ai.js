import axios from "axios";
import {store} from "@/store/index.js";
import {ElMessage} from "element-plus";


export const asr = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return await axios.post("/api4ai/asr", formData);
}

export const ocr = async (file, type) => {
    const formData = new FormData();
    formData.append(name=type, file);
    return await axios.post("/api4ai/ocr", formData);
}

export const afterCr = async (file, result, materialList, type) => {
    const uploadFileInfo = await axios.post('/api/upload', {
        file: file,
        info: {
            fileId: store.fileId,
            fileName: file.name,
            userName: 'Asuka'
        }
    }, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    if (uploadFileInfo.status === 200 && uploadFileInfo.data.status === 'ok') {
        axios.post('/api/material', {
            file_id: store.fileId,
            material_name: file.name,
            material_type: type,
            source_file_url: uploadFileInfo.data.message,
            material_info: result.data.message
        })
            .then(async (response) => {
                const materials = await axios.get('/api/material', {
                    params: {
                        file_id: store.fileId
                    }
                })
                materialList.value = materials.data
                console.log(response);
                await axios.post('/api4ai/chroma', {
                    file_id: store.fileId,
                    material_id: response.data.material_id,
                    material_info: result.data.message,
                    material_type: type
                })
        ElMessage.success('上传成功')

            })
    } else {
        ElMessage.error('上传失败')
    }
}