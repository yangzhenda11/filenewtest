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
	var otherIds = $("#other").data("id");
	var treeObj = $.fn.zTree.getZTreeObj(treeId);
	if(otherIds){
		otherIdsArr = otherIds.split(",");
		for(var i = 0; i < otherIdsArr.length; i++){
			var nodes = treeObj.getNodesByParam("orgId", otherIdsArr[i], null);
			if(nodes.length > 0){
				treeObj.checkNode(nodes[0], true, false);
			}
		}
	}
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
	if(treeId == "organisationTree"){
		var selectName = nodes[0].orgName;
		var selectId = nodes[0].orgId;
	}else if(treeId == "legalTree"){
		var selectName = nodes[0].name;
		var selectId = nodes[0].id;
	};
	$("input[name=" + treeId + "]").data("id", selectId);
	$("input[name=" + treeId + "]").val(selectName);
	$("input[name=" + treeId + "]").attr("title",selectName);
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
			"data": "orgName",
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
		var data = result.data;
		$("#contractModalDefault").addClass("hide");
		$("#mainContent").removeClass("hide");
		$("#partnerNameM").text(data.partnerName);
		$("#partnerId").val(data.partnerId);
		if(data.isPartner == 0){
			$("#isPartnerM").val(0);
			$("#isunicom").removeClass("hide");
			$("#partnerCode").val(data.partnerCode)
			$("#ouOrgId").val(data.ouOrgId);
			$("#organisation").data("id",data.orgId);
			$("#legal").data("id",data.legalPersonName);
			$("#other").data("id",data.otherOrgId);
			getTreeValueInfor(data.orgId,data.legalPersonName,data.otherOrgId);
			getTreeInfo();
		}else{
			$("#isPartnerM").val(1);
			$("#isunicom").addClass("hide");
			$("#organisation,#legal,#other").data("id","");
			$("#organisation,#legal,#other").attr("title","");
			$("#organisation,#legal,#other,#ouOrgId").val("");
			$("#partnerCode").val(0);
		}
	}
}
function changeIsunicom(){
	var isPartnerValue = $("#isPartnerM").val();
	if(isPartnerValue == 0){
		$("#isunicom").removeClass("hide");
		getTreeInfo();
	}else{
		$("#isunicom").addClass("hide");
	}
}
/*
 * 获取三个树
 */
function getTreeInfo(){
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
			var otherIds = $("#other").data("id");
			var otherTreeObj = $.fn.zTree.getZTreeObj("otherTree");
			if(otherIds){
				otherIdsArr = otherIds.split(",");
				for(var i = 0; i < otherIdsArr.length; i++){
					var nodes = otherTreeObj.getNodesByParam("orgId", otherIdsArr[i], null);
					if(nodes.length > 0){
						otherTreeObj.checkNode(nodes[0], true, false);
					}
				}
			}
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
}
/*
 * 获取三个树的信息
 * 所属组织，法人代表，其他组织
 */
function getTreeValueInfor(orgId,legalPersonName,otherOrgId){
	var key = 0;
	App.formAjaxJson("/orgs/"+orgId, "get", "", orgIdSuccessCallback);
	function orgIdSuccessCallback(result){
		var name = result.data.orgName;
		$("#organisation").val(name);
		$("#organisation").attr("title",name);
		key++;
		loadOther();
	}
	App.formAjaxJson("/staffs/"+legalPersonName, "get", "", legalPersonSuccessCallback);
	function legalPersonSuccessCallback(result){
		var name = result.data.staffInfo.staffName;
		$("#legal").val(name);
		$("#legal").attr("title",name);
		key++;
		loadOther();
	};
	function loadOther(){
		if(key == 2){
			var name = "";
			var otherIdsArr = otherOrgId.split(",");
			var otherIdsArrLen = otherIdsArr.length;
			var k = 0;
			function othernSuccessCallback(result){
				name += result.data.orgName+",";
				k++;
				if(k == otherIdsArrLen){
					$("#other").val(name);
					$("#other").attr("title",name);
				}
			}
			if(otherIdsArrLen > 0){
				for(var i = 0; i < otherIdsArrLen; i++){
					App.formAjaxJson("/orgs/"+otherIdsArr[i], "get", "", othernSuccessCallback);
				}
			}
		}
	}
}
$('#contractEditModal').on('hide.bs.modal', function () {
	$("#contractModalDefault").removeClass("hide");
	$("#mainContent").addClass("hide");
});
/*
 * 修改提交
 */
function saveContract(){
	var formObj = App.form2json($("#contractEditForm"));
	var obj = new Object();
	obj.isPartner = formObj.isPartner;
	obj.partnerId = formObj.partnerId;
	obj.partnerName = $("#partnerNameM").text();
	if(formObj.isPartner == 0){
		if(formObj.organisationTree == ""){
			layer.msg("所属组织不能为空",{icon:2});
			return false;
		}else if(formObj.ouOrgId == ""){
			layer.msg("OU组织名称不能为空",{icon:2});
			return false;
		}else if(formObj.legalTree == ""){
			layer.msg("法人代表不能为空",{icon:2});
			return false;
		}else if(formObj.otherTree == ""){
			layer.msg("其他映射组织不能为空",{icon:2});
			return false;
		}else{
			obj.ouOrgId = formObj.ouOrgId;
			obj.partnerCode = formObj.partnerCode;
			obj.orgId = $("#organisation").data("id");
			obj.legalPersonName = $("#legal").data("id");
			obj.otherOrgId = $("#other").data("id");
		}
	}
	App.formAjaxJson("/orgPartner", "PUT", JSON.stringify(obj), successCallback);
	function successCallback(result){
		layer.msg("修改成功",{icon:1});
		searchContract();
		$('#contractEditModal').modal('hide');
	}
}
