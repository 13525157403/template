import { login as loginHttp, logout} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  user: {},
  privileges: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PRIVILEGES: (state, privileges) => {
    state.privileges = privileges
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      const from={
        username:userInfo.username.trim(),
        password:userInfo.password,
      }
      loginHttp(from).then((res) => {
          const {data}=res
          console.log(data.data.authorityList);
          setToken(data.data.idToken)
          commit('SET_TOKEN', data.data.idToken)
          var rolesArray = []
          data.data.authorityList.forEach(item => {
            rolesArray.push(item.code)
            if (item.children.length > 0) {
              item.children.forEach(items => {
                rolesArray.push(items.code)
                if (items.children.length > 0) {
                  items.children.forEach(itemS => {
                    rolesArray.push(itemS.code)
                  })
                }
              })
            }
          })
          commit('SET_PRIVILEGES', rolesArray)
          sessionStorage.setItem('privileges', JSON.stringify(rolesArray))
          window.sessionStorage.setItem('sessionUser', JSON.stringify(data.data.sessionUser))
          resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取动态路由
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      var userRoles = JSON.parse(sessionStorage.getItem('privileges'))
      userRoles = userRoles || []
      const data = {
        roles: userRoles,
        introduction: '',
        avatar: '',
        name: ''
      }
      if (!data) {
        reject('Verification failed, please Login again.')
      }
      const { roles, name, avatar, introduction } = data
      if (!roles || roles.length <= 0) {
        reject('getInfo: roles must be a non-null array!')
      }
      commit('SET_ROLES', roles)
      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      commit('SET_INTRODUCTION', introduction)
      commit('SET_USER', state.user)
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  },

  //登出
  logout({ commit, state, dispatch }) {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
