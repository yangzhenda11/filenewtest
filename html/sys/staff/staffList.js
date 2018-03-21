$(function() {
    //根据当前登录人的岗位id查询其组织id
    //var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
    //	debugger;
    App.initDataTables('#staffSearchTable', {
        "serverSide": true, //开启服务器请求模式
        buttons: ['copy', 'colvis'], //显示的工具按钮
        ajax: {
            "type": "GET",
            "url": parent.globalConfig.serverPath + 'staffs/', //请求路径
            "data": function(d) { // 查询参数
                d.sysOrgId = parent.globalConfig.curOrgId;
                d.staffName = $("input[name='staffName']", $('#searchStaffForm')).val();
                d.loginName = $("input[name='loginName']", $('#searchStaffForm')).val();
                //d.orgId = $("input[name='orgId']", $('#searchStaffForm')).val();
                d.staffStatus = $("select[name='staffStatus']", $('#searchStaffForm')).val();
                d.mobilPhone = $("input[name='mobilPhone']", $('#searchStaffForm')).val();
                d.staffKind = "1"; //$("#curTabstaffKind").val();
                return d;
            },
            "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
            "dataType": "json",
            error: function(xhr, error, thrown) {
                stopLoading("#searchBtn");
                layer.msg("接口错误", { icon: 2 });
            },
            "dataSrc": judge
        },
        // "ordering": true,
        // "order": [
        //     [3, "asc"]
        // ],
        "columns": [ // 对应列
            {
                "data": null,
                className: "text-center",
                title: "操作",
                render: function(a, b, c, d) {
                    var context;
                    var html = '';
                    html += "<button title=\"查看\" onclick=\"showStaffDetail('" + c.STAFF_ID + "')\" class=\"btn btn-info btn-link btn-xs\"><i class=\"fa fa-search-plus\"></i></button>";
                    html += "<button title=\"修改\" onclick=\"goStaffEdit('" + c.STAFF_ID + "')\" class=\"btn btn-info btn-link btn-xs\"><i class=\"fa fa-edit\"></i></button>";
                    html += "<button title=\"岗位管理\" onclick=\"orgManage('" + c.STAFF_ID + "')\" class=\"btn btn-info btn-link btn-xs\"><i class=\"fa fa-user-circle\"></i></button>";
                    html += "<button title=\"密码重置\" onclick=\"resetPasswd('" + c.STAFF_ID + "','" + c.STAFF_NAME + "','" + c.LOGIN_NAME + "')\" class=\"btn btn-info btn-link btn-xs\"><i class=\"fa fa-key\"></i></button>";
                    if ("1" == c.STAFF_STATUS) {
                        html += "<button title=\"禁用\" onclick=\"changeStaffStatus('" + c.STAFF_ID + "','" + c.STAFF_NAME + "','" + c.ORG_NAME + "',0)\" class=\"btn btn-success btn-link btn-xs\"><i class=\"fa fa-close\"></i></button>";
                    } else {
                        html += "<button title=\"启用\" onclick=\"changeStaffStatus('" + c.STAFF_ID + "','" + c.STAFF_NAME + "','" + c.ORG_NAME + "',1)\" class=\"btn btn-success btn-link btn-xs\"><i class=\"fa fa-check\"></i></button>";
                    }
                    return html;
                }
            },
            { "data": "STAFF_NAME", "title": "人员姓名", className: "text-center" },
            { "data": "LOGIN_NAME", "title": "账号", className: "text-center" },
            { "data": "ORG_NAME", "title": "岗位", className: "text-center" },
            {
                "data": "SEX",
                "title": "性别",
                className: "text-center",
                render: function(a, b, c, d) {
                    return (c.SEX == 'M') ? '男' : '女';
                }
            },
            { "data": "PHONE", "title": "电话号码", className: "text-center" },
            { "data": "EMAIL", "title": "邮箱账号", className: "text-center" },
            { "data": "MOBIL_PHONE", "title": "手机号码", className: "text-center" },
            {
                "data": "STAFF_STATUS",
                "title": "岗位状态",
                className: "text-center",
                render: function(a, b, c, d) {
                    return ('1' == c.STAFF_STATUS) ? '有效' : '无效';
                }
            }
        ],
        "columnDefs": [{ // 所有列默认值
                render: $.fn.dataTable.render.ellipsis(22, true),
                "targets": "_all",
                "defaultContent": ''
            },
            { // 添加按钮
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
});

/*
 * 请求到结果后的回调事件
 */
function judge(result) {
    stopLoading("#searchBtn");
    return resolveResult(result);
}

/**
 * 根据查询条件，查询人员列表
 * @returns 
 */
function searchStaff(resetPaging) {
    startLoading("#searchBtn");
    var table = $('#staffSearchTable').DataTable();
    if (resetPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}
/**
 * 重置密码
 * @param {人员id} staffId 
 * @param {姓名} staffName 
 * @param {登录名} loginName 
 */
function resetPasswd(staffId, staffName, loginName) {
    layer.confirm('确定重置' + staffName + '的密码吗?', {
        btn: ['重置', '取消'],
        icon: 0,
        skin: 'layer-ext-moon'
    }, function() {
        $.ajax({ //提交服务端
            url: parent.globalConfig.serverPath + 'staffs/' + staffId + "/passwd/" + loginName,
            type: "PUT",
            success: function(data) {
                layer.alert("用户" + staffName + "的密码重置成功，新密码为" + data.data, {
                    icon: 0,
                    skin: 'layer-ext-moon'
                });
            }
        });
    });
}
/**
 * 启用/禁用 用户
 * @param {人员id} staffId 
 * @param {姓名} staffName 
 * @param {组织名} orgName 
 * @param {状态值} staffStatus 
 */
function changeStaffStatus(staffId, staffName, orgName, staffStatus) {
    if (1 === staffStatus) {
        layer.confirm("确认启用" + staffName + "吗？", {
            btn: ['启用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
            $.ajax({ //提交服务端
                "type": "PUT",
                "url": parent.globalConfig.serverPath + 'staffs/' + staffId + "/status/" + staffStatus,
                success: function(data) {
                    layer.alert("启用成功", {
                        icon: 0,
                        skin: 'layer-ext-moon'
                    });
                    searchStaff(false);
                }
            });
        });
    } else {
        layer.confirm("确认禁用" + staffName + "吗？", {
            btn: ['禁用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
            $.ajax({ //提交服务端
                "type": "PUT",
                "url": parent.globalConfig.serverPath + 'staffs/' + staffId + "/status/" + staffStatus,
                success: function(data) {
                    layer.alert("禁用成功", {
                        icon: 0,
                        skin: 'layer-ext-moon'
                    });
                    searchStaff(false);
                }
            });
        });
    }
}





// $(function() {
//     searchStaffTable = $("#searchStaffTable").DataTable(tableOption).draw(false); //页面加载时渲染表格	
// })

// function searchStaff() {
//     var curTabstaffKind = $('#curTabstaffKind').val();
//     $("#searchStaffTable" + curTabstaffKind).DataTable().ajax.reload();
// }
/**
 * 点击人员姓名，弹出模态框显示人员详细信息
 * 包括人员信息，人员岗位信息，人员角色信息和权限信息
 * param：staffId 人员Id
 */
function showStaffDetail(staffId) {
    var curTabstaffKind = $('#curTabstaffKind').val();
    debugger;
    $('#staffModalPart' + curTabstaffKind).load("../staff/staffDetailModal.html", function() {
        $("#staffDetailId").val(staffId);
        $("#infoModal").attr("id", "infoModal" + curTabstaffKind);
        $("#staffDetailId").attr("id", "staffDetailId" + curTabstaffKind);
        $("#staffDetail").attr("id", "staffDetail" + curTabstaffKind);
    });

}
//重置所用条件查询输入框
function reset() {
    $('#searchForm input').val('');
}
//显示新增人员页面
function goStaffAdd() {
    var curTabstaffKind = $('#curTabstaffKind').val();
    debugger;
    $('#staffLoadPart' + curTabstaffKind).show();
    $("#staffBody" + curTabstaffKind).hide();
    $("#header" + curTabstaffKind).hide();
    $('#staffLoadPart' + curTabstaffKind).load("../staff/staffAdd.html", function() {
        $("#staffAddForm").attr("id", "staffAddForm" + curTabstaffKind);
        $("#staffAddField").attr("id", "staffAddField" + curTabstaffKind);
        if (null == $('#staffAddForm' + curTabstaffKind).data('bootstrapValidator')) {
            $('#staffAddForm' + curTabstaffKind).bootstrapValidator(staffAddCheckValidator);
        }
        //$('#staffAddForm'+curTabstaffKind).bootstrapValidator(staffAddCheckValidator);
        $("input[name='staffKind']", $('#staffAddForm' + curTabstaffKind)).val(curTabstaffKind);
        $("input[name='createBy']", $('#staffAddForm' + curTabstaffKind)).val(curStaffId);
        $("input[name='updateBy']", $('#staffAddForm' + curTabstaffKind)).val(curStaffId);
    });
}


//显示修改人员页面
function goStaffEdit(staffId) {
    var curTabstaffKind = $('#curTabstaffKind').val();
    debugger;
    $('#staffLoadPart' + curTabstaffKind).show();
    $("#staffBody" + curTabstaffKind).hide();
    $("#header" + curTabstaffKind).hide();
    $("#selectedStaffId" + curTabstaffKind).val(staffId);
    $('#staffLoadPart' + curTabstaffKind).load("../staff/staffEdit.html", function() {
        $("#staffEditForm").attr("id", "staffEditForm" + curTabstaffKind);
        $("#staffEditField").attr("id", "staffEditField" + curTabstaffKind);
        if (null == $('#staffEditForm' + curTabstaffKind).data('bootstrapValidator')) {
            $('#staffEditForm' + curTabstaffKind).bootstrapValidator(staffEditCheckValidator);
        }
        $("input[name='staffKind']", $('#staffEditForm' + curTabstaffKind)).val(curTabstaffKind);
        $("input[name='updateBy']", $('#staffEditForm' + curTabstaffKind)).val(curStaffId);
        $("input[name='staffId']", $('#staffEditForm' + curTabstaffKind)).val(staffId);
    });
}

function returnStaffList() {
    debugger;
    var curTabstaffKind = $('#curTabstaffKind').val();
    $('#staffLoadPart' + curTabstaffKind).empty();
    $('#staffLoadPart' + curTabstaffKind).hide();
    $("#searchStaffTable" + curTabstaffKind).DataTable().ajax.reload();
    $("#staffBody" + curTabstaffKind).show();
    $("#header" + curTabstaffKind).show();
}
//岗位管理
function orgManage(staffId, staffName, orgName, staffKind) {
    var curTabstaffKind = $('#curTabstaffKind').val();
    $('#staffLoadPart' + curTabstaffKind).show();
    $("#staffBody" + curTabstaffKind).hide();
    $("#header" + curTabstaffKind).hide();
    $("#selectedStaffId" + curTabstaffKind).val(staffId);
    debugger;
    $('#staffLoadPart' + curTabstaffKind).load("../staff/staffOrgList.html", function() {
        $('#staffOrgList').attr("id", "staffOrgList" + curTabstaffKind);
        $('#searchStaffOrgTable').attr("id", "searchStaffOrgTable" + curTabstaffKind);
        $('#selectedStaffOrgId').attr("id", "selectedStaffOrgId" + curTabstaffKind);
        $('#staffOrgLoadPart').attr("id", "staffOrgLoadPart" + curTabstaffKind);
        $('#staffManageTitle').attr("id", "staffManageTitle" + curTabstaffKind);
        $('#staffManageTitle' + curTabstaffKind).append("<h4>" + staffName + "的岗位操作</h4>");
    });
}



function getStaff_OrgTree(obj) {
    debugger;
    selectOrgTree('staff_OrgTree', obj, parent.globalConfig.curOrgId, getStaff_OrgTreeId, '', '1', '', '');
}

function getStaff_OrgTreeId(orgId, orgName, orgCode) {
    debugger;
    var curTabstaffKind = $('#curTabstaffKind').val();
    $("input[name='orgName']", $('#searchStaffForm' + curTabstaffKind)).val(orgName);
    $("input[name='orgId']", $('#searchStaffForm' + curTabstaffKind)).val(orgId);
}