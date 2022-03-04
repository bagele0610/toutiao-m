// 用户相关请求模块

import request from '@/utils/request'
// import store from '@/store'

export const login = data => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    // data: data
    data
  })
}
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    //     Authorization: `Berer ${store.state.user.token}`
    // }
  })
}
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/channels'
    // 发送请求头数据
    // headers: {
    //     Authorization: `Berer ${store.state.user.token}`
    // }
  })
}

// 关注用户
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}

// 取消关注
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`

  })
}

// 获取当前用户的个人资料
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'

  })
}

// 编辑用户个人资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data

  })
}

// 编辑用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data

  })
}
