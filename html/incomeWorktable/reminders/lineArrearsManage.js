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
 	if(!parm.dataSummaryDate && !parm.contractId){
 		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
 		return;
 	}else{
 		initLineInforTable();
 	}
})
/*
 * 未关联合同客户表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initLineInforTable(){
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(!isInit){
		$("#lineInforTable").html("");
	}
	App.initDataTables('#lineInforTable', {
		ajax: {
			"type": "POST",
			"url" : serverPath + 'reminders/listArrearsLineByContractId',
			"contentType" : "application/json;charset=utf-8",
			"data": function(d) { 
				d.dataSummaryDate = parm.dataSummaryDate;
				d.contractId = parm.contractId;
				return JSON.stringify(d);
			}
		},
		"columns": [
					{"data" : null,"title":"序号","className": "whiteSpaceNormal","width": "5%",
						"render" : function(data, type, full, meta){
							var start = App.getDatatablePaging("#contractInforTable").pageStart;
							return start + meta.row + 1;
						}
					},
					{"data": "serviceNumber","title":"服务号码","className": "whiteSpaceNormal","width": "10%"},
					{"data": "businessId","title":"业务信息ID","className": "whiteSpaceNormal","width": "10%"},
					{"data": "circuitCode","title":"电路代号","className": "whiteSpaceNormal","width": "10%"},
					{"data": "productName","title":"产品名称","className": "whiteSpaceNormal","width": "10%"},
					{"data": "startCityName","title":"发起分公司","className": "whiteSpaceNormal","width": "10%"},
					{"data": "rentingScope","title":"租用范围","className": "whiteSpaceNormal","width": "10%"},
					{"data": "accountPeriodName","title":"账期","className": "whiteSpaceNormal","width": "10%"},
					{"data": "monthRentCost","title":"月租费","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "receivableAmount","title":"应收金额","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "collectedAmount","title":"实收金额","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					},
					{"data": "arrearsAmount","title":"欠费金额","className": "whiteSpaceNormal","width": "10%",
						"render": function(data, type, full, meta){
							return App.unctionToThousands(data);
						}
					}
				]
	});
}