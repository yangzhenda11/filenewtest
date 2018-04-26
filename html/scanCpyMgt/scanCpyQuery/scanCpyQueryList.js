//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#scanCpyQueryTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'contractScanQuery/contractScanQueryList',
        "data": function(d) {//自定义传入参数
        	if($("#oppoPartyName").data("exactSearch")){
        		d.oppoPartyId = $("#oppoPartyName").data("oppoPartyId");
        	}else{
        		d.oppoPartyName = $("#oppoPartyName").val();
        	};
        	
        	if($("#unicomPartyName").data("exactSearch")){
        		d.unicomPartyId = $("#unicomPartyName").data("unicomPartyId");
        	}else{
        		d.unicomPartyName = $("#unicomPartyName").val();
        	};
        	
        	if($("#undertakeName").data("exactSearch")){
        		d.undertakerId = $("#undertakeName").data("undertakeId");
        	}else{
        		d.undertakeName = $("#undertakeName").val();
        	};
        	
        	if($("#executeDeptName").data("exactSearch")){
        		d.executeDeptNameId = $("#executeDeptName").data("executeDeptNameId");
        	}else{
        		d.executeDeptName = $("#executeDeptName").val();
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
    	//增加序号列
        {"data" : null,
		"render" : function(data, type, full, meta){
			return meta.col + 1;
		}}, 
        {"data": "contractName","title": "合同名称",
        	"className":"whiteSpaceNormal",
			//"width":"25%"
        },
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
			"data": key,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				var result = '<a href="/contractUpload/downloadS3?key=' + data.substr(0,data.lastIndexOf('.')) + '">下载</a>';
				return result;
			}
		},
		{
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "打开", "fn": "jumpContractUploadEdit(\'"+data.contractId+"\')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		}
    ]
});

/*
 * 搜索点击事件
 */
function searchContractUpload(retainPaging) {
	var table = $('#scanCpyQueryTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

//点击iconfont弹出模态框事件
$(function(){
	//对方主体
	$("#searchOppoParty").click(function(){
		App.getCommonModal("otherSubject","#oppoPartyName","oppoPartyName","oppoPartyId");
	})
	//我方主体
	$("#searchUnicomParty").click(function(){
		App.getCommonModal("ourSubject","#unicomPartyName","unicomPartyName","unicomPartyId");
	})
	//承办人
	$("#searchUndertaker").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","undertakeName","undertakeId");
	})
	//承办部门
	$("#searchexecuteDept").click(function(){
		App.getCommonModal("agentDepartment","#executeDeptName","executeDeptName","executeDeptNameId");
	})
	
	
	$("#oppoPartyName").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#unicomPartyName").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#undertakeName").on("input",function(){
		$(this).data("exactSearch",false);
	})
	$("#executeDeptName").on("input",function(){
		$(this).data("exactSearch",false);
	})
})