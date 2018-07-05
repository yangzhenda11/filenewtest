var serverPath = parent.globalConfig.serverPath;

$(function() {
    // $("input[name='staffName']", $("#searchStaffForm")).click(function() {
    //     App.getCommonModal("staff", "#searchStaffName", "orgName", ["staffId", "staffOid"]);
    // });
    var cloudSwitch;
    //查询云门户开关参数
    App.formAjaxJson(parent.globalConfig.serverPath + "configs/" + 13, "GET", null, ajaxSuccess);

    function ajaxSuccess(result) {
        cloudSwitch = result.sysConfig.val;
        if (cloudSwitch == 1) {
            $('#addBtn').show();
        }
        App.initDataTables('#staffSearchTable',"#searchBtn", {
            "serverSide": true,
            ajax: {
                "type": "GET",
                "url": parent.globalConfig.serverPath + 'staffs/',
                "data": function(d) {
                    d.sysOrgId = parent.globalConfig.curCompanyId;
                    d.staffName = $("input[name='staffName']", $('#searchStaffForm')).val();
                    d.loginName = $("input[name='loginName']", $('#searchStaffForm')).val();
                    var orgId = $("input[name='orgId']", $('#searchStaffForm')).val();
                    if (null != orgId && '' != orgId) {
                        d.sysOrgId = $("input[name='orgId']", $('#searchStaffForm')).val();
                    }
                    d.staffStatus = $("select[name='staffStatus']", $('#searchStaffForm')).val();
                    d.mobilPhone = $("input[name='mobilPhone']", $('#searchStaffForm')).val();
                    d.staffKind = "1"; //$("#curTabstaffKind").val();
                    d.attra = $("select[name='staffOrgType']", $('#searchStaffForm')).val();
                    return d;
                }
            },
            "columns": [
                {
                    data: null,
                    className: "text-center",
                    width: "35%",
                    title: "操作",
                    render: function(a, b, c, d) {
                        if (c) {
                            var btnArray = new Array();
                            //    btnArray.push({ "name": "查看", "fn": "showStaffDetail(\'" + c.STAFF_ID + "\')" });
                            if (cloudSwitch == 1) {
                                if (c.STAFF_ORG_TYPE == 'F') {
                                    btnArray.push({ "name": "修改", "fn": "goStaffEdit(\'" + c.STAFF_ID + "\')" });
                                    btnArray.push({ "name": "新增岗位", "fn": "goAddStaffOrg(\'" + c.STAFF_ID + "\')" });
                                } else {
                                    btnArray.push({ "name": "调整", "fn": "goEditStaffOrg(\'" + c.STAFF_ID + "\',\'" + c.STAFF_ORG_ID + "\')" });
                                    btnArray.push({ "name": "删除岗位", "fn": "goDelStaffOrg(\'" + c.STAFF_ID + "\',\'" + c.STAFF_ORG_ID + "\')" });
                                }
                            }
                            btnArray.push({ "name": "密码重置", "fn": "resetPasswd(\'" + c.STAFF_ID + "\',\'" + c.STAFF_NAME + "\',\'" + c.LOGIN_NAME + "\')" });
                            btnArray.push({ "name": "角色分配", "fn": "staffOrgRoleManage(\'" + c.STAFF_ORG_ID + "\',\'" + c.ORG_NAME + "\')" });
                            btnArray.push({ "name": "角色复制", "fn": "goStaffOrgRoleCopy(\'" + c.STAFF_ORG_ID + "\')" });
                            btnArray.push({ "name": "数据权限", "fn":"permissionConfiguration(\'" + c.STAFF_ORG_ID + "\')" });
                            if ("1" == c.STAFF_ORG_STATUS) {
                                btnArray.push({ "name": "禁用", "fn": "changeStaffStatus(\'" + c.STAFF_ORG_ID + "\',\'" + c.STAFF_NAME + "\',0,\'" + c.ORG_NAME + "\')" });
                            } else {
                                btnArray.push({ "name": "启用", "fn": "changeStaffStatus(\'" + c.STAFF_ORG_ID + "\',\'" + c.STAFF_NAME + "\',1,\'" + c.ORG_NAME + "\')" });
                            }
                            return App.getDataTableBtn(btnArray);
                        } else {
                            return '';
                        }
                    }
                },
                {
                    "data": null,
                    "title": "人员姓名",
                    "className":"whiteSpaceNormal",
                    "width": "7%",
                    render: function(data, type, full, meta) {
                        return '<a href=\"javascript:void(0)\" onclick = "showStaffDetail(' + data.STAFF_ID + ')">' + data.STAFF_NAME + '</a>';
                    }
                },
                { "data": "LOGIN_NAME", "title": "账号","className":"whiteSpaceNormal","width":"9%"},
                { "data": "ORG_NAME", "title": "部门名称","className":"whiteSpaceNormal","width":"11%"},
                {
                    "data": "STAFF_ORG_TYPE",
                    "title": "岗位类别",
                    "className": "whiteSpaceNormal text-center",
                    "width": "7%",
                    render: function(a, b, c, d) {
                        return ('F' == c.STAFF_ORG_TYPE) ? '主岗' : ('T' == c.STAFF_ORG_TYPE ? '兼岗' : '借调');
                    }
                },
                {
                    "data": "SEX",
                    "title": "性别",
                    "className": "whiteSpaceNormal text-center",
                    "width": "4%",
                    render: function(a, b, c, d) {
                        return (c.SEX == 'M') ? '男' : '女';
                    }
                },
                { "data": "EMAIL", "title": "邮箱账号","className":"whiteSpaceNormal","width":"11%"},
                { "data": "MOBIL_PHONE", "title": "手机号码","className":"whiteSpaceNormal","width":"9%"},
                {
                    "data": "STAFF_ORG_STATUS",
                    "title": "岗位状态",
                    "className": "whiteSpaceNormal text-center",
                    "width": "7%",
                    render: function(a, b, c, d) {
                        return ('1' == c.STAFF_ORG_STATUS) ? '有效' : '无效';
                    }
                }
            ]
//          "fixedColumns": {
//              'leftColumns': 2
//          },
//          drawCallback:function(){
//          	$('table td').css("height","20px");
//          	$(".DTFC_LeftWrapper .DTFC_LeftBodyWrapper").css("margin-top","1px");
//          }
        })
    }
})

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
/**
 * 重置密码
 * @param {人员id} staffId 
 * @param {姓名} staffName 
 * @param {登录名} loginName 
 */
