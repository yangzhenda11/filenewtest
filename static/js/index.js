/**
 * 全局变量的配置
 */
var globalConfig = {
    /**静态服务地址 */
    staticPath: "/",
    /**静态服务文件上传地址 */
    fileUploadPath: "/",
    /**后台服务地址 */
    serverPath: "/",
    /** 当前用户组织深度*/
    orgPath: null,
    /** 当前用户所在组织的id（sys_org表主键） */
    curOrgId: null,
    /** 当前用户所在组织的名称 */
    curOrgName: null,
    /** 当前用户所在组织的上级公司id（sys_org表主键） */
    curCompanyId: null,
    /** 当前用户的用户名 */
    curStaffName: "",
    /** 当前用户的id （sys_staff主键） */
    curStaffId: null, 
    /** 当前用户的岗位id （sys_staff_org表主键） */
    curStaffOrgId: null,
    /** 当前用户的角色 （数组存储） */
    curRole: [],
    /** 当前用户的权限集合 */
    permissions: [],
    /** 当前用户的数据权限集合 */
    dataPermission: null,
    /**当前岗位组织省份code */
   	provCode : null,
   	/**公司编码 */
   	companyCode: null,
   	/**登录来源1:系统登录 0:云门户登录 */
   	loginSwitchSuccess : null,
   	/**是否属于本部：0不属于，1属于 */
   	mainOrgFlag : null,
    /** 当前用户的系统设置 */
    curConfigs: {},
    /**二阶段用户所选稽核范围 */
    auditScope: null,
    /**ifream */
    ifreamLen: 0
};
//缓存文件
var _paramCache = {}
//菜单
var ace_menus = null;
//跳转参数
var jmpParameters = new Object();
$(document).ready(function() {
	//获取用户基本信息
    App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, successCallback, improperCallback, null, null, false);
    function successCallback(result) {
    	//系统默认配置
    	var defaultCurConfigs = {
    		config_page_size: "10,20,50",
			message_space: "6"
		}
        var data = result.data;
        globalConfig.provCode = data.provCode;
        globalConfig.curOrgName = data.orgName;
        globalConfig.curStaffId = data.staffId;
        globalConfig.curStaffName = data.staffName;
        globalConfig.curStaffOrgId = data.staffOrgId;
        globalConfig.curOrgId = data.orgId;
        globalConfig.curCompanyId = data.companyId;
        globalConfig.mainOrgFlag = data.mainOrgFlag;
        globalConfig.permissions = data.permissions;
        globalConfig.dataPermission = data.dataPermission;
        globalConfig.orgPath = data.orgPath;
        globalConfig.loginName = data.loginName;
        globalConfig.companyCode = data.companyCode;
       	globalConfig.curRole = data.rolestrs.split(",");
       	//为稽核时特殊处理
        if(data.loginName.indexOf("qc_zj") != -1 || data.loginName.indexOf("qc_gd") != -1){
        	ace_menus = [{
        	 	childrens: [],
        	 	grade: 0,
        	 	icon: "iconfont icon-report",
        	 	id: 90469,
        	 	name: "合同扫描件上传",
        	 	openType: "1",
        	 	pid: "1",
        	 	uri: "html/scanCpyMgt/scanCpyUpload/scanCpyUploadList.html"
        	}];
        }else{
        	ace_menus = data.menus;
        };
        $(".user-info").html("<small>欢迎,</small>" + data.staffName);
        if (data.staffOrgs.length > 0) {
            for (var i = 0; i < data.staffOrgs.length; i++) {
                if (data.staffOrgId == data.staffOrgs[i].staffOrgId) {
                    $(".user-menu").prepend("<li> <a id=\"staffOrg" + data.staffOrgs[i].staffOrgId + " \" href=\"javascript:changeStaffOrg(" + data.staffOrgs[i].staffOrgId + ");\" style=\"color:red;\"> <i class=\"ace-icon fa fa-cube\"></i> " + data.staffOrgs[i].orgName + "</a> </li>");
                } else {
                    $(".user-menu").prepend("<li> <a id=\"staffOrg" + data.staffOrgs[i].staffOrgId + " \" href=\"javascript:changeStaffOrg(" + data.staffOrgs[i].staffOrgId + ");\" style=\"color:black;\"> <i class=\"ace-icon fa fa-cube\"></i> " + data.staffOrgs[i].orgName + "</a> </li>");
                }
            }
        };
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
	    App.formAjaxJson(globalConfig.serverPath + "configs/getSysConfig/getCloudPortSwitch", "get",null, loginSwitchSuccess, null, null, null, false);
	
	    function loginSwitchSuccess(result) {
	        if (result.data != "") {
	            globalConfig.loginSwitchSuccess = result.data;
	        } else {
	            globalConfig.loginSwitchSuccess = 1;
	        }
	    }
	    //消息定时器
    	var messageSpace = globalConfig.curConfigs.message_space;
    	if(messageSpace == null || messageSpace >= 30){
    		messageSpace = 30;
    	};
    	if(checkPageRoleType("income") || checkPageRoleType("expense")){
    		setWorktableMessageNumber();
			var messageInterval = setInterval(setWorktableMessageNumber, messageSpace*60000);
		}else{
			setMessageTipNumber();
			var messageInterval = setInterval(setMessageTipNumber, messageSpace*60000);
		};
        //请求用户信息成功后加载公告列表
        getIndexNotiveTableInfo(true);
        //请求用户信息成功后加载首页列表
        getHomePage();
    }
    function improperCallback(result){
    	if(result.status == 9002){
    		window.location.href = "permissionDenied.html";
    	}else if(result.status == 9003){
    		layer.alert("您的用户状态异常。如需正常访问系统，请联系系统管理员",{icon:2,title:"提示",closeBtn:0},function(){
                logout();
            })
    	}else{
    		layer.alert(result.message,{icon:2,title:"提示",closeBtn:0},function(){
                logout();
            })
    	}
    }
})


