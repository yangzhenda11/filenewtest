//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
var rolePermissionTree; //权限树
var orgNameTree; //组织树
$(function() {
        parent.data_permFilter(document);
        getRoleTable();
    })
    /*
     * 查询到角色列表
     */
var roleUpdate = parent.data_tpFilter("sys:role:update");
var roleDelete = parent.data_tpFilter("sys:role:delete");

function getRoleTable() {
    App.initDataTables('#searchRoleTable', "#submitBtn", {
        "ajax": {
            "type": "GET",
            "url": serverPath + 'roles/',
            "data": function(d) { // 查询参数
                d.roleName = $('#sysRoleName').val();
                d.orgName = $("#sysOrgName").val();
                d.staffOrgId = config.curStaffOrgId;
                d.companyId = config.curCompanyId;
                d.roleStatus = 1;
                return d;
            }
        },
        "columns": [{
                "data": "roleId",
                "title": "操作",
                "className": "text-center",
                "render": function(data, type, row, meta) {
                    if (data) {
                        var btnArray = new Array();
                        //                        btnArray.push({ "name": "查看", "fn": "findDetail(\'" + data + "\')" });
                        if (roleUpdate) {
                            btnArray.push({ "name": "编辑", "fn": "editDetail(\'" + data + "\')" });
                        }
                        if (roleDelete) {
                            btnArray.push({ "name": "删除", "fn": "deleteDetail(\'" + data + "\',\'" + row.roleName + "\')" });
                        }
                        if (roleUpdate) {
                            btnArray.push({ "name": "授权", "fn": "openAddRolePerm(\'" + row.roleName + "\',\'" + data + "\')" });
                        }
                        if ("1" == row.roleStatus) {
                            btnArray.push({ "name": "禁用", "fn": "changeRoleStatus(\'" + data + "\',\'" + row.roleName + "\',0)" });
                        } else {
                            btnArray.push({ "name": "启用", "fn": "changeRoleStatus(\'" + data + "\',\'" + row.roleName + "\',1)" });
                        }
                        return App.getDataTableBtn(btnArray);
                    } else {
                        return '';
                    }
                }
            },
            {
                "data": "roleName",
                title: "角色名称",
                render: function(data, type, row, meta) {
                    return '<a href=\"javascript:void(0)\" onclick = "findDetail(\'' + row.roleId + '\')">' + data + '</a>';
                }
            },
            // { "data": "orgName", title: "所属组织" },
            { "data": "roleDesc", title: "角色描述" },
            {
                "data": "roleStatus",
                title: "角色状态",
                render: function(a, b, c, d) {
                    return ('1' == c.roleStatus) ? '有效' : '无效';
                }
            },
            {
                "data": "roleCount",
                title: "授权人数",
                render: function(data, type, row, meta) {
                    return '<a href=\"javascript:void(0)\" onclick = "findStaff(\'' + row.roleId + '\')">' + data + '</a>';
                }
            },
            {
                "data": "createDate",
                title: "添加时间",
                render: function(data, type, row, meta) {
                    return App.formatDateTime(data, "yyyy-mm-dd");
                }
            }
        ]
    })
}
/**
 * 启用/禁用角色
 * daiyw 
 */
