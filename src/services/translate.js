import {
    GetTransLangListApi,
    PostTransContentApi,
    PostTransUploadFileApi,
    PostTransFileApi,
    PostTransDownFileApi,
    GetAllRecordsApi,
    GetAllLangListApi,
    PostDeleteRecordApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function GetTransLangList() {
    return request(GetTransLangListApi, METHOD.GET)
}
export async function GetAllLangList() {
    return request(GetAllLangListApi, METHOD.GET)
}

export async function GetRecordsByType(type, offset, count) {
    return request(`${GetAllRecordsApi}/${type}/${offset}/${count} `, METHOD.GET)
}

export async function PostTransContent(obj) {
    return request(PostTransContentApi, METHOD.POST, obj)
}

export async function PostTransUpload(formData) {
    return request(PostTransUploadFileApi, METHOD.POST, formData)
}
export async function PostTransFile(obj) {
    return request(PostTransFileApi, METHOD.POST, obj)
}
export async function PostTransDownFile(obj) {
    return request(PostTransDownFileApi, METHOD.POST, obj, {responseType: 'blob'})
}

export async function PostDeleteRecord(obj) {
    return request(PostDeleteRecordApi, METHOD.POST, obj)
}

