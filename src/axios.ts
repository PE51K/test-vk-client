import axios from "axios";

const instance = axios.create({
    baseURL: 'https://test-vk-server.onrender.com',
})

instance.interceptors.request.use((config) => {
    // @ts-ignore
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance