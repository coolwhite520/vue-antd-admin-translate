import {
    GetTransLangListApi,
    PostTransContentApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function GetTransLangList() {
    return request(GetTransLangListApi, METHOD.GET)
}

export async function PostTransContent(obj) {
    return request(PostTransContentApi, METHOD.POST, obj)
}
