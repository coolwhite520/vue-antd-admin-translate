import {
    PostActivationApi,
} from '@/services/api'

import {request, METHOD,} from '@/utils/request'

export async function PostActivation(obj) {
    return request(PostActivationApi, METHOD.POST, obj)
}
