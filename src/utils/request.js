// 请求模块

import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'

// 但JSONBig能处理数据中超出JavaScript超出安全整数范围的问题
// JSONBig.parse() 把JSON格式的字符串转为JavaScript对象
// JSONBig.stringify() 把JavaScript对象转换为JSON格式的字符串
// 使用的时候需要把BigNumber类型的数据转为字符串来使用

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://toutiao.itheima.net',

  // 自定义后端返回的原始数据
  transformResponse: [function (data) {
    try {
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
    // axios默认会在内部这样来处理后端返回的数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  // 请求发起会经过这里
  // config配置对象：本次请求的请求配置对象
  // console.log(config);
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config);
  // 这里务必要返回config配置对象，否则请求就停止在这儿出不去
  return config
}, function (error) {
  // Do something with request error
  // 如果请求出错了(还没有发出去)会进入这里
  return Promise.reject(error)
})
// 响应拦截器

export default request
