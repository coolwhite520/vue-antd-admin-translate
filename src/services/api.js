//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = API_PROXY_PREFIX

module.exports = {
  LOGIN: `${BASE_URL}/user/login`,
  PostModifyPasswordAPi: `${BASE_URL}/user/password`,
  PostActivationApi:  `${BASE_URL}/activation`,
  GetTransLangListApi: `${BASE_URL}/translate/lang`,
  PostTransContentApi: `${BASE_URL}/translate/content`,
  PostTransUploadFileApi: `${BASE_URL}/translate/upload`,
  PostTransFileApi: `${BASE_URL}/translate/file`,
  PostTransDownFileApi: `${BASE_URL}/translate/down`,
  GetAllRecordsApi: `${BASE_URL}/translate/records`,
  PostDeleteRecordApi: `${BASE_URL}/translate/delete`,

  GetAllUsersApi: `${BASE_URL}/users`,
  PostAddUserApi: `${BASE_URL}/users`,
  PostModifyUserPwdApi: `${BASE_URL}/users/password`,
  DeleteUserApi: `${BASE_URL}/users`
}
