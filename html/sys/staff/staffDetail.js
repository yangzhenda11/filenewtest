$(document).ready(function() {
    debugger;
    if ($('#curTabstaffKind').val() && !$('#mark').val()) {
        doDetail($("#staffDetailId").val());
    } else if ($('#mark').val()) {
        doDetail($("#staffDetailId" + $('#mark').val()).val());
    }
});
var orgTypeSet = {
    "F": "主岗",
    "T": "兼职",
    "J": "借调"
};
//展示人员信息
function doDetail(staffId) {
    $.get(serverPath + 'staffs/' + staffId, {}, function(data) {
        var sysStaff = data.data.staffInfo;
        debugger;
        for (var col in sysStaff) {
            if (col == 'sex') {
                $("#sexInfoObj").html(sysStaff[col] === 'M' ? '男' : '女');
            } else if (col == 'staffStatus') {
                $("#staffStatusInfoObj").html(sysStaff[col] === '1' ? '有效' : '无效');
            } else if (col == 'hireDate') {
                var hireDate = transDate(sysStaff[col]);
                $('#' + col + 'InfoObj').html(hireDate);
            } else {
                $('#' + col + 'InfoObj').html(sysStaff[col]);
            }
        }
        var staffOrgs = data.data.staffOrgs;
        $("#staffOrgInfos").empty();
        debugger;
        for (var i in staffOrgs) {
            var hireDate = transDate(staffOrgs[i].hireDate);
            var effectStartDate = transDate(staffOrgs[i].effectStartDate);
            var effectEndDate = transDate(staffOrgs[i].effectEndDate);
            $("#staffOrgInfos").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
					<label class=\"input-group-addon\">岗位名称</label>\
					<span class=\"form-control\">" + staffOrgs[i].orgName + "</span></div></div>");
            $("#staffOrgInfos").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
					<label class=\"input-group-addon\">岗位类型</label>\
					<span class=\"form-control\">" + orgTypeSet[staffOrgs[i].staffOrgType] + "</span></div></div>");
            $("#staffOrgInfos").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
					<label class=\"input-group-addon\">入职日期</label>\
					<span class=\"form-control\">" + (hireDate ? hireDate : "") + "</span></div></div>");
            $("#staffOrgInfos").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
					<label class=\"input-group-addon\">生效日期</label>\
					<span class=\"form-control\">" + (effectStartDate ? effectStartDate : "") + "</span></div></div>");
            $("#staffOrgInfos").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
					<label class=\"input-group-addon\">结束日期</label>\
					<span class=\"form-control\">" + (effectEndDate ? effectEndDate : "") + "</span></div></div>");
        }
        var roles = data.data.roles;
        if (roles.length > 0) {
            $("#roleDiv").empty();
            for (var i in roles) {
                $("#roleDiv").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
						<label class=\"input-group-addon\">角色名称</label>\
						<span class=\"form-control\">" + (roles[i].roleName ? roles[i].roleName : "") + "</span></div></div>");
                $("#roleDiv").append("<div class=\"form-group col-sm-6\"><div class=\"input-group\">\
								<label class=\"input-group-addon\">角色描述</label>\
								<span class=\"form-control\">" + (roles[i].roleDesc ? roles[i].roleDesc : "") + "</span></div></div>");
            }
        } else {
            $("#roleDiv").detach();
            $("#role").append("<h5>无角色数据</h5>")
        }
        var permissions = data.data.permissions;
        if (permissions.length > 0) {
            $.fn.zTree.destroy("staffDetailPermtree");
            var staffDetailPermtree = $.fn.zTree.init($("#staffDetailPermtree"), {
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
            }, permissions);
        } else {
            $("#staffDetailPermtree").detach();
            $("#permission").append("<h5>无权限数据</h5>")
        }
        $('#infoModal').modal({ 'show': true });
        $('#infoTab a:first').tab('show')
    });
}

//修改日期格式
function transDate(oldDate) {
    if (null == oldDate) {
        var newDate = new Date(oldDate);
        var newDateYear = newDate.getFullYear();
        var newDateMonth = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1;
        var newDateDay = newDate.getDate() < 10 ? "0" + (newDate.getDate()) : newDate.getDate();
        newDate = newDateYear + "-" + newDateMonth + "-" + newDateDay;
        return newDate;
    } else {
        return oldDate;
    }

}