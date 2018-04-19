//系统的全局变量
//var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#searchContractTable', "#submitBtn", {
	 ajax: {
        "type": "GET",
        "url": "www.baidu.com",
        "data": function(d) {//自定义传入参数
            return d;
        }
    },
    "columns": [
        {"data": "null","title": "序号"},
        {"data": "contractName","title": "合同名称"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "executeDeptCode","title": "承办部门"},
        //{"data": "executeDeptName","title": "承办部门"},
        //{"data": "undertakerId","title": "承办人"},
        {"data": "undertakeName","title": "承办人"},
        //{"data": "unicomPartyId","title": "我方主体"},
        {"data": "unicomPartyName","title": "我方主体"},
        //{"data": "oppoPartyId","title": "对方主体"},
        {"data": "oppoPartyName","title": "对方主体"},
        {"data": "approve_date","title": "审批日期"},
        {
            "data": "null",
            "className": "text-center",
            "title": "操作",
            "render": function(data, type, full, meta) {
            	if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "添加", "fn": "addScanCpy(\'" + data + "\')" });
                    return App.getDataTableBtn(btnArray);;
				} else {
					return '';
				}
            }
        }
    ]
});
