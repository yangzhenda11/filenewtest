function initExpenseFlowCharts() {
	var areaData = [{
		"bgColor": "#FFFFCC",
		"title": "前置资源管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.3,
			"text": "项目",
			"textPos": "top",
			"style": "dot1"
		}, {
			"cy": 0.5,
			"text": "采购结果",
			"textPos": "left",
			"style": "dot1"
		}, {
			"cy": 0.7,
			"text": "合同签订",
			"textPos": "bottom",
			"style": "dot1"
		}]
	}, {
		"bgColor": "#92D050",
		"title": "合同注册",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.30,
			"text": "合同激活",
			"textPos": "top",
			"style": "dot1"
		}]
	}, {
		"bgColor": "#FFFF66",
		"title": "业务管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.3,
			"text": "订单下达",
			"textPos": "top",
			"style": "dot1"
		}, {
			"cy": 0.5,
			"text": "订单接收",
			"textPos": "bottom",
			"style": "dot1"
		}]
	}, {
		"bgColor": "#CCFF99",
		"title": "收票与付款管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.3,
			"text": "发票",
			"textPos": "top",
			"style": "dot2"
		}, {
			"cy": 0.5,
			"text": "付款",
			"textPos": "left",
			"style": "dot2"
		}]
	}, {
		"bgColor": "#F0F3F8",
		"title": "风险预警",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.3,
			"text": "未按约定履行预警",
			"textPos": "top",
			"style": "dot2"
		}]
	}, {
		"bgColor": "#FFCC66",
		"title": "合同关闭",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.3,
			"text": "合同办结",
			"textPos": "top",
			"style": "dot2"
		}]
	}]

	var lineData = [{
		"dot1": [0, 0],
		"dot2": [0, 2],
		"color": "#C10000",
		"width": "4",
		"style": "solid",
		"text": "项目-合同签订"
	}, {
		"dot1": [1, 0],
		"dot2": [2, 0],
		"color": "#C10000",
		"width": "4",
		"style": "solid",
		"text": "合同激活-订单下达"
	}, {
		"dot1": [2, 0],
		"dot2": [2, 1],
		"color": "#C10000",
		"width": "4",
		"style": "solid",
		"text": "订单下达-订单接收"
	}, {
		"dot1": [3, 0],
		"dot2": [3, 1],
		"color": "#7F7F7F",
		"width": "4",
		"style": "solid",
		"text": "发票-付款"
	}]
	var polyline = [{
		"points": [{
			dot: [0, 2],
			px: 0,
			py: 0
		}, {
			dot: [1, 0],
			px: 0,
			py: 0.4
		}, {
			dot: [1, 0],
			px: 0,
			py: 0
		}],
		"color": "#C10000",
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
		}, {
			dot: [3, 0],
			px: 0,
			py: 0
		}],
		"color": "#C10000",
		"width": "4",
		"style": "solid",
		"text": "订单接收-发票"
	}, {
		"points": [{
			dot: [3, 1],
			px: 0,
			py: 0
		}, {
			dot: [3, 1],
			px: 0,
			py: 0.2
		}, {
			dot: [5, 0],
			px: 0,
			py: 0.4
		}, {
			dot: [5, 0],
			px: 0,
			py: 0
		}],
		"color": "#7F7F7F",
		"width": "4",
		"style": "solid",
		"text": "付款-办结"
	}, {
		"points": [{
			dot: [3, 1],
			px: 0,
			py: 0
		}, {
			dot: [4, 0],
			px: 0,
			py: 0.2
		}, {
			dot: [4, 0],
			px: 0,
			py: 0
		}],
		"color": "#7F7F7F",
		"width": "4",
		"style": "solid",
		"text": "付款-未按约定"
	}, {
		"points": [{
			dot: [3, 1],
			px: 0.5,
			py: 0
		}, {
			dot: [4, 0],
			px: -0.5,
			py: 0
		}, {
			dot: [4, 0],
			px: 0,
			py: 0
		}],
		"color": "#7F7F7F",
		"width": "4",
		"style": "solid",
		"text": "付款-未按约定"
	}];

	var triangle = [{
		point: [0, 1],
		pos: "up",
		dir: "bottom",
		type: "normal"
	}, {
		point: [0, 2],
		pos: "up",
		dir: "bottom",
		type: "normal"
	}, {
		point: [1, 0],
		pos: "bottom",
		dir: "up",
		type: "normal"
	}, {
		point: [2, 0],
		pos: "left",
		dir: "right",
		type: "normal"
	}, {
		point: [2, 1],
		pos: "up",
		dir: "bottom",
		type: "normal"
	}, {
		point: [3, 0],
		pos: "left",
		dir: "right",
		type: "normal"
	}, {
		point: [3, 1],
		pos: "up",
		dir: "bottom",
		type: "small"
	}, {
		point: [3, 1],
		pos: "right",
		dir: "left",
		type: "small"
	}, {
		point: [4, 0],
		pos: "left",
		dir: "right",
		type: "small"
	}, {
		point: [5, 0],
		pos: "bottom",
		dir: "up",
		type: "small"
	}]
	var flowData = {
		areaData: areaData,
		lineData: lineData,
		polyline: polyline,
		triangle: triangle
	};
	return flowData;
}