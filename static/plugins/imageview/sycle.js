
//首页+产品列表页进度条
(function($) {
	$.fn.svgCircle = function(i) {
		i = $.extend({
			parent: null,
			w: 75,
			R: 30,
			sW: 20,
			color: "#000",
			perent: [110, 110],
			speed: 0,
			delay: 1000
		}, i);
		return this.each(function() {
			var e = i.parent;
			if (!e) return false;
			var w = i.w;
			var r = Raphael(e, w, w),
				R = i.R,
				init = true,
				param = {
					stroke: "#0088cc"
				},
				hash = document.location.hash,
				marksAttr = {
					fill: hash || "#444",
					stroke: "none"
				};
			r.customAttributes.arc = function(b, c, R) {
				var d = 360 / c * b,
					a = (90 - d) * Math.PI / 180,
					x = w / 2 + R * Math.cos(a),
					y = w / 2 - R * Math.sin(a),
					color = i.color,
					path;
				if (c == b) {
					path = [
						["M", w / 2, w / 2 - R],
						["A", R, R, 0, 1, 1, w / 2 - 0.01, w / 2 - R]
					]
				} else {
					path = [
						["M", w / 2, w / 2 - R],
						["A", R, R, 0, +(d > 180), 1, x, y]
					]
				}
				return {
					path: path
				}
			};
			var f = r.path().attr({
				stroke: "#e5e5e5",
				"stroke-width": i.sW
			}).attr({
				arc: [110, 110, R]
			});
			var g = r.path().attr({
				stroke: "#ff0000",
				"stroke-width": i.sW
			}).attr(param).attr({
				arc: [0.01, i.speed, R]
			});
			var h;
			if (i.perent[1] > 0) {
				setTimeout(function() {
					g.animate({
						stroke: i.color,
						arc: [i.perent[1], 100, R]
					}, 900, ">")
				}, i.delay)
			} else {
				g.hide()
			}
		})
	}
})(jQuery);
/**
* options.el 
* options.colors
* options.width
* options.borderWidth
*/
function animateSvgCircle(options) {
	var el = options.el;
	var colors = options.colors?options.colors:["#f5444c"];
	var cWidth = options.width?options.width:100;
	var cBWidth = options.borderWidth?options.borderWidth:60;
	var cR = cWidth/2-cBWidth;
	
	var b = {
		top: $(window).scrollTop(),
		bottom: $(window).scrollTop() + $(window).height()
	};
	var c = $(el);
	c.each(function(index) {
//		if (b.top <= $(this).offset().top && b.bottom >= $(this).offset().top && !$(this).data('bPlay')) {
		if (true) {
			$(this).data('bPlay', true);
			var a = $(this).data('persent');
			if (a != "0") {
				$(this).svgCircle({
					parent: $(this)[0],
					w: cWidth,
					R: cR,
					sW: cBWidth,
					color: colors[index]?colors[index]:'#f5444c',
					perent: [100, a],
					speed: 150,
					delay: 400
				})
			}
			if (a == "0") {
				$(this).find("font").css("color", "#a9a9a9");
				$(this).svgCircle({
					parent: $(this)[0],
					w: cWidth,
					R: cR,
					sW: cBWidth,
					color: ["#d1d1d1", "#d1d1d1", "#d1d1d1"],
					perent: [100, a],
					speed: 150,
					delay: 400
				})
			}
		}
	})
}
/*
$(function() {
	animateSvgCircle({
		el:'.processingbar',
		width:80,
		borderWidth:8
	});
	$(window).scroll(function() {
		animateSvgCircle({
			el:'.processingbar',
			width:80,
			borderWidth:8
		})
	});
});
*/
// $.post(prc + '/reportController/searchStatDetailProject.action',function(data){
//      var domWrapper = $('#circleBar');
//      $.each(data,function(index,item){
//          domWrapper.append('<div onclick="showStaRemandInfoList(\'' + item.projectStatisticCode + '\',\'' + item.projectStatisticCodeDesc + '\');" style="cursor:pointer;" class="circlebar" data-persent="' + item.projNumPersent + '"><font>'+item.projNum + '</font><p>' + item.projectStatisticCodeDesc + '</p></div>')
//      })
//      var cWidth = domWrapper.innerWidth();
//      var itemWidth = 100;
//      animateSvgCircle({
//          el:'.circlebar',
//          width:itemWidth,
//          colors:[
//              '#f5444c','#fdb753','#4cbd8b','#9170db'
//          ],
//          borderWidth:8
//      })
//  })