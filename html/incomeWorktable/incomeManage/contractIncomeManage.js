//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 接受的配置参数
 */
var parm = App.getPresentParm();
console.log(parm);
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
};
$(function(){
 	if(parm.customerCode){
 		$("#customerCodeNum").text(parm.customerCode);
 		initContractInforTable();
 	}else{
		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
		return;
 	}
})

/*
 * 未关联合同客户表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initContractInforTable(){
	var isInit = $.fn.dataTable.isDataTable("#contractInforTable");
	if(!isInit){
		$("#contractInforTable").html("");
	}
	App.initDataTables('#contractInforTable', {
		ajax: {
			"type": "POST",
			"url" : serverPath + 'incomeManage/listContractIncomeZxByCustomerCode',
			"contentType" : "application/json;charset=utf-8",
			"data": function(d) { 
				d.customerCode = parm.customerCode;
				d.accountPeriodName = parm.accountPeriodName;
				return  JSON.stringify(d);
			}
		},
		"columns": [
					{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
						"render" : function(data, type, full, meta){
							var start = App.getDatatablePaging("#contractInforTable").pageStart;
							return start + meta.row + 1;
						}
					},
					{"data": "contractName","title":"合同名称","className": "whiteSpaceNormal","width": "17%"},
					{"data": "contractNumber","title":"合同编号","className": "whiteSpaceNormal","width": "10%"},
					{"data": "customerName","title":"客户名称","className": "whiteSpaceNormal","width": "10%"},
					{"data": "customerCode","title":"集客客户编号","className": "whiteSpaceNormal","width": "10%"},
					{"data": "contractValue","title":"含增值税合同金额","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "receivableAmount","title":"累计应收（元）","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "arrearsAmount","title":"累计欠费（元）","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "collectedAmount","title":"累计实收（元）","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "contractId","title":"线路明细","className": "whiteSpaceNormal","width": "8%",
						"render" : function(data, type, full, meta){
							return "<a onclick='jumpLineManage(\""+data+"\")'>查看</a>";
						}
					}
				]
	});
}

/*
 * 跳转线路信息（已关联合同）
 */
function jumpLineManage(contractId){
	var url = "/html/incomeWorktable/incomeManage/lineIncomeManage.html?contractId="+contractId;
	top.showSubpageTab(url,"查看线路收入信息");
}