/**
 * 权限管理
 */
//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
// 组织树对象 当前处理树的node
var perPermissionTree = null;
var curNode = null;
$(function() {
    // 初始化树
    App.formAjaxJson(serverPath + "pers/root","get", null, successCallback)
	function successCallback(result){
		var zNodes = result.sysPerm;
        perPermissionTree = $.fn.zTree.init($("#permTree"), permSetting, zNodes);
        curNode = perPermissionTree.getNodes()[0];
        perPermissionTree.selectNode(curNode);
        perPermissionTree.expandNode(curNode, true, false, true);
        showPermission(curNode.permId);
	}
});
// 点击展示权限信息
function showPermission(permId) {
	App.formAjaxJson(serverPath + "pers/" + permId,"get", null, successCallback)
	function successCallback(result){
		/**表单赋值时的回调函数 */
		var valueCallback = {'permType':function(value){
			var permType = "";
			if(value == 1){
				permType = "菜单";
			}else if (value == 2) {
				permType = "标签";
			}else if (value == 3) {
				permType = "请求";
			}else if (value == 4) {
				permType = "新窗口";
			};
			return permType;
		}}
        /**根据返回结果给表单赋值 */
        App.setFindValue($("#permissionShow"), result.sysPerm, valueCallback);
	}
}
//删除节点
function delPermission() {
    if (!curNode) {
    	layer.alert("请选择需删除的节点", {icon: 2,title:"删除节点"});
        return;
    }
    if (1 == curNode.permId) {
    	layer.alert("根权限禁止删除", {icon: 2,title:"删除节点"});
        return;
    }
    layer.confirm('确定删除<span style="color:red;margin:0 5px;">' + curNode.permName + '</span>及其子节点?', {
		icon: 3,
		title: '删除节点'
	}, function(index) {
		var permId = curNode.permId;
		var data = {'permIds': permId};
		App.formAjaxJson(serverPath + "pers/" + permId, "DELETE", data, successCallback);
		function successCallback(result) {
			layer.close(index);					
			layer.msg("删除成功", {icon: 1});
			var checkNodes = perPermissionTree.getNodesByParam("permId", curNode.parentId)[0];
			perPermissionTree.selectNode(checkNodes);
			showPermission(checkNodes.permId);
			perPermissionTree.removeNode(curNode);
			curNode = checkNodes;
		}
	})
}

// 添加权限页面
function addPermission() {
    if (!curNode) {
    	layer.alert("请选择父节点", {icon: 2,title:"添加节点"});
        return;
    }else{
    	$("#modal").load("_permissionModal.html?" + App.timestamp()+" #modalEdit",function(){
			$("#modalTitle").text("新增权限");
			$("#parentId").val(curNode.permId);
			$("#parentName").val(curNode.permName);
			$('#modal').modal('show');
			//加载验证
			validate("add");
		});
    }
}
//修改权限页面
function showUpdate() {
    if (!curNode) {
        layer.alert("请选择父节点", {icon: 2,title:"修改节点"});
        return;
    }else if(1 == curNode.permId){
    	layer.alert("父节点不能修改", {icon: 2,title:"修改节点"});
        return;
    }
	$("#modal").load("_permissionModal.html?" + App.timestamp()+" #modalEdit",function(){
		$("#modalTitle").text("修改权限");
		$('#modal').modal('show');
		var data = {'permId': curNode.permId};
		App.formAjaxJson(serverPath + "pers/" + curNode.permId,"get", data, successCallback)
		function successCallback(result){
	        /**根据返回结果给表单赋值 */
	        App.setFormValues($("#permissionForm"), result.sysPerm);
	        var parentNode = perPermissionTree.getNodesByParam("permId", result.sysPerm.parentId)[0];
	       	$("#parentName").val(parentNode.permName);
	       	validate("edit");
		}
	});
}
//权限提交
function updatePermisson(type){
	var formObj = App.getFormValues($("#permissionForm"));
	var ms = "新增成功";
	var url = serverPath + 'pers/';
	var pushType = "POST";
	formObj.staffOrgId = config.curStaffOrgId;
	if(type == "add"){
		delete formObj.permId;
	}else{
		ms = "修改成功";
		url = serverPath + "pers/" + curNode.permId,
		pushType = "PUT";
	}
	App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback,improperCallbacks);
	function successCallback(result) {
		layer.msg(ms, {icon: 1});
		$('#modal').modal('hide');
		showPermission(curNode.permId);
		if(type == "add"){
			var updateNodes = {
				permName : result.sysPerm.permName,
				permId : result.sysPerm.permId
			};
			perPermissionTree.addNodes(curNode, updateNodes);
		}else{
			curNode.permName = result.sysPerm.permName
			perPermissionTree.updateNode(curNode);
		}
	}
	function improperCallbacks(result){
		$('#permissionForm').data('bootstrapValidator').resetForm();
	}
}
/*
 * 表单验证
 */
function validate(editType) {
	$('#permissionForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup',
		message: '校验未通过',
		container: 'popover',
		fields: {
			permCode : {
				validators : {
					notEmpty : {
						message : '请输入权限编码名称'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					}
				}
			},
			permName : {
				validators : {
					notEmpty : {
						message : '请输入权限名称'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					}
				}
			},
			permType : {
				validators : {
					notEmpty : {
						message : '请选择权限类型'
					}
				}
			},
			permSort : {
				validators : {
					numeric : {
						message : "只能输入纯数字"
					},
					stringLength : {
						min : 0,
						max : 6,
						message : '请输入不超过6个字符'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		updatePermisson(editType);
	});
}
// 刷新站点树
function refreshTree() {
    $.get(parent.globalConfig.serverPath + "pers/root", function(data) {
        perPermissionTree.destroy('permTree');
        zNodes = data.sysPerm;
        perPermissionTree = $.fn.zTree
            .init($("#permTree"), permSetting, zNodes);
        curNode = perPermissionTree.getNodes()[0];
        perPermissionTree.selectNode(curNode);
        perPermissionTree.expandNode(curNode, true, false, true);
        showPermission(curNode.permId);
    });
}
// 展开所有
function expandAll() {
    var nodes = perPermissionTree.getNodes();
    expandNodes(nodes);
}

//展开所有节点及其子节点
function expandNodes(nodes) {
    if (!nodes)
        return;
    for (var i = 0, l = nodes.length; i < l; i++) {
        perPermissionTree.expandNode(nodes[i], true, false, false); //展开节点就会调用后台查询子节点  
        if (nodes[i].isParent) {
            expandNodes(nodes[i].children); //递归  
        }
    }
}
// 关闭所有
function collapseAll() {
    perPermissionTree.expandAll(false);
}
// 权限树基础设置
var permSetting = {
    data: {
        key: {
            name: "permName"
        },
        simpleData: {
            enable: true,
            idKey: "permId",
            pIdKey: "parentId",
            rootPId: 0
        }
    },
    async: {
        enable: true,
        url: "",
        otherParam: {
            "staffOrgId": config.curStaffOrgId,
            "staffId": config.curStaffId
        },
        type: "get", // 默认post
        dataType: 'json',
        dataFilter: filter
    },
    callback: {
        beforeAsync: function(treeId, treeNode) {
            perPermissionTree.setting.async.url = serverPath + "pers/" + treeNode.permId + "/children";
            return true;
        },
        onClick: function(event, treeId, treeNode) {
            curNode = treeNode;
            showPermission(treeNode.permId);
        }
    }
};
// 过滤异步加载ztree时返回的数据
function filter(treeId, parentNode, childNodes) {
    if (!childNodes)
        return null;
    childNodes = childNodes.perms;
    return childNodes;
}