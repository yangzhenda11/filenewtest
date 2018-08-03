//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#workOrderActivateListTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'workOrderActivate/workOrderActivateList',
        "data": function(d) {//自定义传入参数
        	var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{"data" : null,"title":"序号","className": "text-center","width":"5%",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#workOrderActivateListTable").pageStart;
				return start + meta.row + 1;
		   }
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"36%"},
        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"17%"},
        {"data": "wcardNumber","title": "工单编号","className":"whiteSpaceNormal","width":"17%"},
        {"data": "wcardStatusStr","title": "工单状态","className":"whiteSpaceNormal","width":"10%"},
        {"data": "ctreatedDate","title": "创建日期","className":"whiteSpaceNormal","width":"10%",
	        "render": function(data, type, full, meta) {
	            return App.formatDateTime(data,"yyyy-mm-dd");
	        }
	    },
	    {"data": null,"className": "text-center","title": "操作","width":"5%",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "激活", "fn": "jumpSanCpyQueryDetail(\'"+data.wcardId+"\')","icon":"iconfont icon-add"});
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


//点击iconfont弹出模态框事件
$(function(){
	//承办人
	$("#searchUndertaker").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","name","staffOrgId");
	})
	
	$("#undertakeName").on("change",function(){
		$(this).data("exactSearch",false);
	})
})


/*
 * 搜索点击事件
 */
function searchWorkOrderActivate(retainPaging) {
	var createDateBegin = $("#create_date_begin").val();
	var createDateEnd = $("#create_date_end").val();
	if(App.checkDate(createDateBegin,createDateEnd)){
		var table = $('#workOrderActivateListTable').DataTable();
		if(retainPaging) {
			table.ajax.reload(null, false);
		} else {
			table.ajax.reload();
		}
	}else{
		layer.msg("创建日期开始日期不得大于截止日期！");
		return;
	}
}

//跳转到工单激活页面
function jumpSanCpyQueryDetail(id){
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:id}, successCallback,null,null,false);
	function successCallback(result) {
		var wcardProcess = result.data.wcardProcess;
		if(wcardProcess == 1){
			var src = "../workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey=GDQR&wcardId="+id;
			App.changePresentUrl(src);
		}else{
			layer.alert("当前工单的状态已经发生变化，请您重新点击查询更新数据后处理。",{icon:2,title:"流程状态错误"},function(index){
				layer.close(index);
			});
		}
	}
}

/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumber").val().trim(),
        contractName : $("#contractName").val().trim(),
		createDateBegin : $("#create_date_begin").val().trim(),
		createDateEnd : $("#create_date_end").val().trim()
	};
	if($("#undertakeName").data("exactSearch")){
        searchData.undertakerId = $("#undertakeName").data("id");
    }else{
        searchData.undertakeName = $("#undertakeName").val().trim();
    };
    return searchData;
}

//导出合同扫描件Excel
function exportResultExcel(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'workOrderActivate/workOrderActivateExportList' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}
