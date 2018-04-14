/**
 * 全局变量的配置
 */
var globalConfig = {
    /**静态服务地址 */
    staticPath: "/",
    /**后台服务地址 */
    serverPath: "/",
	/** 当前岗位信息对象 */
    curStaffOrg: {},
    /** 当前用户的岗位id （sys_staff_org表主键） */
    curStaffOrgId: null, //10001
    /** 当前用户所在组织对象 */
    curOrg: {},
    /** 当前用户所在组织的id（sys_org表主键） */
    curOrgId: null, //56665
    /** 当前用户对象 */
   	curStaff: {},
	/*
	 * 包括
	 * staffCode : "001"
	 * staffId : 10002
	 * staffKind : "1"
	 * staffName : "管理员"
	 */
	/** 当前用户的用户名 */
    curStaffName: "",
    /** 当前用户的id （sys_staff主键） */
    curStaffId: null, //10002
    /** 当前用户的权限集合 */
    perm: [],
     /** 当前用户的系统设置 */
    curConfigs:{}
};
var ace_menus = null;
$(document).ready(function() {
    App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, successCallback, improperCallback, errorCallback, null, false);

    function successCallback(result) {
        var data = result.data;
        globalConfig.curStaffId = data.staff.staffId;
        globalConfig.curStaffName = data.staff.staffName;
        globalConfig.curStaffOrgId = data.mainStaffOrg.staffOrgId;
        globalConfig.curOrgId = data.org.orgId;
        globalConfig.curStaff = data.staff;
        globalConfig.curOrg = data.org;
        globalConfig.curStaffOrg = data.mainStaffOrg;
        globalConfig.perm = data.perm;
        $(".user-info").html("<small>欢迎,</small>" + data.staff.staffName);
        if(data.otherStaffOrg.length>0){
        	for(var i = 0; i < data.otherStaffOrg.length; i++){
        		$(".user-menu").prepend("<li> <a href=\"javascript:changeStaffOrg("+ data.otherStaffOrg[i] +");\"> <i class=\"ace-icon fa fa-cube\"></i> " + data.otherStaffOrg[i].attra + "</a> </li>");
        	}
        }
        $(".user-menu").prepend("<li> <a href=\"javascript:changeStaffOrg("+ data.mainStaffOrg +");\"> <i class=\"ace-icon fa fa-cube\"></i> " + data.mainStaffOrg.attra + "</a> </li>");

        App.formAjaxJson(globalConfig.serverPath + "menus?staffOrgId=" + globalConfig.curStaffOrgId + App.timestamp(), "GET", null, menuSuccess, null, null, null, false);

        function menuSuccess(result) {
            ace_menus = result.data;
        }
        
        App.formAjaxJson(globalConfig.serverPath + "configs/getVal?staffOrgId=" + globalConfig.curStaffOrgId+"&code=config_page_size", "GET", null, configSuccess,configImproper,configError,null,false);
	    function configSuccess(result) {
	       	if(result.data != ""){
	       		globalConfig.curConfigs.configPagelengthMenu = result.data;
	       	}else{
	       		globalConfig.curConfigs.configPagelengthMenu = "10,20,50,100";
	       	}
	    }
	    function configImproper(result){
	    	globalConfig.curConfigs.configPagelengthMenu = "10,20,50,100";
	    }
	    function configError(result){
	    	globalConfig.curConfigs.configPagelengthMenu = "10,20,50,100";
	    }
    }
    function improperCallback(result) {
    	layer.alert("用户信息获取失败，请重新登录或联系管理员", {icon: 2,title:"错误",closeBtn:0}, function(index){
			window.location.href = "login.html";
		});
    }
    function errorCallback(result) {
        layer.alert("用户信息获取失败，请重新登录或联系管理员", {icon: 2,title:"错误",closeBtn:0},function(index){
        	window.location.href = "login.html";
        });
    }
});

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
        layer.msg("当前浏览器暂不支持全屏操作", { icon: 2 });
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

// 页面过滤
function permFilter(obj) {
    var e = obj.querySelectorAll('[permcheck]');
    var perm = globalConfig.perm;
    for (var i = 0; i < e.length; i++) {
        if (null != e[i].getAttribute('permcheck')) {
            if (jQuery.inArray(e[i].getAttribute('permcheck'), perm) < 0) {
                e[i].remove();
            } else {
                $(e[i]).show();
            }
        }
    }
}
// 表中过滤
function tPFilter(permCheck) {
    var perm = globalConfig.perm;
    if (jQuery.inArray(permCheck, perm) >= 0) {
        return true;
    } else {
        return false;
    }
}
//hurx
function changeStaffOrg(staffOrg){
//	globalConfig.curStaffOrg = staffOrg;
//	App.formAjaxJson(globalConfig.serverPath + "pers/permAll?" + App.timestamp(), "GET", {"staffOrgId":staffOrg.staffOrgId,"staffId":globalConfig.curStaffId}, menuCallback, null, null, null, false);
//
//     function menuCallback(result) {
//    	 globalConfig.perm = result;
//    	 window.location.href = "/index.html";
//     }
}
var passwdValidator = {
		message : 'This value is not valid',
		feedbackIcons : {
			valid : 'glyphicon glyphicon-ok',
			invalid : 'glyphicon glyphicon-remove',
			validating : 'glyphicon glyphicon-refresh',
			errorClass : "invalid"
		},
		submitButtons: 'button[type="submit"]',
		fields : {
			passwd : {
				validators : {
					notEmpty : {
						message : '请输入新密码'
					},
					regexp : {
						regexp : /^(?!.*')(?!.*\^)(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,18}$/,
						message : "请输入6到18位同时包含大小写字母及数字密码且不包含'^"
					}
				}
			},
			passConfirm : {
				validators : {
					notEmpty : {
						message : '请再次输入密码确认'
					},
					identical : {
						field : 'passwd',
						message : '两次输入的密码不一致。'
					}
				}
			}
		},
//		submitHandler : function(validator, form, submitButton) {
//			alert(321);
//			changePasswd();
//		}
	};
function updatePasswd(){
	$('#editPasswd').modal({
		backdrop:'static'
	});
	if($('#passwdForm').data('bootstrapValidator')){
		$('#passwdForm').data('bootstrapValidator').resetForm(false);
	}
	if(null == $('#passwdForm').data('bootstrapValidator')) {
		$('#passwdForm').bootstrapValidator(passwdValidator).on("success.form.bv",function(e){
			changePasswd();
			});
	}
}
function changePasswd(){
	var passwd = $("#passwdForm input[name='passwd']").val();	
	App.formAjaxJson(globalConfig.serverPath + "staffs/"+globalConfig.curStaffId+"/main/passwd?passwd="+passwd+ App.timestamp(), "PUT", null, passwdCallback, null, null, null, false);
	function passwdCallback(result){
		if(result.data) {
			alert("修改成功");
			window.location.replace(globalConfig.staticPath+"login.html");
		}
	}
}
 /**
 * 初始化左侧菜单滚动条
 * 
 * */    
//$('#sidebarScroller').slimScroll({
//  allowPageScroll: true, // allow page scroll when the element scroll is ended
//  size: '4px',
//  color: ($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#4B6A8B'),
//  wrapperClass: ($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
//  railColor: ($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
//  position: 'right',
//  height: '100%',
//  alwaysVisible: false,
//  railVisible: false,
//  disableFadeOut: false
//});