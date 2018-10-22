//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	//生成预警总览图表
	initWarningOverviewCharts();
})
/*
 * 标题切换
 */
$("#buttonNavTabs").on("click","button",function(){
	$(this).addClass("check").siblings("button").removeClass("check");
})
$('button[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//	$(e.target).data("id")
})
//风险预警点击跳转
$("#warningOverviewTr").on("click","a",function(){
	var paneId = $(this).data("pane");
	var domId = $(this).attr("id") + "Dom";
	var scrollTopValue = $("#"+domId).offset().top - 20;
	$("#buttonNavTabs button[data-id="+paneId+"]").addClass("check").siblings("button").removeClass("check");
	$("#"+paneId).addClass("active in").siblings("div").removeClass("active in");
	$("#page-content").animate({
		scrollTop:scrollTopValue
	},300)
})
//查询按钮点击统一处理
function searchTable(tableId){
	alert(tableId);
	var isInitTable = $.fn.dataTable.isDataTable("#"+tableId);
	if(isInitTable){
		reloadPageDataTable("#"+tableId);
	}else{
		if(tableId == "lineIsArrearageTable"){

		}else if(tableId == "lineRentNotBillTable"){
			
		}else if(tableId == "lineRentedHaveBillTable"){
			
		}
		
	}
}
/*
 * 页面内表格初始化完成之后查询事件
 */
function reloadPageDataTable(tableId,retainPaging) {
	var table = $(tableId).DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
/*
 * 生成预警总览图表
 */
function initWarningOverviewCharts(){
	var chartsDom = echarts.init(document.getElementById('warningOverviewCharts'));
	var option = {
		title : {
	        text: '风险预警总览',
	        x:'center',
	        textStyle: {
	        	fontSize:14
	        }
	   	},
	    xAxis: {
	        type: 'category',
	        data: ['线路租用中欠费', '线路账单异常', '合同到期业务未停止', '业务信息报错']
	    },
	    yAxis: {
	        type: 'value'
	    },
	    series: [{
	        data: [12, 20, 15, 30,],
	        type: 'bar',
	        barWidth:'45%',
	        itemStyle: {   
                normal:{  
                    color: function (params){
                        var colorList = ['#00a3e2', '#ffc100','#bfbfbf','#85be23'];
                        return colorList[params.dataIndex];
                    }
                },
           	}
	    }]
	};
	chartsDom.setOption(option);
}