/****************************待办数量查询*****************************/
//无工作台角色
function setMessageTipNumber(){
	var messageIntervalData = {
		staffId : globalConfig.curStaffId,
		draw : 999,
		start : 0,
		length : 0
	};
	App.formAjaxJson(globalConfig.serverPath + "workflowrest/taskToDo", "get", messageIntervalData, messageSuccessCallback,null,messageErrorCallback,false);
    function messageSuccessCallback(result) {
        if(result){
        	$("#messageTipNumber").text(result.recordsTotal);
        }
    }
    function messageErrorCallback(result){
    	$("#messageTipNumber").text("?");
    }
}
//存在工作台角色
function setWorktableMessageNumber(){
	var todoData = {
		staffId : globalConfig.curStaffId,
		draw : 999,
		start : 0,
		length : 0
	};
	var toreadData = {
		draw : 999,
		start : 0,
		length : 0
	};
	App.formAjaxJson(globalConfig.serverPath + "workflowrest/taskToDo", "get", todoData, todoSuccessCallback,null,todoErrorCallback);
	App.formAjaxJson(globalConfig.serverPath + "recordToread/getRecordToreadList", "POST", JSON.stringify(toreadData), toreadSuccessCallback,null,toreadErrorCallback,false);
    function todoSuccessCallback(result) {
    	$("#todoNum,#messageTipNumber").text(result.recordsTotal);
    };
    function todoErrorCallback(result){
    	$("#todoNum,#messageTipNumber").text("?");
    };
    function toreadSuccessCallback(result) {
    	$("#toreadNum").text(result.recordsTotal);
    };
    function toreadErrorCallback(result){
    	$("#toreadNum").text("?");
    };
}
/*
 * 待办待阅跳转
 */
function jumpWorkflow(type){
	if(type == "todo"){
		var url = "html/workflow/tasklist/task-todo.html";
		top.showSubpageTab(url,"待办事项",false,false,true);
	}else if(type == "toread"){
		var url = "html/workflow/readrecordlist/record-toread.html";
		top.showSubpageTab(url,"待阅事项",false,false,true);
	};
}
/****************************待办数量查询*****************************/

/****************************子页面权限处理*****************************/
// 页面权限过滤
function data_permFilter(obj) {
    var e = obj.querySelectorAll('[data-permcheck]');
    var permissions = globalConfig.permissions;
    for (var i = 0; i < e.length; i++) {
        if ($(e[i]).data('permcheck') != "") {
            if ($.inArray($(e[i]).data('permcheck'), permissions) < 0) {
                $(e[i]).remove();
            } else {
                $(e[i]).removeClass("hidden");
            }
        } else {
            $(e[i]).removeClass("hidden");
        }
    }
}
// table中权限过滤查询是否存在
function data_tpFilter(permCheck) {
    var permissions = globalConfig.permissions;
    if ($.inArray(permCheck, permissions) >= 0) {
        return true;
    } else {
        return false;
    }
}
/****************************子页面权限处理*****************************/

