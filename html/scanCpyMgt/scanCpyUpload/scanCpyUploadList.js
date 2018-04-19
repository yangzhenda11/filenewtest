//系统的全局变量
/*var serverPath = config.serverPath;
var config = top.globalConfig;*/

/*
 * 初始化表格
 */
App.initDataTables('#searchContractTable', "#submitBtn", {
	 ajax: {
        "type": "GET",
        "url": "null",
        "data": function(d) {//自定义传入参数
        	d.staffId = config.staffId;
        	d.contractNumber = $("input[name='contractNumber']").val();
			d.contractType = $("input[name='contractType']").val();
			//d.undertakerId = $("input[name='undertakerId']").val();
			d.undertakeName = $("input[name='undertakeName']").val();
			//d.oppoPartyId = $("input[name='oppoPartyId']").val();
			d.oppoPartyName = $("input[name='oppoPartyName']").val();
			d.approve_date_begin = $("input[name='approve_date_begin']").val();
			d.approve_date_end = $("input[name='approve_date_end']").val();
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

//跳转到上传页面
function addScanCpy(){
	var src = "html/scanCpyMgt/scanCpyUpload/scanCpyUploadEdit.html?type=2&id=1";
	App.changePresentUrl(src);
}