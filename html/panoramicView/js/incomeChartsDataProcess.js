function initIncomeFlowCharts() {
	var areaData = [{
		"bgColor": "#FFFFCC",
		"title": "前置资源管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "客户",
			"textPos": "top",
			"style": "dot1"
		}, {
			"cy": 0.65,
			"text": "合同签订",
			"textPos": "bottom",
			"style": "dot1"
		}]
	}, {
		"bgColor": "#92D050",
		"title": "合同注册",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "合同激活",
			"textPos": "top",
			"style": "dot1"
		}]
	}, {
		"bgColor": "#FFFF66",
		"title": "业务管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "线路起租",
			"textPos": "top",
			"style": "dot1"
		}, {
			"cy": 0.65,
			"text": "线路退租",
			"textPos": "bottom",
			"style": "dot1"
		}]
	}, {
		"bgColor": "#CCFF99",
		"title": "开票与回款管理",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "开票回款",
			"textPos": "topLeft",
			"style": "dot2"
		}]
	}, {
		"bgColor": "#F0F3F8",
		"title": "风险预警",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "未按合同收款预警",
			"textPos": "bottom",
			"style": "dot2"
		}]
	}, {
		"bgColor": "#FFCC66",
		"title": "合同关闭",
		"titlePos": "topCenter",
		"dotData": [{
			"cy": 0.45,
			"text": "合同办结",
			"textPos": "top",
			"style": "dot2"
		}]
	}]

	var lineData = [{
		"dot1": [0, 0],
		"dot2": [0, 1],
		"color": "#d11718",
		"width": "4",
		"style": "solid",
		"text": "客户-合同签订"
	}, {
		"dot1": [1, 0],
		"dot2": [3, 0],
		"color": "#d11718",
		"width": "4",
		"style": "solid",
		"text": "合同激活-开票回款"
	}, {
		"dot1": [2, 0],
		"dot2": [2, 1],
		"color": "#d11718",
		"width": "4",
		"style": "solid",
		"text": "线路起租-线路退租"
	}, {
		"dot1": [3, 0],
		"dot2": [4, 0],
		"color": "#7F7F7F",
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
		"color": "#d11718",
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
			px: 0.95,
			py: 0
		}, {
			dot: [2, 0],
			px: 0.95,
			py: 0
		}],
		"color": "#d11718",
		"width": "4",
		"style": "solid",
		"text": "线路退租"
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
		"color": "#7F7F7F",
		"width": "4",
		"style": "solid",
		"text": "开票-未按"
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
		"color": "#7F7F7F",
		"width": "4",
		"style": "solid",
		"text": "开票-办结"
	}];

	var triangle = [{
		point: [0, 1],
		pos: "up",
		dir: "bottom",
		type: "normal"
	}, {
		point: [1, 0],
		pos: "left",
		dir: "right",
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
		point: [3, 0],
		pos: "up",
		dir: "bottom",
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