/****************************切换岗位*****************************/
function changeStaffOrg(staffOrgId) {
	App.formAjaxJson(globalConfig.serverPath + "validateOrgId/" + staffOrgId, "GET", null,changeStationSuccess,improperCallback);
	function changeStationSuccess(result){
   		if(result.data == 1){
            $.ajax({
                type: "GET",
                url:"/changeStation?staffOrgId=" + staffOrgId,
                dataType: "json",
                async: false,
                contentType: "application/json",
				error:function (result) {
                    if(result.responseText.indexOf("会话已经超时") != -1 && result.responseJSON == null){
                        message = "切换岗位时发生异常,请联系管理员";
                        layer.alert(message,{icon:2,title:"提示"});
                    }else {
                        App.formAjaxJson(globalConfig.serverPath + "changestation/" + staffOrgId, "GET", null, successCallback, improperCallback, null, null, false);
                        function successCallback(result) {
                            window.location.reload();
                        }
					}
                },
				success:function () {
                    App.formAjaxJson(globalConfig.serverPath + "changestation/" + staffOrgId, "GET", null, successCallback, improperCallback, null, null, false);
                    function successCallback(result) {
                        window.location.reload();
                    }
                }
            });
   		}else{
			improperCallback(result);
		}
	};
	function improperCallback(result){
    	var message = result.message;
    	if(result.status == 9002){
    		message = "系统尚未在岗位所在的组织上线，您无法用选择的岗位访问系统";
    	}else if(result.status == 9003){
    		message = "您的用户状态异常。如需正常访问系统，请联系系统管理员";
    	};
    	layer.alert(message,{icon:2,title:"提示"});
    };
}
/****************************切换岗位*****************************/

/****************************修改密码*****************************/
function updatePasswd() {
    $('#editPasswd').modal('show');
    $('#passwdForm input').val("");
    if (!$('#passwdForm').data('bootstrapValidator')) {
    	validatePassword();
    }
}
$("#editPasswd").on('hide.bs.modal',function(e){
	$('#passwdForm').bootstrapValidator('resetForm', true);
});
function changePasswd() {
      App.formAjaxJson(globalConfig.serverPath + "upfKeyPair?" + App.timestamp(),"GET", null, keyPairCallback, null, null, null, false);

    function keyPairCallback(result) {
        var passwd = $("#passwdForm input[name='passwd']").val();
        var modulus = result.data.modulus,
            exponent = result.data.exponent;
        if (passwd.length != 256) {
            var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
        }
        var pwd = RSAUtils.encryptedString(publicKey, passwd);
        App.formAjaxJson(globalConfig.serverPath + "staffs/" + globalConfig.curStaffId + "/main/passwd?" + App.timestamp(),"GET", { "passwd": pwd }, passwdCallback, passwdErrorCallbacks, null, null, false);

        function passwdCallback(result) {
            if (result.data) {
                layer.alert("用户["+globalConfig.curStaffName+"]的密码已经修改，为安全起见需退出系统重新登录,点击确认按钮退出系统!",{icon:1,closeBtn:0},function () {
                    logout();
                });
            }
        }
        function passwdErrorCallbacks() {
            layer.msg("修改密码失败！");
        }
    }
}
/*
 * 表单验证
 */
