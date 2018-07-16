function appSupportShow(){
	$("#appSupport").modal("show");
}
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
var ace_menus = null;

$(document).ready(function() {
	//获取用户基本信息
    App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, successCallback, null, null, null, false);

    function successCallback(result) {
    	//系统默认配置
    	var defaultCurConfigs = {
    		config_page_size: "10,20,50",
			message_space: "300000",
			oke_active_time: "1",
			oken_maximum_number: "10"
		}
        var data = result.data;
        globalConfig.provCode = data.provCode;
        globalConfig.curStaffId = data.staffId;
        globalConfig.curStaffName = data.staffName;
        globalConfig.curStaffOrgId = data.staffOrgId;
        globalConfig.curOrgId = data.orgId;
        globalConfig.curCompanyId = data.companyId;
        globalConfig.mainOrgFlag = data.mainOrgFlag;
        globalConfig.permissions = data.permissions;
        ace_menus = data.menus;
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
	        if (result.data != "") {
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
	    //消息定时器，20s查询一次
    	setMessageTipNumber();
      	var messageInterval = setInterval(setMessageTipNumber, globalConfig.curConfigs.message_space);
        //请求用户信息成功后加载待办列表
        $("#iframeTaskTodo").attr("src","html/workflow/tasklist/task-todo.html");
        //请求用户信息成功后加载公告列表
        getIndexNotiveTableInfo(true);
    }
})
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

//hurx
function changeStaffOrg(staffOrgId) {
    App.formAjaxJson(globalConfig.serverPath + "changestation/" + staffOrgId, "GET", null, menuCallback, null, null, null, false);

    function menuCallback(result) {
        if (result.status) {
            window.location.reload();
        } else {
            layer.msg(data.message);
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
    App.formAjaxJson(globalConfig.serverPath + "upfKeyPair?" + App.timestamp(),
        "GET", null, keyPairCallback, null, null, null, false);

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
 * 退出登录
 */
function logout() {
	clearAllCookie();
    App.formAjaxJson(globalConfig.serverPath + "staffs/removeStaffCache", "POST", null, successMethod);
    function successMethod(result) {
        App.formAjaxJson(globalConfig.serverPath + "logout", "POST", null, successCallback);
	    function successCallback(result) {
	        window.location.href = "login.html";
	    }
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
/*
 * 待办数量查询
 */
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
};
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
			var html = '<p>暂无公告文件</p>'
			$("#notiveFileList").append(html);
		}
	};
	App.formAjaxJson(saveNotifyUrl,"post",{notifyId:notifyId},saveNotifyRead,null,null,null,null,"formData");
	function saveNotifyRead(){
		getIndexNotiveTableInfo();
	}
}
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