function initD3Charts(dataObj) {
   	var resourceProject = dataObj.resourceProject;
   	var resourceSign = dataObj.resourceSign;
   	var resourcePurchase = dataObj.resourcePurchase;
   	var registerActivate = dataObj.registerActivate;
   	var businessOrderRelease = dataObj.businessOrderRelease;
   	var businessOrderArrival = dataObj.businessOrderArrival;
   	var businessOrderReceive = dataObj.businessOrderReceive;
   	var supplierOrderConfirm = dataObj.supplierOrderConfirm;
   	var supplierOrderDeliver = dataObj.supplierOrderDeliver;
   	var supplierTicket = dataObj.supplierTicket;
   	var invicePaymentVerification = dataObj.invicePaymentVerification;
   	var invicePaymentPayment = dataObj.invicePaymentPayment;
   	var riskWarning = dataObj.riskWarning;
   	var contractCloseConclude = dataObj.contractCloseConclude;
   	
	var areaData = [{
		"bgColor": "#FFFFCC",
		"title": "前置资源管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "项目",
			"textPos": "left",
			"id": "resourceProject",
			"status": resourceProject,
			"style": "dot" + resourceProject
		}, {
			"cy": 0.55,
			"text": "采购结果",
			"textPos": "left",
			"id": "resourcePurchase",
			"status": resourcePurchase,
			"style": "dot" + resourcePurchase
		}, {
			"cy": 0.75,
			"text": "合同签订",
			"textPos": "left",
			"id": "resourceSign",
			"status": resourceSign,
			"style": "dot" + resourceSign
		},]
	}, {
		"bgColor": "#92D050",
		"title": "合同注册",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "合同激活",
			"textPos": "top",
			"id": "registerActivate",
			"status": registerActivate,
			"style": "dot" + registerActivate
		}]
	}, {
		"bgColor": "#FFFF66",
		"title": "业务管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "订单下达",
			"textPos": "top",
			"id": "businessOrderRelease",
			"status": businessOrderRelease,
			"style": "dot" + businessOrderRelease
		}, {
			"cy": 0.55,
			"text": "订单到货",
			"textPos": "left",
			"id": "businessOrderArrival",
			"status": businessOrderArrival,
			"style": "dot" + businessOrderArrival
		}, {
			"cy": 0.75,
			"text": "订单接收入库",
			"textPos": "bottom",
			"id": "businessOrderReceive",
			"status": businessOrderReceive,
			"style": "dot" + businessOrderReceive
		}]
	}, {
		"bgColor": "#CCFF99",
		"title": "供应商备货",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "订单确认",
			"textPos": "top",
			"id": "supplierOrderConfirm",
			"status": supplierOrderConfirm,
			"style": "dot" + supplierOrderConfirm
		}, {
			"cy": 0.55,
			"text": "订单发货",
			"textPos": "bottom",
			"id": "supplierOrderDeliver",
			"status": supplierOrderDeliver,
			"style": "dot" + supplierOrderDeliver
		}, {
			"cy": 0.75,
			"text": "开票",
			"textPos": "bottom",
			"id": "supplierTicket",
			"status": supplierTicket,
			"style": "dot" + supplierTicket
		}]
	}, {
		"bgColor": "#F0F3F8",
		"title": "收票与付款管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "发票验证",
			"textPos": "top",
			"id": "invicePaymentVerification",
			"status": invicePaymentVerification,
			"style": "dot" + invicePaymentVerification
		}, {
			"cy": 0.55,
			"text": "付款",
			"textPos": "left",
			"id": "invicePaymentPayment",
			"status": invicePaymentPayment,
			"style": "dot" + invicePaymentPayment
		}]
	}, {
		"bgColor": "#FFCC66",
		"title": "风险预警",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "未按约定履行预警",
			"textPos": "top",
			"id": "riskWarning",
			"status": riskWarning,
			"style": "dot" + riskWarning
		}]
	}, {
		"bgColor": "#FFCC66",
		"title": "合同关闭",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.35,
			"text": "合同办结",
			"textPos": "top",
			"id": "contractCloseConclude",
			"status": contractCloseConclude,
			"style": "dot" + contractCloseConclude
		}]
	}]

	var lineData = [{
		"dot1": [0, 0],
		"dot2": [0, 1],
		"color": returnBaseType(resourcePurchase,1),
		"width": "4",
		"style": "solid",
		"text": "项目-采购结果"
	},{
		"dot1": [0, 1],
		"dot2": [0, 2],
		"color": returnBaseType(resourceSign,1),
		"width": "4",
		"style": "solid",
		"text": "采购结果-合同签订"
	},{
		"dot1": [1, 0],
		"dot2": [2, 0],
		"color": returnBaseType(businessOrderRelease,1),
		"width": "4",
		"style": "solid",
		"text": "合同激活-订单下达"
	},{
		"dot1": [2, 0],
		"dot2": [3, 0],
		"color": returnBaseType(supplierOrderConfirm,1),
		"width": "4",
		"style": "solid",
		"text": "订单下达-订单确认"
	},{
		"dot1": [3, 0],
		"dot2": [3, 1],
		"color": returnBaseType(supplierOrderDeliver,1),
		"width": "4",
		"style": "solid",
		"text": "订单确认-订单发货"
	},{
		"dot1": [3, 1],
		"dot2": [2, 1],
		"color": returnBaseType(businessOrderArrival,1),
		"width": "4",
		"style": "solid",
		"text": "订单发货-订单到货"
	},{
		"dot1": [2, 1],
		"dot2": [2, 2],
		"color": returnBaseType(businessOrderReceive,1),
		"width": "4",
		"style": "solid",
		"text": "订单到货-订单接收入库"
	},{
		"dot1": [2, 2],
		"dot2": [3, 2],
		"color": returnBaseType(supplierTicket,1),
		"width": "4",
		"style": "solid",
		"text": "订单接收入库-开票"
	},{
		"dot1": [4, 0],
		"dot2": [4, 1],
		"color": returnBaseType(invicePaymentPayment,1),
		"width": "4",
		"style": "solid",
		"text": "发票验证-付款"
	}]
	var polyline = [{
		"points": [{
			dot: [0, 2],
			px: 0,
			py: 0
		}, {
			dot: [0, 2],
			px: 1,
			py: 0
		}, {
			dot: [1, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(registerActivate,1),
		"width": "4",
		"style": "solid",
		"text": "合同签订-合同激活"
	},{
		"points": [{
			dot: [3, 2],
			px: 0,
			py: 0
		}, {
			dot: [3, 2],
			px: 0.5,
			py: 0
		}, {
			dot: [3, 0],
			px: 0.5,
			py: 0
		}, {
			dot: [4, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(invicePaymentVerification,1),
		"width": "4",
		"style": "solid",
		"text": "开票-发票验证"
	},{
		"points": [{
			dot: [4, 1],
			px: 0,
			py: 0
		}, {
			dot: [4, 1],
			px: 1,
			py: 0
		}, {
			dot: [5, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(riskWarning,1),
		"width": "4",
		"style": "solid",
		"text": "付款-未按约定履行预警"
	},{
		"points": [{
			dot: [4, 1],
			px: 0.5,
			py: 0
		}, {
			dot: [4, 0],
			px: 0.5,
			py: 0
		}, {
			dot: [5, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(riskWarning,1),
		"width": "4",
		"style": "solid",
		"text": "付款-未按约定履行预警"
	},{
		"points": [{
			dot: [4, 1],
			px: 0,
			py: 0
		}, {
			dot: [4, 1],
			px: 0,
			py: 0.2
		}, {
			dot: [6, 0],
			px: 0,
			py: 0.4
		}, {
			dot: [6, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(contractCloseConclude,1),
		"width": "4",
		"style": "solid",
		"text": "付款-合同办结"
	}];

	var triangle = [{
		point: [0, 1],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(resourcePurchase,2)
	},{
		point: [0, 2],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(resourceSign,2)
	},{
		point: [1, 0],
		pos: "bottom",
		dir: "up",
		type: returnBaseType(registerActivate,2)
	},{
		point: [2, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(businessOrderRelease,2)
	},{
		point: [3, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(supplierOrderConfirm,2)
	},{
		point: [3, 1],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(supplierOrderDeliver,2)
	},{
		point: [2, 1],
		pos: "right",
		dir: "left",
		type: returnBaseType(businessOrderArrival,2)
	},{
		point: [2, 2],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(businessOrderReceive,2)
	},{
		point: [3, 2],
		pos: "left",
		dir: "right",
		type: returnBaseType(supplierTicket,2)
	},{
		point: [4, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(invicePaymentVerification,2)
	},{
		point: [4, 1],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(invicePaymentPayment,2)
	},{
		point: [4, 1],
		pos: "right",
		dir: "left",
		type: returnBaseType(riskWarning,2)
	},{
		point: [5, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(riskWarning,2)
	},{
		point: [6, 0],
		pos: "bottom",
		dir: "up",
		type: returnBaseType(contractCloseConclude,2)
	}]
	var flowData = {
		areaData: areaData,
		lineData: lineData,
		polyline: polyline,
		triangle: triangle
	};
	return flowData;
}