import axios from "axios";
import {store} from "@/store/index.js";
import {ElMessage} from "element-plus";


export const asr = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("/api4ai/asr", formData)
    console.log(response);
    return response.data;
}

export const ocr = async (file, type) => {
    const formData = new FormData();
    formData.append(name=type, file);
    // const formData = {
    //     'pdf_file': file
    // }
    const response = await axios.post("/api4ai/ocr", formData)
    console.log(response);
    return response;
}

export const afterOcr = async (file, result, materialList, type) => {
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
    console.log(uploadFileInfo);
    if (uploadFileInfo.status === 200) {
        ElMessage.success('上传成功')
        axios.post('/api/material', {
            file_id: store.fileId,
            material_name: file.name,
            material_type: type,
            source_file_url: uploadFileInfo.data.Location,
            material_info: result.data.message
        })
            .then(async (response) => {
                console.log(response);
                const materials = await axios.get('/api/material', {
                    params: {
                        file_id: store.fileId
                    }
                })
                materialList.value = materials.data
            })
    } else {
        ElMessage.error('上传失败')
    }
}