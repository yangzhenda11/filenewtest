var isLoadFinanceInfo = false;
var isLoadBuildInfo = false;
$(function() {
	$("#infoTab").on("click","a", function() {
		$(this).addClass("check").siblings(".infoTabTitle").removeClass("check");
		var checkedId = $(this).data("id");
		if(checkedId == "financeInfo") {
			if(isLoadFinanceInfo == false) {
				loadFinanceInfo();
				isLoadFinanceInfo = true;
			}
		};
		if(checkedId == "buildInfo") {
			if(isLoadBuildInfo == false) {
				loadBuildInfo();
				isLoadBuildInfo = true;
			}
		};
		$(".infoTabFrom").addClass("hidden");
		$("#" + checkedId + "").removeClass("hidden");
	});
	showFn();
	test();
});

var table = App.initDataTables('#dataTable1,#dataTable2', {
	"ajax": "../../static/data/workOrder.json",
	"columns": [{
			"data": "proId",
			"title": "设备行号",
			"width": '500'
		},
		{
			"data": "proName",
			"title": "设备名称",
			"width": '200'
		},
		{
			"data": "type",
			"title": "设备型号",
			"width": '200'
		},
		{
			"data": "unit",
			"title": "计量单位",
			"width": '190'
		},
		{
			"data": "unitPrice",
			"title": "不含增值税目录单价（元）",
			"width": '120'
		},
		{
			"data": "discount",
			"title": "折扣率",
			"width": '50',
		},
		{
			"data": "unitCost",
			"title": "不含增值税物资单价（元）",
			"width": '190'
		},
		{
			"data": "unmber",
			"title": "数量",
			"width": '120',
		},
		{
			"data": "subtotal",
			"title": "不含增值税金额小计（元）",
			"width": '190'
		},
		{
			"data": "name",
			"title": "站名",
			"width": '120',
		},
		{
			"data": "organization",
			"title": "库存组织",
			"width": '190'
		},
		{
			"data": "customer",
			"title": "制造商",
			"width": '120',
		},
		{
			"data": "code",
			"title": "资产类别代码",
			"width": '190'
		},
		{
			"data": "explain",
			"title": "资产类别说明",
			"width": '190'
		}
	],
	"scrollX": true
})

function loadFinanceInfo() {
	var oTable = App.initEditableDatatables('#financeInfoTable', {
		"addRowBtn": "#addFinanceItemBtn",
		"ajax": "../../static/data/workOrder2.json",
		"columns": [{
				"data": "organization",
				"title": "所属组织",
				"isEditable": true
			},
			{
				"data": "code",
				"title": "序号",
				"isEditable": true
			},
			{
				"data": "proId",
				"title": "项目编码",
				"isEditable": true,
				"render": function(data, type, row, meta) {
					return '<input type="text" class="form-control" disabled="" value="ZGA13BA0D0010">'
				}
			},
			{
				"data": "type",
				"title": "付款说明",
				"isEditable": true
			},
			{
				"data": "payStep",
				"title": "付款阶段",
				"isEditable": true,
				"render": function(data, type, row, meta) {
					return '<select name="" class="form-control select2me">'+
											'<option value="0">到货款</option>'+
											'<option value="1">预货款</option>'+
										'</select>'
				}
			},
			{
				"data": "payRatio",
				"title": "付款比例",
				"isEditable": true
			},
			{
				"data": "payNum",
				"title": "付款金额",
				"isEditable": true
			},
			{
				"data": "payType",
				"title": "支付方式",
				"isEditable": true,
				"render": function(data, type, row, meta) {
					return '<select name="" class="form-control select2me">'+
											'<option value="0">电汇</option>'+
											'<option value="1">转账</option>'+
											'<option value="2">银行托收</option>'+
										'</select>';
				}
			},
			{
				"data": "payData",
				"title": "计划付款日期",
				"isEditable": true,
				"render": function(data, type, row, meta) {
					return '<div class="input-group date date-picker">' +
						'<input type="text" class="form-control" readonly value="2018-12-15" >' +
						'<span class="input-group-btn">' +
						'<button class="btn default" type="button">' +
						'<i class="fa fa-calendar"></i>' +
						'</button>' +
						'</span>' +
						'</div>'
				}
			}
		],
		//按照第一列的名称排序
		"ordering": true,
		"order": [
			[0, "asc"]
		],
		"fnDeleteEditRow": function(row) {
			console.log('删除了一行，数据为：' + JSON.stringify(row));
		},
		"fnValidEditRow": function(row) {
			var flag = true;
			//对数据进行逻辑校验
			console.log('用户要新增一条记录，数据为:' + JSON.stringify(row));
			if(row.busiCode == '') {
				layer.open({
					title: '提示',
					content: '工单编码不能为空',
					icon: 0
				})
				flag = false;
			}
			return flag;
		},
		"fnSaveEditRow": function(row) {
			console.log('新增了一行，数据为：' + JSON.stringify(row));
		}
	})
}