function resetPasswd(staffId, staffName, loginName) {
    layer.confirm('确定重置' + staffName + '的密码为123456吗?', {
        btn: ['重置', '取消'],
        icon: 0,
        skin: 'layer-ext-moon'
    }, function() {
    	App.formAjaxJson(serverPath + 'staffs/' + staffId + "/passwd/" + loginName, "PUT", null, successCallback);
    	function successCallback(result){
    		layer.msg("用户" + staffName + "的密码重置成功，新密码为" + result.data);
    	}
    });
}
/**
 * 启用/禁用 用户
 * @param {人员id} staffId 
 * @param {姓名} staffName 
 * @param {组织名} orgName 
 * @param {状态值} staffStatus 
 */
function changeStaffStatus(staffOrgId, staffName, staffOrgStatus, orgName) {
    if (1 === staffOrgStatus) {
        layer.confirm("确认启用" + staffName + "在"+orgName+"部门的岗位吗？", {
            btn: ['启用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
        	App.formAjaxJson(serverPath + 'staffs/' + staffOrgId + "/status/" + staffOrgStatus, "PUT", null, successCallback);
        });
    } else {
        layer.confirm("确认禁用" + staffName + "在"+orgName+"部门的岗位吗？", {
            btn: ['禁用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
        	App.formAjaxJson(serverPath + 'staffs/' + staffOrgId + "/status/" + staffOrgStatus, "PUT", null, successCallback);
        });
    }
    function successCallback(result) {
    	var ms = "禁用成功";
		if(staffOrgStatus == 1){
			ms = "启用成功";
		};
		layer.msg(ms);
        searchStaff(true);
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
                            <label class="control-label col-sm-4">适用范围:</label> \
                            <div class="col-sm-8"> \
                                <p class="form-control-static">' + role.provName + '</p> \
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
                if (data) {
                    return App.formatDateTime(new Date(data), "yyyy-mm-dd");
                } else {
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
//function orgManage(staffId, staffName) {
//  // var curTabstaffKind = $('#curTabstaffKind').val();
//  $("#divStaffList").hide();
//  //debugger;
//  $('#staffLoadPart').load("staffOrgList.html", function() {
//      // $('#staffOrgList').attr("id", "staffOrgList" + curTabstaffKind);
//      // $('#searchStaffOrgTable').attr("id", "searchStaffOrgTable" + curTabstaffKind);
//      // $('#selectedStaffOrgId').attr("id", "selectedStaffOrgId" + curTabstaffKind);
//      // $('#staffOrgLoadPart').attr("id", "staffOrgLoadPart" + curTabstaffKind);
//      // $('#staffManageTitle').attr("id", "staffManageTitle" + curTabstaffKind);
//      $('#staffManageTitle').text(staffName + "的岗位操作");
//      $('#staffLoadPart').show();
//      App.initDataTables('#searchStaffOrgTable',  {
//	        ajax: {
//	            "type": "GET",
//	            "url": parent.globalConfig.serverPath + 'staffs/' + staffId + '/staffOrgs'
//	        },
//	        "columns": [ // 对应列
//	            {
//	                "data": null,
//	                className: "text-center",
//	                title: "操作",
//	                render: function(a, b, c, d) {
//	                	if(c) {
//							var btnArray = new Array();
//		                    btnArray.push({ "name": "角色管理", "fn": "staffOrgRoleManage(\'" + c.STAFF_ORG_ID + "','" + c.ORG_NAME + "\')" });
//		                    if ("1" == c.STAFF_ORG_STATUS) {
//		                       	btnArray.push({ "name": "禁用", "fn": "changeStaffOrgStatus(\'" + c.STAFF_ORG_ID + "\',\'" + c.ORG_NAME + "\',\'0\')" });
//		                    } else {
//		                        btnArray.push({ "name": "启用", "fn": "changeStaffOrgStatus(\'" + c.STAFF_ORG_ID + "\',\'" + c.ORG_NAME + "\',\'1\')" });
//		                    }
//		                    context = {
//		                        func: btnArray
//		                    }
//		                    var template = Handlebars.compile(btnModel);
//		                    var html = template(context);
//		                    return html;
//						} else {
//							return '';
//						} 
//	                }
//	            }, {
//	                "data": "STAFF_ORG_TYPE",
//	                "title": "岗位类型",
//	                className: "text-center",
//	                render: function(a, b, c, d) {
//	                    if ('F' == c.STAFF_ORG_TYPE) {
//	                        return '主岗';
//	                    } else if ('T' == c.STAFF_ORG_TYPE) {
//	                        return '兼职';
//	                    } else {
//	                        return '借调';
//	                    }
//	                }
//	            },
//	            { "data": "ORG_NAME", "title": "组织名称", className: "text-center" },
//	            {
//	                "data": "STAFF_ORG_STATUS",
//	                "title": "岗位状态",
//	                className: "text-center",
//	                render: function(a, b, c, d) {
//	                    if ('1' == c.STAFF_ORG_STATUS) {
//	                        return '有效';
//	                    } else {
//	                        return '无效';
//	                    }
//	                }
//	            },
//	            {
//	                "data": "HIRE_DATE",
//	                "title": "录用时间",
//	                className: "text-center",
//	                render: function(a, b, c, d) {
//	                    return c.HIRE_DATE ? new Date(c.HIRE_DATE).format("yyyy-MM-dd") : '';
//	                }
//	            },
//	            {
//	                "data": "EFFECT_START_DATE",
//	                "title": "生效时间",
//	                className: "text-center",
//	                render: function(a, b, c, d) {
//	                    return c.EFFECT_START_DATE ? new Date(c.EFFECT_START_DATE).format("yyyy-MM-dd") : '';
//	                }
//	            },
//	            {
//	                "data": "EFFECT_END_DATE",
//	                "title": "失效时间",
//	                className: "text-center",
//	                render: function(a, b, c, d) {
//	                    return c.EFFECT_END_DATE ? new Date(c.EFFECT_END_DATE).format("yyyy-MM-dd") : '';
//	                }
//	            },
//	            { "data": "DUTY", "title": "职责", className: "text-center" }
//	        ],
//	        "fixedColumns": {
//              'leftColumns': 2
//          }
//		});
//	})
//}
/**
 * 角色分配
 * @param {岗位id} staffOrgId 
 * @param {组织名称} orgName 
 */
function staffOrgRoleManage(staffOrgId, orgName) {
    $('#selectedStaffOrgId').val(staffOrgId);
    // debugger;
    $('#roleModal').load("staffOrgRole.html", function() {
        /**清空待选、已选 */
        // $("#havingRoles").empty();
        // $("#notHavingRoles").empty();
        $('#roleModal').modal({ show: true, backdrop: 'static' });
        App.formAjaxJson(parent.globalConfig.serverPath + "staffs/" + parent.globalConfig.curStaffId + "/staffOrgs/" + parent.globalConfig.curStaffOrgId + "/staffRoles/" + staffOrgId, "GET", null, ajaxSuccess);

        function ajaxSuccess(result) {
            var havingRoles = result.data.havingRoles;
            var notHavingRoles = result.data.notHavingRoles;
            for (var i = 0; i < havingRoles.length; i++) {
                // <option value=\"" + havingRoles[i].ROLE_ID + "\">
                $("#havingRoles").append($("<li data-id=\"" + havingRoles[i].ROLE_ID + "\" class=\"list-group-item\">" + havingRoles[i].ROLE_NAME + "</li>"));
                $("#notHavingRoles").append($("<li data-id=\"" + havingRoles[i].ROLE_ID + "\" class=\"list-group-item list-group-item-success\">" + havingRoles[i].ROLE_NAME + "</li>"));
            }
            for (var i = 0; i < notHavingRoles.length; i++) {
                $("#notHavingRoles").append($("<li data-id=\"" + notHavingRoles[i].ROLE_ID + "\" class=\"list-group-item\">" + notHavingRoles[i].ROLE_NAME + "</li>"));
            }
            selectL2R.init('#selectL2R-ul');
        }
        // $('#getSelectL2R-ul').click(function() {
        //     var result = selectL2R.getResult('#selectL2R-ul');
        //     $('#selectL2RResult-ul').text(result);
        // });
        $('#roleModal').on('hide.bs.modal', function() {
            $("#roleModal").empty();
        })
    });
}
// $(function() {
//     debugger;
//     $("#havingRoles").empty();
//     $("#notHavingRoles").empty();
//     var staffId = $("#selectedStaffId" + curTabstaffKind).val();
//     var staffOrgId = $("#selectedStaffOrgId" + curTabstaffKind).val();
//     $.get(serverPath + "/staffs/" + staffId + "/staffOrgs/" + curStaffOrgId + "/staffRoles/" + staffOrgId, {}, function(array) {
//         var havingRoles = array.data.havingRoles;
//         var notHavingRoles = array.data.notHavingRoles;
//         for (var i = 0; i < havingRoles.length; i++) {
//             $("#havingRoles" + curTabstaffKind).append($("<option value=\"" + havingRoles[i].ROLE_ID + "\">" + havingRoles[i].ROLE_NAME + "</option>"));
//         }
//         for (var i = 0; i < notHavingRoles.length; i++) {
//             $("#notHavingRoles" + curTabstaffKind).append($("<option value=\"" + notHavingRoles[i].ROLE_ID + "\">" + notHavingRoles[i].ROLE_NAME + "</option>"));
//         }
//         //初始化左右选择控件
//         $('#notHavingRoles' + curTabstaffKind).multiselect({
//             keepRenderingSort: true,
//             right: '#havingRoles' + curTabstaffKind,
//             rightAll: '#rightAll' + curTabstaffKind,
//             rightSelected: '#rightSelected' + curTabstaffKind,
//             leftSelected: '#leftSelected' + curTabstaffKind,
//             leftAll: '#leftAll' + curTabstaffKind,
//             undo: '#notHavingRoles_undo' + curTabstaffKind,
//             search: {
//                 left: '<input type="text" name="q" class="form-control" style="margin-bottom:10px" placeholder="查询待选..." />',
//                 right: '<input type="text" name="q" class="form-control" style="margin-bottom:10px" placeholder="查询已选..." />',
//             },
//             fireSearch: function(value) {
//                 return value.length > 0;
//             }
//         });
//     });

// })



function saveStaffOrgRoles() {
    // debugger;
    //var all = "";
    var result = selectL2R.getResult('#selectL2R-ul').toString();
    var staffOrgId = $("#selectedStaffOrgId").val();
    var obj = { "roleIds": result, "staffOrgId": staffOrgId, "createBy": parent.globalConfig.curStaffId };
    var url = serverPath + "staffs/" + parent.globalConfig.curStaffId + "/staffOrgs/" + staffOrgId + "/staffRoles?t=" + App.timestamp();
    App.formAjaxJson(url, "PUT", JSON.stringify(obj), successCallback);
	function successCallback(result){
		layer.msg("保存成功!");
        $('#roleModal').modal("hide");
	}
    // $.ajax({
    //     "url": serverPath + "/staffs/" + staffId + "/staffOrgs/" + staffOrgId + "/staffRoles",
    //     //    	"data":{'roleIds':all,'staffOrgId':staffOrgId,'createBy':curStaffId},
    //     "type": "PUT",
    //     "contentType": "application/json",
    //     "data": JSON.stringify(obj),
    //     success: function(data) {
    //         returnStaffOrgList();
    //         alert("保存成功！");
    //     },
    //     error: function(e) {
    //         alert("添加失败o_o请重试...");
    //     }
    // })
}

// var curTabstaffKind = $('#curTabstaffKind').val();
// $('#staffOrgLoadPart' + curTabstaffKind).show();
// $('#staffOrgList' + curTabstaffKind).hide();
// $('#selectedStaffOrgId' + curTabstaffKind).val(staffOrgId);
// //	$("#staffBody"+curTabstaffKind).hide();
// //	$("#header"+curTabstaffKind).hide();
// $('#staffOrgLoadPart' + curTabstaffKind).load("../staff/staffOrgRole.html", function() {
//     $("#staffOrgRoleManage").attr("id", "staffOrgRoleManage" + curTabstaffKind);
//     $("#notHavingRoles").attr("id", "notHavingRoles" + curTabstaffKind);
//     $("#havingRoles").attr("id", "havingRoles" + curTabstaffKind);
//     $("#rightAll").attr("id", "rightAll" + curTabstaffKind);
//     $("#rightSelected").attr("id", "rightSelected" + curTabstaffKind);
//     $("#leftSelected").attr("id", "leftSelected" + curTabstaffKind);
//     $("#leftAll").attr("id", "leftAll" + curTabstaffKind);
//     $("#notHavingRoles_undo").attr("id", "notHavingRoles_undo" + curTabstaffKind);
// });
// }

// function returnStaffOrgList() {
//     var curTabstaffKind = $('#curTabstaffKind').val();
//     $("#searchStaffOrgTable" + curTabstaffKind).DataTable().ajax.reload();
//     $('#staffOrgList' + curTabstaffKind).show();
//     $('#staffOrgLoadPart' + curTabstaffKind).empty();
//     $('#staffOrgLoadPart' + curTabstaffKind).hide();
//     $("#staffBody" + curTabstaffKind).hide();
//     $("#header" + curTabstaffKind).hide();
// }
/**
 * 启用/禁用某个岗位
 * @param {岗位id} staffOrgId 
 * @param {组织名称} orgName 
 * @param {状态} staffOrgStatus 
 */
function changeStaffOrgStatus(staffOrgId, orgName, staffOrgStatus) {
    var obj = { "staffOrgId": staffOrgId, "updateBy": parent.globalConfig.curStaffId };
    if ('1' === staffOrgStatus) {
        layer.confirm("确认启用岗位:" + orgName + "吗？", {
            btn: ['启用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
        	App.formAjaxJson(serverPath + 'staffs/' + parent.globalConfig.curStaffId + "/staffOrgStatus/" + staffOrgStatus, "PUT", JSON.stringify(obj), successCallback);
        });
    } else {
        layer.confirm("确认禁用岗位:" + orgName + "吗？", {
            btn: ['禁用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
        	App.formAjaxJson(serverPath + 'staffs/' + parent.globalConfig.curStaffId + "/staffOrgStatus/" + staffOrgStatus, "PUT", JSON.stringify(obj), successCallback);
        });
    }
    function successCallback(result) {
    	var ms = "禁用成功";
		if(staffOrgStatus == 1){
			ms = "启用成功";
		};
		layer.msg(ms);
        $('#searchStaffOrgTable').DataTable().ajax.reload(null, false);
	}
}
/*
 * 新增人员点击事件
 */
function addStaffModal() {
    $("#modal").load("staffInfoModal.html?" + App.timestamp() + " #modalEdit", function() {
        $("#modalTitle").text("新增人员");
        $("#modal").modal("show");
        App.initFormSelect2("#staffForm")
        $("#passwdNotEpmty").show();
        dateRegNameChose();
        validate("add");
    });
}
/*
 * 修改人员点击事件
 */
function goStaffEdit(staffId) {
    $("#modal").load("staffInfoModal.html?" + App.timestamp() + " #modalEdit", function() {
        $("#modalTitle").text("修改人员");
        App.initFormSelect2("#staffForm")
        $("#modal").modal("show");
        getInfor(staffId)
        $("#selectedStaffId").val(staffId);
    });
}
/*
 * 获取人员信息详情
 */
function getInfor(staffId) {
    App.formAjaxJson(parent.globalConfig.serverPath + 'staffs/' + staffId, "get", "", successCallback);

    function successCallback(result) {
        var data = result.data;
        setEditForm(data);
        $('#passwd').val('');
    }
}
/*
 * 填充修改表单
 */
function setEditForm(data) {
    $('#modal').modal('show');
    var valueCallback = { 'hireDate': function(value) { return App.formatDateTime(value, "yyyy-mm-dd") } }
    App.setFormValues("#staffForm", data, valueCallback);
    $("#orgName").attr("title", data.orgName);
    $("#orgNameIn").data("id", data.orgId);
    dateRegNameChose();
    validate("edit");
}

function checkLoginNameFun(){
	var loginName = $('#loginName').val();
	var flag;
	if('' == loginName){
		return;
	}
	App.formAjaxJson(parent.globalConfig.serverPath + "staffs/checkLoginName/" + loginName, "get", "", successCallback, null, null, null, false);
	function successCallback(result) {
		console.log(result.data);
        if (result.data==null) {
            flag=true;
        }else{
        	flag=false;
        }
    };
    return flag;
}

/*
 * 表单验证
 */
function validate(editType) {
    if (editType == "add") {
        $('#staffForm').bootstrapValidator({
            live: 'enabled',
            trigger: 'live focus blur keyup change',
            message: '校验未通过',
            container: 'popover',
            fields: {
                loginName: {
                    validators: {
                        notEmpty: {
                            message: '请输入账号'
                        },
                        stringLength: {
                            min: 0,
                            max: 20,
                            message: '请输入不超过20个字符'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\-\.]+$/,
                            message: '用户名由数字字母-_和.组成'
                        }
                        /*callback: {
                            message: '此账号已存在',
                            callback: function(value, validator, $field) {
                                var flag = true;
                                if (value != "") {
                                    App.formAjaxJson(parent.globalConfig.serverPath + "staffs/checkLoginName/" + value, "get", "", successCallback, null, null, null, false);
                                }

                                function successCallback(result) {
                                    var staffId = $("#selectedStaffId").val();
                                    if (!result.data || result.data.staffId == staffId) {
                                        flag = true;
                                    } else {
                                        flag = false;
                                    }
                                };
                                return flag;
                            }
                        }*/
                    }
                },
                passwd: {
                    validators: {
                        notEmpty: {
                            message: '请输入密码'
                        },
                        stringLength: {
                            min: 5,
                            message: '密码至少5位'
                        }
                    }
                },
                staffName: {
                    validators: {
                        notEmpty: {
                            message: '请输入人员姓名'
                        },
                        stringLength: {
                            min: 0,
                            max: 15,
                            message: '请输入不超过15个字'
                        }
                    }
                },
                orgName: {
                    validators: {
                        notEmpty: {
                            message: '请选择所属组织'
                        }
                    },
                    trigger: "focus blur keyup change",
                },
                empCode: {
                    validators: {
                        regexp: {
                            regexp: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                            message: '请输入15或18位身份证号'
                        }
                    }
                },
                sex: {
                    validators: {
                        notEmpty: {
                            message: '请选择性别'
                        }
                    },
                    trigger: "focus blur keyup change",
                },
                postcode: {
                    validators: {
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '请检查邮政编码'
                        },
                        stringLength: {
                            min: 0,
                            max: 6,
                            message: '请输入不超过6位数字'
                        }
                    }
                },
                mailAddr: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 30,
                            message: '请输入不超过30个字符'
                        }
                    }
                },
                phone: {
                    validators: {
                        regexp: {
                            regexp: /(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]{1}[0-9]{9})/,
                            message: '请检查电话是否正确'
                        }
                    }
                },
                mobilPhone: {
                    validators: {
                        notEmpty: {
                            message: '请输入手机号'
                        },
                        stringLength: {
                            min: 11,
                            max: 11,
                            message: '请输入11位手机号码'
                        },
                        regexp: {
                            regexp: /^1[3|5|7|8]{1}[0-9]{9}$/,
                            message: '请输入正确的手机号码'
                        }
                    }
                },
                email: {
                    validators: {
                        emailAddress: {
                            message: '请检查Email拼写'
                        },
                        stringLength: {
                            min: 0,
                            max: 50,
                            message: '请输入不超过50个字符'
                        }
                    }
                },
                staffSort: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 8,
                            message: '请输入不超过8位数字'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '排序只能输入数字'
                        }
                    }
                }
            }
        }).on('success.form.bv', function(e) {
            e.preventDefault();
            updateInnalPersonnel(editType);
        });
    } else {
        $('#staffForm').bootstrapValidator({
            live: 'enabled',
            trigger: 'live focus blur keyup change',
            message: '校验未通过',
            container: 'popover',
            fields: {
                loginName: {
                    validators: {
                        notEmpty: {
                            message: '请输入账号'
                        },
                        stringLength: {
                            min: 0,
                            max: 20,
                            message: '请输入不超过20个字符'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\-\.]+$/,
                            message: '用户名由数字字母-_和.组成'
                        }
                    }
                },
                passwd: {
                    validators: {
                        stringLength: {
                            min: 5,
                            message: '密码至少5位'
                        }
                    }
                },
                staffName: {
                    validators: {
                        notEmpty: {
                            message: '请输入人员姓名'
                        },
                        stringLength: {
                            min: 0,
                            max: 15,
                            message: '请输入不超过15个字'
                        }
                    }
                },
                orgName: {
                    validators: {
                        notEmpty: {
                            message: '请选择所属组织'
                        }
                    },
                    trigger: "focus blur keyup change",
                },
                empCode: {
                    validators: {
                        regexp: {
                            regexp: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
                            message: '请输入15或18位身份证号'
                        }
                    }
                },
                sex: {
                    validators: {
                        notEmpty: {
                            message: '请选择性别'
                        }
                    },
                    trigger: "focus blur keyup change",
                },
                postcode: {
                    validators: {
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '请检查邮政编码'
                        },
                        stringLength: {
                            min: 0,
                            max: 6,
                            message: '请输入不超过6位数字'
                        }
                    }
                },
                mailAddr: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 30,
                            message: '请输入不超过30个字符'
                        }
                    }
                },
                phone: {
                    validators: {
                        regexp: {
                            regexp: /(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]{1}[0-9]{9})/,
                            message: '请检查电话是否正确'
                        }
                    }
                },
                mobilPhone: {
                    validators: {
                        notEmpty: {
                            message: '请输入手机号'
                        },
                        stringLength: {
                            min: 11,
                            max: 11,
                            message: '请输入11位手机号码'
                        },
                        regexp: {
                            regexp: /^1[3|5|7|8]{1}[0-9]{9}$/,
                            message: '请输入正确的手机号码'
                        }
                    }
                },
                email: {
                    validators: {
                        emailAddress: {
                            message: '请检查Email拼写'
                        },
                        stringLength: {
                            min: 0,
                            max: 50,
                            message: '请输入不超过50个字符'
                        }
                    }
                },
                staffSort: {
                    validators: {
                        stringLength: {
                            min: 0,
                            max: 8,
                            message: '请输入不超过8位数字'
                        },
                        regexp: {
                            regexp: /^[0-9]+$/,
                            message: '排序只能输入数字'
                        }
                    }
                }
            }
        }).on('success.form.bv', function(e) {
            e.preventDefault();
            updateInnalPersonnel(editType);
        });
    }
}

