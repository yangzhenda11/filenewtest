var rolePermissionTree;
var roleStaffOrgTree;
var permForPermManageTree;
var curOrgStaffNode;
var curOrgStaffRole;
var orgTree;
var serverPath = parent.globalConfig.serverPath;
//角色下人员表
var roleSearchStaffTable;
var table = App.initDataTables('#searchRoleTable', {
    "serverSide": true, //开启服务器请求模式
    buttons: ['copy', 'colvis'], //显示的工具按钮
    "ajax": {
        "type": "GET",
        "url": parent.globalConfig.serverPath + 'roles/', //请求路径
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType": 'json',
        "data": function(d) { // 查询参数
            d.roleName = $('#sysRoleName').val();
            d.orgName = $("#sysOrgName").val();
            d.staffOrgId = parent.globalConfig.curStaffOrgId;
            d.roleStatus = 1;
            return d;
        },
        error: function(xhr, error, thrown) {
            stopLoading("#submitBtn");
            layer.msg("接口错误", { icon: 2 });
        },
        "dataSrc": judge
    },
    // "ordering": true,
    // "order": [
    //     [3, "asc"]
    // ],
    "columns": [ // 对应列
        // {
        //     "className": "td-checkbox text-center",
        //     "orderable": false,
        //     "data": "roleId",
        //     "align": 'center',
        //     "render": function(data, type, row, meta) {
        //         var content = '<label class="ui-checkbox">';
        //         content += '<input type="checkbox"  value="' + data + '" name="td-checkbox">';
        //         content += '<span></span></label>';
        //         return content;
        //     }
        // }, 
        {
            "data": "roleId",
            "title": "操作",
            "orderable": false,
            "bSort": false,
            "width": "20",
            "className": "text-center",
            "render": function(data, type, row, meta) {
                var html = '';
                html += '<button title="查看" onclick="findDetail(' + row.roleId + ')" class="btn btn-info btn-link btn-xs"><i class="fa fa-search-plus"></i></button>';
                html += '<button title="编辑" onclick="editDetail(' + row.roleId + ')" class="btn btn-success btn-link btn-xs"><i class="fa fa-edit"></i></button>';
                html += '<button title="删除" onclick="deleteDetail(' + row.roleId + ')" class="btn btn-success btn-link btn-xs"><i class="fa fa-minus"></i></button>';
                return html;
            }
        },
        { "data": "roleName", title: "角色名称", className: "text-center" },
        { "data": "orgName", title: "所属组织", className: "text-center" },
        { "data": "roleDesc", title: "角色描述", className: "text-center" },
        {
            "data": "createDate",
            title: "添加时间",
            className: "text-center",
            render: function(data, type, row, meta) {
                return data ? (new Date(data.time).format("yyyy-MM-dd")) : "";
            }
        }
    ],
    "columnDefs": [{ // 所有列默认值
            "targets": "_all",
            "defaultContent": ''
        },
        { // 最后一列添加按钮
            targets: 0,
            render: function(a, b, c, d) {
                var context = btnFun(c);
                var html = roletemplate(context);
                return html;
            }
        }
    ],
    "fixedColumns": {
        'leftColumns': 2
    },
    "scrollX": true
});
/**
 * 删除某个角色
 * @param {角色id} roleId 
 */
function deleteDetail(roleId) {
    layer.confirm('确定要将其删除吗', {
        btn: ['删除', '取消'],
        icon: 0,
        skin: 'layer-ext-moon'
    }, function() {
        $.ajax({ //提交服务端
            url: parent.globalConfig.serverPath + 'roles/' + roleId + '/role/' + parent.globalConfig.curStaffId,
            type: "DELETE",
            success: function(data) {
                layer.alert('删除成功', {
                        icon: 0,
                        skin: 'layer-ext-moon'
                    })
                    // $('#_frm_confirm_modal').modal('hide');
                searchRole();
            }
        });
    });
}
/**
 * 执行查询
 */
