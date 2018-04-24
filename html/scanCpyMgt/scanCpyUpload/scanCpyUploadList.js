//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#searchContractTable', "#submitBtn", {
	 ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'contractUpload/contractUploadList',
        "data": function(d) {//自定义传入参数
        	if($("#contractType").data("exactSearch")){
        		d.typeId = $("#contractType").data("typeId");
        	}else{
        		d.contractType = $("input[name='contractType']").val();
        	};
        	if($("#undertakeName").data("exactSearch")){
        		d.Id = $("#undertakeName").data("Id");
        	}else{
        		d.undertakeName = $("#undertakeName").val();
        	};
        	if($("#oppoPartyName").data("exactSearch")){
        		d.partnerId = $("#oppoPartyName").data("partnerId");
        	}else{
        		d.oppoPartyName = $("#oppoPartyName").val();
        	};
        	d.contractId = config.contractId;
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
			d.approveDateBegin = $("#approve_date_begin").val();
			d.approveDateEnd = $("#approve_date_end").val();
           return JSON.stringify(d);
          /*return d;*/
        }
    },
    "columns": [
        {"data": "contractId","title": "序号"},
        {"data": "contractName","title": "合同名称"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "executeDeptName","title": "承办部门"},
        {"data": "undertakerId","bVisible":false,"title": "承办人"},
        {"data": "undertakeName","title": "承办人"},
        {"data": "unicomPartyId","bVisible":false,"title": "我方主体"},
        {"data": "unicomPartyName","title": "我方主体"},
        {"data": "oppoPartyId","bVisible":false,"title": "对方主体"},
        {"data": "oppoPartyName","title": "对方主体"},
        {
	            "data": "approveDate",
	            "title": "审批时间",
	            render: function(data, type, full, meta) {
	                return App.formatDateTime(data);
	            }
	        },
        {
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "添加", "fn": "jumpContractUploadEdit(\'"+data.contractId+"\')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		},
    ]
});

//跳转到上传页面
function jumpContractUploadEdit(contractId){
	var src = "html/scanCpyMgt/scanCpyUpload/scanCpyUploadEdit.html?pageType=2&id="+contractId;
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
//点击iconfont弹出模态框事件
$(function(){
	$("#searchContractType").click(function() {
		App.getCommonModal("contractType", "#contractType","typeFullname","typeId");
	})
	$("#searchUndertakerName").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","name","id");
	})
	$("#searchOtherSubject").click(function(){
		App.getCommonModal("otherSubject","#oppoPartyName","partnerName","partnerId");
	})
	$("#contractType","#undertakeName","#oppoPartyName").on("input",function(){
		$(this).data("exactSearch",false);
	})
})


