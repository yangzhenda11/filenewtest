/*
 * 显示所属组织树
 */
function showTree(dom) {
	var selectObj = $("#" + dom + "");
	var selectOffset = selectObj.offset();
	$("#" + dom + "Content").css({
		left: "10px",
		top: selectObj.outerHeight() + "px",
		width: selectObj.outerWidth() + 40
	}).slideDown("fast");
	onBodyDown(dom);
}
/*
 * 隐藏所属组织树
 */
function hideMenu(dom) {
	$("#" + dom + "Content").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
/*
 * 组织树点击事件
 */
function onBodyDown(dom) {
	$("body").on("mousedown", function(event) {
		if(!(event.target.id == dom || event.target.id == dom + "Content" || $(event.target).parents("#" + dom + "Content").length > 0)) {
			hideMenu(dom);
		}
	});
}
/*
 * ztree单选配置
 */
var setting = {
	view: {
		dblClickExpand: false
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		beforeClick: beforeClick,
		onClick: onClick
	}
};
/*
 * ztree多选（搭配异步加载）
 */
var selectSetting = {
	async : {
		enable : true,
		url : "../../static/data/treeDataDemo.json",
		autoParam: ["id=zId"],
		otherParam : {
			"staffOrgId" : 123,
			"staffId" : 123
		},
		type : "get",
		dataType : 'json',
		dataFilter : filter
	},
	check: {
		enable: true
	},
	data: {
		simpleData: {
			enable: true
		}
	},
	callback: {
		onCheck: onCheck,
		onAsyncError: onAsyncError,
		onAsyncSuccess: onAsyncSuccess
	}
}
/*
 * 如果结果一次性返回加过滤条件
 */
function filter(treeId, parentNode, responseData) {
	var responseData = responseData.data;
	if(responseData.length > 0) {
		var id;
		for(var i = 0; i < responseData.length; i++) {
			id = responseData[i].id;
			for(var j = 0; j < responseData.length; j++) {
				if(id == responseData[j].pId) {
					responseData[i].nocheck = true;
				}
			}
		}
	}
	return responseData;
}
/*
 * ztree异步加载成功事件
 */
function onAsyncSuccess(event, treeId, treeNode, msg){
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes = treeObj.getNodesByParam("id", "43", null);
	treeObj.checkNode(nodes[0], true, false);
}
/*
 * ztree异步加载失败事件
 */
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
	layer.msg("接口错误", {icon: 2});
}

/*
 * ztree点击事件之前
 */
function beforeClick(treeId, treeNode) {
	var check = (treeNode && !treeNode.isParent);
	return check;
}
/*
 * ztree点击事件
 */
function onClick(event, treeId, treeNode) {
	var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
	var selectName = nodes[0].name;
	var selectId = nodes[0].id;
	$("input[name=" + treeId + "]").data("name", selectName);
	$("input[name=" + treeId + "]").data("id", selectId);
	$("input[name=" + treeId + "]").val(selectName);
}
/*
 * ztree选中事件
 */
function onCheck(event, treeId, treeNode){
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes = treeObj.getCheckedNodes(true);
	var idAll = [],nameAll = [];
	for(var i = 0; i < nodes.length; i++){
		idAll.push(nodes[i].id);
		nameAll.push(nodes[i].name)
	}
	$("input[name=" + treeId + "]").data("name", nameAll.join(","));
	$("input[name=" + treeId + "]").data("id", idAll.join(","));
	$("input[name=" + treeId + "]").val(nameAll.join(","));
}
/*
 * 请求到结果后的回调事件
 */
function judge(result){
	stopLoading("#submitBtn");
	return resolveResult(result);
}
var searchContractTable = App.initDataTables('#searchContractTable', {
	"serverSide": true,
	ajax: {
        "type": "GET",
        "url": '/orgPartner',
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType":'json',
        "beforeSend": startLoading("#submitBtn"),
        "data":function(d){
        	d.partnerName = $("#partnerName").val();
        	d.isPartner = $("#isPartner").val();
        	return d;
        },
        "dataSrc": judge
	},
	"columns": [{
			"data": "partnerMdmCode",
			"title": "编码",
			"className": "text-center"
		},
		{
			"data": "partnerName",
			"className": "text-center",
			"title": "签约主体名称"
		},
		{
			"data": "isPartner",
			"className": "text-center",
			"title": "是否联通方",
			"render": function(data, type, full, meta) {
				if(data == 0) {
					return '是';
				} else {
					return '否';
				}
			}
		},
		{
			"data": "partnerCode",
			"className": "text-center",
			"title": "关联编码"
		},
		{
			"data": "orgId",
			"className": "text-center",
			"title": "所属组织"
		},
		{
			"data": "partnerId",
			"className": "text-center",
			"title": "编辑",
			"render": function(data, type, full, meta) {
				if(data) {
					return '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "editContract(\'' + data + '\')">编辑</button>';
				} else {
					return '';
				}
			}
		}
	]
});
/*
 * 搜索点击事件
 */
function searchContract() {
	startLoading("#submitBtn")
	var table = $('#searchContractTable').DataTable();
	table.ajax.reload();
}
/*
 * 表格内编辑按钮点击事件
 */
function editContract(data) {
	$('#contractEditModal').modal('show');
	var url = "/orgPartner/"+data;
	App.formAjaxJson(url, "get", "", successCallback);
	function successCallback(result) {
		console.log(result);
		$("#contractModalDefault").addClass("hide");
		$("#mainContent").removeClass("hide");
//		var result = result.data;
//		$.fn.zTree.init($("#organisationTree"), setting, result);
//		$.fn.zTree.init($("#legalTree"), setting, result);
//		$.fn.zTree.init($("#otherTree"), selectSetting);
	}
}
