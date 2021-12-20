import {
    GetAllUsersApi,
    PostAddUserApi,
    PostModifyUserPwdApi,
    DeleteUserApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function GetAllUsers() {
    return request(GetAllUsersApi, METHOD.GET)
}
export async function PostAddUser(obj) {
    return request(PostAddUserApi, METHOD.POST, obj)
}
export async function PostModifyUserPwd(obj) {
    return request(PostModifyUserPwdApi, METHOD.POST, obj)
}
export async function DeleteUserById(id) {
    return request(`${DeleteUserApi}/${id}`, METHOD.DELETE)
}

