var organisationTree = null;
//当前登录角色ID
var curOrgId = 56665;
$(function(){
	getTreeInfo();
	$("#modalContent").load("./html/externalPersonnelModal.html?" + App.timestamp());
	$('#modalContent').on('hidden.bs.modal', function() {
		$("#detailsModal").load("./html/externalPersonnelModal.html?" + App.timestamp());
	});
})
/*
 * 显示所属组织树
 */
function showTree(dom) {
	var selectObj = $("#" + dom + "");
	var selectOffset = selectObj.offset();
	$("#" + dom + "Content").css({
		left: "0",
		top: selectObj.outerHeight() + "px",
		width: selectObj.outerWidth() + 120
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
		onAsyncError: onAsyncError,
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

function zTreeBeforeAsync(treeId, treeNode) {
	if(treeId == "organisationTree"){
		organisationTree.setting.async.url = "/orgs/" + treeNode.orgId + "/children";
	}
	return true;
}

/*
 * ztree异步加载失败事件
 */
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown){
	layer.msg("接口错误", {icon: 2});
}

/*
 * ztree点击事件
 */
function onClick(event, treeId, treeNode) {
	var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
	if(treeId == "organisationTree"){
		var selectName = nodes[0].orgName;
		var selectId = nodes[0].orgId;
	}
	$("input[name=" + treeId + "]").data("id", selectId);
	$("input[name=" + treeId + "]").val(selectName);
	$("input[name=" + treeId + "]").attr("title",selectName);
}
/*
 * 获取组织
 * 所属组织树配置
 *  orgs/{orgId}/orgTree
 */
function getTreeInfo(){
	App.formAjaxJson("/orgs/"+curOrgId+"/orgTree", "get", "", successCallback);
	function successCallback(result){
		var data = result.data;
		var allObj = {
			isParent:"false",
			orgId:"",
			orgName:"全部"
		}
		if(null == data){
			layer.msg("没有相关组织和人员信息",{icon: 2});
		}else{
			data.unshift(allObj);
			organisationTree = $.fn.zTree.init($("#organisationTree"), orgsSetting, data);
		}
	}
}
/*
 * 请求到结果后的回调事件
 */
function judge(result){
	stopLoading("#submitBtn");
	return resolveResult(result);
}
var personnelTable = App.initDataTables('#personnelTable', {
	"serverSide": true,
	fixedColumns:{
        leftColumns: 2
    },
    buttons: ['copy', 'colvis'],
	ajax: {
        "type": "GET",
        "url": '/staffs/',
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType":'json',
        "beforeSend": startLoading("#submitBtn"),
        "data":function(d){
        	d.sysOrgId = curOrgId;
        	d.staffName = $("input[name='staffName']").val();
        	d.loginName = $("input[name='loginName']").val();
        	d.staffStatus =  $("select[name='staffStatus']").val();
        	d.orgId = $("#organisation").data("id");
        	return d;
        },
         error: function (xhr, error, thrown) {  
            stopLoading("#submitBtn");
            layer.msg("接口错误", {icon: 2});
        },
        "dataSrc": judge
	},
	"columns": [{
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var html = "";
					var para = data.STAFF_ID + '&&' + data.STAFF_NAME + '&&' + data.LOGIN_NAME + '&&' + data.STAFF_STATUS;
					html += '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "personnelModal(\'' + data.STAFF_ID + "edit" +'\')">修改</button>'+
					'<button class="btn primary btn-outline btn-xs dt-edit" onclick = "resetPasswd(\'' + para +'\')">密码重置</button>';
					if(data.STAFF_STATUS == '1'){
						html += '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "changeStaffStatus(\'' + para +'\')">禁用</button>';
					}else{
						html += '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "changeStaffStatus(\'' + para +'\')">启用</button>';
					}
					return html;
				} else {
					return '';
				}
			}
		},
		{
			"data": "STAFF_NAME",
			"className": "text-center",
			"title": "人员姓名",
			render:function(a,b,c,d){
	        	return "<a href=\"javascript:void(0)\" onclick=''>"+a+"</a>";
			}
		},
		{
			"data": "LOGIN_NAME",
			"className": "text-center",
			"title": "账号"
		},
		{
			"data": "ORG_NAME",
			"className": "text-center",
			"title": "岗位"
		},
		{
			"data": "SEX",
			"className": "text-center",
			"title": "性别",
			render: function (data, type, full, meta) {
	            return data=='M'?'男':'女';
	        }
		},
		{
			"data": "EMAIL",
			"className": "text-center",
			"title": "邮箱"
		},
		{
			"data": "MOBIL_PHONE",
			"className": "text-center",
			"title": "手机"
		},
		{
			"data": "STAFF_STATUS",
			"className": "text-center",
			"title": "岗位状态",
			render: function (data, type, full, meta) {
	            return data=='1'?'有效':'无效';
	        }
		},
	]
});
/*
 * 搜索点击事件
 */
function searchPersonnel(resetPaging) {
	startLoading("#submitBtn")
	var table = $('#personnelTable').DataTable();
	if(resetPaging){
		table.ajax.reload(null, false);
	}else{
		table.ajax.reload();
	}
}

/*
 * 密码重置
 * para = data.STAFF_ID + '&&' + data.STAFF_NAME + '&&' + data.LOGIN_NAME + data.STAFF_STATUS;
 */
function resetPasswd(para){
	para = para.split("&&");
	layer.confirm('确定重置<span style="color:red;margin:0 5px;">'+ para[1] +'</span>的密码?', {icon: 3, title:'密码重置'}, function(index){
		App.formAjaxJson('/staffs/'+ para[0] +"/passwd/"+ para[2] , "PUT", "", successCallback);
		function successCallback(result){
			layer.close(index);
			layer.alert("用户<span style='color:red;margin:0 5px;'>"+ para[1] +"</span>的密码重置成功，</br>新密码为<span style='color:red;margin:0 5px;'>" + result.data +"</span>。",{icon: 1});
		}
	});
}
/*
 * 用户启用禁用
 * status 1已经启用    0禁用
 * para = data.STAFF_ID + '&&' + data.STAFF_NAME + '&&' + data.LOGIN_NAME + data.STAFF_STATUS;
 */
function changeStaffStatus(para){
	para = para.split("&&");
	if(para[3] == "1"){
		layer.confirm('确定禁用<span style="color:red;margin:0 5px;">'+ para[1] +'</span>的账号?', {icon: 3, title:'账号禁用'}, function(index){
			doChangeStaffStatus(para[0],0,index);
		});
	}else{
		layer.confirm('确定启用<span style="color:red;margin:0 5px;">'+ para[1] +'</span>的账号?', {icon: 3, title:'账号启用'}, function(index){
			doChangeStaffStatus(para[0],1,index);
		});
	}
}

function doChangeStaffStatus(staffId,staffStatus,index){
	App.formAjaxJson("/staffs/"+staffId+"/status/"+staffStatus , "PUT", "", successCallback);
		function successCallback(result){
			layer.close(index);
			var ms = staffStatus == "1" ? "启用成功" : "禁用成功";
			layer.msg(ms,{icon: 1});
			searchPersonnel(true);
		}
}
/*
 * 判断modal类型
 */
function personnelModal(code){
	
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
