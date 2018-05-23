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
        		d.oppoPartyId = $("#oppoPartyName").data("partnerId");
        	}else{
        		d.oppoPartyName = $("#oppoPartyName").val();
        	};
        	
        	if($("#unicomPartyName").data("exactSearch")){
        		d.unicomPartyId = $("#unicomPartyName").data("partnerId");
        	}else{
        		d.unicomPartyName = $("#unicomPartyName").val();
        	};
        	
        	if($("#undertakeName").data("exactSearch")){
        		d.undertakerId = $("#undertakeName").data("id");
        	}else{
        		d.undertakeName = $("#undertakeName").val();
        	};
        	
        	if($("#executeDeptName").data("exactSearch")){
        		d.executeDeptId = $("#executeDeptName").data("orgId");
        	}else{
        		d.executeDeptName = $("#executeDeptName").val();
        	};
        	
        	d.contractId = config.contractId;
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
			d.approveDateBegin = $("#approve_date_begin").val();
			d.approveDateEnd = $("#approve_date_end").val();
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	//增加序号列
        {"data" : null,
         "title":"序号",
         "className": "text-center",
		"render" : function(data, type, full, meta){
						return meta.row + 1;
				   }
		},
        {"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "executeDeptName","title": "承办部门","className":"whiteSpaceNormal","width":"13%"},
        {"data": "undertakerId","bVisible":false,"title": "承办人"},
        {"data": "undertakeName","title": "承办人"},
        {"data": "unicomPartyId","bVisible":false,"title": "我方主体"},
        {"data": "unicomPartyName","title": "我方主体","className":"whiteSpaceNormal","width":"15%"},
        {"data": "oppoPartyId","bVisible":false,"title": "对方主体"},
        {"data": "oppoPartyName","title": "对方主体","className":"whiteSpaceNormal","width":"15%"},
		{"data": "id","bVisible":false,"title": "id"},
        {
	        "data": "approveDate",
	        "title": "审批通过时间",
	        render: function(data, type, full, meta) {
	            return App.formatDateTime(data,"yyyy-MM-dd");
	        }
	    },
        {
			"data": "id",
			"className": "text-center",
			"title": "快捷下载",
			"render": function(data, type, full, meta) {
				var downloadUrl = serverPath+"contractUpload/downloadContractText?id=" + full.id;
				var result = '<a href="'+downloadUrl+'"">正文下载</a>';
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
                    btnArray.push({ "name": "打开", "fn": "jumpSanCpyQueryDetail(\'"+data.id+"\')","icon":"iconfont icon-add"});
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
		App.getCommonModal("otherSubject","#oppoPartyName","partnerName","partnerId");
	})
	//我方主体
	$("#searchUnicomParty").click(function(){
		App.getCommonModal("ourSubject","#unicomPartyName","partnerName","partnerId");
	})
	//承办人
	$("#searchUndertaker").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","name","id");
	})
	//承办部门
	$("#searchexecuteDept").click(function(){
		App.getCommonModal("agentDepartment","#executeDeptName","orgName","orgId");
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

//跳转展示列表页面
function jumpSanCpyQueryDetail(id){
	var src = "/html/scanCpyMgt/scanCpyQuery/scanCpyQueryDetail.html?id="+id;
	App.changePresentUrl(src);
}

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