var organisationTree = null;
var otherTree = null;
var legalTree = null;
var curOrgStaffNode = null;
var config = parent.globalConfig;
var serverPath = config.serverPath;
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
		onAsyncError: onAsyncError,
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
 */
var legalSetting = {
	async : {
		enable : true,
		url : serverPath + "roles/" + config.curOrgStaffRole + "/orgStaffsTreeChildren",
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
		onAsyncError: onAsyncError,
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
		organisationTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
	}else if(treeId == "otherTree"){
		otherTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
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
        "url": serverPath + 'orgPartner',
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
			"data": "partnerId",
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					return '<button class="btn primary btn-outline btn-xs" onclick = "editContract(\'' + data + '\')">编辑</button>';
				} else {
					return '';
				}
			}
		},
		{
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
		}
	]
});
/*
 * 搜索点击事件
 */
function searchContract() {
	startLoading("#submitBtn");
	var table = $('#searchContractTable').DataTable();
	table.ajax.reload();
}
/*
 * 表格内编辑按钮点击获取结果事件
 */
function editContract(data) {
	$('#contractEditModal').modal('show');
	var url = serverPath + "orgPartner/" + data;
	App.formAjaxJson(url, "get", "", successCallback);
	function successCallback(result) {
		var data = result.data;
		$("#contractModalDefault").addClass("hide");
		$("#mainContent").removeClass("hide");
		$("#partnerId").val(data.partnerId);
		$("#partnerNameM").text(data.partnerName);
		$("#partnerCode").val(data.partnerCode)
		$("#isPartnerM").val(data.isPartner);
		if(data.isPartner == 0){
			$("#isunicom").removeClass("hide");
			$("#ouOrgId").val(data.ouOrgId);
			$("#organisation").data("id",data.orgId);
			$("#legal").data("id",data.legalPersonName);
			$("#other").data("id",data.otherOrgId);
			$("#organisation").val(data.orgName);
			$("#organisation").attr("title",data.orgName);
			$("#legal").val(data.staffName);
			$("#legal").attr("title",data.staffName);
			$("#other").val(data.otherOrgName);
			$("#other").attr("title",data.otherOrgName);
			getTreeInfo();
		}else{
			$("#isunicom").addClass("hide");
			$("#organisation,#legal,#other").data("id","");
			$("#organisation,#legal,#other").attr("title","");
			$("#organisation,#legal,#other,#ouOrgId").val("");
		}
	}
}
/*
 * 是否联通方切换
 */
function changeIsunicom(){
	var isPartnerValue = $("#isPartnerM").val();
	if(isPartnerValue == 0){
		$("#isunicom").removeClass("hide");
		getTreeInfo();
	}else{
		$("#isunicom").addClass("hide");
		$("#organisation,#legal,#other").data("id","");
		$("#organisation,#legal,#other").attr("title","");
		$("#organisation,#legal,#other,#ouOrgId").val("");
	}
}
/*
 * 获取树信息
 */
function getTreeInfo(){
	/*
	 * 所属组织树配置
	 *  orgs/{orgId}/orgTree
	 */
	App.formAjaxJson(serverPath + "orgs/"+ config.orgId +"/orgTree", "get", "", successCallback);
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
	$.get(serverPath + "roles/orgStaffsTreeRoot", {"curOrgId":config.orgId} ,function(result) {
		if(null == result){
			layer.msg("没有相关组织和人员信息",{icon: 2});
		}else{
			legalTree = $.fn.zTree.init($("#legalTree"), legalSetting, result);
			curOrgStaffNode = legalTree.getNodes()[0];
		}
	});
}
/*
 * 获取三个树的信息
 * 所属组织，法人代表，其他组织
 */
function getTreeValueInfor(data){
	/*
	var key = 0;
	App.formAjaxJson(serverPath + "orgs/"+orgId, "get", "", orgIdSuccessCallback);
	function orgIdSuccessCallback(result){
		var name = result.data.orgName;
		$("#organisation").val(name);
		$("#organisation").attr("title",name);
		key++;
		loadOther();
	}
	App.formAjaxJson(serverPath + "staffs/"+legalPersonName, "get", "", legalPersonSuccessCallback);
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
				name += result.data.orgName+"，";
				k++;
				if(k == otherIdsArrLen){
					name = name.slice(0,name.length-1);
					$("#other").val(name);
					$("#other").attr("title",name);
				}
			}
			if(otherIdsArrLen > 0){
				for(var i = 0; i < otherIdsArrLen; i++){
					App.formAjaxJson(serverPath + "orgs/"+otherIdsArr[i], "get", "", othernSuccessCallback);
				}
			}
		}
	}*/
}
$('#contractEditModal').on('hide.bs.modal', function () {
	$("#contractModalDefault").removeClass("hide");
	$("#mainContent").addClass("hide");
});
/*
 * 修改提交
 */
function saveContract(){
	var formObj = App.getFormValues($("#contractEditForm"));
	formObj.partnerName = $("#partnerNameM").text();
	App.changeObjKey({"legalTree":"legalPersonName","organisationTree":"orgId","otherTree":"otherOrgId"},formObj)
	formObj.orgId = $("#organisation").data("id");
	formObj.legalPersonName = $("#legal").data("id");
	formObj.otherOrgId = $("#other").data("id");
	console.log(formObj);
	if(formObj.isPartner == 0){
		if(formObj.orgId == ""){
			layer.msg("所属组织不能为空",{icon:2});
			return false;
		}else if(formObj.ouOrgId == ""){
			layer.msg("OU组织名称不能为空",{icon:2});
			return false;
		}else if(formObj.legalPersonName == ""){
			layer.msg("法人代表不能为空",{icon:2});
			return false;
		}else if(formObj.otherOrgId == ""){
			layer.msg("其他映射组织不能为空",{icon:2});
			return false;
		}
	};
	App.formAjaxJson(serverPath + "orgPartner", "PUT", JSON.stringify(formObj), successCallback);
	function successCallback(result){
		layer.msg("修改成功",{icon:1});
		searchContract();
		$('#contractEditModal').modal('hide');
	}
}
