/**
 * 全局变量的配置（云平台处理待办）
 */
var globalConfig = {
    /**静态服务地址 */
    staticPath: "/",
    /**静态服务文件上传地址 */
    fileUploadPath: "/",
    /**后台服务地址 */
    serverPath: "/",
    /** 当前用户的岗位id （sys_staff_org表主键） */
    curStaffOrgId: null, //10001
    /** 当前用户所在组织的id（sys_org表主键） */
    curOrgId: null, //56665
    /** 当前用户所在组织的上级公司id（sys_org表主键） */
    curCompanyId: null,
    /** 当前用户的用户名 */
    curStaffName: "",
    /** 当前用户的id （sys_staff主键） */
    curStaffId: null, //10002
    /** 当前用户的权限集合 */
    permissions: [],
    /**当前岗位组织省份code */
   	provCode : null,
   	/**登录来源1:系统登录 0:云门户登录 */
   	loginSwitchSuccess : null,
   	/**是否属于本部：0不属于，1属于 */
   	mainOrgFlag : null,
    /** 当前用户的系统设置 */
    curConfigs: {}
};
//获取用户基本信息
App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, successCallback, null, null, null, false);

function successCallback(result) {
	var data = result.data;
	globalConfig.provCode = data.provCode;
	globalConfig.curStaffId = data.staffId;
	globalConfig.curStaffName = data.staffName;
	globalConfig.curStaffOrgId = data.staffOrgId;
	globalConfig.curOrgId = data.orgId;
	globalConfig.curCompanyId = data.companyId;
	globalConfig.mainOrgFlag = data.mainOrgFlag;
	globalConfig.permissions = data.permissions;
}

//获取用户配置信息
//系统默认配置
var defaultCurConfigs = {
	config_page_size: "10,20,50",
	message_space: "6"
}
//获取用户自定义配置信息
App.formAjaxJson(globalConfig.serverPath + "personalConfig/list", "GET", { staffOrgId: globalConfig.curStaffOrgId,draw:1,start:0,length:100}, configSuccess, configImproper, configError, null, false);
function configSuccess(result) {
	var data = result.data;
    if (data != "") {
    	var personalConfigObj = {};
		$.each(data, function(k,v) {
			personalConfigObj[v.code] = v.val;
		});
        globalConfig.curConfigs = personalConfigObj;
    } else {
        globalConfig.curConfigs = defaultCurConfigs;
    }
}

function configImproper(result) {
	globalConfig.curConfigs = defaultCurConfigs;
}

function configError(result) {
	globalConfig.curConfigs = defaultCurConfigs;
}
//获取用户登录方式
App.formAjaxJson(globalConfig.serverPath + "configs/getSysConfig/getCloudPortSwitch", "get", null, loginSwitchSuccess, null, null, null, false);

function loginSwitchSuccess(result) {
	if(result.data != "") {
		globalConfig.loginSwitchSuccess = result.data;
	} else {
		globalConfig.loginSwitchSuccess = 1;
	}
}