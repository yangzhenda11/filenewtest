$.fn.D3Charts = function(options){
	var defaultData = {
		width:600,
		height:400,
		titleSize:24,
		titleLineHeight:24,
		titleColor:'#3E3026',
		textSize:16,
		textLineHeight:18,
		textFontWeight:'bold',
		textColor:'#3E3026',
		data:[],
		lineData:[],
		//点的类型
		dot1:{
			borderColor:'#002060',
			borderWidth:5,
			dotR:6,
			dotColor:'#FFF'
		},
		dot2:{
			borderColor:'#7F7F7F',
			borderWidth:5,
			dotR:6,
			dotColor:'#A6A6A6'
		},
		triangleType:{
			'normal':{
				sizeR1:8,
				sizeR2:14,
				color:'#66CCFF'
			},
			'small':{
				sizeR1:6,
				sizeR2:10,
				color:'#7F7F7F'
			}
		}
		
	}
	
	options = jQuery.extend(defaultData,options);
	var areaData = options.areaData;
	var lineData = options.lineData;
	var polyline = options.polyline;
	var triangle = options.triangle;
	var $wrapper = $(this);
	var wrapperId = $wrapper.attr('id');
	if(wrapperId == undefined){
		return false
	}
	var wWidth = options.width;
	var wHeight = options.height;
	var svg = d3.select("#"+wrapperId)     //选择文档中的body元素
		    .append("svg")          //添加一个svg元素
		    .attr("width", wWidth)       //设定宽度
		    .attr("height", wHeight);    //设定高度
	//定义比例尺
	var areaXLinear = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, wWidth]);
	var areaYLinear = d3.scale.linear()
	    .domain([0, 1])
	    .range([0, wHeight]);
    
    //生成面
    $.each(areaData,function(index,item){
    	//添加面
    	svg.append("rect")
	    .attr("x",areaXLinear(item.x))
	    .attr("y",areaYLinear(item.y))
	    .attr("width",areaXLinear(item.w))
	    .attr("height",areaYLinear(item.h))
	    .attr("fill",item.bgColor)
//	    .on('click',function(){
//	    	alert('我是【'+item.title+'】模块');
//	    })
	    
	    var titleX = areaXLinear(item.x)+(areaXLinear(item.w)/2)-(item.title.length/2)*options.titleSize;
		var titleY = areaYLinear(item.y)+10+options.titleLineHeight;
		svg.append("text")
    	.attr("class","title1")
	    .attr("x",titleX)
	    .attr("y",titleY)
	    .attr("dx",0)
	    .attr("dy",0)
	    .text(item.title)
	    .style('font-size',options.titleSize+'px')
	    .style('font-weight','bold')
	    .attr('fill',options.titleColor)
    })
    
    
	//生成线  
	$.each(lineData, function(i,item) {
		var lineObj = svg.append("line")
		    .attr("x1",areaXLinear(item.x1))
		    .attr("y1",areaYLinear(item.y1))
		    .attr("x2",areaXLinear(item.x2))
		    .attr("y2",areaYLinear(item.y2))
		    .style("stroke",item.color)
		    .style("stroke-width",item.width)
//		    .on('click',function(){
//		    	alert('我是【'+item.text+'】线条');
//		    })
	    if(item.style!='solid'){
	    	lineObj.style("stroke-dasharray","5,5")
	    }
	});
	//生成折线
	$.each(polyline, function(i,item) {
		var pointsStr = [];
		$.each(item.points, function(index,p) {
			pointsStr.push(areaXLinear(p.x).toFixed(2)+','+areaYLinear(p.y).toFixed(2))
		});
		var lineObj = svg.append("polyline")
		    .attr("points",pointsStr.join(' '))
		    .style("stroke",item.color)
		    .style("stroke-width",item.width)
		    .attr('fill','rgba(0,0,0,0)')
//		    .on('click',function(){
//		    	alert('我是【'+p.text+'】线条');
//		    })
	    if(item.style!='solid'){
	    	lineObj.style("stroke-dasharray","5,5")
	    }
	});
	
	//生成点
	$.each(areaData,function(i,areaItem){
		$.each(areaItem.dotData,function(index,item){
			var dotStyle = options[item.style];
			svg.append("circle")
			    .attr("cx",areaXLinear(item.cx))
			    .attr("cy",areaYLinear(item.cy))
			    .attr("r",dotStyle.dotR)
			    .style("stroke",dotStyle.borderColor)
			    .style("stroke-width",dotStyle.borderWidth)
			    .attr('fill',dotStyle.dotColor)
			    .attr('data-id',item.id)
//			    .on('click',function(){
//			    	alert('我是【'+item.text+'】点');
//			    })
				
			//默认不断行，直接拼接
			if(typeof item.isWrap == 'undefined'){
				item.isWrap = false;
				item.wrapCount = item.text.length;
			}
			var trCount = Math.ceil(item.text.length/item.wrapCount);
			var textCount = item.wrapCount;
			var textX = 0;
			var textY = 0;
			if(item.textPos == 'top'){
				textX = areaXLinear(item.cx)-(textCount/2);
				textY = areaYLinear(item.cy)-trCount*options.textLineHeight+2
			}else if(item.textPos == 'bottom'){
				textX = areaXLinear(item.cx)-(textCount/2);
				textY = areaYLinear(item.cy)+options.textSize/2*3+4
			}else if(item.textPos == 'left'){
				textX = areaXLinear(item.cx)-textCount/2*options.textSize-options.textSize
				textY = areaYLinear(item.cy)-trCount/2*options.textLineHeight+dotStyle.dotR/2+options.textLineHeight/2+2;
			}else if(item.textPos == 'right'){
				textX = areaXLinear(item.cx)+textCount/2*options.textSize+options.textSize;
				textY = areaYLinear(item.cy)-trCount/2*options.textLineHeight+dotStyle.dotR/2+options.textLineHeight/2;
			}else if(item.textPos == 'topRight'){
				textX = areaXLinear(item.cx)+dotStyle.dotR+2*options.textSize;
				textY = areaYLinear(item.cy)-trCount*options.textLineHeight
			}
			var tDom = svg.append("text")
		    	.attr("class","title2")
			    .attr("x",textX)
			    .attr("y",textY)
			    .attr("dx",0)
			    .attr("dy",0)
			    .style('font-size',options.textSize+'px')
			    .style('font-weight',options.textFontWeight)
			    .attr('fill',options.textColor)
//			    .on('click',function(){
//			    	alert('我是【“'+item.text+'】点');
//			    })
		 	for(var i=0;i<trCount;i++){
		 		tDom.append('tspan')
		 		.attr("x",textX)
		 		.attr("y",textY+i*options.textLineHeight)
		 		.style('text-anchor','middle')
			    .text(item.text.substring(i*textCount,(i+1)*textCount))
		 	}
		})
	})
	
	//生成三角形
	$.each(triangle,function(index,item){
		var dotP = areaData[item.point[0]].dotData[item.point[1]];
		var dotX = areaXLinear(dotP.cx+(typeof item.offsetX != 'undefined'?item.offsetX:0));
		var dotY = areaYLinear(dotP.cy);
		var dotR = options[dotP.style].dotR+options[dotP.style].borderWidth/2;
		var tl = options.triangleType[item.type].sizeR1;
		var tr = options.triangleType[item.type].sizeR2;
		var x1,y1,x2,y2,x3,y3;
		if(item.pos == 'bottom'){
			x1 = dotX;
			y1 = dotY + dotR;
		}else if(item.pos == 'up'){
			x1 = dotX;
			y1 = dotY - dotR;
		}else if(item.pos == 'left'){
			x1 = dotX-dotR;
			y1 = dotY;
		}else if(item.pos == 'right'){
			x1 = dotX+dotR;
			y1 = dotY;
		}
		
		if(item.dir == 'up'){
			x2 = x1-tl;
			x3 = x1+tl;
			y2 = y3 = y1+tr;
		}else if(item.dir == 'right'){
			x2 = x3 = x1-tr;
			y2 = y1-tl;
			y3 = y1+tl;
		}else if(item.dir == 'left'){
			x2 = x3 = x1+tr;
			y2 = y1-tl;
			y3 = y1+tl;
		}else if(item.dir == 'bottom'){
			x2 = x1-tl;
			x3 = x1+tl;
			y2 = y3 = y1-tr;
		}
		svg.append("polyline")
		    .attr("points",x1.toFixed(2)+','+y1.toFixed(2)+' '+x2.toFixed(2)+','+y2.toFixed(2)+' '+x3.toFixed(2)+','+y3.toFixed(2))
		    .attr('fill',options.triangleType[item.type].color)
	})
	
}
