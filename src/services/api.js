//跨域代理前缀
const API_PROXY_PREFIX='/api'
const BASE_URL = API_PROXY_PREFIX

module.exports = {
  LOGIN: `${BASE_URL}/user/login`,
  LOGOFF: `${BASE_URL}/user/logoff`,
  PostModifyPasswordAPi: `${BASE_URL}/user/password`,
  PostActivationApi:  `${BASE_URL}/activation`,
  PostActivationProofApi:  `${BASE_URL}/activation/proof`,
  PostBanApi:  `${BASE_URL}/activation/ban`,
  GetTransLangListApi: `${BASE_URL}/translate/lang`,
  GetAllLangListApi: `${BASE_URL}/translate/allLang`,
  PostTransContentApi: `${BASE_URL}/translate/content`,
  PostTransUploadFileApi: `${BASE_URL}/translate/upload`,
  PostTransFileApi: `${BASE_URL}/translate/file`,
  PostTransDownFileApi: `${BASE_URL}/translate/down`,
  GetAllRecordsApi: `${BASE_URL}/translate/records`,
  PostDeleteRecordApi: `${BASE_URL}/translate/delete`,

  GetAllUsersApi: `${BASE_URL}/admin`,
  GetUserOperatorRecordsApi: `${BASE_URL}/admin/ops`,
  PostRepairSysApi: `${BASE_URL}/admin/repair`,
  PostAddUserApi: `${BASE_URL}/admin`,
  PostModifyUserPwdApi: `${BASE_URL}/admin/password`,
  PostModifyUserMarkApi:  `${BASE_URL}/admin/mark`,
  DeleteUserApi: `${BASE_URL}/admin`,
  GetComponentsApi: `${BASE_URL}/admin/components`,
  PostUpgradeApi: `${BASE_URL}/admin/upgrade`,
  GetAllTransRecordsApi: `${BASE_URL}/admin/all_records`,
  GetSysInfoUrl: `${BASE_URL}/admin/sysinfo`,
  GetSystemCpuMemIoDetailApi: `${BASE_URL}/admin/cpu_mem_io`,
  PostDownContainerLogsApi: `${BASE_URL}/admin/container_logs`,
  PostDownSysLogsApi: `${BASE_URL}/admin/sys_logs`,
  IpTableUrl: `${BASE_URL}/admin/ip_table`,
  IpTableTypeUrl: `${BASE_URL}/admin/ip_table_type`,


  UserFavorUrl: `${BASE_URL}/user/favor`,


}
