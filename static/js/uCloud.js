/**
 * 全局变量的配置
 */
var globalConfig = {
	/**静态服务地址 */
	staticPath: "/",
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
	provCode: null,
	/**登录来源1:系统登录 0:云门户登录 */
	loginSwitchSuccess: null,
	/**是否属于本部：0不属于，1属于 */
	mainOrgFlag: null,
	/** 当前用户的系统设置 */
	curConfigs: {}
};
//获取用户基本信息
App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, successCallback, improperCallback, errorCallback, null, false);

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

function improperCallback(result) {
	if(result.responseText.indexOf("会话已经超时") != -1){
		layer.alert("由于您长时间未操作，为安全起见系统已经自动退出，请重新登录", {icon: 2,title:"登录超时",closeBtn: 0},function(){
			top.window.location.href = "/login";
		});
	}else{
		 layer.alert("用户信息获取失败，请重新登录或联系管理员", { icon: 2, title: "错误", closeBtn: 0 }, function(index) {
	        window.location.href = "login.html";
	    });
	}
}

function errorCallback(result) {
	if(result.responseText.indexOf("会话已经超时") != -1){
		layer.alert("由于您长时间未操作，为安全起见系统已经自动退出，请重新登录", {icon: 2,title:"登录超时",closeBtn: 0},function(){
			top.window.location.href = "/login";
		});
	}else{
		 layer.alert("用户信息获取失败，请重新登录或联系管理员", { icon: 2, title: "错误", closeBtn: 0 }, function(index) {
            window.location.href = "login.html";
        });
	}
}
//获取用户分页信息
App.formAjaxJson(globalConfig.serverPath + "configs/getVal", "GET", {
	staffOrgId: globalConfig.curStaffOrgId,
	code: "config_page_size"
}, configSuccess, configImproper, configError, null, false);

function configSuccess(result) {
	if(result.data != "") {
		globalConfig.curConfigs.configPagelengthMenu = result.data;
	} else {
		globalConfig.curConfigs.configPagelengthMenu = "10,20,50,100";
	}
}

function configImproper(result) {
	globalConfig.curConfigs.configPagelengthMenu = "10,20,50,100";
}

function configError(result) {
	globalConfig.curConfigs.configPagelengthMenu = "10,20,50,100";
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