//日期和组织树选择触发
function dateRegNameChose() {
    if ($.fn.datepicker) {
        $.fn.datepicker.defaults.format = 'yyyy-mm-dd';
        $.fn.datepicker.defaults.language = 'zh-CN';
        $.fn.datepicker.defaults.autoclose = true;
        $('.date-picker').datepicker({
            format: "yyyy-mm-dd"
        });
    };
    $("#orgNameIn").on("click", function() {
        showTree('orgNameIn');
    });
    App.formAjaxJson(parent.globalConfig.serverPath + "orgs/" + parent.globalConfig.curCompanyId + "/orgTree", "get", "", successCallback);

    function successCallback(result) {
        var data = result.data;
        if (null == data) {
            layer.msg("没有相关组织和人员信息", { icon: 2 });
        } else {
            orgNameTree = $.fn.zTree.init($("#orgName"), orgsSetting, data);
        }
    }
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
        width: selectObj.outerWidth() + (dom == "orgNameIn" ? 40 : 120)
    }).slideDown("fast");
    onBodyDown(dom);
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
 * ztree点击事件
 */
function onClick(event, treeId, treeNode) {
    var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
    var selectName = nodes[0].orgName;
    var selectId = nodes[0].orgId;
    $("input[name=" + treeId + "]").data("id", selectId);
    $("input[name=" + treeId + "]").val(selectName);
    $("input[name=" + treeId + "]").attr("title", selectName);
    if (treeId == "orgName") {
        $("#staffForm").data("bootstrapValidator").updateStatus("orgName", "NOT_VALIDATED", null);
        $("#staffForm").data("bootstrapValidator").validateField('orgName');
    }
}
/*
 * ztree异步加载之前
 */
