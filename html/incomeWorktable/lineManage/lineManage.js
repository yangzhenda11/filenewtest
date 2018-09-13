//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

//已关联合同表格头
var relationContractTheadList = [
	{name:"业务信息ID",data:"id"},
	{name:"电路代号",data:"daihao"},
	{name:"产品名称",data:"name"},
	{name:"合同编号",data:"num"},
	{name:"集客客户编号",data:"jnum"},
	{name:"集客客户名称",data:"jname"},
	{name:"发起分公司",data:"come"},
	{name:"租用范围",data:"fanwei"},
	{name:"月租费",data:"mon"},
	{name:"租用状态",data:"sta"},
	{name:"客户经理姓名",data:"cname"},
	{name:"来源",data:"from"}
];
//未关联合同表格头
var notRelationContractTheadList = [
	{name:"业务信息ID",data:"id"},
	{name:"电路代号",data:"daihao"},
	{name:"产品名称",data:"name"},
	{name:"集客客户编号",data:"jnum"},
	{name:"集客客户名称",data:"jname"},
	{name:"发起分公司",data:"come"},
	{name:"租用范围",data:"fanwei"},
	{name:"月租费",data:"mon"},
	{name:"租用状态",data:"sta"},
	{name:"客户经理姓名",data:"cname"},
	{name:"来源",data:"from"}
];

/*
 * 该dom中可接受的配置参数
 * id:业务id暂定（区别跳转还是直接从线路管理打开）
 * relationType：是否确定是否关联合同，若有则隐藏选择dom
 * returnbtn：是否显示返回按钮，默认不传值为false
 * import：是否显示导入区域，默认不传值为false
 */
var parm = App.getPresentParm();
console.log(parm);
if(parm.returnbtn == "true"){
	$("#returnBtn").show();
};
if(parm.relationType == "0" || parm.relationType == "1"){
	if(parm.relationType == "1"){
		$("#lineInfor input[name='relationType'][value=1]").attr("checked","checked")
	}else{
		$("#lineInfor input[name='relationType'][value=0]").attr("checked","checked");
	};
	searchLineInfor();
}else{
	$("#relationTypeDom").show();
};

//区域收缩时引用的函数，返回form-fieldset的id
function formFieldsetSlideFn(id){
	
}
/*
 * 未关联合同和已关联合同切换
 */
$("#lineInfor input[name='relationType']").on("change",function(){
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(isInit){
		initLineInforTable();
	}else{
		if($(this).val() == 1){
			$("#lineInforTableConNum").removeClass("hidden");
		}else{
			$("#lineInforTableConNum").addClass("hidden");
		}
	}
})
/*
 * 未关联合同客户点击查询事件
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
	var isInit = $.fn.dataTable.isDataTable("#lineInforTable");
	if(!isInit){
		$("#lineInforTable").html("");
	};
	App.initDataTables('#lineInforTable', "#lineInforLoading", {
		ajax: {
			"type": "GET",
			"url": serverPath + 'staffPartner/getStaffPartnerList',
			"data": function(d) {
//				d.staffName = $("input[name='staffName']").val().trim();
				return d;
			},
			"dataSrc":function(data){
				return lineData;
			}
		},
		"columns": lineInforTableColumns()
	});
}
function lineInforTableColumns(){
	var whiteSpaceNormal = "";
	var theadList = $("#lineInfor input[name='relationType']:checked").val()==1 ? relationContractTheadList : notRelationContractTheadList;
	var columns = [
		{"data" : null,"title":"序号","className": whiteSpaceNormal,
			"render" : function(data, type, full, meta){
				var start = App.getDatatablePaging("#lineInforTable").pageStart;
				return start + meta.row + 1;
			}
		}
	];
	$.each(theadList, function(k,v) {
		if(v.data == "mon"){
			var item = {
				"data": v.data,
				"title": v.name,
				"render": function(data, type, full, meta){
					return App.unctionToThousands(data);
				}
			};
		}else{
			var item = {
				"data": v.data,
				"title": v.name,
				"className": whiteSpaceNormal
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
