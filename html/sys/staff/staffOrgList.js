// var searchStaffOrgTable;
// var btnModel = '    \
// 	{{#each func}}\
//     <button type="button" class="{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
//     {{/each}}';
// var template = Handlebars.compile(btnModel);

$(function() {
    var staffId = $("#selectedStaffId").val();

});

/*
 * 请求到结果后的回调事件
 */
function judge(result) {
    App.stopLoading("#searchBtn");
    return resolveResult(result);
}
//新增岗位
function goStaffOrgAdd() {
    debugger;
    var curTabstaffKind = $('#curTabstaffKind').val();
    $('#staffOrgLoadPart' + curTabstaffKind).show();
    $('#staffOrgList' + curTabstaffKind).hide();
    $("#staffBody" + curTabstaffKind).hide();
    $("#header" + curTabstaffKind).hide();
    $('#staffOrgLoadPart' + curTabstaffKind).load("../staff/staffOrgAdd.html", function() {
        $("#staffOrgAddForm").attr("id", "staffOrgAddForm" + curTabstaffKind);
        $("#staffOrgAddField").attr("id", "staffOrgAddField" + curTabstaffKind);
        if (null == $('#staffOrgAddForm' + curTabstaffKind).data('bootstrapValidator')) {
            $('#staffOrgAddForm' + curTabstaffKind).bootstrapValidator(staffOrgAddValidator);
        }
        $("input[name='staffId']", $('#staffOrgAddForm' + curTabstaffKind)).val($("#selectedStaffId" + curTabstaffKind).val());
        $("input[name='createBy']", $('#staffOrgAddForm' + curTabstaffKind)).val(curStaffId);
        $("input[name='updateBy']", $('#staffOrgAddForm' + curTabstaffKind)).val(curStaffId);
    });
}

//修改岗位
function goStaffOrgEdit(staffOrgId) {
    debugger;
    var curTabstaffKind = $('#curTabstaffKind').val();
    $('#staffOrgLoadPart' + curTabstaffKind).show();
    $('#staffOrgList' + curTabstaffKind).hide();
    $("#staffBody" + curTabstaffKind).hide();
    $("#header" + curTabstaffKind).hide();
    $('#selectedStaffOrgId' + curTabstaffKind).val(staffOrgId);
    $('#staffOrgLoadPart' + curTabstaffKind).load("../staff/staffOrgEdit.html", function() {
        $("#staffOrgEditForm").attr("id", "staffOrgEditForm" + curTabstaffKind);
        $("#staffOrgEditField").attr("id", "staffOrgEditField" + curTabstaffKind);
        if (null == $('#staffOrgEditForm' + curTabstaffKind).data('bootstrapValidator')) {
            $('#staffOrgEditForm' + curTabstaffKind).bootstrapValidator(staffOrgEditValidator);
        }
        $("input[name='staffId']", $('#staffOrgEditForm' + curTabstaffKind)).val($("#selectedStaffId" + curTabstaffKind).val());
        $("input[name='staffOrgId']", $('#staffOrgEditForm' + curTabstaffKind)).val(staffOrgId);
        $("input[name='updateBy']", $('#staffOrgEditForm' + curTabstaffKind)).val(curStaffId);
    });
}

function delStaffOrg(staffOrgId, orgName) {
    var staffId = $("#selectedStaffId" + curTabstaffKind).val();
    if (confirm("确认删除岗位：" + orgName + "吗？（不可恢复）")) {
        $.ajax({
            "url": serverPath + "staffs/" + staffId + "/staffOrg/" + staffOrgId,
            "type": "DELETE",
            success: function(data) {
                $("#searchStaffOrgTable" + curTabstaffKind).DataTable().ajax.reload();
                //					alert("修改成功！");
            },
            error: function(e) {
                alert("修改失败o_o请重试...");
            }
        })
    }
}


//角色管理
function staffOrgRoleManage(staffOrgId, orgName) {
    debugger;
    var curTabstaffKind = $('#curTabstaffKind').val();
    $('#staffOrgLoadPart' + curTabstaffKind).show();
    $('#staffOrgList' + curTabstaffKind).hide();
    $('#selectedStaffOrgId' + curTabstaffKind).val(staffOrgId);
    //	$("#staffBody"+curTabstaffKind).hide();
    //	$("#header"+curTabstaffKind).hide();
    $('#staffOrgLoadPart' + curTabstaffKind).load("../staff/staffOrgRole.html", function() {
        $("#staffOrgRoleManage").attr("id", "staffOrgRoleManage" + curTabstaffKind);
        $("#notHavingRoles").attr("id", "notHavingRoles" + curTabstaffKind);
        $("#havingRoles").attr("id", "havingRoles" + curTabstaffKind);
        $("#rightAll").attr("id", "rightAll" + curTabstaffKind);
        $("#rightSelected").attr("id", "rightSelected" + curTabstaffKind);
        $("#leftSelected").attr("id", "leftSelected" + curTabstaffKind);
        $("#leftAll").attr("id", "leftAll" + curTabstaffKind);
        $("#notHavingRoles_undo").attr("id", "notHavingRoles_undo" + curTabstaffKind);
    });
}

function returnStaffOrgList() {
    var curTabstaffKind = $('#curTabstaffKind').val();
    $("#searchStaffOrgTable" + curTabstaffKind).DataTable().ajax.reload();
    $('#staffOrgList' + curTabstaffKind).show();
    $('#staffOrgLoadPart' + curTabstaffKind).empty();
    $('#staffOrgLoadPart' + curTabstaffKind).hide();
    $("#staffBody" + curTabstaffKind).hide();
    $("#header" + curTabstaffKind).hide();
}

function changeStaffOrgStatus(staffOrgId, orgName, staffOrgStatus) {
    debugger;
    if ('1' === staffOrgStatus) {
        if (confirm("确认恢复岗位：" + orgName + "吗？")) {
            doChangeStaffOrgStatus(staffOrgId, staffOrgStatus);
        }
        return;
    }
    if (confirm("确认禁用岗位：" + orgName + "吗？")) {
        doChangeStaffOrgStatus(staffOrgId, staffOrgStatus);
    }
}

function doChangeStaffOrgStatus(staffOrgId, staffOrgStatus) {
    var curTabstaffKind = $('#curTabstaffKind').val();
    var obj = { "staffOrgId": staffOrgId, "updateBy": curStaffId };
    $.ajax({
        "type": "PUT",
        "url": serverPath + 'staffs/' + staffId + "/staffOrgStatus/" + staffOrgStatus,
        "contentType": "application/json",
        "data": JSON.stringify(obj),
        success: function(data) {
            $("#searchStaffOrgTable" + curTabstaffKind).DataTable().ajax.reload();
            //				alert("修改成功！");
        },
        error: function(e) {
            alert("修改失败o_o请重试...");
        }
    })
}