function validatePassword() {
	$('#passwdForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup change',
		message: '校验未通过',
		container: 'popover',
		fields: {
	        passwd: {
	            validators: {
	                notEmpty: {
	                    message: '请输入新密码'
	                },
	                regexp: {
	                    regexp: /^(?!.*')(?!.*\^)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/,
	                    message: "请输入6到18位同时包含大小写字母及数字密码且不包含'^"
	                },
                    identical: {
                        field: 'passConfirm',
                        message: '两次输入的密码不一致。'
                    }
	            }
	        },
	        passConfirm: {
	            validators: {
	                notEmpty: {
	                    message: '请再次输入密码确认'
	                },
	                regexp: {
	                    regexp: /^(?!.*')(?!.*\^)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/,
	                    message: "请输入6到18位同时包含大小写字母及数字密码且不包含'^"
	                },
	                identical: {
	                    field: 'passwd',
	                    message: '两次输入的密码不一致。'
	                }
	            }
	        }
	    }
	}).on('success.form.bv', function(e) {
		e.preventDefault();
        changePasswd();
	})
};
/****************************修改密码*****************************/

/****************************退出登录*****************************/
//退出登录
function logout() {
	layer.confirm('是否要退出系统？退出系统后,浏览器当前窗口会自动关闭。', {
        icon: 0
    }, function() {
        clearAllCookie();
        App.formAjaxJson(globalConfig.serverPath + "staffs/removeStaffCache", "POST", null, successMethod);
        function successMethod(result) {
            App.formAjaxJson("/logout", "POST", null, successCallback);
            function successCallback(result) {
            	console.log(result);
            	if (result.status == 1){
                    closeWindow();
				}
            }
        }
    })
}
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
/*
 * 清除cookie
 */
function clearAllCookie() {  
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);  
    if(keys) {
        for(var i = keys.length; i--;){
			document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
    }
}
/****************************退出登录*****************************/


/****************************首页公告*****************************/
/*
 * 请求用户信息成功后加载公告列表
 */
function getIndexNotiveTableInfo(isInit){
	var url = globalConfig.serverPath + "notifyController/search4Page1.do";
	var requestParm = {
		draw: 990,
		start: 0,
		length: 10
	};
	App.formAjaxJson(url,"post",requestParm,successCallback,null,null,null,null,"formData");
	function successCallback(result){
		if(isInit){
			if(result.recordsTotal > 0){
				$("#indexNotiveTableView").modal('show');
		    	$("#indexNotiveTableView").on('shown.bs.modal', function (e) {
					initNotiveTableInfo();
				})
			}
		}else{
			if(result.recordsTotal > 0){
				var table = $('#indexNotiveTable').DataTable();
				table.ajax.reload(null, false);
			}else{
				$("#indexNotiveTableView").modal('hide');
			}
		}
	}
}
function initNotiveTableInfo(){
	App.initDataTables('#indexNotiveTable', {
		ajax: {
			"type": "post",
			"url": globalConfig.serverPath + 'notifyController/search4Page1.do',
			"data": function(d) {
				return d;
			}
		},
		"columns": [
			{"data" : null,"title":"序号","className": "text-center",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#indexNotiveTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
			{
				"data": null,
				"title": "公告标题",
				render: function(data, type, full, meta) {
					return '<a href=\"javascript:void(0)\" title=' + data.notifyTitle + ' onclick = "indexNotiveModal(\'' + data.notifyId + '\')">' + data.notifyTitle + '</a>';
				}
			},
			{
	            "data" : "lastUpdateByName",
	            "title" : "发布人",
	        },
			{
				"data": "lastUpdateDate",
				"title": "发布时间"
			},
			{
				"data": "noticeState",
				"title": "公告状态",
				render: function(data, type, full, meta) {
					var noticeState = "未知";
					if(data == 0){
						noticeState = "作废";
					}else if(data == 1){
						noticeState = "未发布";
					}else if(data == 2){
						noticeState = "已发布";
					};
					return noticeState;
				}
			},
			{
				"data": "noticeTop",
				"title": "是否置顶",
				render: function(data, type, full, meta) {
					return data == '1' ? '是' : '否';
				}
			}
		]
	})
}
/*
 * 公告详情
 */
function indexNotiveModal(notifyId){
	var url = globalConfig.serverPath + "notifyController/findNotifyById"
	App.formAjaxJson(url,"post",{notifyId:notifyId},successCallback,null,null,null,null,"formData");
	function successCallback(result){
		var data = result.data;
		if(data){
			$('#indexNotiveDetailView').modal('show');
			var noticeTypeDict = App.getDictInfo(9110);
			var noticeTopName = data.noticeTopName == "1" ? "置顶" : "非置顶";
			var notiveDetailAttribute = noticeTypeDict[data.noticeType] + " | " + noticeTopName;
			$(".notiveDetailTitle").text(data.notifyTitle);
			$(".notiveDetailAttribute").text(notiveDetailAttribute);
			$("#notifyContent").html(data.notifyContent);
			viewNotify(notifyId);
		}
	}
}
/**
 * 获取附件列表记录读取状态
 */
function viewNotify(notifyId) {
	var getFileurl = globalConfig.serverPath + "notifyController/listNotifyFileAttachmentFileID";
	var saveNotifyUrl = globalConfig.serverPath + 'notifyController/saveNotifyRead';
	App.formAjaxJson(getFileurl,"get",{notifyBusiId:notifyId},successCallback);
	function successCallback(result){
		var data = result.data;
		$("#notiveFileList").html("");
		if(data.length > 0){
			$.each(data, function(k,v) {
				var html = '<p><i class="icon iconfont icon-yanshoushq"></i>'+
					'<a title="点击下载" href="'+globalConfig.serverPath+"fileload/downloadS3?key="+v.storeIdKey+'">'+ v.displayName+'</a></p>'
				$("#notiveFileList").append(html);
			});
		}else{
			var html = '<p>暂无公告附件</p>'
			$("#notiveFileList").append(html);
		}
	};
	App.formAjaxJson(saveNotifyUrl,"post",{notifyId:notifyId},saveNotifyRead,null,null,null,null,"formData");
	function saveNotifyRead(){
		getIndexNotiveTableInfo();
	}
}
/****************************首页公告*****************************/

/****************************首页按钮事件实现*****************************/
/*
 * 待办按钮跳转待办
 */
function openTasktodo(){
	showSubpageTab("html/workflow/tasklist/task-todo.html","待办事项",false,false,true);
}
/*
 * 支撑modal打开
 */
function appSupportShow(){
	$("#appSupport").modal("show");
}
/*
 * 菜单隐藏实现
 */
var $hidemenu = $('#hidemenu');
$hidemenu.click(function() {
    $('body').removeClass('hideNavbar');
    $(this).hide();
})

function hideNavbar() {
    $('body').addClass('hideNavbar');
    $hidemenu.show();
}
//用户信息划过显示
$("#loginInfoCon").hover(function(){
	$("#user-menu").show();
},function(){
	$("#user-menu").hide();
})
/*
 * 全屏实现
 */
$("#fullScreen").on("click", function() {
    var fullscreenEnabled = document.fullscreenEnabled ||
        document.webkitFullscreenEnabled ||
        document.mozFullScreenEnabled ||
        document.msFullscreenEnabled
    if (!fullscreenEnabled) {
        layer.msg("当前浏览器不支持全屏操作", { icon: 2 });
        return false;
    };
    var fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
    if (fullscreenElement) {
        exitFullscreen();
    } else {
        launchFullscreen(document.documentElement);
    }
});
//全屏事件
function launchFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}
//退出全屏事件
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}
//全屏相关事件监听事件
document.addEventListener("fullscreenchange", function(e) {
    checkFullscreen();
});
document.addEventListener("mozfullscreenchange", function(e) {
    checkFullscreen();
});
document.addEventListener("webkitfullscreenchange", function(e) {
    checkFullscreen();
});
document.addEventListener("MSFullscreenChange", function(e) {
    checkFullscreen();
});

