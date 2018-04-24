//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
console.log(parm);
$(function(){
	if(parm.pageType == 1){
		$(".toolbarBtn,.portlet-title").remove();
	}
})
//系统的全局变量获取
var config = top.globalConfig;
console.log(config);
var serverPath = config.serverPath;
//页面初始化事件
$(function() {
	//固定操作按钮在70px的高度
	App.fixToolBars("toolbarBtnContent", 70);
	console.log(getQueryString("processInstanceId"));
})
//返回上一页
function backPage() {
	window.history.go(-1);
}

//初始化表格
App.initDataTables('#scanCpyloadTable', {
	ajax: {
		"type": "POST",
		"url": serverPath + 'listFile',
		"data": function(d) {
			//d.contractId = $("#contractId").val();
			d.contractId = 110;
			return d;
		}
	},
	"columns": [{
			"data": "displayName",
			"title": "文件列表"
		},
		{
			"data": "",
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {

				}
			}
		}
	]
});

function getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
} 

//流程点“通过”或“回退”回调业务侧此方法，业务侧完成表单校验并设置流程参数。
function beforePushProcess(pass){
	var result=true;
	//1，业务侧的校验，校验不通过则返回false
	
	//2,设置下一步选人的参数，用于匹配通用规则选人。
	var assigneeParam = { 
			"prov": "sd",  //省分，来自需求工单，必传
			}
	parent.setAssigneeParam(assigneeParam);
	
	//3,设置路由值，默认为0，对于有分支的场景需要单独设置路由值
	// parent.setPathSelect(1);
	
	return result;
}
//点通过或回退，在公共界面点提交按钮调用的流程推进方法，方法名和参数不允许修改，可以凭借业务侧的表单序列化后的参数一起传到后台，完成业务处理与流程推进。
function modal_pass(root, taskDefinitionKey, assignee, processInstanceId, taskId, comment, handleType, withdraw){
	//alert( "目标任务定义：" + taskDefinitionKey + "_目标受理人：" + assignee + "_流程实例ID：" + processInstanceId + "_当前任务ID：" + taskId + "_审批意见：" + comment + "_处理方式：" + handleType + "_是否可回撤" + withdraw);
		$.post(root + "business/pushProcess", {
			"processInstanceId" : processInstanceId,//当前流程实例
			"taskId" : taskId,//当前任务id
			"taskDefinitionKey" : taskDefinitionKey,//下一步任务code
			"assignee" : assignee,//下一步参与者
			"comment" : comment,//下一步办理意见
			"handleType" : handleType,//处理类型，1为通过，2为回退
			"withdraw" : withdraw,//是否可以撤回，此为环节配置的撤回。
			"nowtaskDefinitionKey":$("#taskDefinitionKey").val(),//当前办理环节
			"title":""//可不传，如果需要修改待办标题则传此参数。
		}, function(data) {
			layer.msg(data.sign);
			
			// 成功后回调模态窗口关闭方法
			parent.modal_close();   
		});
}