function searchRole(resetPaging) {
    startLoading("#submitBtn");
    var table = $('#searchRoleTable').DataTable();
    if (resetPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}
/*
 * 请求到结果后的回调事件
 */
function judge(result) {
    stopLoading("#submitBtn");
    return resolveResult(result);
}
/**
 * 查看角色详情
 * @param {角色id} itemId 
 */
function findDetail(itemId) {
    App.formAjaxJson(parent.globalConfig.serverPath + "roles/" + itemId, "GET", null, ajaxSuccess, null, ajaxError);
    /**成功回调函数 */
    function ajaxSuccess(result) {
        /**根据返回结果给表单赋值 */
        App.setFindValue($("#roleDetail"), result.data, { createDate: valueCallback });
        /**表单赋值时的回调函数 */
        function valueCallback(data) {
            return getFormatDate(new Date(data), "yyyy-MM-dd")
        }
        /**查询角色拥有的权限集合 */
        App.formAjaxJson(parent.globalConfig.serverPath + "roles/" + itemId + "/perms", "GET", null, permsSuccess);

        /**权限查询结束后的回调函数 */
        function permsSuccess(result) {
            if (null != result.data) {
                var permTree = $.fn.zTree.init($("#rolePermissionTree1"), permissionViewSetting, result.data);
                permTree.expandAll(false);
            } else {
                layer.msg("该角色无相关权限", { icon: 2 });
            }
        }
    }
    /**错误回调函数 */
    function ajaxError() {
        layer.msg("详情查询接口错误", { icon: 2 });
    }

    $('#findDetailModal').modal('show');
}

/**
 * 打开新增窗口，同时向表单增加验证等，待改进
 */
function openAddModal() {
    $("#editDetailModal").load("./subpage/roleform.html?" + App.timestamp(), function() {
        //是否合作方角色，默认设置为否
        $(".role-form.modal-title").text("添加角色");
        //加载权限树
        $.get(parent.globalConfig.serverPath + "pers/permAll", { "staffOrgId": parent.globalConfig.curStaffOrgId, "staffId": parent.globalConfig.curStaffId }, function(data) {
            rolePermissionTree = $.fn.zTree.init($("#rolePermissionTree"), rolePermissionSetting, data);
        });
        //重置表单
        // App.resetForm($("#roleForm"));
        if (null == $('#roleForm').data('bootstrapValidator')) {
            $('#roleForm').bootstrapValidator(roleFormValidator).on('success.form.bv', function(e) {
                e.preventDefault();
                var $form = $(e.target);
                var bv = $form.data('bootstrapValidator');
                var url = serverPath + "roles/?t=" + App.timestamp(); //staffPartner
                var pushType = "POST";
                var formObj = App.getFormValues($("#roleForm"));
                var rolePermissionTreeNodes = rolePermissionTree.getCheckedNodes(true);
                var permId = '';
                for (var i = 0; i < rolePermissionTreeNodes.length; i++) {
                    permId += rolePermissionTreeNodes[i].permId;
                    permId += ",";
                }
                formObj.permId = permId.substring(0, permId.length - 1);
                App.formAjaxJson(url, "POST", JSON.stringify(formObj), successCallback, improperCallbacks);

                function successCallback(result) {
                    layer.msg(result.message, { icon: 1 });
                    searchRole();
                    $('#editDetailModal').modal('hide');
                }

                function improperCallbacks(result) {
                    $('#roleForm').data('bootstrapValidator').resetForm();
                }
            });
        }
        // resetValidator();
        $('#orgId').on('change', function(e) {
            $('#roleForm')
                .data('bootstrapValidator')
                .updateStatus('orgId', 'NOT_VALIDATED', null)
                .validateField('orgId');
        });
    });
    // $('#editDetailModal').on('hidden.bs.modal', function() {
    //     $("#modalDetailContent").load("./html/externalPersonnelModal.html?" + App.timestamp() + " #editDetail");
    // });

}

/**
 * 重置表单验证
 */
function resetValidator() {
    if ($('#roleForm').data('bootstrapValidator')) {
        $('#roleForm').data('bootstrapValidator').resetForm();
    }
}
/**
 * 打开编辑窗口
 * @param {角色id} itemId 
 */
function editDetail(itemId) {
    $("#editDetailModal").load("./subpage/roleform.html?" + App.timestamp(), function() {
        debugger;
        $(".role-form.modal-title").text("编辑角色");
        App.formAjaxJson(serverPath + "roles/" + itemId, "GET", null, successCallback);

        function successCallback(result) {
            App.setFormValues($("#roleForm"), result.data);

            //加载权限树
            $.get(parent.globalConfig.serverPath + "pers/permAll", { "staffOrgId": parent.globalConfig.curStaffOrgId, "staffId": parent.globalConfig.curStaffId }, function(data) {
                rolePermissionTree = $.fn.zTree.init($("#rolePermissionTree"), rolePermissionSetting, data);

                /**查询角色拥有的权限集合 */
                App.formAjaxJson(parent.globalConfig.serverPath + "roles/" + itemId + "/perms", "GET", null, permsSuccess);

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
            });
            if (null == $('#roleForm').data('bootstrapValidator')) {
                $('#roleForm').bootstrapValidator(roleFormValidator).on('success.form.bv', function(e) {
                    e.preventDefault();
                    var $form = $(e.target);
                    var bv = $form.data('bootstrapValidator');
                    var url = serverPath + "roles/?t=" + App.timestamp(); //staffPartner
                    var pushType = "PUT";
                    var formObj = App.getFormValues($("#roleForm"));
                    var rolePermissionTreeNodes = rolePermissionTree.getCheckedNodes(true);
                    var permId = '';
                    for (var i = 0; i < rolePermissionTreeNodes.length; i++) {
                        permId += rolePermissionTreeNodes[i].permId;
                        permId += ",";
                    }
                    formObj.permId = permId.substring(0, permId.length - 1);
                    App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback, improperCallbacks);

                    function successCallback(result) {
                        layer.msg(result.message, { icon: 1 });
                        searchRole();
                        $('#editDetailModal').modal('hide');
                    }

                    function improperCallbacks(result) {
                        $('#roleForm').data('bootstrapValidator').resetForm();
                    }
                });
            }
            $('#editDetailModal').modal('show');
        }
    });
}
/**
 * 实现所属组织的点击方法，显示下拉树
 * @param {加载树的对象} obj 
 */
