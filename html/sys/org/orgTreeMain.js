/**
 * 组织管理
 */
//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
// 组织树对象 当前处理树的node
var orgTree = null;
var curNode = null;
$(function() {
    var windowHeigth = $(window).height();
    var documentHeight = $(".portlet").outerHeight();
    if (windowHeigth > documentHeight) {
        $("#orgTree").css("max-height", windowHeigth - 110);
    } else {
        $("#orgTree").css("max-height", documentHeight - 110);
    }
    // 初始化树
    App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", "", successCallback);
    function successCallback(result) {
        var zNodes = result.data[0];
        orgTree = $.fn.zTree.init($("#orgTree"), orgSetting, zNodes);
        curNode = orgTree.getNodes()[0];
        orgTree.selectNode(curNode);
        orgTree.expandNode(curNode, true, false, true);
        showOrg(curNode.orgId);
    }
});
// 展示右侧组织信息
function showOrg(orgId) {
    App.formAjaxJson(serverPath + "orgs/" + orgId, "GET", null, ajaxSuccess);
    /**成功回调函数 */
    function ajaxSuccess(result) {
        /**根据返回结果给表单赋值 */
        App.setFindValue($("#orgShow"), result.data, { 'orgStatus': function(value) { return value == '1' ? "有效" : "无效" }, "orgType": orgTypeCallback });
        /**表单赋值时的回调函数 */
        function orgTypeCallback(data) {
            var value = "";
            if (data == 1) {
                value = "公司";
            } else if (data == 2) {
                value = "部门";
            } else if (data == 3) {
                value = "处室";
            } else if (data == 4) {
                value = "虚拟组织";
            }
            return value;
        }
    }
}

//删除节点
function delOrg() {
    if (!curNode) {
        layer.alert("请选择需删除的节点", { icon: 2, title: "删除节点" });
        return;
    }
    if (1 == curNode.permId) {
        layer.alert("根组织禁止删除", { icon: 2, title: "删除节点" });
        return;
    }
    layer.confirm('确定删除<span style="color:red;margin:0 5px;">' + curNode.orgName + '</span>及其子节点?', {
        icon: 3,
        title: '删除节点'
    }, function(index) {
        var orgId = curNode.orgId;
        var data = { 'orgIds': orgId };
        App.formAjaxJson(serverPath  + "orgs/" + orgId, "DELETE", data, successCallback);

        function successCallback(result) {
            layer.close(index);
            layer.msg("删除成功");
            var checkNodes = orgTree.getNodesByParam("orgId", curNode.parentId)[0];
            orgTree.selectNode(checkNodes);
            showOrg(checkNodes.orgId);
            orgTree.removeNode(curNode);
            curNode = checkNodes;
        }
    })
}
// 添加组织页面
function addOrg() {
    if (!curNode) {
        layer.alert("请选择父节点", { icon: 2, title: "添加节点" });
        return;
    } else {
        $("#modal").load("orgInfoModal.html?" + App.timestamp() + " #modalEdit", function() {
            $("#modalTitle").text("新增组织");
            App.initFormSelect2("#orgForm")
            $("#parentId").val(curNode.orgId);
            $("#parentName").val(curNode.orgName);
            $('#modal').modal('show');
            //加载验证
            validate("add");
        });
    }
}
//修改组织页面
function showUpdate() {
    if (!curNode) {
        layer.alert("请选择父节点", { icon: 2, title: "修改节点" });
        return;
    } else if (config.curOrgId == curNode.orgId) {
        layer.alert("父节点不能修改", { icon: 2, title: "修改节点" });
        return;
    }
    $("#modal").load("orgInfoModal.html?" + App.timestamp() + " #modalEdit", function() {
        $("#modalTitle").text("修改组织");
        App.initFormSelect2("#orgForm")
        $('#modal').modal('show');
        var data = { 'orgId': curNode.orgId };
        App.formAjaxJson(serverPath + "orgs/" + curNode.orgId, "get", data, successCallback)

        function successCallback(result) {
            /**根据返回结果给表单赋值 */
            App.setFormValues($("#orgForm"), result.data);
            var parentNode = orgTree.getNodesByParam("orgId", result.data.parentId)[0];
            $("#parentName").val(parentNode.orgName);
            validate("edit");
        }
    });
}
//权限提交
function updateOrg(type) {
    var formObj = App.getFormValues($("#orgForm"));
    var ms = "新增成功";
    var url = serverPath + 'orgs/addOrg';
    var pushType = "POST";
    if (type == "add") {
    	formObj.createBy = config.curStaffId;
    	formObj.updateBy = config.curStaffId;
        delete formObj.orgId;
    } else {
        ms = "修改成功";
        formObj.updateBy = config.curStaffId;
        url = serverPath + "orgs/updateOrg";
            pushType = "PUT";
    }
    App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback, improperCallbacks);

    function successCallback(result) {
        layer.msg(ms);
        $('#modal').modal('hide');
        showOrg(curNode.orgId);
        if (type == "add") {
            var updateNodes = {
                orgName: result.data.orgName,
                orgId: result.data.orgId
            };
            orgTree.addNodes(curNode, updateNodes);
        } else {
            curNode.orgName = result.data.orgName,
            orgTree.updateNode(curNode);
        }
    }

    function improperCallbacks(result) {
        $('#orgForm').data('bootstrapValidator').resetForm();
    }
}
/*
 * 表单验证
 */
