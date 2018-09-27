//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
$(function(){
	getFlowKyeList();
})
/*
 * 流程类型下拉框处理
 */
function getFlowKyeList(){
	var ajaxObj = {
	    "url" :  serverPath + "recordToread/listReadTypeCode",
	    "type" : "post",
	    "callbackFn": initflowTypeSelect2
	}
	App.initAjaxSelect2("#readTypeCode",ajaxObj,"value","label","请选择流程类型");
}
function initflowTypeSelect2(){
	App.readCache("searchForm");
	getTableToreadHisList();
}
/*
 * 初始化表格
 */
function getTableToreadHisList(){
	App.initDataTables('#recordToreadHisListTable', "#searchBtn", {
		ajax: {
	        "type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'recordToread/recordToreadHisList',
	        "data": function(d) {//自定义传入参数
				var searchParmData = getSearchParm();
	        	d = $.extend(d,searchParmData);
	           	return JSON.stringify(d);
	        }
	    },
	    "columns": [
	    	{"data" : null,"title":"序号","className": "text-center",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#recordToreadHisListTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
	        {
	            "data": "readTitle",
	            "title": "主题",
	            "className": "whiteSpaceNormal",
	            "render": function(data, type, row, meta) {
	            	var assignee = row.receivedStaffOrgId
		        	var fn = "";
		        	var style = "";
		        	var buttontitle = null;
		        	if(curStaffOrgId == assignee){
		        		fn = "findDetail('"+row.readTypeUrl+"',"+row.bussId+")";
		        	}else{
		        		style = "cursor:not-allowed";
		        		buttontitle = "当前任务属于您的另一个岗位【" + row.orgName + "】,请点击右上角个人信息切换岗位后处理";
		        		fn = "layer.msg(\'"+buttontitle+"\')";
		        	}
		        	var context = [{"name": row.readTitle,"placement":"right","title": buttontitle,"style": style,"fn": fn}]; 	
		            return App.getDataTableLink(context);
	            }
	       	},
	        {"data": "readTypeName","title": "流程类型","className":"whiteSpaceNormal"},
	       	{"data": "sendDate","title": "接收日期","className":"whiteSpaceNormal",
		        "render": function(data, type, full, meta) {
		            return App.formatDateTime(data,"yyyy-MM-dd");
		        }
		    },
	        {"data": "staffName","title": "发送人","className":"whiteSpaceNormal"}
	    ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 && col < 6) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	});
}


function  findDetail  (url,bussId) {
	App.setCache("searchForm");
	App.changePresentUrl(url+"&bussid="+bussId);
}

/*
 * 搜索点击事件
 */
function searchWorkOrderHandle(retainPaging) {
	var table = $('#recordToreadHisListTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){
	var createDateBegin =  $("#send_date_begin").val();
	var createDateEnd = $("#send_date_end").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		$(dom).val("");
		layer.msg("接收日期开始日期不能早于截止日期");
	}
}
/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		readTypeCode : $("#readTypeCode").val(),
		readTitle : $("#readTitle").val().trim(),
		sendDateBegin : $("#send_date_begin").val(),
		sendDateEnd : $("#send_date_end").val(),
		bussId : $("#bussId").val().trim()
	};
	return searchData;
}

