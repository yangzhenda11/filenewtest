var globalConfig = parent.globalConfig;
var serverPath = globalConfig.serverPath;
$(function() {
    //getStaffSearchOnlyTable();
});
function getStaffSearchOnlyTable() {
    App.initDataTables('#staffSearchOnlyTable', "#searchBtn",{
        ajax: {
            "type": "GET",
            "url": serverPath + 'staffs/',
            "data": function(d) {
                d.sysOrgId = globalConfig.curCompanyId;
                d.staffOrgId = globalConfig.curStaffOrgId;
                d.mainOrgFlag = globalConfig.mainOrgFlag;
                d.staffName = $("input[name='staffName']", $('#searchOnlyStaffForm')).val();
                d.loginName = $("input[name='loginName']", $('#searchOnlyStaffForm')).val();
                var orgId = $("input[name='orgId']", $('#searchOnlyStaffForm')).val();
                if (null != orgId && '' != orgId) {
                    d.sysOrgId = $("input[name='orgId']", $('#searchOnlyStaffForm')).val();
                }
                d.staffStatus = $("select[name='staffStatus']", $('#searchOnlyStaffForm')).val();
                d.mobilPhone = $("input[name='mobilPhone']", $('#searchOnlyStaffForm')).val();
                d.staffKind = "1";
                d.attra = $("select[name='staffOrgType']", $('#searchOnlyStaffForm')).val();
                return d;
            }
        },
        "columns": [
        	{"data" : null,"title":"序号","className": "text-center",
				"render" : function(data, type, full, meta){
					var start = App.getDatatablePaging("#staffSearchOnlyTable").pageStart;
					return start + meta.row + 1;
			   	}
			},
            {
                "data": null,
                "title": "人员姓名",
                render: function(data, type, full, meta) {
                    return '<a href=\"javascript:void(0)\" onclick = "showStaffDetail(' + data.STAFF_ID +','+ data.STAFF_ORG_ID +')">' + data.STAFF_NAME + '</a>';
                }
            },
            { "data": "LOGIN_NAME", "title": "账号" },
            { "data": "ORG_NAME", "title": "部门名称" },
            {
                "data": "STAFF_ORG_TYPE",
                "title": "岗位类别",
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
        ],
        "columnDefs": [{
                render: $.fn.dataTable.render.ellipsis(22, true),
            },
            {
                targets: 0,
                render: function(a, b, c, d) {
                    var context = btnFun(c);
                    var html = roletemplate(context);
                    return html;
                }
            }
        ]
    });
}

/**
 * 根据查询条件，查询人员列表
 * @returns 
 */
function searchStaff(retainPaging) {
    if($.fn.DataTable.isDataTable("#staffSearchOnlyTable")){
		var table = $('#staffSearchOnlyTable').DataTable();
	    if (resetPaging) {
	        table.ajax.reload(null, false);
	    } else {
	        table.ajax.reload();
	    }
	}else{
		$(".emptyTableDom").hide();
		getStaffSearchOnlyTable();
	}
}

var orgTypeSet = {
    "F": "主岗",
    "T": "兼职",
    "J": "借调"
};
/**
 * 弹出模态框显示人员详细信息
 * 包括人员信息，人员岗位信息，人员角色信息和权限信息
 * param：staffId 人员Id
 * param：staffOrgId 岗位Id
 */
function showStaffDetail(staffId,staffOrgId) {
    $('#infoModal').load("staffDetailModal.html", function() {
        $('#infoModal').modal("show");
        App.formAjaxJson(serverPath + 'staffs/' + staffId + '/dataPerm/' + staffOrgId, "GET", null, ajaxSuccess);
        /**成功回调函数 */
        function ajaxSuccess(result) {
            /**根据返回结果给表单赋值 */
            App.setFindValue($("#infoDiv"), result.data.staffInfo, { hireDate: hireDateCallback, staffStatus: statusCallback, sex: sexCallback });
            /**处理岗位 */
            var staffOrgs = result.data.staffOrgs;
            if (staffOrgs.length > 0) {
                for (p in staffOrgs) {
                    var staffOrg = staffOrgs[p];
                    var staffOrgHtml = '<div class="col-sm-12"> \
                        <div class="form-group"> \
                            <label class="control-label col-sm-3">所属岗位:</label> \
                            <div class="col-sm-9"> \
                                <p class="form-control-static">' + staffOrg.orgName + '(' + orgTypeSet[staffOrg.staffOrgType] + ')</p> \
                            </div> \
                        </div> \
                    </div>';
                    $("#staffOrgInfos").append(staffOrgHtml);
                }
            } else {
                $("#staffOrgInfos").append("<p class=\"text-center\">无岗位数据</p>");
            }
            /**处理角色 */
            var roles = result.data.roles;
            if (roles.length > 0) {
                for (p in roles) {
                    var role = roles[p];
                    var roleHtml = '<div class="col-sm-6"> \
                        <div class="form-group"> \
                            <label class="control-label col-sm-4">角色名称:</label> \
                            <div class="col-sm-8"> \
                                <p class="form-control-static">' + role.roleName + '</p> \
                            </div> \
                        </div> \
                    </div> \
                    <div class="col-sm-6"> \
                        <div class="form-group"> \
                            <label class="control-label col-sm-4">适用范围:</label> \
                            <div class="col-sm-8"> \
                                <p class="form-control-static">' + role.provName + '</p> \
                            </div> \
                        </div> \
                    </div>';
                    $("#roleDiv").append(roleHtml);
                }
            } else {
                $("#roleDiv").append("<p class=\"text-center\">无角色数据</p>");
            }
            /**处理权限 */
            var permissions = result.data.permissions;
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
                staffDetailPermtree.expandAll(true);
            } else {
                $("#staffDetailPermtree").detach();
                $("#permission").append("<p class=\"text-center\">无权限数据</p>")
            }
            /**处理数据权限信息*/
            var dataPermissions = result.data.dataPermissions;
            if (dataPermissions != null) {
                var dataPermissionHtml = '<div class="col-sm-8"> \
                    <div class="form-group"> \
                        <label class="control-label col-sm-5">数据权限级别:</label> \
                        <div class="col-sm-7"> \
                            <p class="form-control-static">' + dataPermissions.dataPermName + '</p> \
                        </div> \
                    </div> \
                </div> \
                </div>';
                $("#DatapermissionInfo").append(dataPermissionHtml); 
            } else {
                var dataPermissionHtml = '<div class="col-sm-8"> \
                    <div class="form-group"> \
                        <label class="control-label col-sm-5">数据权限级别:</label> \
                        <div class="col-sm-7"> \
                            <p class="form-control-static">' + "本人" + '</p> \
                        </div> \
                    </div> \
                </div> \
                </div>';
                $("#DatapermissionInfo").append(dataPermissionHtml);
            }
            /**表单赋值时的回调函数 */
            function hireDateCallback(data) {
                if (data) {
                    return App.formatDateTime(new Date(data), "yyyy-mm-dd");
                } else {
                    return '';
                }
            }

            function statusCallback(data) {
                return data == '1' ? '有效' : '无效';
            }

            function sexCallback(data) {
                return data == 'F' ? '女' : '男';
            }
        }
        $('#infoModal').on('hide.bs.modal', function() {
            $("#infoModal").empty();
        })
    });
}
/**从岗位列表返回人员列表 */
function returnStaffList() {
    // debugger;
    $('#staffLoadPart').empty();
    $('#staffLoadPart').hide();
    $("#divStaffList").show();
    // searchStaff(true);
}

function getStaffSearch_OrgTree(obj) {
    selectOrgTree('staffSearch_OrgTree', obj, globalConfig.curCompanyId, getStaffSearch_OrgTreeId, '', '1', '300', '300');
}

function getStaffSearch_OrgTreeId(orgId, orgName, orgCode) {
    $("input[name='orgName']", $('#searchOnlyStaffForm')).val(orgName);
    $("input[name='orgId']", $('#searchOnlyStaffForm')).val(orgId);
}