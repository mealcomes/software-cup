import axios from "axios";
// export const ocr = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);
//     const response = await axios.post("https://api.ocr.space/parse/image", formData, {
//     })
//     return response.data;
// }

export const asr = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await axios.post("/api4ai/asr", formData)
    console.log(response);
    return response.data;
}

export const ocr = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await axios.post("/api4ai/ocr", formData)
    console.log(response);
    return response.data;
}