function zTreeBeforeAsync(treeId, treeNode) {
    if (treeId == "organisationTree") {
        organisationTree.setting.async.url = parent.globalConfig.serverPath + "orgs/" + treeNode.orgId + "/children";
    } else if (treeId == "orgName") {
        orgNameTree.setting.async.url = parent.globalConfig.serverPath + "orgs/" + treeNode.orgId + "/children";
    }
    return true;
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
 * 隐藏所属组织树
 */
function hideMenu(dom) {
    $("#" + dom + "Content").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
/*
 * 新增||修改提交
 */
function updateInnalPersonnel(editType) {
	var formObj = App.getFormValues($("#staffForm"));
    var ms = "新增成功";
    var url = parent.globalConfig.serverPath + "staffs/addStaff";
    var pushType = "POST";
    if (editType == "add") {
    	if(!checkLoginNameFun()){
    		layer.alert("此账号已存在！", {
                icon: 0,
                skin: 'layer-ext-moon'
           	});
			return;
    	}
        formObj.createBy = parent.globalConfig.curStaffId;
        formObj.updateBy = parent.globalConfig.curStaffId;
        formObj.orgId = $("#orgNameIn").data("id");
        formObj.staffKind = 1;
        delete formObj.staffId;
    } else {
        formObj.updateBy = parent.globalConfig.curStaffId;
        formObj.orgId = $("#orgNameIn").data("id");
        ms = "修改成功";
        url = parent.globalConfig.serverPath + "staffs/updateStaff";
        pushType = "PUT";
    }
    App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback, improperCallbacks);

    function successCallback(result) {
        layer.msg(ms, { icon: 1 });
        searchPersonnel(false);
        $('#modal').modal('hide');
    }

    function improperCallbacks(result) {
        $('#staffForm').data('bootstrapValidator').resetForm();
    }
}
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
/*
 * 条件查询查询组织
 */
function getStaffSearch_OrgTree(obj) {
    selectOrgTree('staffSearch_OrgTree', obj, parent.globalConfig.curCompanyId, getStaffSearch_OrgTreeId, '', '1', '400', '300');

    function getStaffSearch_OrgTreeId(orgId, orgName, orgCode) {
        $("input[name='orgName']", $('#searchStaffForm')).val(orgName);
        $("input[name='orgId']", $('#searchStaffForm')).val(orgId);
    }
}


/**
 * 跳转新增岗位modal
 * @param staffId
 * @returns
 */
function goAddStaffOrg(staffId) {
    $("#modal").load("addStaffOrgModal.html?" + App.timestamp() + " #modalAddSO", function() {
        $("#modalTitle").text("新增岗位");
        //App.initFormSelect2("#addStaffOrgForm");
        $("#modal").modal("show");
        $("input[name='staffId']", $('#addStaffOrgForm')).val(staffId);
        $('#addStaffOrgForm').bootstrapValidator({
            live: 'enabled',
            trigger: 'live focus blur keyup change',
            message: '校验未通过',
            container: 'popover',
            fields: {
                orgName: {
                    validators: {
                        notEmpty: {
                            message: '请选择所属组织'
                        },
                        // staffOrgCheck: {
                        //     message: '在该组织下已有岗位信息'
                        // }
                        callback: {
                            message: '在该组织下已有岗位信息',
                            callback: function(value, validator, $field) {
                                var flag = true;
                                if (value != "") {
                                    var url = parent.globalConfig.serverPath + "staffs/staffOrgOrgId";
                                    var staffId = $("input[name='staffId']", $('#addStaffOrgForm')).val();
                                    var staffOrgId = $("input[name='staffOrgId']", $('#addStaffOrgForm')).val();
                                    var orgId = $("input[name='orgId']", $('#addStaffOrgForm')).val();
                                    App.formAjaxJson(url, 'GET', { 'staffId': staffId, 'orgId': orgId, 'staffOrgId': staffOrgId }, successCallback, null, null, null, false);
                                }

                                function successCallback(result) {
                                    var staffOrgId = result.data ? result.data.staffOrgId : null;
                                    if (staffOrgId) { //已存在岗位
                                        flag = false;
                                    } else {
                                        flag = true;
                                    }
                                }
                                return flag;
                            }
                        }
                    }
                }
            }
        }).on('success.form.bv', function(e) {
            e.preventDefault();
            addStaffOrg('add');
        });
    });
}

/**
 * 跳转权限配置modal
 * @param staffOrgId
 * @returns
 */
function permissionConfiguration(staffOrgId) {
    $("#modal").load("permissionConfigurationModal.html?" + App.timestamp() + " #modalPermission", function() {
        $("#modalTitle").text("数据权限配置");
        $("#modalStaffOrgId").val(staffOrgId);
        //$("#modal").modal("show");
        getPermission(staffOrgId);
        var dataPermType = $("input[name='dataPermType']:checked").val();
	});
}
//获取配置信息
function getPermission(staffOrgId){
    App.formAjaxJson(parent.globalConfig.serverPath +'staffs/staffOrgId' + staffOrgId, "get", "", successCallback);
    function successCallback(result) {
        var data = result.data;
        if(data){
        	if(data.hasOwnProperty("data_perm_type")){
	        	$("input[name='dataPermType'][value='"+data.data_perm_type+"']").attr("checked","checked");
	        	$("#saveradio2").removeClass("hide");
	        	$("#saveradio1").addClass("hide");
	        }
        }
		$("#modal").modal("show");
    }
}
//权限配置保存
function savePermission1(){
	var dataPermType = $("input[name='dataPermType']:checked").val();
	var createdBy = parent.globalConfig.curStaffId;
	var updatedBy = parent.globalConfig.curStaffId;
	var staffOrgId = $("#modalStaffOrgId").val();
    var obj = { "staffOrgId": staffOrgId, "dataPermType":dataPermType,"createdBy":createdBy,"updatedBy":updatedBy};
    var url = parent.globalConfig.serverPath + "staffs/addPermission";
    App.formAjaxJson(url, "POST", JSON.stringify(obj), successCallback);
	function successCallback(result){
		layer.msg("配置成功!");
        $('#modal').modal("hide");
	}
}
function savePermission2(){
	var dataPermType = $("input[name='dataPermType']:checked").val();
	var updatedBy = parent.globalConfig.curStaffId;
	var staffOrgId = $("#modalStaffOrgId").val();
    var obj = { "staffOrgId": staffOrgId, "dataPermType":dataPermType,"updatedBy":updatedBy};
    var url = parent.globalConfig.serverPath + "staffs/updatePermission";
    App.formAjaxJson(url, "PUT", JSON.stringify(obj), successCallback);
	function successCallback(result){
		layer.msg("配置成功!");
        $('#modal').modal("hide");
	}
}

/*
 * 新增岗位选择组织
 * 
 */
function addStaffOrg_OrgTree(obj) {
    //selectOrgTree('staffOrgAdd_OrgTree', obj, parent.globalConfig.curCompanyId, addStaffOrg_Callback, '', '1', '400', '300');
    //196606 为中国联通
    selectOrgTree('staffOrgAdd_OrgTree', obj, 196606, addStaffOrg_Callback, '', '1', '400', '300');

    function addStaffOrg_Callback(orgId, orgName, orgCode) {
        $("input[name='orgName']", $('#addStaffOrgForm')).val(orgName);
        $("input[name='orgId']", $('#addStaffOrgForm')).val(orgId);
        var staffId = $("input[name='staffId']", $('#addStaffOrgForm')).val();
        var staffOrgId = $("input[name='staffOrgId']", $('#addStaffOrgForm')).val();
        var orgId = $("input[name='orgId']", $('#addStaffOrgForm')).val();
        //手动触发orgName字段的验证
        $("#addStaffOrgForm").data("bootstrapValidator").revalidateField('orgName');
    }
}
/*
 * 新增||修改岗位提交
 */
function addStaffOrg(editType) {
    //debugger;
    var formObj = App.getFormValues($("#addStaffOrgForm"));
    var ms = "新增成功";
    var url = parent.globalConfig.serverPath + "staffs/" + parent.globalConfig.curStaffId + "/staffOrg/";
    var pushType = "POST";
    if (editType == "add") {
        formObj.createBy = parent.globalConfig.curStaffId;
        formObj.updateBy = parent.globalConfig.curStaffId;
    } else {
        formObj.updateBy = parent.globalConfig.curStaffId;
        ms = "修改成功";
        pushType = "PUT";
    }
    App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback, improperCallbacks);

    function successCallback(result) {
        layer.msg(ms, { icon: 1 });
        searchPersonnel(true);
        $('#modal').modal('hide');
    }

    function improperCallbacks(result) {
        $('#addStaffOrgForm').data('bootstrapValidator').resetForm();
    }

}
/*
 * 跳转角色复制
 */
