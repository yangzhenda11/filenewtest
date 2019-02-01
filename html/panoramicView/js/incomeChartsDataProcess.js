function initD3Charts(dataObj) {
   	var resourceCustomer = dataObj.resourceCustomer;
   	var resourceSign = dataObj.resourceSign;
   	var registerActivate = dataObj.registerActivate;
   	var businessLineRenting = dataObj.businessLineRenting;
   	var businessStopRenting = dataObj.businessStopRenting;
   	var ticketReceivables = dataObj.ticketReceivables;
   	var riskWarning = dataObj.riskWarning;
   	var contractCloseConclude = dataObj.contractCloseConclude;
   	var bussStopRent_ticket = 2;
   	if(businessStopRenting == 3 || ticketReceivables == 3){
   		bussStopRent_ticket = 3;
   	};
   	
	var areaData = [{
		"bgColor": "#FFFFCC",
		"title": "前置资源管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "客户",
			"textPos": "top",
			"id": "resourceCustomer",
			"status": resourceCustomer,
			"style": "dot" + resourceCustomer
		}, {
			"cy": 0.65,
			"text": "合同签订",
			"textPos": "bottom",
			"id": "resourceSign",
			"status": resourceSign,
			"style": "dot" + resourceSign
		}]
	}, {
		"bgColor": "#92D050",
		"title": "合同注册",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
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
			"cy": 0.45,
			"text": "线路起租",
			"textPos": "top",
			"id": "businessLineRenting",
			"status": businessLineRenting,
			"style": "dot" + businessLineRenting
		}, {
			"cy": 0.65,
			"text": "线路退租",
			"textPos": "bottom",
			"id": "businessStopRenting",
			"status": businessStopRenting,
			"style": "dot" + businessStopRenting
		}]
	}, {
		"bgColor": "#CCFF99",
		"title": "开票与回款管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "开票回款",
			"textPos": "topLeft",
			"id": "ticketReceivables",
			"status": ticketReceivables,
			"style": "dot" + ticketReceivables
		}]
	}, {
		"bgColor": "#F0F3F8",
		"title": "风险预警",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "未按合同收款预警",
			"textPos": "bottom",
			"id": "riskWarning",
			"status": riskWarning,
			"style": "dot" + riskWarning
		}]
	}, {
		"bgColor": "#FFCC66",
		"title": "合同关闭",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
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
		"color": returnBaseType(resourceSign,1),
		"width": "4",
		"style": "solid",
		"text": "客户-合同签订"
	},{
		"dot1": [1, 0],
		"dot2": [2, 0],
		"color": returnBaseType(businessLineRenting,1),
		"width": "4",
		"style": "solid",
		"text": "合同激活-线路起租"
	},{
		"dot1": [2, 0],
		"dot2": [2, 1],
		"color": returnBaseType(businessStopRenting,1),
		"width": "4",
		"style": "solid",
		"text": "线路起租-线路退租"
	},{
		"dot1": [2, 0],
		"dot2": [3, 0],
		"color": returnBaseType(ticketReceivables,1),
		"width": "4",
		"style": "solid",
		"text": "线路起租-开票回款"
	},{
		"dot1": [3, 0],
		"dot2": [4, 0],
		"color": returnBaseType(riskWarning,1),
		"width": "4",
		"style": "solid",
		"text": "开票回款-未按合同收款预警"
	}, ]
	var polyline = [{
		"points": [{
			dot: [0, 1],
			px: 0,
			py: 0
		}, {
			dot: [0, 1],
			px: 0.5,
			py: 0
		}, {
			dot: [0, 0],
			px: 0.5,
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
	}, {
		"points": [{
			dot: [2, 1],
			px: 0,
			py: 0
		}, {
			dot: [2, 1],
			px: 0.5,
			py: 0
		}, {
			dot: [2, 0],
			px: 0.5,
			py: 0
		}],
		"color": returnBaseType(bussStopRent_ticket,1),
		"width": "4",
		"style": "solid",
		"text": "线路退租-开票回款"
	}, {
		"points": [{
			dot: [3, 0],
			px: 0,
			py: 0
		}, {
			dot: [3, 0],
			px: 0,
			py: -0.2
		}, {
			dot: [4, 0],
			px: 0,
			py: -0.2
		}, {
			dot: [4, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(riskWarning,1),
		"width": "4",
		"style": "solid",
		"text": "开票回款-未按合同收款预警"
	}, {
		"points": [{
			dot: [3, 0],
			px: 0,
			py: 0
		}, {
			dot: [3, 0],
			px: 0,
			py: 0.2
		}, {
			dot: [5, 0],
			px: 0,
			py: 0.2
		}, {
			dot: [5, 0],
			px: 0,
			py: 0
		}],
		"color": returnBaseType(contractCloseConclude,1),
		"width": "4",
		"style": "solid",
		"text": "开票回款-合同办结"
	}];

	var triangle = [{
		point: [0, 1],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(resourceSign,2)
	}, {
		point: [1, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(registerActivate,2)
	}, {
		point: [2, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(businessLineRenting,2)
	}, {
		point: [2, 1],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(businessStopRenting,2)
	}, {
		point: [3, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(ticketReceivables,2)
	}, {
		point: [3, 0],
		pos: "up",
		dir: "bottom",
		type: returnBaseType(riskWarning,2)
	}, {
		point: [4, 0],
		pos: "left",
		dir: "right",
		type: returnBaseType(riskWarning,2)
	}, {
		point: [5, 0],
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