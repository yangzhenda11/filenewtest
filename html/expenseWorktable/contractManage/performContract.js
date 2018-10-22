//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//获取传递的参数
var parm = App.getPresentParm();
$(function(){
	if(!parm.partyId){
		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
		return;
	};
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
	App.initDataTables('#performContractTable', "#performContractLoading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'performanceContractPay/listPerformanceContractByPartyId',
			"data": function(d) {
	        	d.partyId = parm.partyId;
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
			{"data": "partnerName","className": "whiteSpaceNormal","width": "20%"},
			{"data": "partnerCode","className": "whiteSpaceNormal","width": "10%"},
			{"data": "contractValue","className": "whiteSpaceNormal","width": "15%",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "contractNumber","className": "whiteSpaceNormal","width": "10%",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpOrderManageByContract(\""+data+"\")'>查看</a>";
				}
			}
		]
	});
}
/*
 * 跳转订单信息
 */
function jumpOrderManageByContract(contractNumber){
	var url = "/html/expenseWorktable/orderManage/orderManageForContract.html?returnbtn=true&contractNumber="+contractNumber;
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

