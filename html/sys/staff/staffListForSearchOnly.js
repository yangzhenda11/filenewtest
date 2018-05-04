var serverPath = parent.globalConfig.serverPath;
$(function() {
    var cloudSwitch;
    //查询云门户开关参数
    App.formAjaxJson(parent.globalConfig.serverPath + "configs/" + 13, "GET", null, ajaxSuccess);

    function ajaxSuccess(result) {
        cloudSwitch = result.sysConfig.val;
        if (cloudSwitch == 1) {
            $('#addBtn').show();
        }
        //根据当前登录人的岗位id查询其组织id
        //var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
        App.initDataTables('#staffSearchTable', {
            "serverSide": true, //开启服务器请求模式
            //buttons: ['copy', 'colvis'], //显示的工具按钮
            ajax: {
                "type": "GET",
                "url": parent.globalConfig.serverPath + 'staffs/', //请求路径
                "data": function(d) { // 查询参数
                    d.sysOrgId = parent.globalConfig.curCompanyId;
                    d.staffName = $("input[name='staffName']", $('#searchStaffForm')).val();
                    d.loginName = $("input[name='loginName']", $('#searchStaffForm')).val();
                    var orgId= $("input[name='orgId']", $('#searchStaffForm')).val();
                    if(null!=orgId && ''!=orgId){
                    	d.sysOrgId = $("input[name='orgId']", $('#searchStaffForm')).val();
                    }
                    d.staffStatus = $("select[name='staffStatus']", $('#searchStaffForm')).val();
                    d.mobilPhone = $("input[name='mobilPhone']", $('#searchStaffForm')).val();
                    d.staffKind = "1"; //$("#curTabstaffKind").val();
                    d.attra = $("select[name='staffOrgType']", $('#searchStaffForm')).val();
                    return d;
                },
                "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
                "dataType": "json",
                error: function(xhr, error, thrown) {
                    App.stopLoading("#searchBtn");
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
                    "title": "人员姓名",
                    render: function(data, type, full, meta) {
                        return '<a href=\"javascript:void(0)\" onclick = "showStaffDetail(' + data.STAFF_ID + ')">' + data.STAFF_NAME + '</a>';
                    }
                },
                { "data": "LOGIN_NAME", "title": "账号" },
                { "data": "ORG_NAME", "title": "部门名称" },
                {
                    "data": "STAFF_ORG_TYPE",
                    "title": "岗位类别",
                    className: "text-center",
                    render: function(a, b, c, d) {
                        return ('F' == c.STAFF_ORG_TYPE) ? '主岗' : ('T' == c.STAFF_ORG_TYPE ? '兼岗':'借调' ) ;
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
    }
});

/*
 * 请求到结果后的回调事件
 */
function judge(result) {
    App.stopLoading("#searchBtn");
    return resolveResult(result);
}

/**
 * 根据查询条件，查询人员列表
 * @returns 
 */
function searchStaff(retainPaging) {
    var table = $('#staffSearchTable').DataTable();
    if (retainPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
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
 */
function showStaffDetail(staffId) {
    //var curTabstaffKind = $('#curTabstaffKind').val();
    //debugger;
    $('#infoModal').load("../staff/staffDetailModal.html", function() {
        //$("#staffDetailId").val(staffId);

        $('#infoModal').modal({ show: true, backdrop: 'static' });
        App.formAjaxJson(parent.globalConfig.serverPath + 'staffs/' + staffId, "GET", null, ajaxSuccess);
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
                            <label class="control-label col-sm-2">所属岗位:</label> \
                            <div class="col-sm-10"> \
                                <p class="form-control-static">' + staffOrg.orgName + '(' + orgTypeSet[staffOrg.staffOrgType] + ')</p> \
                            </div> \
                        </div> \
                    </div>';
                    $("#staffOrgInfos").append(staffOrgHtml);
                }
            } else {
                $("#staffOrgInfos").append("<h5 class=\"text-center\">无岗位数据</h5>");
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
                            <label class="control-label col-sm-4">所属组织:</label> \
                            <div class="col-sm-8"> \
                                <p class="form-control-static">' + role.orgName + '</p> \
                            </div> \
                        </div> \
                    </div>';
                    $("#roleDiv").append(roleHtml);
                }
            } else {
                $("#roleDiv").append("<h5 class=\"text-center\">无角色数据</h5>");
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
            } else {
                $("#staffDetailPermtree").detach();
                $("#permission").append("<h5 class=\"text-center\">无权限数据</h5>")
            }
            /**表单赋值时的回调函数 */
            function hireDateCallback(data) {
            	if(data){
            		return App.formatDateTime(new Date(data), "yyyy-mm-dd");
            	}else{
            		return '';
            	}
                    //  return getFormatDate(new Date(data), "yyyy-MM-dd");

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
/**显示岗位管理列表 */



/*
 * 搜索点击事件
 */
function searchPersonnel(resetPaging) {
    var table = $('#staffSearchTable').DataTable();
    if (resetPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}

function getStaffSearch_OrgTree(obj){
	selectOrgTree('staffSearch_OrgTree',obj,parent.globalConfig.curCompanyId,getStaffSearch_OrgTreeId,'','1','400','300');
}

function getStaffSearch_OrgTreeId(orgId, orgName, orgCode){
	$("input[name='orgName']",$('#searchStaffForm')).val(orgName);
	$("input[name='orgId']",$('#searchStaffForm')).val(orgId);
}
