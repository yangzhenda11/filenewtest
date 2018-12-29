$(function(){
	var tw = $('#incomeFlowChart').width();
	var th = $('#incomeFlowChart').height();
	var flowData = initIncomeFlowCharts();
	console.log(flowData);
	$('#incomeFlowChart').D3Charts({
		width:tw,
		height:th,
		areaData: flowData.areaData,
		lineData: flowData.lineData,
		polyline: flowData.polyline,
		triangle: flowData.triangle
	})
	$("circle").hover(function(){
		if($(this).data("id") == "kehu"){
			var html = "<input type='checkbox' disabled='disabled' ><span style='color:#000'>测试</span>"
			layer.tips(html, $(this), {
			  tips: [3, '#fff'],
			  time: 0
			});
		}
	},function(){
		layer.closeAll('tips');
	})
	$(window).resize(function(){
		$('#incomeFlowChart').html('');
		var tw = $('#incomeFlowChart').width();
		var th = $('#incomeFlowChart').height();
		$('#incomeFlowChart').D3Charts({
			width:tw,
			height:th,
			areaData: flowData.areaData,
			lineData: flowData.lineData,
			polyline: flowData.polyline,
			triangle: flowData.triangle
		})
	})
})