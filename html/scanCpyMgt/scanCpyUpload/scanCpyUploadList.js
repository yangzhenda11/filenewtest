//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#searchContractTable', "#submitBtn", {
	 ajax: {
        "type": "GET",
        "url": serverPath+'contractUpload/contractUploadList',
        "data": function(d) {//自定义传入参数
        	d.contractId = config.contractId;
        	d.contractName = $("input[name='contractName']").val();
        	d.contractNumber = $("#contractNumber").val();
			d.contractType = $("#contractType").val();
			d.undertakerId = $("#undertakerId").val();
			d.undertakeName = $("input[name='undertakeName']").val();
			d.oppoPartyId = $("#oppoPartyId").val();
			d.oppoPartyName = $("#oppoPartyName").val();
			/*d.approve_date_begin = $("input[name='approve_date_begin']").val();
			d.approve_date_end = $("input[name='approve_date_end']").val();*/
			d.approve_date = $("#approveDate").val();
            return d;
        }
    },
    "columns": [
        {"data": "contractId","title": "序号"},
        {"data": "contractName","title": "合同名称"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "executeDeptName","title": "承办部门"},
        {"data": "undertakeName","title": "承办人"},
        {"data": "unicomPartyId","bVisible":false,"title": "我方主体"},
        {"data": "unicomPartyName","title": "我方主体"},
        {"data": "oppoPartyId","bVisible":false,"title": "对方主体"},
        {"data": "oppoPartyName","title": "对方主体"},
        {"data": "approveDate","title": "审批通过日期"},
        {
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "添加", "fn": "jumpContractUploadEdit()","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		},
    ]
});

//跳转到上传页面
function jumpContractUploadEdit(){
	var src = "html/scanCpyMgt/scanCpyUpload/scanCpyUploadEdit.html?type=2&id=1";
	App.changePresentUrl(src);
}

/*
 * 搜索点击事件
 */
function searchContractUpload(retainPaging) {
	var table = $('#searchContractTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}