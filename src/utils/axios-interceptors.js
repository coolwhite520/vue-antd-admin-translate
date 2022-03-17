import Cookie from 'js-cookie'
import HttpStatus from "./httpStatus";
// 401拦截
const resp401 = {
    /**
     * 响应数据之前做点什么
     * @param response 响应对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(response, options) {
        const {message} = options
        if (response.code === 401) {
            message.error('无此权限')
        }
        return response
    },
    /**
     * 响应出错时执行
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        const {response} = error
        if (response && response.status === 401) {
            message.error('无此权限')
        }
        return Promise.reject(error)
    }
}

const resp403 = {
    onFulfilled(response, options) {
        const {message} = options
        if (response.code === 403) {
            message.error('请求被拒绝')
        }
        return response
    },
    onRejected(error, options) {
        const {message} = options
        const {response} = error
        if (response && response.status === 403) {
            message.error('请求被拒绝')
        }
        return Promise.reject(error)
    }
}

// 未激活  或 激活过期 拦截
const respNotActivation = {
    /**
     * 响应数据之前做点什么
     * @param response 响应对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(response, options) {
        const {router} = options
        if (response.data.code === HttpStatus.HttpActivationNotFound ||
            response.data.code === HttpStatus.HttpActivationReadFileError ||
            response.data.code === HttpStatus.HttpActivationInvalidateError ||
            response.data.code === HttpStatus.HttpActivationExpiredError)
        {
            let {sn} = response.data;
            router.push({
                path: '/activation',
                query: {
                    sn
                }
            })
        }
        return response
    },
    /**
     * 响应出错时执行
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        message.warning(error.message)
        return Promise.reject(error)
    }
}


const respLoginExpired = {
    /**
     * 响应数据之前做点什么
     * @param response 响应对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(response, options) {
        const {router} = options
        if (response.data.code === HttpStatus.HttpUserExpired ||
            response.data.code === HttpStatus.HttpUserNoThisUserError ||
            response.data.code === HttpStatus.HttpForbiddenIp ||
            response.data.code === HttpStatus.HttpUserNotLogin) {
            router.push({path: '/login',})
        }
        return response
    },
    /**
     * 响应出错时执行
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        message.warning(error.message)
        return Promise.reject(error)
    }
}

const reqCommon = {
    /**
     * 发送请求之前做些什么
     * @param config axios config
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {*}
     */
    onFulfilled(config, options) {
        const {message} = options
        const {url, xsrfCookieName} = config
        if (url.indexOf('login') === -1 && xsrfCookieName && !Cookie.get(xsrfCookieName)) {
            message.warning('认证 token 已过期，请重新登录')
        }
        return config
    },
    /**
     * 请求出错时做点什么
     * @param error 错误对象
     * @param options 应用配置 包含: {router, i18n, store, message}
     * @returns {Promise<never>}
     */
    onRejected(error, options) {
        const {message} = options
        message.error(error.message)
        return Promise.reject(error)
    }
}

export default {
    request: [reqCommon], // 请求拦截
    response: [resp401, resp403, respNotActivation, respLoginExpired] // 响应拦截
}