function loadBuildInfo() {
	var oTable = App.initEditableDatatables('#buildInfoTable', {
		"addRowBtn": "#addbuildItemBtn",
		"ajax": "../../static/data/workOrder2.json",
		"columns": [
			{
				"data": "code",
				"title": "序号",
				"isEditable": true
			},
			{
				"data": "organization",
				"title": "所属组织",
				"isEditable": true
			},
			{
				"data": "proId",
				"title": "项目编码",
				"isEditable": true
			},
			{
				"data": "organization",
				"title": "项目名称",
				"isEditable": true
			},
			{
				"data": "payNum",
				"title": "合同分摊金额",
				"isEditable": true
			},
			{
				"data": "payData",
				"title": "项目计划开工日期",
				"isEditable": true,
				"render": function(data, type, row, meta) {
					return '<div class="input-group date date-picker">' +
						'<input type="text" class="form-control" readonly value="2018-12-15" >' +
						'<span class="input-group-btn">' +
						'<button class="btn default" type="button">' +
						'<i class="fa fa-calendar"></i>' +
						'</button>' +
						'</span>' +
						'</div>'
				}
			},
			{
				"data": "payData",
				"title": "项目计划竣工日期",
				"isEditable": true,
				"render": function(data, type, row, meta) {
					return '<div class="input-group date date-picker">' +
						'<input type="text" class="form-control" readonly value="2020-12-15" >' +
						'<span class="input-group-btn">' +
						'<button class="btn default" type="button">' +
						'<i class="fa fa-calendar"></i>' +
						'</button>' +
						'</span>' +
						'</div>'
				}
			}
		],
		//按照第一列的名称排序
		"ordering": true,
		"order": [
			[0, "asc"]
		],
		"fnDeleteEditRow": function(row) {
			console.log('删除了一行，数据为：' + JSON.stringify(row));
		},
		"fnValidEditRow": function(row) {
			var flag = true;
			//对数据进行逻辑校验
			console.log('用户要新增一条记录，数据为:' + JSON.stringify(row));
			if(row.busiCode == '') {
				layer.open({
					title: '提示',
					content: '工单编码不能为空',
					icon: 0
				})
				flag = false;
			}
			return flag;
		},
		"fnSaveEditRow": function(row) {
			console.log('新增了一行，数据为：' + JSON.stringify(row));
		}
	})
}
function showFn(){
	$("#contractMore").on("click", function() {
		if($("#contractMore").text() == "更多") {
			$("#contractMore").text("隐藏");
			$("#contractMoreContent").removeClass("hidden")
		} else {
			$("#contractMore").text("更多");
			$("#contractMoreContent").addClass("hidden");
		};
		return false;
	})
	$("#gathering").on("click", function() {
		if($("#gathering").text() == "更多") {
			$("#gathering").text("隐藏");
			$("#gatheringContent").removeClass("hidden")
		} else {
			$("#gathering").text("更多");
			$("#gatheringContent").addClass("hidden");
		};
		return false;
	})
	$("#payMore").on("click", function() {
		if($("#payMore").text() == "更多") {
			$("#payMore").text("隐藏");
			$("#payMoreContent").removeClass("hidden")
		} else {
			$("#payMore").text("更多");
			$("#payMoreContent").addClass("hidden");
		};
		return false;
	})
}

