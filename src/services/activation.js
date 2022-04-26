import {
    PostActivationApi,
    PostBanApi,
    PostActivationProofApi
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function PostActivation(obj) {
    return request(PostActivationApi, METHOD.POST, obj)
}
export async function PostBan() {
    return request(PostBanApi, METHOD.POST)
}

export async function PostActivationProof() {
    return request(PostActivationProofApi, METHOD.POST,  {}, {responseType: 'blob'})
}