function checkFullscreen() {
    var fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
    if (fullscreenElement) {
        $("#fullScreen").removeClass("fa-expand").addClass("fa-compress");
        $("#fullScreen").parent().attr("title", "点击退出全屏");
    } else {
        $("#fullScreen").removeClass("fa-compress").addClass("fa-expand");
        $("#fullScreen").parent().attr("title", "点击全屏")
    }
}
/****************************首页按钮事件实现*****************************/


/****************************首屏显示处理*****************************/
//请求用户信息成功后加载首页列表
//系统的全局变量获取
var serverPath = globalConfig.serverPath;
function getHomePage(){
	var userLoginName = globalConfig.loginName;
    if(userLoginName.indexOf("qc_zj") != -1 || userLoginName.indexOf("qc_gd") != -1 ){
    	$("#contractWorktable").remove();
    	$("#content-tabs").css("top","-1px");
		$("#content-main").css("top","33px");
		$("#main-content").show();
		showSubpageTab("html/scanCpyMgt/scanCpyUpload/scanCpyUploadList.html","合同扫描件上传",false,false,true);
    }else{
    	if(checkPageRoleType("income") || checkPageRoleType("expense")){
    		setWorktableRoleName();
    		if(checkPageRoleType("income",true)){
	    		setIncomeHomePage();
	    	}else if(checkPageRoleType("expense",true)){
	    		setExpenseHomePage();
	    	}
    	}else{
    		$("#contractWorktable").remove();
	    	$("#content-tabs").css("top","-1px");
			$("#content-main").css("top","33px");
			$("#main-content").show();
	    	showSubpageTab("html/workflow/tasklist/task-todo.html","待办事项",false,false,true);
    	};
    };
}
//设置工作台标题
function setWorktableRoleName(){
	$("#content-tabs").css("top","128px");
	$("#content-main").css("top","162px");
	$("#main-content").show();
	$("#loginUserName").text(globalConfig.curStaffName);
	if(checkPageRoleType("income") && checkPageRoleType("expense")){
		var incomeRoleType = getWorktableRoleType("income");
		var expenseRoleType = getWorktableRoleType("expense");
		$("#worktabledropdown").hover(function(){
			$("#worktableRoleMenu").show();
		},function(){
			$("#worktableRoleMenu").hide();
		});
		$("#worktableRoleMenu").on("click","li",function(){
			if($("#worktableRoleName").data("type") != $(this).data("type")){
				if($(this).data("type") == "income"){
					$(this).addClass("choose").siblings().removeClass("choose");
					$("#worktableRoleName").text(getWorktableRoleName(incomeRoleType));
					$("#worktableRoleName").data("type","income");
					setIncomeHomePage();
				}else if($(this).data("type") == "expense"){
					$(this).addClass("choose").siblings().removeClass("choose");
					$("#worktableRoleName").text(getWorktableRoleName(expenseRoleType));
					$("#worktableRoleName").data("type","expense");
					setExpenseHomePage();
				}
			}
		})
		$("#worktableRoleName").text(getWorktableRoleName(incomeRoleType));
		$("#worktableRoleName").data("type","income");
		var worktableRoleMenuHtml = "<li class='choose' data-type='income'><a>"+getWorktableRoleName(incomeRoleType)+"</a></li>"+
					"<li data-type='expense'><a>"+getWorktableRoleName(expenseRoleType)+"</a></li>";
		$("#worktableRoleMenu").html(worktableRoleMenuHtml);
	}else{
		$("#worktableRoleMenu").remove();
		if(checkPageRoleType("income")){
			var roleType = getWorktableRoleType("income");
			$("#worktableRoleName").text(getWorktableRoleName(roleType));
		}else{
			var roleType = getWorktableRoleType("expense");
			$("#worktableRoleName").text(getWorktableRoleName(roleType));
		}
	}
}
//根据类型加载不同的页面
function checkPageRoleType(type,isAlert){
	var roleArr = globalConfig.curRole;
	if(type == "income"){
		var roleExistLen = checkWorktableArrLen(roleArr,[91216,91217,91218,91219]);
		if(roleExistLen == 0){
			return false;
		}else if(roleExistLen > 1){
			if(isAlert){
				layer.alert("当前岗位配置了 <span style='color:red'>"+roleExistLen+"</span> 个收入类租线业务合同履行工作台查看角色，请联系系统管理员处理。",{icon:2});
			};
			return false;
		}else{
			if(isInArray(roleArr, 91218)){
				if(globalConfig.dataPermission == 0 || globalConfig.dataPermission == 1 || globalConfig.dataPermission == 4){
					if(isAlert){
						layer.alert("当前稽核管理角色权限范围不足，请联系系统管理员处理。",{icon:2});
					};
					return false;
				}
			};
			return true;
		}
	}else if(type == "expense"){
		var roleExistLen = checkWorktableArrLen(roleArr,[91220,91221,91222]);
		if(roleExistLen == 0){
			return false;
		}else if(roleExistLen > 1){
			if(isAlert){
				layer.alert("当前岗位配置了 <span style='color:red'>"+roleExistLen+"</span> 个支出类采购业务合同履行工作台查看角色，请联系系统管理员处理。",{icon:2});
			};
			return false;
		}else{
			return true;
		}
	}
}
//取得角色数量
function checkWorktableArrLen(roleArr,permArr){
	var len = 0;
	$.each(roleArr, function(k,v) {
		if(isInArray(permArr,v)){
			len ++;
		}
	});
	return len;
}
//根据类型取得角色list中的当前页面所使用的角色
function getWorktableRoleType(type) {
	if(type == "income"){
		var permArr = [91216, 91217, 91218, 91219];
	}else if(type == "expense"){
		var permArr = [91220,91221,91222];
	};
	var roleArr = globalConfig.curRole;
	var worktableRoleType = null;
	$.each(roleArr, function(k, v) {
		if(isInArray(permArr, v)) {
			worktableRoleType = v;
			return false;
		}
	});
	return worktableRoleType;
}
//根据角色id翻译角色名称
function getWorktableRoleName(roleType){
	var roleName = "";
	if(roleType == 91216) {
		roleName = "客户经理（收入类租线业务）";
	} else if(roleType == 91217) {
		roleName = "业务管理（收入类租线业务）";
	} else if(roleType == 91218) {
		roleName = "稽核管理（收入类租线业务）";
	} else if(roleType == 91219) {
		roleName = "商务经理（收入类租线业务）";
	} else if(roleType == 91220){
		roleName = "采购经理/项目经理（支出类采购业务）";
	}else if(roleType == 91221){
		roleName = "业务管理（支出类采购业务）";
	}else if(roleType == 91222){
		roleName = "商务经理（支出类采购业务）";
	};
	return roleName;
}
//设置收入类履行工作台主页
function setIncomeHomePage(){
	var roleType = getWorktableRoleType("income");
	if(roleType == 91216 || roleType == 91217 || roleType == 91219) {
		if(roleType == 91216) {
			$("#worktableCaption").text("我的商务助理");
		} else {
			$("#worktableCaption").text("我的管理助手");
		};
		$("#auditCol").addClass("hidden");
	} else if(roleType == 91218) {
		$("#worktableCaption").text("我的管理助手");
		$("#workItemCol").removeClass("col-sm-10").addClass("col-sm-7");
		$("#auditCol").removeClass("hidden");
		setAuditScope();
	};
	getAssistantList(roleType,"sr");
	showSubpageTab("html/incomeWorktable/index/index.html","收入类租线业务",false,false,true);
}
//设置支出类履行工作台主页
function setExpenseHomePage(){
	var roleType = getWorktableRoleType("expense");
	$("#auditCol").addClass("hidden");
	$("#workItemCol").removeClass("col-sm-7").addClass("col-sm-10");
	if(roleType == 91220){
		$("#worktableCaption").text("我的商务助理");
	}else{
		$("#worktableCaption").text("我的管理助手");
	};
	getAssistantList(roleType,"zc");
	showSubpageTab("html/expenseWorktable/index/index.html","支出类采购业务",false,false,true);
}
//获取商务助理配置内容
function getAssistantList(roleType,funType) {
	var url = globalConfig.serverPath + "assistant/assistantList";
	var postData = {
		roleId: roleType,
		provinceCode: globalConfig.provCode,
		funType: funType
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		var html = "";
		var specialList = ["KHGL","LXZHT_SR","FXYJ_SR","HZFGL","LXZHT_ZC","FXYJ_ZC"];
		$.each(data, function(k, v) {
			html += '<div class="workItem"><div class="workItemImg">';
			if(specialList.indexOf(v.funCode) != -1){
				html += '<span class="badge badge-Worktable">'+v.superscript+'</span>';
			};
			html += '<img src="/static/img/worktable/' + v.funIconUrl + '" data-url="' + v.funUrl + '"/></div><p>' + v.funName + '</p></div>';
		});
		$("#workItemDom").html(html);
	}
}
$("#workItemDom").on("click", ".workItem", function() {
	var moduleUrl = $(this).find("img").data("url");
	if(moduleUrl) {
		top.showSubpageTab(moduleUrl, $(this).find("p").text());
	} else {
		layer.alert("该模块暂未使用。", {icon: 2})
	}
})

