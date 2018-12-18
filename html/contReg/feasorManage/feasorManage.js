//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
App.readCache("searchForm");
/*
 * 初始化表格
 */
App.initDataTables('#feasorListTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'AssistFeasorManageController/listAssistFeasor',
        "data": function(d) {//自定义传入参数
			var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{"data" : null,"title":"序号","className": "text-center","width":"5%",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#feasorListTable").pageStart;
				return start + meta.row + 1;
		   	}
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"36%"},
        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"17%"},
        {"data": "wcardNumber","title": "工单编号","className":"whiteSpaceNormal","width":"17%"},
        {"data": "wcardStatusStr","title": "工单状态","className":"whiteSpaceNormal","width":"10%"},
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
function searchFeasorTable(retainPaging) {
	var createDateBegin = $("#create_date_begin").val();
	var createDateEnd = $("#create_date_end").val();
	if(App.checkDate(createDateBegin,createDateEnd)){
		var table = $('#feasorListTable').DataTable();
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


//跳转到工单编辑页面
function jumpSanCpyQueryDetail(id){
	var src = "../workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey=GDCL&wcardId="+id;
	App.setCache("searchForm");
	App.changePresentUrl(src);
}

/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumberSel").val().trim(),
        contractName : $("#contractNameSel").val().trim(),
		createDateBegin : $("#create_date_begin").val(),
		createDateEnd : $("#create_date_end").val()
	};
	return searchData;
}
//导出合同扫描件Excel
function exportResultExcel(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'workOrderHandle/workOrderHandleExportList' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}
