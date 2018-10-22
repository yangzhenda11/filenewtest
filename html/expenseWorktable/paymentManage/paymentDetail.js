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
	$("#payVateAmountSum").text(App.unctionToThousands(parm.payVateAmountSum));
	//付款详情表格初始化
	initPaymentDetailTable();
})

/*
 * 付款详情表格初始化
 */
function initPaymentDetailTable(){
	App.initDataTables('#paymentDetailTable', {
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
					var start = App.getDatatablePaging("#paymentDetailTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "orgCodeNameOu","className": "whiteSpaceNormal"},
			{"data": "invoiceNum","className": "whiteSpaceNormal"},
			{"data": "invoiceType","className": "whiteSpaceNormal"},
			{"data": "vendorName","className": "whiteSpaceNormal"},
			{"data": "prepayRemaining","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "appPaymentAmount","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "realPaymentAmount","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "invoicDiscountAmount","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "beforePayedAmount","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			},
			{"data": "lastPayDate","className": "whiteSpaceNormal",
				"render": function(data, type, full, meta){
					return App.formatDateTime(data, "yyyy-mm-dd");
				}
			},
			{"data": "invoiceStatus","className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					return data == 1 ? "发票正常" : "发票异常"
				}
			}
		]
	});
}
