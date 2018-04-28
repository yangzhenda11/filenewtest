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
        	if($("#contractTypeName").data("exactSearch")){
        		d.contractType = $("#contractTypeName").data("typeId");
        	}else{
        		d.contractTypeName = $("#contractTypeName").val();
        	};
        	if($("#undertakeName").data("exactSearch")){
        		d.undertakerId = $("#undertakeName").data("id");
        	}else{
        		d.undertakeName = $("#undertakeName").val();
        	};
        	if($("#oppoPartyName").data("exactSearch")){
        		d.oppoPartyId = $("#oppoPartyName").data("partnerId");
        	}else{
        		d.oppoPartyName = $("#oppoPartyName").val();
        	};
        	d.contractId = config.contractId;
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
			d.approveDateBegin = $("#approveDateBegin").val();
			d.approveDateEnd = $("#approveDateEnd").val();
           return JSON.stringify(d);
        }
    },
    "columns": [
    	//增加序号列
        {"data" : null,
         "title":"序号",
		"render" : function(data, type, full, meta){
			return meta.row + 1;
		}}, 
        {"data": "contractName","title": "合同名称",
         "className":"whiteSpaceNormal",
		 "width":"25%"
        },
        {"data": "contractNumber","title": "合同编号"},
        {"data": "executeDeptName","title": "承办部门",
        "className":"whiteSpaceNormal",
		 "width":"13%"
        },
        {"data": "undertakerId","bVisible":false,"title": "承办人"},
        {"data": "undertakeName","title": "承办人"},
        {"data": "unicomPartyId","bVisible":false,"title": "我方主体"},
        {"data": "unicomPartyName","title": "我方主体",
        "className":"whiteSpaceNormal",
		 "width":"15%"
		 },
        {"data": "oppoPartyId","bVisible":false,"title": "对方主体"},
        {"data": "oppoPartyName","title": "对方主体",
        "className":"whiteSpaceNormal",
		 "width":"15%"
		 },
		 {"data": "id","bVisible":false,"title": "id"},
        {
	            "data": "approveDate",
	            "title": "审批通过时间",
	            render: function(data, type, full, meta) {
	                return formatDateTime(data);
	            }
	        },
        {
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "添加", "fn": "jumpContractUploadEdit(\'"+data.id+"\')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		},
    ]
    
});

//跳转到上传页面
function jumpContractUploadEdit(id){
	var src = "/html/scanCpyMgt/scanCpyUpload/scanCpyUploadEdit.html?pageType=2&id="+id;
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
		App.getCommonModal("contractType", "#contractTypeName","typeFullname","typeId");
	})
	$("#searchUndertakerName").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","name","id");
	})
	$("#searchOtherSubject").click(function(){
		App.getCommonModal("otherSubject","#oppoPartyName","partnerName","partnerId");
	})
	$("#contractTypeName").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#undertakeName").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#oppoPartyName").on("input",function(){
		$(this).data("exactSearch",false);
	})
})

//调整时间显示，不显示时分秒
function formatDateTime(inputTime,type) {
	if(inputTime){
		var date = new Date(inputTime);
	}else{
		return "";
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
}
