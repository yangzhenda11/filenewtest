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
    curStaffOrgId: null, 
    /** 当前用户组织深度*/
    orgPath: null,
    /** 当前用户所在组织的id（sys_org表主键） */
    curOrgId: null,
    /** 当前用户所在组织的上级公司id（sys_org表主键） */
    curCompanyId: null,
    /** 当前用户的用户名 */
    curStaffName: "",
    /** 当前用户的id （sys_staff主键） */
    curStaffId: null,
    /** 当前用户的权限集合 */
    permissions: [],
    /**当前岗位组织省份code */
   	provCode : null,
   	/**登录来源1:系统登录 0:云门户登录 */
   	loginSwitchSuccess : null,
   	/**是否属于本部：0不属于，1属于 */
   	mainOrgFlag : null,
    /** 当前用户的系统设置 */
    curConfigs: {
		config_page_size: "10,20,50",
		message_space: "6"
	}
};
//字典项缓存
var sysDictsCache = [];


//进业务页面之前统一错误处理方法
function errorInfoSolve(ms){
	layer.alert(ms,{icon:2,title:"错误"},function(index){
		layer.close(index);
		closeWindow();
	});
}
//关闭页面方法
function closeWindow(){
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
        window.location.href="about:blank";
        window.close();
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}

//获取用户基本信息
App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, userInfoSuccess, improperCallback, null, null, false);

function userInfoSuccess(result) {
	var data = result.data;
	globalConfig.provCode = data.provCode;
	globalConfig.curStaffId = data.staffId;
	globalConfig.curStaffName = data.staffName;
	globalConfig.curStaffOrgId = data.staffOrgId;
	globalConfig.curOrgId = data.orgId;
	globalConfig.curCompanyId = data.companyId;
	globalConfig.mainOrgFlag = data.mainOrgFlag;
	globalConfig.permissions = data.permissions;
	globalConfig.orgPath = data.orgPath;
}

//获取用户登录方式
App.formAjaxJson(globalConfig.serverPath + "configs/getSysConfig/getCloudPortSwitch", "get", null, loginSwitchSuccess, improperCallback, null, null, false);

function loginSwitchSuccess(result) {
	if(result.data != "") {
		globalConfig.loginSwitchSuccess = result.data;
	} else {
		globalConfig.loginSwitchSuccess = 1;
	}
}

//获取字典缓存
App.formAjaxJson(globalConfig.serverPath + "dicts/", "get",null, dictSuccess, improperCallback, null, null, false);

function dictSuccess(result) {
    var dictsData = result.dicts;
    for(var l = 0; l < dictsData.length; l++){
    	var dictsItem = dictsData[l];
    	if(dictsItem.dictStatus == "1"){
    		var dictsObj = {
        		dictId: dictsItem.dictId,
        		dictParentId: dictsItem.dictParentId,
        		dictLabel: dictsItem.dictLabel,
        		dictValue: dictsItem.dictValue
        	};
        	sysDictsCache.push(dictsObj);
    	}
    }
}

function improperCallback(result){
	var ms = result.message;
	errorInfoSolve(ms);
}