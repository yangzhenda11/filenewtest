//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 该dom中可接受的配置参数
 * id:业务id暂定
 * relationType：是否确定是否关联合同 1：已关联  2：未关联
 * returnbtn：是否显示返回按钮，默认不传值为false
 */
var parm = App.getPresentParm();
console.log(parm);
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
};
if(parm.relationType == "0"){
	$("#lineInforTableConNum").remove();
}else if(parm.relationType == null){
	layer.alert("请确定线路的关联方式",{icon:2})
};
function initselectLR() {
	var theadList = parm.relationType == 1 ? relationContractTheadList : notRelationContractTheadList;
	var options = {
		modalId: "#commomModal",
		data: theadList
	}
	$.initSelectLRFn(options);
}
/*
 * 点击确定回调的页面方法
 */
function returnSelectLRData(data) {
	console.log(data);
}
/*
 * 点击查询事件
 * 判断是否已加载表格，若已加载直接刷新操作，否则初始化表格
 */
function searchLineInfor(){
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(isInit){
		reloadPageDataTable("#lineInforTable");
	}else{
		$("#lineInforTable").html("");
		initLineInforTable();
	}
}
/*
 * 未关联合同客户表格初始化
 * 表头为动态表头，第一次加载时需要去掉其中的内容
 */
function initLineInforTable(){
	App.initDataTables('#lineInforTable', "#lineInforLoading", {
		ajax: {
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				console.log(data)
				return lineData;
			}
		},
		"columns": lineInforTableColumns()
	});
}
function lineInforTableColumns(){
	var theadList = parm.relationType == 1 ? relationContractTheadList : notRelationContractTheadList;
	var columns = [
		{"data" : null,"title":"序号",
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#lineInforTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(theadList, function(k,v) {
		if(v.data == "mon"){
			var item = {
				"data": v.id,
				"title": v.data,
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			};
		}else{
			var item = {
				"data": v.id,
				"title": v.data
			};
		};
		columns.push(item);
	});
	return columns;
};

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
$("#returnBtn").on("click",function(){
	 window.history.go(-1);
})

//已关联合同表格头
var relationContractTheadList = [
	{data:"业务信息ID",id:"id",checked:true},
	{data:"电路代号",id:"daihao",checked:true},
	{data:"产品名称",id:"name",checked:true},
	{data:"合同编号",id:"num",checked:true},
	{data:"集客客户编号",id:"jnum",checked:true},
	{data:"集客客户名称",id:"jname",checked:true},
	{data:"发起分公司",id:"come",checked:true},
	{data:"租用范围",id:"fanwei",checked:true},
	{data:"月租费",id:"mon",checked:true},
	{data:"租用状态",id:"sta",checked:true},
	{data:"客户经理姓名",id:"cname",checked:true},
	{data:"来源",id:"from",checked:true},
	{data:"接入速率/带宽",id:"cname"},
	{data:"发起省分名称",id:"cname"},
	{data:"发起省分CODE",id:"cname"},
	{data:"发起地市CODE",id:"cname"},
	{data:"A端/CE端城市",id:"cname"},
	{data:"A端/CE端装机地址",id:"cname"},
	{data:"Z端/PE端城市",id:"cname"},
	{data:"Z端/PE端装机地址",id:"cname"},
	{data:"全程竣工时间",id:"cname"},
	{data:"起租时间",id:"cname"},
	{data:"币种",id:"cname"},
	{data:"止租时间",id:"cname"},
	{data:"一次性费用",id:"cname"},
	{data:"客户经理账号",id:"cname"},
	{data:"添加人姓名",id:"cname"},
	{data:"添加人账号",id:"cname"},
	{data:"导入时间",id:"cname"}
];
//未关联合同表格头
var notRelationContractTheadList = [
	{data:"业务信息ID",id:"id",checked:true},
	{data:"电路代号",id:"daihao",checked:true},
	{data:"产品名称",id:"name",checked:true},
	{data:"集客客户编号",id:"jnum",checked:true},
	{data:"集客客户名称",id:"jname",checked:true},
	{data:"发起分公司",id:"come",checked:true},
	{data:"租用范围",id:"fanwei",checked:true},
	{data:"月租费",id:"mon",checked:true},
	{data:"租用状态",id:"sta",checked:true},
	{data:"客户经理姓名",id:"cname",checked:true},
	{data:"来源",id:"from",checked:true},
	{data:"接入速率/带宽",id:"cname"},
	{data:"发起省分名称",id:"cname"},
	{data:"发起省分CODE",id:"cname"},
	{data:"发起地市CODE",id:"cname"},
	{data:"A端/CE端城市",id:"cname"},
	{data:"A端/CE端装机地址",id:"cname"},
	{data:"Z端/PE端城市",id:"cname"},
	{data:"Z端/PE端装机地址",id:"cname"},
	{data:"全程竣工时间",id:"cname"},
	{data:"起租时间",id:"cname"},
	{data:"币种",id:"cname"},
	{data:"止租时间",id:"cname"},
	{data:"一次性费用",id:"cname"},
	{data:"客户经理账号",id:"cname"},
	{data:"添加人姓名",id:"cname"},
	{data:"添加人账号",id:"cname"},
	{data:"导入时间",id:"cname"}
];