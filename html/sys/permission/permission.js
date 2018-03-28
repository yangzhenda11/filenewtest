/**
 * 权限管理
 */
// 组织树对象 当前处理树的node
var perPermissionTree, dealTreeNode1;
var isAddSysPer = false,
    isUpdateSysPer = false;
var zNodes = [];
// 当前操作节点
var curNode;
var validator = {
    live: 'enabled',
    trigger: 'live focus blur keyup',
    message: '校验未通过',
    container: 'popover',
    submitHandler: function(validator, form, submitButton) {
        debugger;
        if ($(submitButton).attr('id') == 'dealPermission') {
            savePermission();
        }
        if ($(submitButton).attr('id') == 'updatePermissionbtn') {
            updatePermission();
        }
    },
    fields: {
        permCode: {
            validators: {
                notEmpty: {
                    message: '请输入权限编码'
                }
            },
            stringLength: {
                max: 20,
                message: '权限编码不大于20个字符'
            }
        },
        permName: {
            validators: {
                notEmpty: {
                    message: '请输入权限名称111'
                }
            },
            stringLength: {
                max: 20,
                message: '权限名称不大于20个字符'
            }
        },
        uri: {
            validators: {
                stringLength: {
                    max: 200,
                    message: '权限地址不大于200个字符'
                }
            },

        },
        permIcon: {
            validators: {
                stringLength: {
                    max: 100,
                    message: '菜单图标不大于100个字符'
                }
            },

        },
        permCheck: {
            validators: {
                stringLength: {
                    max: 60,
                    message: '校验字符不大于60个字符'
                }
            },

        },
        permSort: {
            validators: {
                stringLength: {
                    max: 10,
                    message: '展示顺序不大于10个字符'
                },
                numeric: {
                    message: "只能输入纯数字"

                },
            },
        }

    }
};

$(function() {
    // 初始化树
    $("#permTree").height($(window).height() - 300);
    $.get(parent.globalConfig.serverPath + "pers/root", function(data) {
        zNodes = data.sysPerm;
        perPermissionTree = $.fn.zTree.init($("#permTree"), permSetting, zNodes);
        curNode = perPermissionTree.getNodes()[0];
        perPermissionTree.selectNode(curNode);
        perPermissionTree.expandNode(curNode, true, false, true);
        showPermission(curNode.permId);
    });
    //getDpType();
    $('#permissionObj').bootstrapValidator(validator).on('success.form.bv', function(e) {
        debugger;
        if ($("input[name='permId']", $("#permissionObj")).val()) {
            updatePermission();
        } else {
            savePermission();
        }
    });
});

