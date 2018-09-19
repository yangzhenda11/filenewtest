//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
/*
 * 初始化表格
 */
App.initDataTables('#workOrderHandleListTable', "#submitBtn", {
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
    	{"data" : null,"title":"序号","className": "text-center","width":"5%",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#workOrderHandleListTable").pageStart;
				return start + meta.row + 1;
		   	}
		},
		{"data": "readTitle","title": "主题","className":"whiteSpaceNormal","width":"36%"},
        {"data": "readTypeCode","title": "流程类型","className":"whiteSpaceNormal","width":"17%"},
        {"data": "sendDate","title": "接收日期","className":"whiteSpaceNormal","width":"17%"},
        {"data": "staffName","title": "发送人","className":"whiteSpaceNormal","width":"10%"},
        {"data": "ctreatedDate","title": "创建日期","className":"whiteSpaceNormal","width":"10%",
	        "render": function(data, type, full, meta) {
	            return App.formatDateTime(data,"yyyy-MM-dd");
	        }
	    },
	    {"data": null,"className": "text-center","title": "操作","width":"5%",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "处理", "fn": "jumpSanCpyQueryDetail(\'"+data.wcardId+"\')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		}
    ],
	"columnDefs": [{
   		"createdCell": function (td, cellData, rowData, row, col) {
         	if ( col > 0 && col < 6) {
           		$(td).attr("title", $(td).text())
         	}
   		}
 	}]
});

/*
 * 搜索点击事件
 */
function searchWorkOrderHandle(retainPaging) {
	var createDateBegin = $("#create_date_begin").val();
	var createDateEnd = $("#create_date_end").val();
	if(App.checkDate(createDateBegin,createDateEnd)){
		var table = $('#workOrderHandleListTable').DataTable();
		if(retainPaging) {
			table.ajax.reload(null, false);
		} else {
			table.ajax.reload();
		}
	}else{
		layer.msg("创建日期开始日期不能早于截止日期");
		return;
	}
}
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){
	var createDateBegin = $("#create_date_begin").val();
	var createDateEnd = $("#create_date_end").val();
	if(!App.checkDate(createDateBegin,createDateEnd)){
		$(dom).val("");
		layer.msg("创建日期开始日期不能早于截止日期");
	}
}
function manualCreation(){
	$("#manualCreationEditModal").load("_manualCreationEdit.html",function(){
		$("#manualCreationEditModal").modal("show");
	});
}

//跳转到工单编辑页面
function jumpSanCpyQueryDetail(id){
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:id}, successCallback,null,null,false);
	function successCallback(result) {
		var wcardProcess = result.data.wcardProcess;
		if(wcardProcess == 0 || wcardProcess == 2){
			var src = "../workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey=GDCL&wcardId="+id;
App.changePresentUrl(src);
		}else{
			layer.alert("当前工单的状态已经发生变化，请您重新点击查询更新数据后处理。",{icon:2,title:"流程状态错误"},function(index){
				layer.close(index);
			});
		}
	}
}
/*
 * 检查工单状态是否属于该流程
 */
function checkWcardProcessId(){
	
}
/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumberSel").val().trim(),
        contractName : $("#contractNameSel").val().trim(),
		createDateBegin : $("#create_date_begin").val().trim(),
		createDateEnd : $("#create_date_end").val().trim()
	};
	return searchData;
}

//导出合同扫描件Excel
function exportResultExcel(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'workOrderHandle/workOrderHandleExportList' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}

