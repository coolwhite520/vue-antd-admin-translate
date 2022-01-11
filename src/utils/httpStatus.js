const HttpStatus = {
    HttpSuccess: 200,
    HttpDockerInitializing: -1000,
    HttpDockerRepairing: -1001,
    HttpDockerServiceException: -1002,
    HttpActivationNotFound: -1003,
    HttpActivationReadFileError: -1004,
    HttpActivationExpiredError: -1005,
    HttpActivationGenerateError: -1006,
    HttpActivationAESError: -1007,
    HttpActivationInvalidateError: -1008,
    HttpJwtTokenGenerateError: -1009,
    HttpUserForbidden: -1010,
    HttpUserNotLogin: -1011,
    HttpUserTwicePwdNotSame: -1012,
    HttpUserExpired: -1013,
    HttpUserUpdatePwdError: -1014,
    HttpUserPwdError: -1015,
    HttpUserNameOrPwdError: -1016,
    HttpFileTooBigger: -1017,
    HttpUploadFileError: -1018,
    HttpJsonParseError: -1019,
    HttpLanguageNotSupport: -1020,
    HttpTranslateError: -1021,
    HttpRecordGetError: -1022,
    HttpRecordDelError: -1023,
    HttpMysqlQueryError: -1024,
    HttpMysqlDeleteError: -1025,
    HttpMysqlAddError: -1026,
    HttpUsersExistSameUserNameError: -1027,
    HttpFileNotFoundError: -1028,
    HttpFileOpenError: -1029,
    HttpUserNoThisUserError: -1030,
    HttpForbiddenIp: -1031
}

export default HttpStatus;
