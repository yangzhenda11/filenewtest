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
        "url": serverPath+'workOrderHandle/workOrderHandleList',
        "data": function(d) {//自定义传入参数
			var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{"data" : null,
         "title":"序号",
         "className": "text-center",
		"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#workOrderHandleListTable").pageStart;
				return start + meta.row + 1;
		   }
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "wcardNumber","title": "工单编号"},
        {"data": "wcardStatusStr","title": "工单状态"},
        {
	        "data": "ctreatedDate",
	        "title": "创建日期",
	        render: function(data, type, full, meta) {
	            return App.formatDateTime(data,"yyyy-MM-dd");
	        }
	    },
	    {
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "编辑", "fn": "jumpSanCpyQueryDetail(\'"+data.wcardId+"\')","icon":"iconfont icon-add"});
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
	var createDateBegin = $("#create_date_begin").val().trim();
	var createDateEnd = $("#create_date_end").val().trim();
	if(checkDate(createDateBegin,createDateEnd)){
		var table = $('#workOrderHandleListTable').DataTable();
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

function manualCreation(){
	$("#manualCreationEditModal").load("_manualCreationEdit.html",function(){
		$("#manualCreationEditModal").modal("show");
	});
}

//跳转到上传页面
function jumpSanCpyQueryDetail(id){
	App.formAjaxJson(serverPath+"contractOrderEditorController/getWcardProcessId", "get", {wcardId:id}, successCallback,null,null,false);
	function successCallback(result) {
		var wcardProcess = result.data;
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


/**
 * 校验开始时间是否大于截止时间
 * */
function checkDate(strDate1,strDate2){  
    var t1 = new Date(strDate1);     
    var t2 = new Date(strDate2);    
              
    if(Date.parse(t1) - Date.parse(t2) > 0){     
        return false;   
    }else{  
        return true;  
    }  
}