function roleAdd_OrgTree(obj) {
    selectOrgTree('staffAdd_OrgTree', obj, parent.globalConfig.curOrgId, roleAdd_OrgTreeCallback, '', '1', '720', '');
}
/**
 * 下拉树的回调方法
 * @param {组织id} orgId 
 * @param {组织名称} orgName 
 * @param {组织Code} orgCode 
 */
function roleAdd_OrgTreeCallback(orgId, orgName, orgCode) {
    $("#orgName").val(orgName);
    $("#orgId").val(orgCode);
    $("#roleForm").data('bootstrapValidator')
        .updateStatus('orgName', 'NOT_VALIDATED', null)
        .validateField('orgName');
}

var roleFormValidator = {
    /**
     * 生效规则（三选一）
     * enabled 字段值有变化就触发验证
     * disabled,submitted 当点击提交时验证并展示错误信息
     */
    live: 'enabled',
    /**
     * 为每个字段设置统一触发验证方式（也可在fields中为每个字段单独定义），默认是live配置的方式，数据改变就改变
     * 也可以指定一个或多个（多个空格隔开） 'focus blur keyup'
     */
    trigger: 'live focus blur keyup',
    message: '校验未通过',
    container: 'popover',
    excluded: [':disabled'], //[':disabled', ':hidden', ':not(:visible)']
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
                    message: '请选择所属组织'
                }
            }
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
}




/** **************************** */
/**下面的是之前的代码，尚有参考价值 */
/** **************************** */

/**
 * 表单验证规则、提交事件监听配置
 */
var checkValidator = {
    message: 'This value is not valid',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
        roleName: {
            validators: {
                notEmpty: {
                    message: '请输入角色名称'
                }
            }
        },
        orgId: {
            selector: '#orgName',
            validators: {
                notEmpty: {
                    message: '请单击选择所属组织'
                }
            }
        },
        roleDesc: {
            validators: {
                stringLength: { min: 0, max: 100, message: '请输入不超过100个字符' }
            }
        }
    },
    submitHandler: function(validator, form, submitButton) {
        alert("表单提交");
        if (!$("input[name='roleId']").val()) {
            addRole();
        } else {
            updateRole();
        }
    }
};

/** 角色管理页面的权限树 */
var rolePermissionSetting = {
    check: {
        enable: true,
        chkboxType: {
            "Y": "ps",
            "N": "ps"
        },
        chkStyle: "checkbox"
    },
    view: {
        selectedMulti: true
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
        beforeClick: function(treeId, treeNode) {},
        onCheck: setPermData

    }
};

