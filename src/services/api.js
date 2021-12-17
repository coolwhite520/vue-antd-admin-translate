//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX

module.exports = {
  LOGIN: `${BASE_URL}/api/user/login`,
  PostActivationApi:  `${BASE_URL}/api/activation`,
  GetTransLangListApi: `${BASE_URL}/api/translate/lang`,
  PostTransContentApi: `${BASE_URL}/api/translate/content`,
  PostTransUploadFileApi: `${BASE_URL}/api/translate/upload`,
  PostTransFileApi: `${BASE_URL}/api/translate/file`,
  PostTransDownFileApi: `${BASE_URL}/api/translate/down`,
  GetAllRecordsApi: `${BASE_URL}/api/translate/records`,
}