function changeRoleStatus(roleId, roleName, roleStatus) {
    if (1 === roleStatus) {
        layer.confirm("确定启用角色" + roleName + "吗？", {
            btn: ['启用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
            $.ajax({ //提交服务端
                "type": "PUT",
                "url": serverPath + 'roles/' + roleId + "/status/" + roleStatus,
                success: function(data) {
                    layer.msg("启用成功");
                    searchRole(true);
                }
            });
        });
    } else {
        layer.confirm("确定禁用角色" + roleName + "吗？", {
            btn: ['禁用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
            $.ajax({ //提交服务端
                "type": "PUT",
                "url": parent.globalConfig.serverPath + 'roles/' + roleId + "/status/" + roleStatus,
                success: function(data) {
                    layer.alert("禁用成功");
                    searchRole(true);
                }
            });
        });
    }
}
/**
 * 删除某个角色
 * @param {角色id} roleId 
 */
function deleteDetail(roleId,roleName) {
    layer.confirm('确定删除'+roleName+'角色吗？', {
        icon: 3,
        title: '删除角色'
    }, function(index) {
        App.formAjaxJson(serverPath + 'roles/' + roleId + '/role/' + config.curStaffId, "DELETE", "", successCallback);

        function successCallback(result) {
            layer.close(index);
            layer.msg("删除成功");
            searchRole(true);
        }
    })
}

function authRole(roleId) {

}
/**
 * 执行查询
 */
function searchRole(retainPaging) {
    var table = $('#searchRoleTable').DataTable();
    if (retainPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}

/**
 * 查看角色详情
 * @param {角色id} itemId 
 */
function findDetail(itemId) {
    $("#modal").load("_roleModal.html?" + App.timestamp() + " #modalDetail", function() {
        $("#modal").modal("show");
        var documentHeight = $(".page-content").height() - 190;
		$("#roleDeatilModal").css("height",documentHeight);
		$("#rolePermissionDetailTreeCon").css("max-height",documentHeight-130);
        getRoleInfo(itemId, "detail");
    });
}
/**
 * 查看角色授权人员列表
 * daiyw
 */
function findStaff(roleId) {
     $("#modal").load("roleStaffModal.html?" + App.timestamp() + " #modalDetail", function() {
    	$("#modal").modal("show");
    	$("#roleStaffTableContent").height($(".page-content").height() - 250);
    	$('#modal').off("shown.bs.modal").on('shown.bs.modal', function (e) {
			getRoleStaffTable(roleId);
		})
    });
}
/**
 * 授权人员列表
 * daiyw
 */
function getRoleStaffTable(roleId) {
    App.initDataTables('#searchRoleStaffTable', "#submitBtn", {
    	scrollY:$(".page-content").height() - 340,
        "ajax": {
            "type": "GET",
            "url": serverPath + 'roles/searchRoleStaff',
            "data": function(d) { // 查询参数
                d.staffName = $('#staffName').val();
                d.loginName = $("#loginName").val();
                d.companyId = config.curCompanyId;
                d.roleId = roleId;
                return d;
            }
        },
        "columns": [{
                "data": null,
                "title": "人员姓名",
                render: function(data, type, full, meta) {
                    return '<a href=\"javascript:void(0)\">' + data.STAFF_NAME + '</a>';
                }
            },
            { "data": "LOGIN_NAME", "title": "账号" },
            { "data": "ORG_NAME", "title": "部门名称" },
            {
                "data": "STAFF_ORG_TYPE",
                "title": "岗位状态",
                className: "text-center",
                render: function(a, b, c, d) {
                    return ('F' == c.STAFF_ORG_TYPE) ? '主岗' : ('T' == c.STAFF_ORG_TYPE ? '兼岗' : '借调');
                }
            },
            {
                "data": "SEX",
                "title": "性别",
                className: "text-center",
                render: function(a, b, c, d) {
                    return (c.SEX == 'M') ? '男' : '女';
                }
            },
            // { "data": "PHONE", "title": "电话号码" },
            { "data": "EMAIL", "title": "邮箱账号" },
            { "data": "MOBIL_PHONE", "title": "手机号码" },
            {
                "data": "STAFF_ORG_STATUS",
                "title": "岗位状态",
                className: "text-center",
                render: function(a, b, c, d) {
                    return ('1' == c.STAFF_ORG_STATUS) ? '有效' : '无效';
                }
            }
        ]
    })
}
/**
 * 根据条件查询授权人员
 * daiyw
 */
function searchRoleStaff() {
    var table = $('#searchRoleStaffTable').DataTable();
    table.ajax.reload();
}
/**
 * 重置授权人员查询条件
 * daiyw
 */
function reset() {
    $("#staffName").val("");
    $("#loginName").val("");
}
/**
 * 角色编辑
 * @param {角色id} itemId 
 */
function editDetail(itemId) {
    $("#modal").load("_roleModal.html?" + App.timestamp() + " #modalEdit", function() {
        App.initFormSelect2("#roleForm");
        var ajaxObj = {
            "url": serverPath + "dicts/dictProvSelect",
            "type": "post",
            "data": { id: null },
            "async": false
        }
        App.initAjaxSelect2("#provinceCode", ajaxObj, "provCode", "provName", "请选择省分编码");

        $("#editModalTitle").text("编辑角色信息");
        $("#modal").modal("show");
        getRoleInfo(itemId, "edit");
        validate("edit");
    });
}
/*
 * 获取角色信息
 */
function getRoleInfo(id, type) {
    App.formAjaxJson(serverPath + "roles/" + id, "GET", null, successCallback);

    function successCallback(result) {
        if (type == "detail") {
            /**表单赋值时的回调函数 */
            var valueCallback = {
                    'updateDate': function(value) { return App.formatDateTime(value, "yyyy-mm-dd") },
                    'isPartnerRole': function(value) { return value == "1" ? "是" : "否" }
                }
                /**根据返回结果给表单赋值 */
            App.setFindValue($("#roleInfo"), result.data, valueCallback);

            /**查询角色拥有的权限集合 */
            App.formAjaxJson(serverPath + "roles/" + id + "/perms", "GET", null, permsSuccess);

            /**权限查询结束后的回调函数 */
            function permsSuccess(result) {
                if (null != result.data) {
                    var permTree = $.fn.zTree.init($("#rolePermissionDetailTree"), permissionViewSetting, result.data);
                    var firstTree = permTree.getNodes()[0];
                    permTree.expandNode(firstTree);
                } else {
                    $("#rolePermission").text("该角色暂无权限");
                    layer.msg("该角色无相关权限", { icon: 2 });
                }
            }
        } else {
            var valueCallback = { 'updateDate': function(value) { return App.formatDateTime(value, "yyyy-mm-dd") } }
            App.setFormValues($("#roleForm"), result.data, valueCallback);
            $("#orgNameTree").attr("title", result.data.orgName);
            $("#orgNameTree").data("orgCode", result.data.orgId);
            $("#orgNameTree").data("provCode", result.data.provCode);
            loadPerTree(id);
        }
    }
}

/**
 * 打开新增窗口，同时向表单增加验证
 */
function openAddModal() {
    $("#modal").load("_roleModal.html?" + App.timestamp() + " #modalEdit", function() {
        App.initFormSelect2("#roleForm");
        var ajaxObj = {
            "url": serverPath + "dicts/dictProvSelect",
            "type": "post",
            "data": { id: null },
            "async": false
        }
        App.initAjaxSelect2("#provinceCode", ajaxObj, "provCode", "provName", "请选择省分编码");

        $("#editModalTitle").text("添加角色");
        $("#modal").modal("show");
        loadPerTree();
        validate("add");
    })
}
/**
 * 打开授权窗口,授权
 */
function openAddRolePerm(roleName, roleId) {
    $("#modal").load("rolePerm.html?" + App.timestamp() + " #modalEdit", function() {
        $("#editModalTitle").text(roleName + "角色授权");
        $("#modal").modal("show");
        getRoleInfo(roleId, "edit");
        $("#roleId").val(roleId);
        $("#staffId").val(config.curStaffId);
        $('#rolePermForm').bootstrapValidator({}).on('success.form.bv', function(e) {
            e.preventDefault();
            var ms = "授权成功";
            var formObj = App.getFormValues($("#rolePermForm"));
            var permId = '';
            var rolePermissionTreeNodes = rolePermissionTree.getCheckedNodes(true);
            for (var i = 0; i < rolePermissionTreeNodes.length; i++) {
                permId += rolePermissionTreeNodes[i].permId + ",";
            }
            formObj.permId = permId.substring(0, permId.length - 1);
            var url = serverPath + "roles/addRolePerm";
            App.formAjaxJson(url, "PUT", JSON.stringify(formObj), successCallback);

            function successCallback(result) {
                layer.msg(ms, { icon: 1 });
                searchRole(true);
                $('#modal').modal('hide');
            }
        });
    })
}
/*
 * 加载组织树和权限树
 * id  编辑时的ID值，用来查询该ID下存在的权限
 */
function loadPerTree(itemId) {
    //组织树点击事件
    $("#orgNameTree").on("click", function() {
        showTree('orgNameTree');
        //selectOrg('orgtreeMark', '', '', yourFunction2, '', '2');
    });
    //加载组织树
    App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", null, successCallback);

    function successCallback(result) {
        var data = result.data;
        if (null == data) {
            layer.msg("没有相关组织和人员信息", { icon: 2 });
        } else {
            orgNameTree = $.fn.zTree.init($("#orgName"), orgsSetting, data);
        }
    };
    //加载权限树
    $.get(serverPath + "pers/permAll", { "staffOrgId": config.curStaffOrgId, "staffId": config.curStaffId }, function(data) {
        if (data.length > 0) {
            rolePermissionTree = $.fn.zTree.init($("#rolePermissionTree"), rolePermissionSetting, data);
            if (itemId) {
                /**查询角色拥有的权限集合 */
                App.formAjaxJson(serverPath + "roles/" + itemId + "/perms", "GET", null, permsSuccess);
                /**权限查询结束后的回调函数 */
                function permsSuccess(result) {
                    if (null != result.data) {
                        var perms = result.data;
                        for (p in perms) {
                            var perm = perms[p];
                            var node = rolePermissionTree.getNodeByParam("permId", perm.PERM_ID);
                            rolePermissionTree.checkNode(node, true);
                        }
                    }
                }
            }
        } else {
            $("#rolePermissions").html("<div style='margin-top:9px'>暂无查询到权限信息</div>");
            layer.msg("暂无查询到权限信息", { icon: 2 });
        }
    });
}
/*
 * 编辑/新增
 */
function updateRoleValue(editType) {
    debugger;
    var formObj = App.getFormValues($("#roleForm"));
    var rolePermissionTreeNodes = rolePermissionTree.getCheckedNodes(true);
    var permId = '';
    var ms = "新增成功";
    var url = serverPath + "roles/";
    var pushType = "POST";
    for (var i = 0; i < rolePermissionTreeNodes.length; i++) {
        permId += rolePermissionTreeNodes[i].permId + ",";
    }
    formObj.permId = permId.substring(0, permId.length - 1);
    //formObj.orgId = $("#orgNameTree").data("orgCode");
    //formObj.provCode = $("#orgNameTree").data("provCode");
    /*if (formObj.permId == '') {
        layer.msg("请选择该角色对应的权限", { icon: 2 });
        $('#roleForm').data('bootstrapValidator').resetForm();
        return false;
    }*/
    if (editType == "add") {
        delete formObj.roleId;
    } else {
        ms = "修改成功";
        pushType = "PUT";
    }
    App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback, improperCallbacks);

    function successCallback(result) {
        layer.msg(ms, { icon: 1 });
        searchRole(true);
        $('#modal').modal('hide');
    }

    function improperCallbacks(result) {
        $('#roleForm').data('bootstrapValidator').resetForm();
    }
}

/*
 * 验证提交
 */
function validate(type) {
    $('#roleForm').bootstrapValidator({
        live: 'enabled',
        trigger: 'live focus blur keyup change',
        message: '校验未通过',
        container: 'popover',
        fields: {
            roleName: {
                validators: {
                    notEmpty: {
                        message: '您输入的字段不能为空'
                    }
                }
            },
            orgName: {
                validators: {
                    notEmpty: {
                        message: '请选择适用范围'
                    }
                },
                trigger: "focus blur keyup change",
            },
            roleDesc: {
                validators: {
                    stringLength: {
                        max: 100,
                        message: '请输入不超过100个字符'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        e.preventDefault();
        updateRoleValue(type);
    });
}

/**配置信息**/

/** 查看权限的树配置 (无勾选框)*/
var permissionViewSetting = {
    view: {
        selectedMulti: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "PERM_ID",
            pIdKey: "PARENT_ID"
        },
        key: {
            name: "PERM_NAME"
        }
    }
};
/** 角色管理页面的所有权限树配置(有勾选框) */
var rolePermissionSetting = {
    check: {
        enable: true,
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        }
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "permId",
            pIdKey: "parentId"
        },
        key: {
            name: "permName"
        }
    },
    callback: {
        //      beforeClick: function(treeId, treeNode) {},
        //      onCheck: setPermData
    }
};
//设置添加角色时拥有权限管理或角色管理的数据范围
function setPermData() {
    var treeObj = $.fn.zTree.getZTreeObj("rolePermissionTree");
    var node1 = treeObj.getNodeByParam("permId", 100);
    var node2 = treeObj.getNodeByParam("permId", 201);
    /*	if(node1.checked){
    		$('#permForPermManage').show();
    	}
    	if(node2.checked){
    		$('#roleForRoleManage').show();
    	}
    	if(!node1.checked){
    		$('#permForPermManage').hide();
    		var permForPermManageTreeObj = $.fn.zTree.getZTreeObj("permForPermManageTree");
    		permForPermManageTreeObj.checkAllNodes(false);
    	}
    	if(!node2.checked){
    		$('#roleForRoleManage').hide();
    	}*/
}

/*
 * 显示所属组织树
 */
function showTree(dom) {
    var selectObj = $("#" + dom + "");
    var selectOffset = selectObj.offset();
    $("#" + dom + "Content").css({
        left: "0",
        top: selectObj.outerHeight() + "px",
        width: selectObj.outerWidth() + 50
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
        if (!(event.target.id == dom || event.target.id == dom + "Content" || $(event.target).parents("#" + dom + "Content").length > 0)) {
            hideMenu(dom);
        }
    });
}
/*
 * 所属组织树配置单选配置
 */
var orgsSetting = {
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
        beforeAsync: zTreeBeforeAsync
    }
};

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
    orgNameTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children?orgType=1";
    return true;
}

/*
 * ztree点击事件
 */
function onClick(event, treeId, treeNode) {
    var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
    var selectName = nodes[0].orgName;
    var orgCode = nodes[0].orgCode;
    var provCode = nodes[0].provCode;
    $("input[name=" + treeId + "]").data("orgCode", orgCode);
    $("input[name=" + treeId + "]").data("provCode", provCode);
    $("input[name=" + treeId + "]").val(selectName);
    $("input[name=" + treeId + "]").attr("title", selectName);
    if (treeId == "orgName") {
        $("#roleForm").data("bootstrapValidator").updateStatus("orgName", "NOT_VALIDATED", null);
        $("#roleForm").data("bootstrapValidator").validateField('orgName');
    }
}