// 基础设置
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
        url: parent.globalConfig.serverPath + "pers/1/children",
        otherParam: {
            "staffOrgId": parent.globalConfig.curStaffOrgId,
            "staffId": parent.globalConfig.curStaffId
        },
        type: "get", // 默认post
        dataType: 'json',
        dataFilter: filter
            // 异步返回后经过Filter
    },
    callback: {
        beforeAsync: function(treeId, treeNode) {
            perPermissionTree.setting.async.url = parent.globalConfig.serverPath + "pers/" +
                treeNode.permId + "/children";
            return true;
        },
        onClick: function(event, treeId, treeNode) {
            $('#permissionShow').show();
            $('#menuInfoWell').hide();
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

/**
 * 查找所有父节点
 * 
 * @param data
 * @returns {Array}
 */
function findRootNodes(data) {
    var rootNodes = new Array();
    for (var i = 0; i < data.length; i++) {
        var hasParent = false;
        for (var j = 0; j < data.length; j++) {
            if (data[i].parentId == data[j].permId) {
                hasParent = true;
                break;
            }
        }
        if (!hasParent) {
            rootNodes.push(data[i]);
        }
    }
    return rootNodes;
}

/**
 * 排序节点
 * 
 * @param curId
 * @param newArray
 * @param oldArray
 */
function sortOrder(curId, newArray, oldArray) {
    for (var i = 0; i < oldArray.length; i++) {
        if (oldArray[i].parentId == curId) {
            newArray.push(oldArray[i]);
            sortOrder(oldArray[i].permId, newArray, oldArray);
        }
    }
}

// 初始化页面
function initFrame() {
    $('#permissionObj input').val('');
    $('#permissionObj [name=type]').val('1');
    $('#permissionObj [name=grade]').val('-1');
    resetValidator();

}

function resetValidator() {
    if ($('#permissionObj').data('bootstrapValidator')) {
        $('#permissionObj').data('bootstrapValidator').resetForm(false);
    }
}

// 展示添加权限页面
function addPermission() {
    if (!curNode) {
        alertModel('请选择父节点');
        return;
    }
    initFrame();
    // $('#permissionObj').bootstrapValidator(validator);
    $('#permissionShow').hide();
    $('#menuInfoWell').show();
    $('#dealPermission').show();
    $('#updatePermissionbtn').hide();
    $('#parentIdVal').val(curNode.permId);
    $('#parentName').html(curNode.permName);
    $('#dealPermission').html('保存');
    /*
     * $('#dealPermission').unbind('click').bind('click',function(){savePermission();});
     */
}

// 保存权限信息
function savePermission() {
    $("input[name='staffOrgId']").val(parent.globalConfig.curStaffOrgId);
    var sysPermission = $('#permissionObj').serializeArray();
    var obj = {};
    $.each(sysPermission, function(i, v) {
        obj[v.name] = v.value;
    });
    // debugger;
    $.ajax({
        url: parent.globalConfig.serverPath + 'pers/',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify(obj),
        success: function(data) {
            $('#permissionShow').show();
            $('#menuInfoWell').hide();
            perPermissionTree.reAsyncChildNodes(curNode, "refresh");
        }
    });
}

function delPermission() {
    if (!curNode) {
        alert('请选择需删除的节点');
        return;
    }
    if (1 == curNode.permId) {
        alert('根权限禁止删除');
        return;
    }
    if (confirm('确定删除' + curNode.permName + '及其子节点么？')) {
        delPermission1();
    }
}

function delPermission1() {
    var treeObj = $.fn.zTree.getZTreeObj("permTree");
    var treeNode = treeObj.getSelectedNodes();
    var childNodes = treeObj.transformToArray(treeNode);
    var nodes = new Array();
    for (var i = 0; i < childNodes.length; i++) {
        nodes.push(childNodes[i].permId);
    }
    var permIds = nodes.join(",");
    $.ajax({
        type: "DELETE",
        url: parent.globalConfig.serverPath + "pers/" + permIds,
        data: {
            'permIds': permIds
        },
        dataType: "json",
        success: function(data) {
            $('#_frm_confirm_modal').modal('hide');
            var ptId = curNode.parentTId;
            perPermissionTree.removeNode(curNode);
            curNode = perPermissionTree.getNodeByTId(ptId);
            if (curNode) {
                showPermission(curNode.permId);
            }
            permSearchTable.ajax.reload();
        }
    });
}
// 展示权限信息
function showPermission(permId) {
    $.get(parent.globalConfig.serverPath + "pers/" + permId, function(data) { // ,{ "permId": permId }
        var sysPerm = data.sysPerm;
        $("#sysPermissionCode").html(sysPerm.permCode);
        $("#sysPermissionName").html(sysPerm.permName);
        $("#sysPermissionUri").html(sysPerm.uri);
        $("#sysPermissionType").html(sysPerm.permType = "1" ? "菜单" : (sysPerm.permType = "2" ? "标签" : "请求"));
        $("#sysPermissionIcon").html(sysPerm.permIcon);
        $("#sysPermissionCheck").html(sysPerm.permCheck);
        $("#sysPermissionSort").html(sysPerm.permSort);
        $("#sysPermissionDP").html(data.dataPermissionTypeLabel);
        $("#sysPermissionCheck").html(sysPerm.permCheck);
    });
}

function showUpdate() {
    if (!curNode) {
        alertModel('请选择需修改节点');
        return;
    }

    initFrame();
    var aa = curNode.permId;
    // $('#permissionObj').bootstrapValidator(validator);

    $.get(parent.globalConfig.serverPath + 'pers/' + aa, {
        'permId': curNode.permId
    }, function(data) {
        var sysPerm = data.sysPerm;
        for (col in sysPerm) {
            $('#permissionObj [name=' + col + ']').val(sysPerm[col]);
        }
    });
    $('#permissionShow').hide();
    $('#menuInfoWell').show();
    $('#dealPermission').hide();
    $('#updatePermissionbtn').show();
    $('#parentIdVal').val(curNode.permId);
    var ptId = curNode.parentTId;
    var pNode = perPermissionTree.getNodeByTId(ptId);
    if (!pNode == 0) {
        $('#parentName').html(pNode.permName);
    } else {
        $('#parentName').html('');
    }
    $('#updatePermissionbtn').html('修改');
    // $('#dealPermission').unbind('click').bind('click',function(){updatePermission();});
}
var permSearchTable;
// 查看用户
function showStaff() {
    debugger;
    if (!curNode) {
        alertModel('请选择需查询的节点');
        return;
    }
    // 后面构建btn 代码
    var btnModel = '    \
			{{#each func}}\
		    <button type="button" class="user-button btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
		    {{/each}}';

    var permTemplate = Handlebars.compile(btnModel);
    var aa = curNode;
    $("#permSearchTable").DataTable().destroy();
    permSearchTable = $("#permSearchTable").DataTable({
        "ordering": false, // 排序
        "serverSide": true, // 开启服务器模式
        "scrollX": true, // 横向滚动
        ajax: {
            "type": 'GET',
            "url": parent.globalConfig.serverPath + 'pers/' + curNode.permId + '/staffs', // 请求路径
            "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
            "dataType": 'json',
            "data": function(d) { // 查询参数
                d.permId = curNode.permId;
                return d;
            }
        },
        columns: [ // 对应列

            {
                "data": "staffId"
            }, {
                "data": null
            }, {
                "data": "staffCode",
                render: $.fn.dataTable.render.ellipsis(22, true)
            }, {
                "data": "staffName",
                render: $.fn.dataTable.render.ellipsis(22, true)
            }, {
                "data": "loginName",
                render: $.fn.dataTable.render.ellipsis(22, true)
            }, {
                "data": "orgName",
                render: $.fn.dataTable.render.ellipsis(22, true)
            }, {
                "data": "sex"
            }, {
                "data": "phone"
            }, {
                "data": "email"
            }, {
                "data": "mobilPhone"
            }, {
                "data": "staffStatus"
            }

        ],
        "columnDefs": [{ // 所有列默认值
            "targets": "_all",
            "defaultContent": ''
        }, { // 隐藏第一列
            "targets": 0,
            "visible": false
        }, {
            targets: 6,
            render: function(a, b, c, d) {
                if ('M' == c.sex) {
                    return '男';
                } else {
                    return '女';
                }
            }
        }, {
            targets: 10,
            render: function(a, b, c, d) {
                if ('1' == c.staffStatus)
                    return '有效';
                else
                    return '无效';
            }
        }, { // 最后一列添加按钮
            targets: 1,
            render: function(a, b, c, d) {
                context = {
                    func: [{
                        "name": "详细信息",
                        "fn": "showStaffPage(\'" + c.staffId + "\')",
                        "type": "primary"
                    }]
                };
                var html = permTemplate(context);
                return html;
            }
        }],
        // lengthMenu: [
        //     menuLength,
        //     menuLength
        // ],
        "dom": 'rt<"bottom"ip><"clear">' // 生成样式
    });
    $('#PermissionHeader').hide();
    $('#PermissionContainer').show();
    $('#PermissionContainer2').hide();
}

// 初始化页面信息
function initFrame1() {
    $('#PermissionHeader').show();
    $('#staffContainer').hide();
    $('#PermissionContainer').hide();
    $('#PermissionContainer2').hide();
    $('#saveBtn').hide();
    /*
     * if(searchTable!=''){ searchTable.destroy(); }
     */
}

// 返回
function backSearch() {
    initFrame1();
}

// 更新至数据库
function updatePermission() {
    $("input[name='permId']").val();
    var sysPermission = {
        permId: $("input[name='permId']").val(),
        parentId: $("input[name='parentId']").val(),
        parentName: $("#parentName").html(),
        permCode: $("input[name='permCode']").val(),
        uri: $("input[name='uri']").val(),
        permType: $("select[name='permType']").val(),
        permIcon: $("input[name='permIcon']").val(),
        permCheck: $("input[name='permCheck']").val(),
        permSort: $("input[name='permSort']").val(),
        dataPermissionType: $("select[name='dataPermissionType']").val(),
        permName: $("input[name='permName']").val(),
    };
    $.ajax({
        url: parent.globalConfig.serverPath + "pers/" + curNode.permId,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(sysPermission),
        success: function(data) {
            var sysPerm = data.sysPerm;
            perPermissionTree.editName(curNode);
            perPermissionTree.cancelEditName(sysPerm.permName);
            showPermission(curNode.permId);
            $('#permissionShow').show();
            $('#menuInfoWell').hide();
            curNode.permName = sysPerm.permName;
            perPermissionTree.updateNode(curNode);
            alert("修改成功!");
        }
    });
}

function showData(data) {
    for (col in data) {
        if ('permType' == col) {
            if ('1' == data[col]) {
                $('#sysPermissionType').html('菜单');
            } else if ('2' == data[col]) {
                $('#sysPermissionType').html('标签');
            } else if ('3' == data[col]) {
                $('#sysPermissionType').html('请求');
            }
        }
        /*
         * else if('controlLevel' == col){ if('-1' == data[col]){
         * $('#sysPermissionGrade').html('无限制'); }else if('100' ==
         * data[col]){ $('#sysPermissionGrade').html('集团公司'); }else if('200' ==
         * data[col]){ $('#sysPermissionGrade').html('省公司'); }else if('300' ==
         * data[col]){ $('#sysPermissionGrade').html('地市公司'); }else if('400' ==
         * data[col]){ $('#sysPermissionGrade').html('区县公司'); } }
         */
        else if ('grade' == col) {}
        /*
         * else{ $('#sysPermission'+upperHead(col)).html(data[col]); }
         */
        else if ('permCode' == col) {
            $('#sysPermissionCode').html(data[col]);
        } else if ('permName' == col) {
            $('#sysPermissionName').html(data[col]);
        } else if ('uri' == col) {
            $('#sysPermissionUri').html(data[col]);
        } else if ('permType' == col) {
            $('#sysPermissionType').html(data[col]);
        } else if ('permIcon' == col) {
            $('#sysPermissionIcon').html(data[col]);
        } else if ('permCheck' == col) {
            $('#sysPermissionCheck').html(data[col]);
        } else if ('permSort' == col) {
            $('#sysPermissionSort').html(data[col]);
        } else if ('dataPermissionType' == col) {
            var type = "";
            for (var i = 0; i < DpType.length; i++) {
                if (DpType[i].ID == data[col]) {
                    type = DpType[i].LABEL;
                }
            }
            $('#sysPermissionDP').html(type);
        }
    }
}

/**
 * 展示人员详细信息
 * @param staffId
 * @returns
 */
function showStaffPage(staffId) {
    $('#permStaffDetail').load("../staff/staffDetailModal.html", function() {
        $("#staffDetailId").val(staffId);
        $("#mark").val("Perm");
        $("#infoModal").attr("id", "infoModal" + $("#mark").val());
        $("#staffDetailId").attr("id", "staffDetailId" + $("#mark").val());
        $("#staffDetail").attr("id", "staffDetail" + $("#mark").val());
    });
}