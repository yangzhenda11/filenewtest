//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#workOrderQueryTable', "#submitBtn", {
	ajax: {
		"type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'contractHistoryImportController/listHistoryContractInfo',
        "data": function(d) {//自定义传入参数
        	var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
           	return JSON.stringify(d);
        }
	},
	"columns": [
        {"data" : null,"title":"序号","className": "text-center","width": "5%",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#workOrderQueryTable").pageStart;
				return start + meta.row + 1;
		   	}
		},
        {"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"15%"},
        {"data": "newContractNumber","title": "合同编号","className":"whiteSpaceNormal","width": "10%"},
        {"data": "provinceCode","title": "省份代码","className":"whiteSpaceNormal","width": "6%"},
        {"data": "contractTypeName","title": "合同类型","className":"whiteSpaceNormal","width": "14%"},
	    {"data": "empName","title": "承办人","className":"whiteSpaceNormal","width": "6%"},
        {"data": "hrOrgName","title": "承办部门","className":"whiteSpaceNormal","width": "16%"},
        {"data": "contractStatus","title": "合同状态","className":"whiteSpaceNormal","width":"6%"},
        {"data": "orgName","title": "ou组织","className":"whiteSpaceNormal","width": "16%"},
        {"data": "mailboxPrefix","title": "登陆账号","className":"whiteSpaceNormal","width":"7%"}
	],
	"columnDefs": [{
   		"createdCell": function (td, cellData, rowData, row, col) {
         	if ( col > 0 ) {
           		$(td).attr("title", $(td).text())
         	}
   		}
 	}]
});

/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
        contractNumber : $("#contractNumber").val().trim(),
        provinceCode : $("#provinceCode").val().trim(),
        orgName : $("#orgName").val().trim(),
        contractTypeName: $("#contractTypeName").val().trim(),
        importIdentifier : $("#importIdentifier").val(),
        contractImportNum: $('#contractNum').val()
	};
	return searchData;
}

/*
 * 搜索点击事件
 */
function searchWorkOrder(retainPaging) {
	var table = $('#workOrderQueryTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

/*
 * 导入点击事件
 */
function searchWorkOrder1() {
    var contractNum = $('#contractNum').val();
    var postData = {
        provinceCode : $("#provinceCode").val().trim(),
        orgName : $("#orgName").val().trim(),
        contractTypeName: $("#contractTypeName").val().trim(),
        contractImportNum: contractNum
    };
    App.formAjaxJson( serverPath+'contractHistoryImportController/saveHistoryContractImport',"post",JSON.stringify(postData),successCallback,null,null,null,null,null);
    function successCallback(result){
    	console.info();
    	if(result.status == 1){
            layer.msg("导入成功！"+result);
		} else {
            layer.msg("导入失败！"+result);
        }
    }
}


/*
 * 导入点击事件
 */
function searchWorkOrder2() {
    var postData = {
        contractImportNum: 100
    };
    App.formAjaxJson( serverPath+'contractHistoryImportController/saveProvinceHistoryContractImport',"post",JSON.stringify(postData),successCallback,null,null,null,null,null);
    function successCallback(result){
        console.info();
        if(result.status == 1){
            layer.msg("导入成功！"+result);
        } else {
            layer.msg("导入失败！"+result);
        }
    }
}
