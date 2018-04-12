/**
 * 全局变量的配置
 * staticPath:静态资源路径
 * serverPath:服务端请求路径前缀
 * curStaffOrgId: 当前登录人的岗位id
 */
var globalConfig = {
    /**静态服务地址 */
    staticPath: "/",
    /**后台服务地址 */
    serverPath: "/",
    // serverPath: "http://localhost:9090/",
    /** 当前用户的岗位id （sys_staff_org表主键） */
    curStaffOrgId: null, //10001,
    /** 当前用户的id （sys_staff主键） */
    curStaffId: null, //10002,
    /** 当前用户所在组织的id（sys_org表主键） */
    curOrgId: null, //56665,
    /** 当前用户对象 */
    /**staffCode : "001"
    staffId : 10002
    staffKind : "1"
    staffName : "管理员" */
    curStaff: {},
    /** 当前用户所在组织对象 */
    curOrg: {},
    /** 当前岗位信息对象 */
    curStaffOrg: {},
    /** 当前用户的用户名 */
    curStaffName: "",
    perm: [],
    //全局系统变量
    curConfigs:{}
};
var ace_menus = null;
$(document).ready(function() {
    App.formAjaxJson(globalConfig.serverPath + "myinfo?" + App.timestamp(), "GET", null, successCallback, null, null, null, false);

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
        $(".user-menu").prepend("<li> <a href=\"javascript:;\"> <i class=\"ace-icon fa fa-cube\"></i> " + data.org.orgName + "</a> </li>");
        App.formAjaxJson(globalConfig.serverPath + "menus?staffOrgId=" + globalConfig.curStaffOrgId + "&" + App.timestamp(), "GET", null, menuCallback, null, null, null, false);

        function menuCallback(result) {
            ace_menus = result.data;
        }
        App.formAjaxJson(globalConfig.serverPath + "configs/getVal", "GET", {staffOrgId:globalConfig.curStaffOrgId,code:"config_page_size"}, configSuccess,configImproper,configError,null,false);
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