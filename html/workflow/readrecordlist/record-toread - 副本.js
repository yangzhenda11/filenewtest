//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var curStaffOrgId = config.curStaffOrgId;
//流程类型下拉框处理
var ajaxObj = {
	    "url" :  serverPath + "recordToread/listReadTypeCode",
	    "type" : "post"
	}
App.initAjaxSelect2("#readTypeCode",ajaxObj,"value","label","请选择流程类型");

/*
 * 初始化表格
 */
App.initDataTables('#recordToreadListTable', "#searchBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'recordToread/recordToreadList',
        "data": function(d) {//自定义传入参数
			var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{"data" : null,"title":"序号","className": "text-center",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#recordToreadListTable").pageStart;
				return start + meta.row + 1;
		   	}
		},
        {
            "data": "readTitle",
            title: "主题",
            "className": "whiteSpaceNormal",
            render: function(data, type, row, meta) {
            	var assignee = row.receivedStaffOrgId
	        	var fn = "";
	        	var style = "";
	        	var buttontitle = null;
	        	var readIds=row.readId;
	        	if(curStaffOrgId == assignee){
	        			fn = "findDetail('"+readIds+"','"+row.readTypeUrl+"',"+row.bussId+")";
	        	}else{
	        		style = "cursor:not-allowed";
	        		buttontitle = "当前任务属于您的另一个岗位,请点击查看";
	        		fn = "findOrgName("+assignee+")";//"layer.msg(\'"+buttontitle+"\')";
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

function  findDetail  (readIds,url,bussId) {
	//待阅数据删除
	var ajaxObj = {
		    "url" :  serverPath + "recordToread/changeRecordToreadToHis",
		    "type" : "post",
		    "data":{"readId":readIds}
		};
	var postData = ajaxObj.data;	
		App.formAjaxJson(ajaxObj.url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			console.log(result);
//			var table = $('#recordToreadListTable').DataTable();
//			table.ajax.reload(null, false);
		}
		//直接覆盖原页面
		App.changePresentUrl(url+"&bussId="+bussId);
//		top.showSubpageTab(url+"&bussId="+bussId,"demo页面");
		
}
//查询岗位名称
function  findOrgName  (receivedStaffOrgId) {
	var ajaxObj = {
		    "url" :  serverPath + "recordToread/listReadOrgName",
		    "type" : "post",
		    "data":{"receivedStaffOrgId":receivedStaffOrgId}
		};
	var postData = ajaxObj.data;	
		App.formAjaxJson(ajaxObj.url, "post", JSON.stringify(postData), successCallback);
		function successCallback(result) {
			console.log(result);
			layer.msg("当前任务属于您的另一个岗位【" + result.data[0].orgName + "】,请点击右上角个人信息切换岗位后处理")
		}
}

/*
 * 搜索点击事件
 */
function searchWorkOrderHandle(retainPaging) {
	var createDateBegin = $("#send_date_begin").val();
	var createDateEnd = $("#send_date_end").val();
	if(App.checkDate(createDateBegin,createDateEnd)){
		var table = $('#recordToreadListTable').DataTable();
		if(retainPaging) {
			table.ajax.reload(null, false);
		} else {
			table.ajax.reload();
		}
	}else{
		layer.msg("接收日期开始日期不能早于截止日期");
		return;
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
function manualCreation(){
	$("#manualCreationEditModal").load("_manualCreationEdit.html",function(){
		$("#manualCreationEditModal").modal("show");
	});
}
/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
			readTypeCode : $("#readTypeCode").val().trim(),
			readTitle : $("#readTitle").val().trim(),
			sendDateBegin : $("#send_date_begin").val().trim(),
			sendDateEnd : $("#send_date_end").val().trim(),
			bussId : $("#bussId").val().trim()
	};
	return searchData;
}

