//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
var parm = App.getPresentParm();
$(function(){
	if(!parm.managerStaffOrgId && !parm.customerCode){
		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
		return;
	}
	//我的客户查询表格初始化
	initPerformContractTable();
})
/*
 * 履行中合同信息查询点击查询事件
 */
function searchPerformContract(){
	reloadPageDataTable("#performContractTable");
}
/*
 * 我的客户查询表格初始化
 */
function initPerformContractTable(){
	if(parm.customerCode){
		var url = serverPath + 'performanceContract/listContractByCustomerCode';
	}else if(parm.managerStaffOrgId){
		var url = serverPath + 'performanceContract/listContractByManagerStaffOrgId';
	}else{
		layer.alert("参数错误，请联系系统管理员。",{icon:2});
		return;
	};
	App.initDataTables('#performContractTable', "#performContractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": url,
			"data": function(d) {
				if(parm.customerCode){
					d.customerCode = parm.customerCode;
				}else{
					d.managerStaffOrgId = parm.managerStaffOrgId;
				};
	        	d.contractInfoSearch = $("#contractInfoInput").val().trim();
				return JSON.stringify(d);;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#performContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractName","className": "whiteSpaceNormal","width": "25%"},
			{"data": "contractNumber","className": "whiteSpaceNormal","width": "15%"},
			{"data": "customerName","className": "whiteSpaceNormal","width": "20%"},
			{"data": "customerCode","className": "whiteSpaceNormal","width": "10%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width": "10%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "contractId","className": "whiteSpaceNormal","width": "5%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 跳转线路信息
 */
function jumpLineManage(data){
	var url = "/html/incomeWorktable/lineManage/lineView.html?id="+data+"&relationType=1&returnbtn=true";
	App.changePresentUrl(url);
}

/*
 * 页面内表格初始化完成之后查询事件
 */
function reloadPageDataTable(tableId,retainPaging) {
	var table = $(tableId).DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

