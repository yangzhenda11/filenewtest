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
        	var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	//增加序号列
        {"data" : null,"title":"序号","className": "text-center","width":"5%",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#scanCpyQueryTable").pageStart;
				return start + meta.row + 1;
		   	}
		},
        {"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"16%"},
        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"13%"},
        {"data": "executeDeptName","title": "承办部门","className":"whiteSpaceNormal","width":"10%"},
//      {"data": "undertakerId","bVisible":false,"title": "承办人"},
        {"data": "undertakeName","title": "承办人","className":"whiteSpaceNormal","width":"6%"},
//      {"data": "unicomPartyId","bVisible":false,"title": "我方主体"},
        {"data": "unicomPartyName","title": "我方主体","className":"whiteSpaceNormal","width":"15%"},
//      {"data": "oppoPartyId","bVisible":false,"title": "对方主体"},
        {"data": "oppoPartyName","title": "对方主体","className":"whiteSpaceNormal","width":"15%"},
//		{"data": "id","bVisible":false,"title": "id"},
        {"data": "approveDate","title": "审批通过日期","className":"whiteSpaceNormal","width":"8%",
	        "render": function(data, type, full, meta) {
	            return App.formatDateTime(data,"yyyy-MM-dd");
	        }
	    },
        {"data": "id","title": "快捷下载","className":"whiteSpaceNormal text-center","width":"7%",
			"render": function(data, type, full, meta) {
				var result = '<a onclick="getScanCpyConract(\''+full.id+'\')">正文下载</a>';
				return result;
			}
		},
		{"data": null,"className": "text-center","title": "操作","width":"5%",
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
    ],
	"columnDefs": [{
   		"createdCell": function (td, cellData, rowData, row, col) {
         	if ( col > 0 && col < 9) {
           		$(td).attr("title", $(td).text())
         	}
   		}
 	}]
});

/*
 * 搜索点击事件
 */
function searchContractUpload(retainPaging) {
	var approveDateBegin = $("#approve_date_begin").val();
	var approveDateEnd = $("#approve_date_end").val();
	if(App.checkDate(approveDateBegin,approveDateEnd)){
		var table = $('#scanCpyQueryTable').DataTable();
		if(retainPaging) {
			table.ajax.reload(null, false);
		} else {
			table.ajax.reload();
		}
	}else{
		layer.msg("审批通过日期开始日期不能早于截止日期");
		return;
	}
}
/*
 * 日期修改时监听事件
 */
function dataChangeEvent(dom){
	var approveDateBegin = $("#approve_date_begin").val();
	var approveDateEnd = $("#approve_date_end").val();
	if(!App.checkDate(approveDateBegin,approveDateEnd)){
		layer.msg("审批通过日期开始日期不能早于截止日期");
		$(dom).val("");
	};
}
//导出合同扫描件Excel
function exportScanCpyList(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'contractScanQuery/contractExportList' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}

/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumber").val().trim(),
		contractName : $("#contractName").val().trim(),
		approveDateBegin : $("#approve_date_begin").val().trim(),
		approveDateEnd : $("#approve_date_end").val().trim()
	};
	if($("#oppoPartyName").data("exactSearch")){
		searchData.oppoPartyId = $("#oppoPartyName").data("partnerId");
	}else{
		searchData.oppoPartyName = $("#oppoPartyName").val().trim();
	};
	
	if($("#unicomPartyName").data("exactSearch")){
		searchData.unicomPartyId = $("#unicomPartyName").data("partnerId");
	}else{
		searchData.unicomPartyName = $("#unicomPartyName").val().trim();
	};
	
	if($("#undertakeName").data("exactSearch")){
		searchData.undertakerId = $("#undertakeName").data("staffOrgId");
	}else{
		searchData.undertakeName = $("#undertakeName").val().trim();
	};
	
	if($("#executeDeptName").data("exactSearch")){
		searchData.executeDeptId = $("#executeDeptName").data("orgId");
	}else{
		searchData.executeDeptName = $("#executeDeptName").val().trim();
	};
	return searchData;
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
		App.getCommonModal("agentStaff","#undertakeName","name","staffOrgId");
	})
	//承办部门
	$("#searchexecuteDept").click(function(){
		App.getCommonModal("agentDepartment","#executeDeptName","orgName","orgId");
	})
	$("#oppoPartyName").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#unicomPartyName").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#undertakeName").on("change",function(){
		$(this).data("exactSearch",false);
	})
	$("#executeDeptName").on("change",function(){
		$(this).data("exactSearch",false);
	})
})

//跳转展示列表页面
function jumpSanCpyQueryDetail(id){
	var src = "./scanCpyQueryDetail.html?id="+id;
	App.changePresentUrl(src);
}
/*
 * 获取正文下载的key
 */
function getScanCpyConract(id){
	var url = serverPath + "contractScanQuery/downloadContractText";
	var postData = {
		id: id,
		fileType: "905510"
	};
	App.formAjaxJson(url, "get", postData, successCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			window.location.href = serverPath+'fileload/downloadS3?key=' + data;
		}else{
			layer.msg("获取不到下载key值！");
		}
	}
}