function validate(editType) {
    $('#orgForm').bootstrapValidator({
        live: 'enabled',
        trigger: 'live focus blur keyup change',
        message: '校验未通过',
        container: 'popover',
        fields: {
            orgName: {
                validators: {
                    notEmpty: {
                        message: '请输入组织名称'
                    }
                }
            },
            fullName: {
                validators: {
                    notEmpty: {
                        message: '请输入组织全称'
                    }
                }
            },
            orgCode: {
                validators: {
                    notEmpty: {
                        message: '请输入组织编码'
                    },
                    callback: { 
                        message: '此组织编码已存在',  
                        callback: function(value, validator, $field) {  
                            	var flag=true;
                            	if(value!=""){
                            		App.formAjaxJson(serverPath + "orgs/checkOrgCode/"+ value, "get", "", successCallback,null,null,null,false);
                            	}
                            	function successCallback(result) {
                            		var orgId = curNode.orgId;
                            		if(!result.data||result.data.orgId==orgId){
                            			flag=true;
                            		}else{
                            			flag=false;
                            		}
                            	};
                                return flag;
                        }  
                    }  
                }
            },
            orgType: {
                validators: {
                    notEmpty: {
                        message: '请选择组织类型'
                    }
                }
            },
            orgStatus: {
                validators: {
                    notEmpty: {
                        message: '请选择状态'
                    }
                }
            },
            provinceCode: {
                validators: {
                    notEmpty: {
                        message: '请输入省分编码'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        e.preventDefault();
        updateOrg(editType);
    });
}



// 刷新站点树
function refreshTree() {
    App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", "", successCallback);
    function successCallback(result) {
        orgTree.destroy('orgTree');
        zNodes = result.data[0];
        orgTree = $.fn.zTree.init($("#orgTree"), orgSetting, zNodes);
        curNode = orgTree.getNodes()[0];
        orgTree.selectNode(curNode);
        orgTree.expandNode(curNode, true, false, true);
        showOrg(curNode.orgId);
    };
}
// 展开所有
function expandAll() {
    var nodes = orgTree.getNodes();
    expandNodes(nodes);
}
//展开所有节点及其子节点
function expandNodes(nodes) {
    if (!nodes)
        return;
    for (var i = 0, l = nodes.length; i < l; i++) {
        orgTree.expandNode(nodes[i], true, false, false);
        if (nodes[i].isParent) {
            expandNodes(nodes[i].children);
        }
    }
}
// 关闭所有
function collapseAll() {
    orgTree.expandAll(false);
}
// 组织树基础设置
var orgSetting = {
	    async: {
	        enable: true,
	        url: "",
	        type: "get",
	        dataType: 'json',
	        dataFilter: orgsfilter
	    },
	    data: {
	        simpleData: {
	            enable: true,
	            idKey: "orgId",
	            pIdKey: "parentId"
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
	        beforeAsync: zTreeBeforeAsync,
	        onClick: function(event, treeId, treeNode) {
	            curNode = treeNode;
	            showOrg(treeNode.orgId);
	        }
	    }
	};
// 过滤异步加载ztree时返回的数据
function orgsfilter(treeId, parentNode, responseData) {
    var responseData = responseData.data;
    if (responseData) {
        return responseData;
    } else {
        return null;
    }
}
/*
 * ztree异步加载之前
 */
function zTreeBeforeAsync(treeId, treeNode) {
    orgTree.setting.async.url = config.serverPath + "orgs/" + treeNode.orgId + "/children";
    return true;
}