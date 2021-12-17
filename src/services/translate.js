import {
    GetTransLangListApi,
    PostTransContentApi,
    PostTransUploadFileApi,
    PostTransFileApi,
    PostTransDownFileApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function GetTransLangList() {
    return request(GetTransLangListApi, METHOD.GET)
}

export async function PostTransContent(obj) {
    return request(PostTransContentApi, METHOD.POST, obj)
}

export async function PostTransUpload(formData) {
    return request(PostTransUploadFileApi, METHOD.POST, formData)
    // return request(PostTransUploadFileApi, METHOD.POST, formData, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data;boundary = ' + new Date().getTime()
    //     }
    // })
}
export async function PostTransFile(obj) {
    return request(PostTransFileApi, METHOD.POST, obj)
}


export async function PostTransDownFile(obj) {
    return request(PostTransDownFileApi, METHOD.POST, obj, {responseType: 'blob'})
}
