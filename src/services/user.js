import {LOGIN, LOGOFF, ROUTES, PostModifyPasswordAPi} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    username: name,
    password: password
  })
}

export async function PostModifyPassword(obj) {
  return request(PostModifyPasswordAPi, METHOD.POST, obj)
}


export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout(UserId) {
  request(LOGOFF, METHOD.POST, {user_id: UserId})
      .then(() => {
        localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
        localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
        localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
        removeAuthorization()
      })
      .catch(() => {
          localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
          localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
          localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
          removeAuthorization()
      })

}
export default {
  login,
  logout,
  getRoutesConfig
}
