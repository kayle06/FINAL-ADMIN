import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '', // API 基础路径
    timeout: 15000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

// 请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 在请求发送前做一些处理，例如添加 token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers = {
                ...config.headers,
                'Authorization': `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        console.error('请求错误：', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        const res = response.data

        if (res.code === 200) {
            return res
        }

        // 只显示后端返回的错误信息
        ElMessage.error(res.message || '请求失败')
        return Promise.reject(new Error(res.message || '请求失败'))
    },
    (error) => {
        // 网络错误等情况
        const message = error.response?.data?.message || '服务器错误'
        ElMessage.error(message)
        return Promise.reject(error)
    }
)

export default service 