/** 查看权限的树 */
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
    },
    callback: {
        beforeClick: function(treeId, treeNode) {}
    }
};

//添加角色下人员时的人员选择树配置
//20170524
var roleStaffsetting = {
    view: {
        selectedMulti: true
            // 设置是否允许同时选中多个节点
    },
    edit: {
        enable: false, // 设置 zTree 是否处于编辑状态
        editNameSelectAll: false, // 节点编辑名称 input 初次显示时,设置 txt
        // 内容是否为全选状态
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    check: {
        chkStyle: "checkbox", // 勾选框类型
        enable: true, // 设置 zTree 的节点上是否显示 checkbox
        chkboxType: {
            "Y": "",
            "N": ""
        }
    },
    async: {
        enable: true,
        otherParam: {
            "orgId": function() {
                return curOrgStaffNode.id
            }
        },
        type: "get", // 默认post
        dataType: 'json',
        dataFilter: filterStaff //处理异步加载返回的数据
    },
    callback: {
        beforeAsync: function(treeId, treeNode) {
            curOrgStaffNode = treeNode;
            roleStaffOrgTree.setting.async.url = serverPath + "roles/" + curOrgStaffRole + "/orgStaffsTreeChildren";
            return true;
        },
    }
};
//角色下人员选择树，异步加载时过滤掉当前角色下的已有人员
function filterStaff(treeId, parentNode, childNodes) {
    return childNodes.children;
}

var rolebtnModel = '    \
	{{#each func}}\
    <button type="button" class="user-button user-{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var roletemplate = Handlebars.compile(rolebtnModel);


function btnFun(c) {
    contentBtn = "";
    if (contentBtn) {
        return contentBtn;
    } else {
        var btnArray = new Array();
        btnArray.push({ "name": "修改", "fn": "showEditPage(\'" + c.roleId + "\')" });
        btnArray.push({ "name": "删除", "fn": "del(\'" + c.roleId + "\',\'" + c.roleName + "\')", "type": "btn-n" });
        btnArray.push({ "name": "查看权限", "fn": "roleSearchPerm(\'" + c.roleId + "\', \'" + c.roleName + "\')" });
        btnArray.push({ "name": "关联人员", "fn": "roleSearchStaff(\'" + c.roleId + "\', \'" + c.roleName + "\')" });
        contentBtn = {
            func: btnArray
        }
        return contentBtn;
    }

}

//显示添加角色
// function addRoleShow() {
//     //	$('#roleManage').hide();
//     $("input[name='isPartnerRole'][value='1']").prop("checked", true);
//     debugger;
//     $('#searchRoleContent').hide();
//     $('#roleName').val('');
//     $('#roleDesc').val('');
//     $('#roleModal').show();
//     $('#roleModalTitle').text("新增角色");
//     $('#updateBtn').hide();
//     /**
//      * 根据岗位ID获取当前登录人可操作的权限树信息
//      */
//     $.get(serverPath + "pers/permAll", { "staffOrgId": curStaffOrgId, "staffId": curStaffId }, function(data) {
//         rolePermissionTree = $.fn.zTree.init($("#rolePermissionTree"), rolePermissionSetting, data);
//         permForPermManageTree = $.fn.zTree.init($("#permForPermManageTree"), permForPermManageSetting, data);

//     });
//     /**
//      * 根据岗位ID获取当前登录人可操作的角色信息
//      */
//     $.get(serverPath + "roles/" + curStaffOrgId + "/role", { "staffId": curStaffId }, function(data) {
//         $html = "<button type=\"button\" class=\"user-button btn-sm\" onclick=\"chooseAll()\">全选</button>" +
//             "<button type=\"button\" class=\"user-button user-btn-n btn-sm\" onclick=\"clearAll()\">清除</button>"
//         $("#roleList").append($html);
//         for (var i = 0; i < data.roles.length; i++) {
//             $html = "<label class=\"roleChoose\">" + "<input type=\"checkbox\" name=\"roleList\" value=\"" + data.roles[i].roleId + "\"/>" +
//                 "<span>" + data.roles[i].roleName + "</span></label>";
//             $("#roleList").append($html);
//         }
//     });

//     $('#addBtn').show();
//     if (null == $('#roleForm').data('bootstrapValidator')) {
//         $('#roleForm').bootstrapValidator(checkValidator);
//     }
//     resetValidator();
//     $('#orgId').on('change', function(e) {
//         $('#roleForm')
//             .data('bootstrapValidator')
//             .updateStatus('orgId', 'NOT_VALIDATED', null)
//             .validateField('orgId');
//     });

// }
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
//添加角色至后台
function addRole() {
    //获取角色的权限
    var rolePermissionTreeObj = $.fn.zTree.getZTreeObj("rolePermissionTree");
    var node1 = rolePermissionTreeObj.getNodeByParam("permId", 100);
    var node2 = rolePermissionTreeObj.getNodeByParam("permId", 201);
    var rolePermissionTreeNodes = rolePermissionTreeObj.getCheckedNodes(true);
    var permId = '';
    for (var i = 0; i < rolePermissionTreeNodes.length; i++) {
        permId += rolePermissionTreeNodes[i].permId;
        permId += ",";
    }
    permId = permId.substring(0, permId.length - 1);
    //获取角色拥有权限“权限管理”时可操作的权限
    //	var permForPermManageTreeObj = $.fn.zTree.getZTreeObj("permForPermManageTree");
    //	var permForPermManageNodes = permForPermManageTreeObj.getCheckedNodes(true);
    //当角色拥有权限“权限管理”但是没有选择可操作的权限时弹框提示
    //	var permForPermManageId = '';
    //	if(node1.checked){
    //		for(var i = 0 ; i < permForPermManageNodes.length; i++){
    //			permForPermManageId += permForPermManageNodes[i].permId;
    //			permForPermManageId += ",";	
    //		}
    //		if(permForPermManageId.length>0){
    //			permForPermManageId=permForPermManageId.substring(0,permForPermManageId.length-1);
    //		}
    //	}
    //获取角色拥有权限“角色管理”时可操作的角色
    //	 var roleForRoleManageObj = document.getElementsByName("roleList");
    //	 var roleForRoleManageId = "";
    //	 for(var i=0; i<roleForRoleManageObj.length; i++){
    //        if(roleForRoleManageObj[i].checked){
    //        	roleForRoleManageId += roleForRoleManageObj[i].value;
    //        	roleForRoleManageId += ",";	
    //        }
    //    }
    //	if(roleForRoleManageId.length>0){
    //		roleForRoleManageId=roleForRoleManageId.substring(0,roleForRoleManageId.length-1);
    //	}
    var roleName = $('#roleName').val();
    var orgName = $('#orgName').val();
    var roleDesc = $('#roleDesc').val();
    var isPartnerRole = $('input[name="isPartnerRole"]:checked ').val();
    var map = {
            role: {
                roleDesc: roleDesc,
                roleName: roleName,
                isPartnerRole: isPartnerRole
            },
            permId: permId,
            permForPermManageId: permForPermManageId,
            roleForRoleManageId: roleForRoleManageId,
            staffId: curStaffId
        }
        //debugger;
    $.ajax({
        url: serverPath + "roles/",
        data: JSON.stringify(map),
        type: "POST",
        contentType: "application/json",
        success: function(data) {
            if (data.status == '1') {
                initFrame();
                rolePermissionTree = null;
                searchRoleTable.ajax.reload();
                alert("添加成功！");
            }
        },
        error: function(e) {
            alert("添加失败o_o请重试...");
        }
    })
}

function backSearch1() {
    $('#rolePermissionTree').val();
    $('.roleChoose').remove();
    $('#roleList button').remove();
    initFrame();
    $("#searchRoleTable").DataTable().draw(false);
}


//全选
function chooseAll() {
    var checkBoxAll = $("input[name='roleList']");
    $.each(checkBoxAll, function(j, checkbox) {
        $(checkbox).prop("checked", true);
    })
}
//清除全选
function clearAll() {
    $("[name = roleList]:checkbox").attr("checked", false);
}
//更新数据
function updateRole() {
    debugger;
    var roleId = $('#roleId').val();
    var roleName = $('#roleName').val();
    var roleDesc = $('#roleDesc').val();
    var isPartnerRole = $('input[name="isPartnerRole"]:checked').val();
    var rolePermissionTreeObj = $.fn.zTree.getZTreeObj("rolePermissionTree");
    var node1 = rolePermissionTreeObj.getNodeByParam("permId", 100);
    var node2 = rolePermissionTreeObj.getNodeByParam("permId", 201);
    var rolePermissionTreeNodes = rolePermissionTreeObj.getCheckedNodes(true);
    var permId = '';
    for (var i = 0; i < rolePermissionTreeNodes.length; i++) {
        permId += rolePermissionTreeNodes[i].permId;
        permId += ",";
    }
    permId = permId.substring(0, permId.length - 1);
    //获取角色拥有权限“权限管理”时可操作的权限
    var permForPermManageTreeObj = $.fn.zTree.getZTreeObj("permForPermManageTree");
    var permForPermManageNodes = permForPermManageTreeObj.getCheckedNodes(true);
    //当角色拥有权限“权限管理”但是没有选择可操作的权限时弹框提示
    var permForPermManageId = '';
    for (var i = 0; i < permForPermManageNodes.length; i++) {
        permForPermManageId += permForPermManageNodes[i].permId;
        permForPermManageId += ",";
    }
    if (permForPermManageId.length > 0) {
        permForPermManageId = permForPermManageId.substring(0, permForPermManageId.length - 1);
    }
    //获取角色拥有权限“角色管理”时可操作的角色
    var roleForRoleManageObj = document.getElementsByName("roleList");
    var roleForRoleManageId = "";
    for (var i = 0; i < roleForRoleManageObj.length; i++) {
        if (roleForRoleManageObj[i].checked) {
            roleForRoleManageId += roleForRoleManageObj[i].value;
            roleForRoleManageId += ",";
        }
    }
    if (roleForRoleManageId.length > 0) {
        roleForRoleManageId = roleForRoleManageId.substring(0, roleForRoleManageId.length - 1);
    }
    var map = {
        role: {
            roleId: roleId,
            roleDesc: roleDesc,
            roleName: roleName,
            isPartnerRole: isPartnerRole
        },
        permId: permId,
        permForPermManageId: permForPermManageId,
        roleForRoleManageId: roleForRoleManageId,
        staffId: curStaffId
    };
    //debugger;
    $.ajax({
        url: serverPath + "roles/",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(map),
        success: function(data) {
            if (data.status == 1) {
                initFrame();
                rolePermissionTree = null;
                searchRoleTable.ajax.reload();
                alert("更新角色成功！")
            }
        },
        error: function(e) {
            alert("更新角色失败o_o请查明原因后重试！");
        }
    });
}

//新增角色下人员时,弹出人员树,查询人员树
function selectStaff(roleId) {
    $('#staffModal').modal('show');
    $("#showStaffInRoleId").val(roleId);
    $.get(serverPath + "roles/orgStaffsTreeRoot", { "curOrgId": curOrgId }, function(data) {
        if (null == data) {
            alert("没有相关组织和人员信息");
        } else {
            curOrgStaffRole = roleId;
            roleStaffOrgTree = $.fn.zTree.init($("#stafftree"), roleStaffsetting, data);
            curOrgStaffNode = roleStaffOrgTree.getNodes()[0];
            roleStaffOrgTree.selectNode(curOrgStaffNode);
            roleStaffOrgTree.expandNode(curOrgStaffNode, true, false, true);
        }
    });
}

//点击确定时，添加角色下的人员到后台
function getStaffCheck() {
    var roleId = $("#showStaffInRoleId").val();
    var treeObj = $.fn.zTree.getZTreeObj("stafftree");
    var nodes = treeObj.getCheckedNodes(true);
    var staffOrgIds = "";
    for (var i = 0; i < nodes.length; i++) {
        if (false == nodes[i].isParent) {
            staffOrgIds += nodes[i].staffOrgId + ",";
        }
    }
    if (staffOrgIds == null || staffOrgIds == "") {
        alert("请选择人员");
        return;
    }
    $.post(serverPath + 'roles/' + roleId + '/staffs/', {
        'roleId': roleId,
        'staffOrgIds': staffOrgIds.substr(0, staffOrgIds.length - 1),
        'staffId': curStaffId
    }, function(data) {
        $('#staffModal').modal('hide');

        $("#roleSearchStaffTable").DataTable().draw(false);
        roleStaffOrgTree.destroy();
        alert("添加人员成功！");
    });

}
//删除角色下的人员，确认框
function delStaff(roleId, roleName, staffOrgId, staffName) {
    if (confirm("是否要删除'" + staffName + "'的'" + roleName + "'角色吗？")) {
        deleteStaffInRole(roleId, staffOrgId);
    }
}

//删除角色下的人员
function deleteStaffInRole(roleId, staffOrgId) {
    $.ajax({
        url: serverPath + "roles/" + roleId + "/staff/" + staffOrgId,
        type: "DELETE",
        success: function(data) {
            if (data.data > 0) {
                $('#_frm_confirm_modal').modal('hide');
                alert("删除成功！");
                $("#roleSearchStaffTable").DataTable().draw(false);
            }
        },
        error: function(e) {
            alert("删除失败！");
        }
    })
}

//删除数据
function del(roleId, roleName) {
    if (confirm('确定要删除角色 ' + roleName + ' 吗？')) {
        selectSysRole(roleId);
    }
}
//点删除角色时,需要查看该角色下是否还有人员,如果有,则该角色不可删除,如果没有,则可以删除
function selectSysRole(roleId) {

    $.ajax({

        url: serverPath + 'roles/' + roleId + '/isStaff',
        type: "GET",
        data: {
            "roleId": roleId
        },
        success: function(data) {
            if (data.isStaff) {
                alert("该角色不可删除！");
            } else {
                deleteSysRole(roleId);
            }
        }
    });
}
//删除角色
function deleteSysRole(roleId) {
    $.ajax({

        url: serverPath + 'roles/' + roleId + '/role/' + curStaffId,
        type: "DELETE",
        /*	    data:{
        	    	"staffId":curStaffId
        	    },*/
        success: function(data) {
            $('#_frm_confirm_modal').modal('hide');
            alert("删除成功！");
            searchRoleTable.ajax.reload();
        }
    });
}

/**
 * 根据角色ID查询角色拥有的权限，以树的形式在模态框中展示
 * @param roleId 角色ID
 * @param roleName 角色名
 * @returns
 */
function roleSearchPerm(roleId, roleName) {
    $("#permModalLabel").text("\"" + roleName + "\"" + " 角色的权限");
    var permNum = 0;
    $.ajax({
        url: serverPath + "roles/" + roleId + "/perms",
        type: "GET",
        success: function(data) {
            if (null != data.data) {
                var permTree = $.fn.zTree.init($("#rolePermissionTree1"), permissionViewSetting, data.data);
                permTree.expandAll(true);

            } else {
                alert("该角色无相关权限");
            }

        }
    });
    $('#roleHavepermModal').modal('show');
}



/**
 * 根据角色ID查询拥有此角色的人员
 * @param roleId 角色ID
 * @param roleName 角色名
 * 20170524cuiy
 * @returns
 */
function roleSearchStaff(roleId, roleName) {
    var orgId = curOrgId;
    $("#showStaffInRoleId").val(roleId);
    $('#roleManage').show();
    $('#searchRoleContent').hide();
    $('#RoleContainer').show();
    $(".ma_tip").text("拥有" + "\"" + roleName + "\"" + " 角色的人员");
    $("#AddStaffInRoleModal").attr("onClick", "selectStaff(" + roleId + ")");
    if (roleSearchStaffTable) {
        roleSearchStaffTable.destroy();
    }
    roleSearchStaffTable = $("#roleSearchStaffTable").DataTable({
        "ordering": false, // 排序
        "serverSide": true, // 开启服务器模式
        "scrollX": true, // 横向滚动     
        autoWidth: false,
        ajax: {
            "type": "GET",
            "url": serverPath + 'roles/' + roleId + '/staffs', //请求路径
            "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
            "dataType": 'json',
            "data": {
                "orgId": orgId
            }
        },
        columns: [ // 对应列
            {
                "data": null,
                visible: false
            },
            {
                "data": null,
                title: "操作",
                className: "text-center",
                render: function(a, b, c, d) {
                    var context = addRoleStaffbtnFun(roleId, roleName, c);
                    var html = roletemplate(context);
                    return html;
                }
            },
            {
                "data": "staffName",
                title: "人员姓名",
                className: "text-center",
                render: function(a, b, c, d) {
                    return "<a href=\"javascript:staffDetails('" + c.staffId + "')\">" + a + "</a>";
                }
            },
            { "data": "loginName", title: "账号", className: "text-center" },
            { "data": "orgName", title: "组织名称", className: "text-center" },
            {
                "data": "sex",
                title: "性别",
                className: "text-center",
                render: function(a, b, c, d) {
                    if ('M' == c.sex) {
                        return '男';
                    } else {
                        return '女';
                    }
                }
            },
            { "data": "mobilPhone", title: "手机号码", className: "text-center" },
            { "data": "email", title: "邮箱", className: "text-center" },
            { "data": "phone", title: "电话", className: "text-center" },
            {
                "data": "staffStatus",
                title: "岗位状态",
                className: "text-center",
                render: function(a, b, c, d) {
                    if ('1' == c.staffStatus) {
                        return '有效';
                    } else {
                        return '无效';
                    }
                }
            }
        ],
        "columnDefs": [{ // 所有列默认值
            "targets": "_all",
            "defaultContent": '',
            render: $.fn.dataTable.render.ellipsis(22, true)
        }],
        //      lengthMenu: [
        //	      menuLength,
        //	      menuLength
        //	    ],
        "dom": 'rt<"pull-left mt5"l><"pull-left mt5"i><"pull-right mt5"p><"clear">' //生成样式
    });

}

//角色下人员删除操作配置
//20170524
function addRoleStaffbtnFun(roleId, roleName, c) {
    contentBtn = "";
    if (contentBtn) {
        return contentBtn;
    } else {
        var btnArray = new Array();
        btnArray.push({
            "name": "删除",
            "fn": "delStaff(\'" + roleId + "\', \'" + roleName + "\',\'" + c.staffOrgId + "\', \'" + c.staffName + "\')"
        });

        contentBtn = {
            func: btnArray
        }
        return contentBtn;
    }

}

//展示人员信息
function staffDetails(staffId) {
    $('#roleStaffInfoModal').load("../staff/staffDetailModal.html", function() {

        $("#staffDetailId").val(staffId);
        $("#mark").val("role");
        $("#infoModal").attr("id", "infoModal" + $("#mark").val());
        $("#staffDetailId").attr("id", "staffDetailId" + $("#mark").val());
        $("#staffDetail").attr("id", "staffDetail" + $("#mark").val());
    });
}



//人员所属角色下的组织树
// var orgSetting = {
//     check: {
//         enable: true,
//         chkboxType: {
//             "Y": "ps",
//             "N": "ps"
//         },
//         chkStyle: "checkbox"
//     },
//     view: {
//         selectedMulti: true
//     },
//     data: {
//         simpleData: {
//             enable: true,
//             idKey: "oId",
//             pIdKey: "pId"
//         },
//         key: {
//             name: "name"
//         }
//     },
//     callback: {
//         beforeClick: function(treeId, treeNode) {},

//     }
// };
//var permForPermManageSetting = {
//     check: {
//         enable: true,
//         chkboxType: {
//             "Y": "ps",
//             "N": "ps"
//         },
//         chkStyle: "checkbox"
//     },
//     view: {
//         selectedMulti: true
//     },
//     data: {
//         simpleData: {
//             enable: true,
//             idKey: "permId",
//             pIdKey: "parentId"
//         },
//         key: {
//             name: "permName"
//         }
//     },
//     callback: {
//         beforeClick: function(treeId, treeNode) {}

//     }
// };
//组织树设置
// var roleorgSetting = {
//     view: {
//         selectedMulti: false
//     },
//     data: {
//         simpleData: {
//             enable: true,
//             idKey: "oCode",
//             pIdKey: "pCode"
//         }
//     },
//     callback: {
//         beforeClick: function(treeId, treeNode) {
//             $('#orgId').val(treeNode.id);
//             $('#orgName').val(treeNode.name);
//             $('#orgId').change();
//             $('#orgCloseModal').click();
//         }
//     },
//     async: {
//         enable: true,
//         url: "../sysOrgController/disOrgTree",
//         autoParam: ["oCode", "has_bm", "orgKind"]
//     }
// };