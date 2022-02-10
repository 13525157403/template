import axios from 'axios'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, 
  timeout: 300000
})

// 请求前
service.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 请求后
service.interceptors.response.use(res => {
  const { data } = res
  const Msg = document.getElementsByClassName('el-message')[0]
  if (data.code !== 200) {
    if (!Msg) {
      Message({
        message: data.message || '错误 状态码' + data.code,
        type: 'error',
        duration: 1500
      })
    }
    return Promise.reject(data)
  } else {
    return res
  }
},
  error => {
    const { response: { data, status } } = error
    if (status !== 200) {
      if (status == 500) {
        Message({
          message: '与服务器断开连接',
          type: 'error',
          duration: 1500
        })
      } else {
        Message({
          message: data.message || '错误 状态码' + data.code,
          type: 'error',
          duration: 1500
        })
      }
    }
    return Promise.reject(response)
  }
)

export default service
