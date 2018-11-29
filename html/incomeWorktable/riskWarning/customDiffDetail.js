//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 该dom中可接受的配置参数
 */
var parm = App.getPresentParm();
//if(!parm.contractId){
//	layer.alert("页面参数错误，请联系系统管理员",{icon:2});
//}
$(function(){
	searchLineInfor();
})
/*
 * 点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineInfor(){
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(isInit){
		reloadPageDataTable("#lineInforTable");
	}else{
		initLineInforTable();
	}
}
/*
 * 未关联合同客户表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initLineInforTable(){
     var  riskType=parm.riskType;
     var  path=""; 
      if(riskType){
    	  path=riskType;
      }

	App.initDataTables('#lineInforTable', "#lineInforLoading", {
		ajax: {
			"type": "POST",
			"url" : serverPath + 'riskWarningDetailMangerController/listCustomDiff'+path+'Detail',
			"contentType" : "application/json;charset=utf-8",
			"data": function(d) { 
				d.customerName = $("#searchInput").val().trim();
				d.contractNumber = parm.contractNumber;
				d.customerNameBss1=parm.customerNameBss1;
			    d.customerNameBss2=parm.customerNameBss2;
			    d.customerCodeBss1=parm.customerCodeBss1;
				d.contractId = parm.contractId;
				d.diffContent = parm.diffContent; 
				return  JSON.stringify(d);
			}
		},
		"columns":  [
			{   "data" : null,
				"className": "whiteSpaceNormal",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#lineInforTable").pageStart;
					return start + meta.row + 1;
				}
			},
			{"data": "customerName",
				"className": "whiteSpaceNormal",},
			{"data": "customerCode",
				"className": "whiteSpaceNormal",},
			{"data": "serviceNumber",
				"className": "whiteSpaceNormal",},
			{"data": "businessId",
				"className": "whiteSpaceNormal",},
			{"data": "circuitCode",
				"className": "whiteSpaceNormal",},
			{"data": "productName",
				"className": "whiteSpaceNormal",},
			{"data": "startCityName",
				"className": "whiteSpaceNormal",},
			{"data": "rentingScope",
				"className": "whiteSpaceNormal",},
			{"data": "monthRentCost",
				"className": "whiteSpaceNormal",
			  "render" : function(data, type, full, meta) {
					return App.unctionToThousands(data);
				}		
			}
		]
			
	});
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





