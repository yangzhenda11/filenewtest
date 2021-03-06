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
	if (!fullscreenEnabled){
		layer.msg("当前浏览器暂不支持全屏操作",{icon: 2});
		return false;
	};
	var fullscreenElement =
		document.fullscreenElement ||
		document.webkitFullscreenElement ||
		document.mozFullScreenElement || 
		document.msFullscreenElement;
	if(fullscreenElement) {
		exitFullscreen();
	} else {
		launchFullscreen(document.documentElement);
	}
})
//全屏事件
function launchFullscreen(element) {
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	}
}
//退出全屏事件
function exitFullscreen() {
	if(document.exitFullscreen) {
		document.exitFullscreen();
	} else if(document.msExitFullscreen) {
		document.msExitFullscreen();
	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if(document.webkitExitFullscreen) {
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
	if(fullscreenElement) {
		$("#fullScreen").removeClass("fa-expand").addClass("fa-compress");
		$("#fullScreen").parent().attr("title","点击退出全屏");
	} else {
		$("#fullScreen").removeClass("fa-compress").addClass("fa-expand");
		$("#fullScreen").parent().attr("title","点击全屏")
	}
}