function goStaffOrgRoleCopy(staffOrgId) {
    $("#roleCopyFrom").val(staffOrgId);
    App.getCommonModal("staff", "#", "orgName", ["staffId", "staffOid"]);
}

function goDelStaffOrg(staffId, staffOrgId) {
    layer.confirm('确定删除该借调岗位吗？', {
        btn: ['确认', '取消'],
        icon: 0,
        skin: 'layer-ext-moon'
    }, function() {
    	App.formAjaxJson(serverPath + 'staffs/' + staffId + '/staffOrg/' + staffOrgId, "DELETE", null, successCallback);

	    function successCallback(result) {
			layer.alert("删除成功！", {icon: 0});
            searchPersonnel(true);
		}
    });
}

/**
 * 跳转编辑岗位modal
 * @param staffId
 * @param staffOrgId
 * @returns
 */
function goEditStaffOrg(staffId, staffOrgId) {
    $("#modal").load("addStaffOrgModal.html?" + App.timestamp() + " #modalAddSO", function() {
        $("#modalTitle").text("修改岗位");
        App.initFormSelect2("#addStaffOrgForm");
        $("#modal").modal("show");
        $("input[name='staffId']", $('#addStaffOrgForm')).val(staffId);
        $("input[name='staffOrgId']", $('#addStaffOrgForm')).val(staffOrgId);
        App.formAjaxJson(parent.globalConfig.serverPath + "staffs/" + staffId + '/staffOrg/' + staffOrgId, "get", "", successCallback);

        function successCallback(result) {
            debugger;
            var data = result.data;
            if (null == data) {
                layer.msg("没有查到岗位信息", { icon: 2 });
            } else {
                App.setFormValues("#addStaffOrgForm", data, '');
            }
        }
        $('#addStaffOrgForm').bootstrapValidator({
            live: 'enabled',
            trigger: 'live focus blur keyup change',
            message: '校验未通过',
            container: 'popover',
            fields: {
                orgName: {
                    validators: {
                        notEmpty: {
                            message: '请选择所属组织'
                        },
                        callback: {
                            message: '该组织下已有其他类型岗位',
                            callback: function(value, validator, $field) {
                                var staffId = $("input[name='staffId']", $('#addStaffOrgForm')).val();
                                var staffOrgId = $("input[name='staffOrgId']", $('#addStaffOrgForm')).val();
                                var orgId = $("input[name='orgId']", $('#addStaffOrgForm')).val();
                                var flag = true;
                                if (value != "") {
                                    var url = parent.globalConfig.serverPath + "staffs/staffOrgOrgId";
                                    App.formAjaxJson(url, 'GET', { 'staffId': staffId, 'orgId': orgId, 'staffOrgId': staffOrgId }, successCallback, null, null, null, false);
                                }

                                function successCallback(result) {
                                    var staffOrgId = result.data ? result.data.staffOrgId : null;
                                    if (staffOrgId) { //已存在岗位
                                        flag = false;
                                    } else {
                                        flag = true;
                                    }
                                };
                                return flag;
                            }
                        }
                    },
                    trigger: "focus blur keyup change",
                }
            }
        }).on('success.form.bv', function(e) {
            e.preventDefault();
            addStaffOrg('edit');
        });
    });
}