/****************************首屏显示处理*****************************/


/***************选择稽核范围开始***********************/
/*
 * 设置初始稽核范围
 */
function setAuditScope() {
	var obj = {
		companyCode: globalConfig.companyCode
	};
	var url = globalConfig.serverPath + "auditManager/getAuditRangeByStaffOrgId";
	App.formAjaxJson(url, "POST", JSON.stringify(obj), successCallback);
	var dataPermission = globalConfig.dataPermission;
	function successCallback(result) {
		var data = result.data;
		var orgName = data.orgName;
		$("#scope").text(orgName);
		$("#scope").attr("title", orgName);
		if(dataPermission == 3) {
			$("#changeScope").show();
		} else {
			$("#changeScope").remove();
		};
		var html = '<div class="scopeItem" data-id=' + data.auditRange + '>' + orgName + '</div>';
		$("#scopeChecked").html(html);
		globalConfig.auditScope = data.auditRange;
	}
}
/*
 * 选择稽核范围
 */
function changeScope() {
	$("#scopeModal").modal("show");
	if(!scopeTree) {
		initSopeChooseTree();
	}
}
var scopeTree;
/*
 * 生成稽核部门树————ztree
 */
function initSopeChooseTree() {
	var treeSetting = {
		async: {
			enable: true,
			url: globalConfig.serverPath + "contractType/listCompany",
			type: "post",
			dataType: 'json',
			dataFilter: orgsfilter,
			autoParam: ["orgCode=orgCode"]
		},
		data: {
			simpleData: {
				enable: true,
				idKey: "orgCode",
				pIdKey: "parentCode"
			},
			key: {
				name: "orgName"
			}
		},
		view: {
			selectedMulti: false,
			//			dblClickExpand: false
		},
		callback: {
			onAsyncError: onAsyncError,
			onDblClick: setInputInfo
		}
	};

	function orgsfilter(treeId, parentNode, responseData) {
		if(responseData.status == 1) {
			var data = responseData.data;
			if(data) {
				return data;
			} else {
				return null;
			}
		} else {
			layer.msg(responseData.message);
			return null;
		}
	};
	App.formAjaxJson(globalConfig.serverPath + 'contractType/listCompany', "post", {
		'orgId': ''
	}, successCallback, null, null, null, null, "formData")

	function successCallback(result) {
		var data = result.data;
		if(data != "") {
			if(scopeTree) {
				scopeTree.destroy();
			};
			scopeTree = $.fn.zTree.init($("#scopeTree"), treeSetting, data);
			var nodes = scopeTree.getNodes();
			scopeTree.expandNode(nodes[0]);
		} else {
			layer.msg("暂无数据，请稍后重试");
		}
	}
	//双击事件 
	function setInputInfo(event, treeId, treeNode) {
		setScopeChecked(treeNode);
	}
}
//按钮选择
function chooseScopeTree() {
	var treeNode = scopeTree.getSelectedNodes()[0];
	setScopeChecked(treeNode);
}
//按钮删除
function deleteCheckedScope() {
	if($("#scopeChecked .scopeItem.selected").length == 0) {
		layer.msg("请选择已选内容进行移除");
	} else {
		$("#scopeChecked").html("");
	}
}
//右侧赋值
function setScopeChecked(treeNode) {
	var name = treeNode.orgName;
	var orgCode = treeNode.orgCode;
	var html = '<div class="scopeItem" data-id=' + orgCode + '>' + name + '</div>';
	$("#scopeChecked").html(html);
}
$("#scopeChecked").on("click", ".scopeItem", function() {
	if($(this).hasClass("selected")) {
		$(this).removeClass("selected");
	} else {
		$(this).addClass("selected");
	}
})
/*
 * 选择稽核范围确定按钮点击
 */
function setScope() {
	$("#scopeModal").modal("hide");
	if($("#scopeChecked .scopeItem").length > 0) {
		var checkedText = $("#scopeChecked .scopeItem").text();
		var companyCode = $("#scopeChecked .scopeItem").data("id");
		var obj = {
			"companyCode": companyCode,
		};
		var url = serverPath + "auditManager/updateAuditRange";
		App.formAjaxJson(url, "POST", JSON.stringify(obj), successCallback);
		function successCallback(result) {
			layer.msg("更改成功");
		}
		$("#scope").text(checkedText);
		$("#scope").attr("title", checkedText);
		globalConfig.auditScope = companyCode;
		showSubpageTab("html/incomeWorktable/index/index.html","收入类租线业务",false,true,true);
	}
}

/***************选择稽核范围结束***********************/