//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项
var parm = App.getPresentParm();


function initData(){
	$.ajax({
		url:serverPath + 'workflowrest/taskToDoDetail', 
		type:"POST",
		data:$("#taskToDoDetail").serializeArray(),
		async:false,
		success:function(data){
			$('#isCounterSign').val(data.isCounterSign);
			$('#startLink').val(data.startLink);
			$('#endLink').val(data.endLink);
			$('#canQuickPush').val(data.canQuickPush);
			$('#handleType').val(data.handleType);
			$('#buttonBack').val(data.buttonBack);
			$('#buttonTurn').val(data.buttonTurn);
			$('#buttonBreak').val(data.buttonBreak);
			$('#buttonQuick').val(data.buttonQuick);
			$('#isUseReferenceMan').val(data.isUseReferenceMan);
			$('#isHistoryBack').val(data.isHistoryBack);
			$('#isUsePushExpression').val(data.isUsePushExpression);
			$('#isUseBackExpression').val(data.isUseBackExpression);
			$('#isSendRecord').val(data.isSendRecord);
		},
		error:function(e){
			alert("获取数据异常"+e);
			App.ajaxErrorCallback(e);
		}
	});
}