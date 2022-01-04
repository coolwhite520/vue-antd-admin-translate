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

  GetAllUsersApi: `${BASE_URL}/admin`,
  PostRepairSysApi: `${BASE_URL}/admin/repair`,
  PostAddUserApi: `${BASE_URL}/admin`,
  PostModifyUserPwdApi: `${BASE_URL}/admin/password`,
  PostModifyUserMarkApi:  `${BASE_URL}/admin/mark`,
  DeleteUserApi: `${BASE_URL}/admin`,
  GetComponentsApi: `${BASE_URL}/admin/components`,
  PostUpgradeApi: `${BASE_URL}/admin/upgrade`,
}
