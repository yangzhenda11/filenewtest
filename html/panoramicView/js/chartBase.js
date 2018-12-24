function returnBaseType(data,type){
	if(type == 1){
		if(data == 1 || data == 2){
			return "#d11718";
		}else if(data == 3){
			return "#7F7F7F";
		};
	}else if(type == 2){
		if(data == 1 || data == 2){
			return "arrive";
		}else if(data == 3){
			return "notArrive";
		};
	}
}
$.fn.D3Charts = function(options) {
	var defaultData = {
		areaPadding:0,
		autoDrawRect:true,
		areaBorderWidth:2,
		rectSize:6,
		rectR:40,//矩形圆角的弧度
		width: 600,
		height: 400,
		titleSize: 18,
		titleLineHeight: 24,
		titleColor: '#858585',
		textSize: 14,
		textLineHeight: 18,
		textFontWeight: 'bold',
		textColor: '#858585',
		textHoverColor: '#333',
		data: [],
		//点的类型
		dot1: {
			borderColor: '#333',
			borderWidth: 4,
			dotR: 6,
			dotColor: '#ccc'
		},
		dot2: {
			borderColor: '#333',
			borderWidth: 4,
			dotR: 6,
			dotColor: '#FD6D64'
		},
		dot3: {
			borderColor: '#7F7F7F',
			borderWidth: 4,
			dotR: 6,
			dotColor: '#ccc'
		},
		triangleType: {
			'arrive': {
				sizeR1: 6,
				sizeR2: 10,
				color: '#d11718'
			},
			'notArrive': {
				sizeR1: 6,
				sizeR2: 10,
				color: '#7F7F7F'
			}
		}
	}

	options = jQuery.extend(defaultData, options);
	
	var areaData = options.baseData.areaData;
	var lineData = options.baseData.lineData;
	var polyline = options.baseData.polyline;
	var triangle = options.baseData.triangle;
	var $wrapper = $(this);
	var wrapperId = $wrapper.attr('id');
	if(wrapperId == undefined) {
		console.log('请以id命名');
		return false
	}
	var wWidth = options.width;
	var wHeight = options.height;
	var svg = d3.select("#" + wrapperId) //选择文档中的body元素
		.append("svg") //添加一个svg元素
		.attr("width", wWidth) //设定宽度
		.attr("height", wHeight); //设定高度
	//定义比例尺
	var areaXLinear = d3.scale.linear()
		.domain([0, 1])
		.range([0, wWidth]);
	var areaYLinear = d3.scale.linear()
		.domain([0, 1])
		.range([0, wHeight]);

	//承载文本
	var textArray = [];
	var titleArray = [];
	var rectWidth = parseInt(1/areaData.length*1000)/1000;
	//生成矩形面
	$.each(areaData, function(index, item) {
		var rectx = index*rectWidth;
		svg.append("rect")
			.attr('x',parseFloat(areaXLinear(rectx).toFixed(2))+index*defaultData.areaPadding)
			.attr('y',defaultData.areaBorderWidth)
			.attr('rx',defaultData.rectR)
			.attr('ry',defaultData.rectR)
			.attr('width',areaXLinear(rectWidth).toFixed(2)-options.areaPadding)
			.attr('height',areaYLinear(1).toFixed(2)-defaultData.areaBorderWidth*2)
			.attr("fill", '#FFF')
			.style("stroke", '#D9D9D9')
			.style("stroke-width", defaultData.areaBorderWidth)
			.on('mouseover', function() {
				d3.select(this)
					.interrupt()
					.transition()
					.duration(500)
					.attr("fill", '#DADADA')
					.style("stroke", '#8C8C8C');

				//组内节点文本颜色加深
				$.each(textArray[index], function(y, textObj) {
					textObj.transition()
						.duration(500).attr('fill', options.textHoverColor)
				})
				titleArray[index].transition()
					.duration(500).attr('fill', options.textHoverColor)
			})
			.on('mouseout', function() {
				d3.select(this)
					.interrupt()
					.transition()
					.duration(500)
					.attr("fill", '#FFF')
					.style("stroke", '#D9D9D9');

				//组内节点文本颜色加深
				$.each(textArray[index], function(y, textObj) {
					textObj.transition()
						.duration(500).attr('fill', options.textColor)
				})

				titleArray[index].transition()
					.duration(500).attr('fill', options.textColor)
			})
		var titleX = areaXLinear(rectx) + areaXLinear(rectWidth) / 2 - (item.title.length / 2) * options.titleSize;
		var titleY = 10 + options.titleLineHeight;
		var textDom = svg.append("text")
			.attr("class", "title1")
			.attr("x", titleX)
			.attr("y", titleY)
			.attr("dx", 0)
			.attr("dy", 0)
			.text(item.title)
			.style('font-size', options.titleSize + 'px')
			.style('font-family', '微软雅黑')
			.style('font-weight', 'bold')
			.attr('fill', options.titleColor)
		titleArray.push(textDom);
	})
	//生成多边形形面

	//生成线  
	$.each(lineData, function(i, item) {
		var lineObj = svg.append("line")
			.attr("x1", areaXLinear(item.dot1[0]*rectWidth+rectWidth/2).toFixed(2))
			.attr("y1", areaYLinear(areaData[item.dot1[0]].dotData[item.dot1[1]].cy).toFixed(2))
			.attr("x2", areaXLinear(item.dot2[0]*rectWidth+rectWidth/2).toFixed(2))
			.attr("y2", areaYLinear(areaData[item.dot2[0]].dotData[item.dot2[1]].cy).toFixed(2))
			.style("stroke", item.color)
			.style("stroke-width", item.width)
		if(item.style != 'solid') {
			lineObj.style("stroke-dasharray", "5,5")
		}
	});
	//生成折线
	$.each(polyline, function(i, item) {
		var pointsStr = [];
		$.each(item.points, function(index, p) {
			pointsStr.push(areaXLinear(p.dot[0]*rectWidth+rectWidth/2+p.px*rectWidth).toFixed(2) + ',' + areaYLinear(areaData[p.dot[0]].dotData[p.dot[1]].cy+p.py).toFixed(2))
		});
		var lineObj = svg.append("polyline")
			.attr("points", pointsStr.join(' '))
			.style("stroke", item.color)
			.style("stroke-width", item.width)
			.attr('fill', 'rgba(0,0,0,0)')
//			.on('click', function() {
//				alert('我是【' + p.text + '】线条');
//			})
		if(item.style != 'solid') {
			lineObj.style("stroke-dasharray", "5,5")
		}
	});

	//生成点
	$.each(areaData, function(i, areaItem) {
		var cx = i*rectWidth+rectWidth/2;
		var texts = [];
		$.each(areaItem.dotData, function(index, item) {
			var dotStyle = options[item.style];
			svg.append("circle")
				.attr("cx", areaXLinear(cx))
				.attr("cy", areaYLinear(item.cy))
				.attr("r", dotStyle.dotR)
				.attr("id", item.id)
				.attr("data-status", item.status)
				.style("stroke", dotStyle.borderColor)
				.style("stroke-width", dotStyle.borderWidth)
				.attr('fill', dotStyle.dotColor)
				.on('mouseover', function(e) {
					d3.select(this)
						.interrupt()
						.transition()
						.duration(1000)
						.attr("r", dotStyle.dotR + 2)
						.attr('fill', dotStyle.borderColor)
						.attr("stroke-opacity", '0')
				})
				.on('mouseout', function(e) {
					d3.select(this)
						.interrupt()
						.transition()
						.duration(1000)
						.attr("r", dotStyle.dotR)
						.attr('fill', dotStyle.dotColor)
						.attr("stroke-opacity", '1')
				})
//				.on('click', function(e) {
//					d3.select(this)
//						.interrupt()
//					alert('您点击了【' + item.text + '】,此时您可以进行跳转或其他业务操作')
//				})

			//默认不断行，直接拼接
			if(typeof item.isWrap == 'undefined') {
				item.isWrap = false;
				item.wrapCount = item.text.length;
			}
			var trCount = Math.ceil(item.text.length / item.wrapCount);
			var textCount = item.wrapCount;
			var textX = 0;
			var textY = 0;
			if(item.textPos == 'top') {
				textX = areaXLinear(cx) - (textCount / 2);
				textY = areaYLinear(item.cy) - trCount * options.textLineHeight + 2
			} else if(item.textPos == 'bottom') {
				textX = areaXLinear(cx) - (textCount / 2);
				textY = areaYLinear(item.cy) + options.textSize / 2 * 3 + 4
			} else if(item.textPos == 'left') {
				textX = areaXLinear(cx) - textCount / 2 * options.textSize - options.textSize
				textY = areaYLinear(item.cy) - trCount / 2 * options.textLineHeight + dotStyle.dotR / 2 + options.textLineHeight / 2 + 2;
			} else if(item.textPos == 'right') {
				textX = areaXLinear(cx) + textCount / 2 * options.textSize + options.textSize;
				textY = areaYLinear(item.cy) - trCount / 2 * options.textLineHeight + dotStyle.dotR / 2 + options.textLineHeight / 2;
			} else if(item.textPos == 'topRight') {
				textX = areaXLinear(cx) + dotStyle.dotR + 2 * options.textSize;
				textY = areaYLinear(item.cy) - trCount * options.textLineHeight
			} else if(item.textPos == 'topLeft') {
				textX = areaXLinear(cx) - dotStyle.dotR - 2 * options.textSize;
				textY = areaYLinear(item.cy) - trCount * options.textLineHeight
			}
			var tDom = svg.append("text")
				.attr("class", "title2")
				.attr("x", textX)
				.attr("y", textY)
				.attr("dx", 0)
				.attr("dy", 0)
				.style('font-size', options.textSize + 'px')
				.style('font-weight', options.textFontWeight)
				.attr('fill', options.textColor)
			for(var i = 0; i < trCount; i++) {
				tDom.append('tspan')
					.attr("x", textX)
					.attr("y", textY + i * options.textLineHeight)
					.style('text-anchor', 'middle')
					.text(item.text.substring(i * textCount, (i + 1) * textCount))
			}
			texts.push(tDom);
		})
		textArray.push(texts);
	})

	//生成三角形
	$.each(triangle, function(index, item) {
		var dotP = areaData[item.point[0]].dotData[item.point[1]];
		var dotX = areaXLinear(item.point[0]*rectWidth+rectWidth/2);
		var dotY = areaYLinear(areaData[item.point[0]].dotData[item.point[1]].cy);
		var dotR = options[dotP.style].dotR + options[dotP.style].borderWidth / 2;
		var tl = options.triangleType[item.type].sizeR1;
		var tr = options.triangleType[item.type].sizeR2;
		
		var x1, y1, x2, y2, x3, y3;
		if(item.pos == 'bottom') {
			x1 = dotX;
			y1 = dotY + dotR;
		} else if(item.pos == 'up') {
			x1 = dotX;
			y1 = dotY - dotR;
		} else if(item.pos == 'left') {
			x1 = dotX - dotR;
			y1 = dotY;
		} else if(item.pos == 'right') {
			x1 = dotX + dotR;
			y1 = dotY;
		}
		if(item.dir == 'up') {
			x2 = x1 - tl;
			x3 = x1 + tl;
			y2 = y3 = y1 + tr;
		} else if(item.dir == 'right') {
			x2 = x3 = x1 - tr;
			y2 = y1 - tl;
			y3 = y1 + tl;
		} else if(item.dir == 'left') {
			x2 = x3 = x1 + tr;
			y2 = y1 - tl;
			y3 = y1 + tl;
		} else if(item.dir == 'bottom') {
			x2 = x1 - tl;
			x3 = x1 + tl;
			y2 = y3 = y1 - tr;
		}
		svg.append("polyline")
			.attr("points", x1.toFixed(2) + ',' + y1.toFixed(2) + ' ' + x2.toFixed(2) + ',' + y2.toFixed(2) + ' ' + x3.toFixed(2) + ',' + y3.toFixed(2))
			.attr('fill', options.triangleType[item.type].color)
	})

}