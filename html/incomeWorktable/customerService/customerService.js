//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;
//页面变量
var pageConfig = {
	customerCode: null,
	isInitLineTable: false,
	isInitContractTable: false
};
/*
 * 标题切换
 */
$("#buttonNavTabs").on("click","button",function(){
	$(this).addClass("check").siblings("button").removeClass("check");
})
/*
 * 标题切换触发事件
 */
$('button[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	var targetId = $(e.target).data("id");
	if(targetId == "lineDetail"){
		if(pageConfig.isInitLineTable){
			initLineTable();
		}
	}else if(targetId == "contractDetail"){
		if(pageConfig.isInitContractTable){
			initContractTable();
		}
	}
})
/*
 * 数据集客客户编号进行查询
 */
function searchCustomer(){
	var customerCode = $("#customerNumber").val().trim();
	if(customerCode == ""){
		layer.alert("请输入集客客户编号。",{icon:2});
		return;
	};
	var url = serverPath + "customerInfo/getCustomerInfoByCustomerCode";
	var postData = {
		customerCode: customerCode
	};
	App.formAjaxJson(url, "post", JSON.stringify(postData), successCallback, improperCallback);
	function successCallback(result) {
		var data = result.data;
		if(data){
			$("#businessEmptyDom").hide();
			$("#businessDetailsDom").show();
			pageConfig.isInitContractTable = true;
			pageConfig.customerCode = data.customerCode;
			$("#customerCode").text(data.customerCode);
			$(".customerName").text(data.customerName);
			if($("#lineDetail").css("display") == "none"){
				pageConfig.isInitLineTable = true;
				$('#buttonNavTabs button:first').addClass("check").siblings("button").removeClass("check");
				$('#buttonNavTabs button:first').tab('show');
			}else{ 
				initLineTable();
			};
		}else{
			layer.alert("暂无数据",{icon:2});
		}
	}
	function improperCallback(result){
		var ms = result.message;
		layer.alert(ms,{icon:2});
	}
}
/*
 * 生成线路账单表格
 */
function initLineTable(){
	App.initDataTables('#lineTable', "#loading", {
		ajax: {
			"type": "POST",
			"url": serverPath + 'customerServiceMangerController/listContractIncomeZx',
	        "contentType":"application/json;charset=utf-8", 
	        "data": function(d) {
	        	d.customerCode = pageConfig.customerCode;
	           	return JSON.stringify(d);
	        }
		},
	    "columns": [
	    	{"data" : null,"title":"序号","className": "text-center","width":"5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#lineTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
			{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
	        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"15%"},
	        {"data": "accountPeriodName","title": "账期","className":"whiteSpaceNormal","width":"10%"},
	        {"data": "monthRentCost","title": "月租费","className":"whiteSpaceNormal","width":"10%",
	        	"render" : function(data, type, full, meta){
					return App.unctionToThousands(data);
			   	}
	        },
	        {"data": "collectedAmount","title": "已缴费（元）","className":"whiteSpaceNormal","width":"10%",
	        	"render" : function(data, type, full, meta){
					return App.unctionToThousands(data);
			   	}
	        },
	        {"data": "arrearsAmount","title": "待缴费（元）","className":"whiteSpaceNormal","width":"10%",
	        	"render" : function(data, type, full, meta){
					return App.unctionToThousands(data);
			   	}
	        },
	        {"data": "contractId","title": "线路清单","className":"whiteSpaceNormal","width":"10%",
	        	"render" : function(data, type, full, meta){
					return "<a onclick='jumpLineManageByContract(\""+data+"\")'>查看</a>";
			   	}
	        }
	    ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 && col < 6) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	},function(){
		pageConfig.isInitLineTable = false;
	});
}

/*
 * 生成合同清单表格
 */
function initContractTable(){
	App.initDataTables('#contractTable', "#loading", {
		ajax: {
			"type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath + 'performanceContract/listContractByCustomerCode',
	        "data": function(d) {
	        	d.customerCode = pageConfig.customerCode;
	           	return JSON.stringify(d);
	        }
		},
	    "columns": [
	    	{"data" : null,"title":"序号","className": "text-center","width":"5%",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#lineTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
			{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"35%"},
	        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"25%"},
	        {"data": "contractValue","title": "含增值税合同金额","className":"whiteSpaceNormal","width":"20%",
	        	"render" : function(data, type, full, meta){
					return App.unctionToThousands(data);
			   	}
	       	},
	        {"data": "contractId","title": "合同里程碑","className":"whiteSpaceNormal","width":"10%",
	        	"render" : function(data, type, full, meta){
					return "<a onclick='jumpRiskList(\""+data+"\")'>管理</a>";
			   	}
	        }
	    ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 && col < 6) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	},function(){
		pageConfig.isInitContractTable = false;
	});
}
/*
 * 跳转线路信息（已关联合同）
 */
function jumpLineManageByContract(contractId){
	var url = "/html/incomeWorktable/lineManage/lineView.html?relationType=1&id="+contractId;
	top.showSubpageTab(url,"线路基本信息");
}
/*
 * 跳转里程碑查看
 */
function jumpRiskList(contractId){ 
	var url = "/html/incomeWorktable/milestone/milestoneList.html?contractId="+contractId;
	top.showSubpageTab(url,"里程碑查看");
}