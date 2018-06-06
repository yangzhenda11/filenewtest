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
        //获取用户分页信息
	    App.formAjaxJson(globalConfig.serverPath + "configs/getVal", "GET", { staffOrgId: globalConfig.curStaffOrgId, code: "config_page_size" }, configSuccess, configImproper, configError, null, false);
	
	    function configSuccess(result) {
	        if (result.data != "") {
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
        //var messageInterval = setInterval(setMessageTipNumber, 20000);
        //请求用户信息成功后加载待办列表
        $("#iframeTaskTodo").attr("src","html/workflow/tasklist/task-todo.html");
    }
    function improperCallback(result) {
        layer.alert("用户信息获取失败，请重新登录或联系管理员", { icon: 2, title: "错误", closeBtn: 0 }, function(index) {
            window.location.href = "login.html";
        });
    }
    function errorCallback(result) {
        layer.alert("用户信息获取失败，请重新登录或联系管理员", { icon: 2, title: "错误", closeBtn: 0 }, function(index) {
            window.location.href = "login.html";
        });
    }
});

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
var passwdValidator = {
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
                }
            }
        },
        passConfirm: {
            validators: {
                notEmpty: {
                    message: '请再次输入密码确认'
                },
                identical: {
                    field: 'passwd',
                    message: '两次输入的密码不一致。'
                }
            }
        }
    },

};

function updatePasswd() {
    $('#editPasswd').modal({
        backdrop: 'static'
    });
    $('#passwdForm input').val("");
    if ($('#passwdForm').data('bootstrapValidator')) {
        $('#passwdForm').data('bootstrapValidator').resetForm(false);
    }
    if (null == $('#passwdForm').data('bootstrapValidator')) {
        $('#passwdForm').bootstrapValidator(passwdValidator).on(
            "success.form.bv",
            function(e) {
                changePasswd();
            });
    }
}

function changePasswd() {
    debugger;
    App.formAjaxJson(globalConfig.serverPath + "upfKeyPair?" + App.timestamp(),
        "GET", null, keyPairCallback, null, null, null, false);

    function keyPairCallback(result) {
        debugger;
        var passwd = $("#passwdForm input[name='passwd']").val();
        var modulus = result.data.modulus,
            exponent = result.data.exponent;
        if (passwd.length != 256) {
            var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
        }
        var pwd = RSAUtils.encryptedString(publicKey, passwd);
        App.formAjaxJson(globalConfig.serverPath + "staffs/" + globalConfig.curStaffId + "/main/passwd?" + App.timestamp(),"PUT", { "passwd": pwd }, passwdCallback, null, null, null, false);

        function passwdCallback(result) {
            if (result.data) {
	            alert("修改成功");
	            logout();
	        }
        }
    }
}
/*
 * 退出登录
 */
function logout() {
    App.formAjaxJson(globalConfig.serverPath + "staffs/removeStaffCache", "POST", null, successMethod);
    function successMethod(result) {
        App.formAjaxJson(globalConfig.serverPath + "cloud/logout", "POST", null, successCallback);
	    function successCallback(result) {
	        window.location.href = result.data;
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
	App.formAjaxJson(globalConfig.serverPath + "workflowrest/taskToDo", "get", messageIntervalData, messageSuccessCallback,null,null,false);
    function messageSuccessCallback(result) {
        if(result){
        	$("#messageTipNumber").text(result.recordsTotal);
        }
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