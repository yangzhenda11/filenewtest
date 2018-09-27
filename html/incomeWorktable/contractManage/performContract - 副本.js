//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

//我的客户查询表格初始化
initPerformContractTable();
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
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return contractData;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#performContractTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "contractname","className": "whiteSpaceNormal"},
			{"data": "contractnum","className": "whiteSpaceNormal"},
			{"data": "cusname","className": "whiteSpaceNormal"},
			{"data": "jnum","className": "whiteSpaceNormal"},
			{"data": "from","className": "whiteSpaceNormal"},
			{"data": "mon","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManage(\""+data.mon+"\")'>查看</a>";
				}
			},
		]
	});
}
/*
 * 跳转线路信息
 */
function jumpLineManage(data){
	var url = "/html/incomeWorktable/lineManage/lineView.html?id=123&relationType=1&returnbtn=true";
	window.location.href = url;
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

