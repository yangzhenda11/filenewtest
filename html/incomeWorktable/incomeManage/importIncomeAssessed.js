$(function(){
//	getAssessedTbody();
})
/*
 * 获取表格
 */
function getAssessedTbody(){
	var url = serverPath + "";
	var postData = JSON.stringify({});
	App.formAjaxJson(url, "post", postData, successCallback);
	function successCallback(result) {
		var data = result.data;
		var html = "";
		if(data.length > 0){
			for(var i = 0; i < data.length; i++){
				html += '<tr>'+
						'<td><label class="ui-checkbox"><input type="checkbox" name="assessedCheckbox"><span></span></label></td>'+
						'<td class="orderNumber"></td>'+
						"<td><div class='form-group'><input type='text' class='form-control accountName' placeholder='请输入账期' maxlength='240' value="+data[i]+" /></div></td>"+
						"<td><div class='form-group'><input type='text' class='form-control accountNumber' placeholder='请输入分摊收入' maxlength='40' value="+data[i]+" /></div></td>"+
					"</tr>";
			};
			$("#assessedTbody").html(html);
		};
		addAssessedTbodySort();
		App.checkAllFn("#assessedCheckAll","assessedCheckbox");
		addAssessedTbodyEmptyTr();
	}
	
}
//新增一行
function addTbody(){
	var html = '<tr>'+
			'<td><label class="ui-checkbox"><input type="checkbox" name="assessedCheckbox"><span></span></label></td>'+
			'<td class="orderNumber"></td>'+
			"<td><div class='form-group'><input type='text' class='form-control accountName' placeholder='请输入账期' maxlength='240' /></div></td>"+
			"<td><div class='form-group'><input type='text' class='form-control accountNumber' placeholder='请输入分摊收入' maxlength='40' /></div></td>"+
		"</tr>";
	$("#assessedTbody").append(html);
	addAssessedTbodySort();
	App.checkAllFn("#assessedCheckAll","assessedCheckbox");
}
//删除表格
function deleteTbody(){
	var checkInvoiceLength = $("#assessedTbody input[name='assessedCheckbox']:checked").length;
	if(checkInvoiceLength == 0){
		layer.msg("请勾选要删除的分摊收入信息");
	}else{
		layer.confirm("是否要删除这"+checkInvoiceLength+"条数据？",{icon:7,title:"提示"},function(index){
			layer.close(index);
			$.each($("#assessedTbody input[name='assessedCheckbox']:checked"), function(k,v) {
				$(v).parents("tr").remove();
			});
			addAssessedTbodySort();
			App.checkAllFn("#assessedCheckAll","assessedCheckbox");
			addAssessedTbodyEmptyTr();
		})
	}
}
//保存表格
function saveTbody(){
	
}
//提交表格
function submitTbody(){
	
	//关闭当前页面
	var pageId = self.frameElement.getAttribute('data-id');
	top.closeIfreamSelf(pageId);
}
/*
 * 若为空增加empty值
 */
function addAssessedTbodyEmptyTr(){
	if($("#assessedTbody tr").length == 0){
		var html = '<tr class="emptyTr"><td colspan="4">暂无跨省分摊收入信息</td></tr>';
		$("#assessedTbody").html(html);
	}
}
/*
 * 表格数据增加序号
 */
function addAssessedTbodySort(){
	$.each($("#assessedTbody .orderNumber"), function(k,v) {
		$(v).text(k+1);
	});
}