//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//获取传递的参数
var parm = App.getPresentParm();
$(function(){
	if(!parm.invPayId){
		layer.alert("页面参数错误，请联系系统管理员。",{icon:2});
		return;
	};
	$("#invoiceNnovateSum").text(App.unctionToThousands(parm.invoiceNnovateSum));
	//发票详情表格初始化
	initInvoiceDetailTable();
})

/*
 * 发票详情表格初始化
 */
function initInvoiceDetailTable(){
	App.initDataTables('#invoiceDetailTable', {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
			"url": serverPath + 'paymentManageInfo/listPaymentManageInfo',
			"data": function(d) {
	        	d.invPayId = parm.invPayId;
				return JSON.stringify(d);;
			}
		},
		"columns": [
			{"data" : null,"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#invoiceDetailTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "orgCodeNameOu","className": "whiteSpaceNormal"},
			{"data": "invoiceNum","className": "whiteSpaceNormal"},
			{"data": "invoiceType","className": "whiteSpaceNormal"},
			{"data": "vendorName","className": "whiteSpaceNormal"},
			{"data": "invoiceNovate","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "invoiceStatus","className": "whiteSpaceNormal"
//				"render" : function(data, type, full, meta){
//					return data == 1 ? "发票正常" : "发票异常"
//				}
			}
		]
	});
}

