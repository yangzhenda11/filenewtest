//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

$(function(){
	getAssessedTbody();
})
/*
 * 获取表格
 */
function getAssessedTbody(){
	var url = serverPath + "incomeShare/listIncomeShareImport";
	var postData = {
		accountPeriodName: $("#searchInput").val().trim()
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		var data = result.data;
		var html = "";
		if(data.length > 0){
			for(var i = 0; i < data.length; i++){
				html += '<tr data-id="'+data[i].incomeShareId+'">'+
						'<td><label class="ui-checkbox"><input type="checkbox" name="assessedCheckbox"><span></span></label></td>'+
						'<td class="orderNumber"></td>'+
						"<td><div class='form-group'><input type='text' class='form-control accountName' placeholder='请输入账期 eg:201801' maxlength='240' value="+data[i].accountPeriodName+" /></div></td>"+
						"<td><div class='form-group'><input type='text' class='form-control accountNumber' placeholder='请输入分摊收入' maxlength='40' value="+data[i].shareValue+" /></div></td>"+
					"</tr>";
			};
			$("#assessedTbody").html(html);
		};
		addAssessedTbodySort();
		App.checkAllFn("#assessedCheckAll","assessedCheckbox");
		addAssessedTbodyEmptyTr();
	}
	
}

/*
 * 根据账期查询
 */
function searchAssessed(){
	getAssessedTbody();
}

//新增一行
function addTbody(){

	if($("#assessedTbody").find(".emptyTr")[0]){
		$("#assessedTbody").find(".emptyTr").remove();
	}	
	var html = '<tr data-id="100000">'+
			'<td><label class="ui-checkbox"><input type="checkbox" name="assessedCheckbox"><span></span></label></td>'+
			'<td class="orderNumber"></td>'+
			"<td><div class='form-group'><input type='text' class='form-control accountName' placeholder='请输入账期 例如:201801' maxlength='6' /></div></td>"+
			"<td><div class='form-group'><input type='text' class='form-control accountNumber' placeholder='请输入分摊收入' maxlength='40' /></div></td>"+
		"</tr>";
	$("#assessedTbody").append(html);
	addAssessedTbodySort();
	App.checkAllFn("#assessedCheckAll","assessedCheckbox");
}
//删除表格
var deleteList = [];
function deleteTbody(){
	var checkInvoiceLength = $("#assessedTbody input[name='assessedCheckbox']:checked").length;
	if(checkInvoiceLength == 0){
		layer.msg("请勾选要删除的分摊收入信息");
	}else{
		layer.confirm("是否要删除这"+checkInvoiceLength+"条数据？",{icon:7,title:"提示"},function(index){
			layer.close(index);
			$.each($("#assessedTbody input[name='assessedCheckbox']:checked"), function(k,v) {
				deleteList.push($(v).parents("tr").data("id"));
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
	
	var flag = true;
	// 将需要保存的数据拼成json格式提交后台[{key:value,key:value,...},{key:value,key:value,...}...]
	var dataAll = [];
	var accountNameArray = []; // 记录账期
	$("#assessedTbody tr").each(function(){

		var accountName = $(this).find(".accountName").val();
		var accountNumber = $(this).find(".accountNumber").val();
		var accountId = $(this).data("id");

	    if(!/^[0-9]+$/.test(accountName)){
	    	layer.msg("请输入数字!");
	    	flag = false;
	    	return false;
	    }

	    if(!/^[0-9]+$/.test(accountNumber)){
	    	layer.msg("请输入数字!");
	    	flag = false;
	    	return false;
	    }
	    
		var data = {"accountName": accountName,
				"accountNumber": accountNumber,
				"accountId": accountId
				}
		dataAll.push(data);
		accountNameArray.push(accountName);
	});

	// 判断数组中账期信息是否重复
    var s = accountNameArray.join(",") + ",";
    for (var i = 0; i < accountNameArray.length; i++) {
        if (s.replace(accountNameArray[i] + ",", "").indexOf(accountNameArray[i] + ",") > -1) {
        	layer.msg("列表中有重复的账期：" + accountNameArray[i]);
            return false;
            break;
        }
    }
    
	if(flag) {

		var postData = {
			incomeShareData : JSON.stringify(dataAll),
			incomeShareDelData : JSON.stringify(deleteList)
		};
		var url = serverPath + "incomeShare/saveIncomeShare";
		App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			if(result.data == 0) { 

				// 保存成功返回0
				layer.msg("保存成功");
				getAssessedTbody();
			}
			else {

				// 主表已存在返回存在的账期名称
				layer.msg(""+result.data+" 账期的收入分摊数据已存在，请核实");
			}
		}
	}
}

//提交表格
function submitTbody(){
console.log($("#assessedTbody").find(".emptyTr"));

	var flag = true;
	// 判断列表是否为null
	if($("#assessedTbody").find(".emptyTr")[0]){

    	layer.msg("没有可提交的数据，请先添加分摊数据!");
    	flag = false;
    	return false;
	}
	
	// 将需要保存的数据拼成json格式提交后台[{key:value,key:value,...},{key:value,key:value,...}...]
	var dataAll = [];
	var accountNameArray = []; // 记录账期
	$("#assessedTbody tr").each(function(){

		var accountName = $(this).find(".accountName").val();
		var accountNumber = $(this).find(".accountNumber").val();		
		var accountId = $(this).data("id");
	    if(!/^[0-9]+$/.test(accountName)){
	    	layer.msg("请输入数字!");
	    	flag = false;
	    	return false;
	    }

	    if(!/^[0-9]+$/.test(accountNumber)){
	    	layer.msg("请输入数字!");
	    	flag = false;
	    	return false;
	    }
	    
		var data = {"accountName": accountName,
				"accountNumber": accountNumber,
				"accountId": accountId
				}
		dataAll.push(data);
		accountNameArray.push(accountName);
	});
	
	// 判断数组中账期信息是否重复
    var s = accountNameArray.join(",") + ",";
    for (var i = 0; i < accountNameArray.length; i++) {
        if (s.replace(accountNameArray[i] + ",", "").indexOf(accountNameArray[i] + ",") > -1) {
        	layer.msg("列表中有重复的账期：" + accountNameArray[i]);
            return false;
            break;
        }
    }

	if(flag) {

		var url = serverPath + "incomeShare/saveIncomeShare";
		layer.confirm("<div style='text-align:center'>提交成功后无法修改，<br/>是否确定提交？</div>", {icon:7,title:"提示",btn:['提交','取消']}, function() {

			var postData = {
				incomeShareData : JSON.stringify(dataAll),
				incomeShareDelData : JSON.stringify(deleteList)
			};
			App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
			function successCallback(result) {

				if(result.data == 0) { 
					// 保存成功 执行提交操作
					submitData();
				}
				else {

					// 主表已存在返回存在的账期名称
					layer.msg(""+result.data+" 账期的收入分摊数据已存在，请核实");
				}
			}
	   	});
	}
}

function submitData() {

	var postData = {};
	var url = serverPath + "incomeShare/saveSubmitIncomeShare";
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback);
	function successCallback(result) {
		if(result.data == 0) { 

			// 保存成功返回0
			layer.msg("提交成功");
			
			//关闭当前页面
			var pageId = self.frameElement.getAttribute('data-id');
			top.closeIfreamSelf(pageId);
		}
		else {

			// 主表已存在返回存在的账期名称
			layer.msg(""+result.data+" 账期的收入分摊数据已存在，请核实");
		}
	}
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