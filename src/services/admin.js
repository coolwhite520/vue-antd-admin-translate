import {
    GetAllUsersApi,
    GetUserOperatorRecordsApi,
    PostAddUserApi,
    PostModifyUserPwdApi,
    GetComponentsApi,
    DeleteUserApi,
    PostUpgradeApi,
    PostModifyUserMarkApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function GetAllUsers() {
    return request(GetAllUsersApi, METHOD.GET)
}
export async function GetComponents() {
    return request(GetComponentsApi, METHOD.GET)
}

export async function PostAddUser(obj) {
    return request(PostAddUserApi, METHOD.POST, obj)
}

export async function PostUpgrade(obj) {
    return request(PostUpgradeApi, METHOD.POST, obj)
}

export async function PostModifyUserPwd(obj) {
    return request(PostModifyUserPwdApi, METHOD.POST, obj)
}

export async function PostModifyUserMark(obj) {
    return request(PostModifyUserMarkApi, METHOD.POST, obj)
}


export async function DeleteUserById(id) {
    return request(`${DeleteUserApi}/${id}`, METHOD.DELETE)
}

export async function GetUserOperatorRecords(offset, count) {
    return request(`${GetUserOperatorRecordsApi}/${offset}/${count}`, METHOD.GET)
}

export async function DeleteOperatorRecordById(id) {
    return request(`${GetUserOperatorRecordsApi}/${id}`, METHOD.DELETE)
}

export async function DeleteAllOperatorRecord() {
    return request(GetUserOperatorRecordsApi, METHOD.DELETE)
}


