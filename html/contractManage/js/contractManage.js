var organisationTree = null;
var otherTree = null;
var legalTree = null;
//角色全局变量
var curOrgStaffRole = 1;
var curOrgStaffNode = null;
/*
 * 显示所属组织树
 */
function showTree(dom) {
	var selectObj = $("#" + dom + "");
	var selectOffset = selectObj.offset();
	$("#" + dom + "Content").css({
		left: "10px",
		top: selectObj.outerHeight() + "px",
		width: selectObj.outerWidth() + 80
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
 * 所属组织树配置单选
 * "/orgs/" + treeNode.orgId + "/children"
 */
var orgsSetting = {
	async : {
		enable : true,
		url : "",
		type : "get",
		dataType : 'json',
		dataFilter : orgsfilter
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parent_id"
		},		
		key: {
			name: "orgName"
		}
	},
	view: {
		dblClickExpand: false
	},
	callback: {
		beforeClick: beforeClick,
		onClick: onClick,
		beforeAsync:zTreeBeforeAsync
	}
};
function orgsfilter(treeId, parentNode, responseData) {
	var responseData = responseData.data;
	if(responseData){
		return responseData;
	}else{
		return null;
	}
}

/*
 * 所属人员树配置单选
 * curOrgStaffRole = 1
 * "/roles/" + curOrgStaffRole + "/orgStaffsTreeChildren"
 */
var legalSetting = {
	async : {
		enable : true,
		url : "/roles/" + curOrgStaffRole + "/orgStaffsTreeChildren",
		type : "get",
		dataType : 'json',
		dataFilter : orgsFilter,
		otherParam : {
			"orgId" : function() {
				return curOrgStaffNode.id
			}
		},
	},
	data: {
		simpleData: {
			enable: true,
		}
	},
	view: {
		dblClickExpand: false
	},
	callback: {
		beforeClick: beforeClick,
		onClick: onClick,
		beforeAsync:zTreeBeforeAsync
	}
};
function orgsFilter(treeId, parentNode, responseData) {
	var responseData = responseData.children;
	if(responseData){
		return responseData;
	}else{
		return null;
	}
}
/*
 * 所属组织树多选配置
 * orgs/{orgId}/orgTree
 */
var otherSetting = {
	async : {
		enable : true,
		url : "",
		type : "get",
		dataType : 'json',
		dataFilter : otherFilter
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "orgId",
			pIdKey: "parent_id"
		},		
		key: {
			name: "orgName"
		}
	},
	check: {
		enable: true
	},
	callback: {
		onCheck: onCheck,
		onAsyncError: onAsyncError,
		onAsyncSuccess: onAsyncSuccess,
		beforeAsync:zTreeBeforeAsync
	}
}
function otherFilter(treeId, parentNode, responseData) {
	var responseData = responseData.data;
	if(responseData.length > 0) {
		for(var i = 0; i < responseData.length; i++) {
			if("true" == responseData[i].isParent) {
				responseData[i].nocheck = true;
			}
		}
	}
	return responseData;
}
function zTreeBeforeAsync(treeId, treeNode) {
	if(treeId == "organisationTree"){
		organisationTree.setting.async.url = "/orgs/" + treeNode.orgId + "/children";
	}else if(treeId == "otherTree"){
		otherTree.setting.async.url = "/orgs/" + treeNode.orgId + "/children";
	}else if(treeId == "legalTree"){
		curOrgStaffNode = treeNode;
	}
	return true;
}
/*
 * ztree异步加载成功事件
 */
function onAsyncSuccess(event, treeId, treeNode, msg){
	console.log(treeNode);
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	var nodes = treeObj.getNodesByParam("orgId", "43", null);
	if(false){
		treeObj.checkNode(nodes[0], true, false);
	}
	console.log(nodes);
	
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
	var selectName = nodes[0].orgName;
	var selectId = nodes[0].orgId;
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
		idAll.push(nodes[i].orgId);
		nameAll.push(nodes[i].orgName)
	}
	$("input[name=" + treeId + "]").data("name", nameAll.join(","));
	$("input[name=" + treeId + "]").data("id", idAll.join(","));
	$("input[name=" + treeId + "]").attr("title",nameAll.join(","));
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
         error: function (xhr, error, thrown) {  
            stopLoading("#submitBtn");
            layer.msg("接口错误", {icon: 2});
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
		var data = result.data;
		$("#contractModalDefault").addClass("hide");
		$("#mainContent").removeClass("hide");
		$("#partnerNameM").text(data.partnerName);
		if(result.isPartner == 0){
			$("#isPartnerM").val(0);
			$("#isunicom").removeClass("hide");
			organisationTree = $.fn.zTree.init($("#organisationTree"), orgsSetting);
			
			
		}else{
			$("#isPartnerM").val(1);
		}

//		
	}
}
function changeIsunicom(){
	var isPartnerValue = $("#isPartnerM").val();
	if(isPartnerValue == 0){
		$("#isunicom").removeClass("hide");
		/*
		 * 所属组织树配置
		 *  orgs/{orgId}/orgTree
		 */
		App.formAjaxJson("/orgs/56665/orgTree", "get", "", successCallback);
		function successCallback(result){
			var data = result.data;
			if(null == data){
				layer.msg("没有相关组织和人员信息",{icon: 2});
			}else{
				var otherTreeResult = otherFilter("","",result);
				organisationTree = $.fn.zTree.init($("#organisationTree"), orgsSetting, data);
				otherTree = $.fn.zTree.init($("#otherTree"), otherSetting, otherTreeResult);
			}
		}
		/*
		 * 所属人员树配置
		 *  roles/orgStaffsTreeRoot
		 * get  data:{"curOrgId":curOrgId}
		 */
		$.get("/roles/orgStaffsTreeRoot", {"curOrgId":56665} ,function(result) {
			if(null == result){
				layer.msg("没有相关组织和人员信息",{icon: 2});
			}else{
				legalTree = $.fn.zTree.init($("#legalTree"), legalSetting, result);
				curOrgStaffNode = legalTree.getNodes()[0];
//				legalTree.selectNode(curOrgStaffNode);
//				legalTree.expandNode(curOrgStaffNode, true, false, true);
			}
		});
	}else{
		$("#isunicom").addClass("hide");
	}
}
$('#contractEditModal').on('hide.bs.modal', function () {
	$("#contractModalDefault").removeClass("hide");
	$("#mainContent").addClass("hide");
	$("#isunicom").addClass("hide");
	$("#isPartnerM").val(1);
	$("#partnerNameM").text("");
});