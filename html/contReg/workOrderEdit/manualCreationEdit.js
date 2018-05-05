//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#contractCheckListTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'workOrderHandle/contractCheckList',
        "data": function(d) {//自定义传入参数
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{"data" : null,
         "title":"选择",
		"render" : function(data, type, full, meta){
						return meta.row + 1;
				   }
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"25%"},
        {"data": "oppoPartyName","title": "对方主体名称","className":"whiteSpaceNormal","width":"50%"}
    ]
});


function ceshi(){
	alert("aaaa");
}
