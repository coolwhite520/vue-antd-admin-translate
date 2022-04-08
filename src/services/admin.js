import {
    GetAllUsersApi,
    GetUserOperatorRecordsApi,
    PostAddUserApi,
    PostModifyUserPwdApi,
    GetComponentsApi,
    GetSystemCpuMemDiskDetailApi,
    DeleteUserApi,
    PostUpgradeApi,
    PostModifyUserMarkApi,
    IpTableTypeUrl,
    GetSysInfoUrl,
    IpTableUrl,
    GetAllTransRecordsApi,
    PostDownContainerLogsApi,
    PostDownSysLogsApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function GetAllUsers() {
    return request(GetAllUsersApi, METHOD.GET)
}

export async function GetAllTransRecords(offset, count) {
    return request(`${GetAllTransRecordsApi}/${offset}/${count} `, METHOD.GET)
}

export async function GetComponents() {
    return request(GetComponentsApi, METHOD.GET)
}

export async function GetSystemCpuMemDiskDetail() {
    return request(GetSystemCpuMemDiskDetailApi, METHOD.GET)
}

export async function PostDownContainerLogs(containerName) {
    return request(PostDownContainerLogsApi, METHOD.POST, {name: containerName}, {responseType: 'blob'})
}

export async function PostDownSysLogs() {
    return request(PostDownSysLogsApi, METHOD.POST, {}, {responseType: 'blob'})
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

export async function GetAllIpTableRecords() {
    return request(IpTableUrl, METHOD.GET)
}
export async function AddIpTableRecord(obj) {
    return request(IpTableUrl, METHOD.POST, obj)
}


export async function SwitchTableType(value) {
    return request(IpTableTypeUrl, METHOD.POST, {type: value})
}

export async function GetTableType() {
    return request(IpTableTypeUrl, METHOD.GET)
}

export async function GetSysInfo() {
    return request(GetSysInfoUrl, METHOD.GET)
}

export async function DeleteIpTableRecordById(id) {
    return request(`${IpTableUrl}/${id}`, METHOD.DELETE)
}


