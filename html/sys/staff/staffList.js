var curTabstaffKind = $('#curTabstaffKind').val(); //当前页签的人员类型
var searchStaffTable;
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
// 人员列表的配置
var tableOption = {
    "ordering": false, // 排序
    "serverSide": true, // 开启服务器模式
    scrollX: true,
    autoWidth: false,
    fixedColumns: {
        leftColumns: 2
    },
    // lengthMenu: [
    // 	menuLength,
    // 	menuLength
    // ],
    ajax: {
        "type": "GET",
        "url": parent.globalConfig.serverPath + 'staffs/', //请求路径
        "data": function(d) { // 查询参数
            d.sysOrgId = parent.globalConfig.curOrgId;
            d.staffName = $("input[name='staffName']", $('#searchStaffForm' + curTabstaffKind)).val();
            d.loginName = $("input[name='loginName']", $('#searchStaffForm' + curTabstaffKind)).val();
            d.orgId = $("input[name='orgId']", $('#searchStaffForm' + curTabstaffKind)).val();
            d.staffStatus = $("select[name='staffStatus']", $('#searchStaffForm' + curTabstaffKind)).val();
            d.staffKind = $("#curTabstaffKind").val();
            return d;
        }
    },
    columns: [ // 对应列
        {
            "data": null,
            "title": "操作",
            className: "text-center",
            render: function(a, b, c, d) {
                var btnArray = new Array();
                btnArray.push({ "name": "修改", "fn": "goStaffEdit(\'" + c.STAFF_ID + "\')", "type": "user-button" });
                btnArray.push({ "name": "岗位管理", "fn": "orgManage('" + c.STAFF_ID + "','" + c.STAFF_NAME + "','" + c.ORG_NAME + "','" + c.STAFF_KIND + "')", "type": "user-button" });
                btnArray.push({ "name": "密码重置", "fn": "resetPasswd('" + c.STAFF_ID + "\',\'" + c.STAFF_NAME + "\',\'" + c.LOGIN_NAME + "\')", "type": "user-button" });
                if ('1' == c.STAFF_STATUS) {
                    btnArray.push({ "name": "禁用", "fn": "changeStaffStatus(\'" + c.STAFF_ID + "\',\'" + c.STAFF_NAME + "\',\'" + c.ORG_NAME + "\',\'0\')", "type": "user-button user-btn-n" });
                } else {
                    btnArray.push({ "name": "启用", "fn": "changeStaffStatus(\'" + c.STAFF_ID + "\',\'" + c.STAFF_NAME + "\',\'" + c.ORG_NAME + "\',\'1\')", "type": "user-button" });
                }
                context = {
                    func: btnArray
                }
                var html = template(context);
                return html;
            }
        },
        {
            "data": "STAFF_NAME",
            "title": "人员姓名",
            className: "text-center",
            render: function(a, b, c, d) {
                return "<a href=\"javascript:showStaffDetail('" + c.STAFF_ID + "')\">" + a + "</a>";
            }
        },
        { "data": "LOGIN_NAME", "title": "账号", className: "text-center" },
        { "data": "ORG_NAME", "title": "岗位", className: "text-center" },
        {
            "data": "SEX",
            "title": "性别",
            className: "text-center",
            render: function(a, b, c, d) {
                return c.SEX == 'M' ? '男' : '女';
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
                if ('1' == c.STAFF_STATUS) return '有效';
                else return '无效';
            }
        },
    ],
    "columnDefs": [{ // 所有列默认值
        "targets": "_all",
        "defaultContent": ''
            //				render: $.fn.dataTable.render.ellipsis(22, true)
    }],
    "dom": 'rt<"pull-left mt5"l><"pull-left mt4"i><"pull-right mt5"p><"clear">' //生成样式
};

$(function() {
    searchStaffTable = $("#searchStaffTable").DataTable(tableOption).draw(false); //页面加载时渲染表格	
})

function searchStaff() {
    var curTabstaffKind = $('#curTabstaffKind').val();
    $("#searchStaffTable" + curTabstaffKind).DataTable().ajax.reload();
}
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

function changeStaffStatus(staffId, staffName, orgName, staffStatus) {
    if ('1' === staffStatus) {
        if (confirm("确认恢复" + staffName + "吗？")) {
            doChangeStaffStatus(staffId, staffStatus);
        }
        return;
    }
    if (confirm("确认禁用" + staffName + "吗？")) {
        doChangeStaffStatus(staffId, staffStatus);
    }
}

function doChangeStaffStatus(staffId, staffStatus) {
    var curTabstaffKind = $('#curTabstaffKind').val();
    $.ajax({
        "type": "PUT",
        "url": parent.globalConfig.serverPath + 'staffs/' + staffId + "/status/" + staffStatus,
        //		"contentType":"application/json",
        "data": "",
        success: function(data) {
            $("#searchStaffTable" + curTabstaffKind).DataTable().ajax.reload();
            //				alert("修改成功！");
        },
        error: function(e) {
            alert("修改失败o_o请重试...");
        }
    })
}

function resetPasswd(staffId, staffName, loginName) {
    if (confirm('确定重置' + staffName + '的密码吗?')) {
        $.ajax({
            "type": "PUT",
            "url": parent.globalConfig.serverPath + 'staffs/' + staffId + "/passwd/" + loginName,
            //			"contentType":"application/json",
            //			"data":JSON.stringify(obj),
            success: function(data) {
                if (data) {
                    alert("用户" + staffName + "的密码重置成功，新密码为" + data.data);
                } else {
                    alertModel("密码重置失败！");
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("密码重置时异常：" + errorThrown);
            }
        });

    }
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