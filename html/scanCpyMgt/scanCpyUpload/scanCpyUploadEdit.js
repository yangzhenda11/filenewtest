//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
//console.log(parm);
//系统的全局变量获取
var config = top.globalConfig;
//console.log(config);
var serverPath = config.serverPath;
//页面初始化事件
$(function() {
	//固定操作按钮在70px的高度
	App.fixToolBars("toolbarBtnContent",70);
})
//返回上一页
function backPage(){
	window.history.go(-1);
}