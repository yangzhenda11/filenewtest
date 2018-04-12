$(function() {
    //根据当前登录人的岗位id查询其组织id
    //var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
    //	debugger;
    App.initDataTables('#staffSearchTable', "#searchBtn", {
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
        },
        "columns": [ // 对应列
            {
                "data": null,
                className: "text-center",
                title: "操作",
                render: function(a, b, c, d) {
                	if(c) {
						var btnArray = new Array();
	                    btnArray.push({ "name": "查看", "fn": "showStaffDetail(\'" + c.STAFF_ID + "\')" });
                       	btnArray.push({ "name": "岗位管理", "fn": "orgManage(\'" + c.STAFF_ID + "','" + c.STAFF_NAME + "\')" });
                        btnArray.push({ "name": "密码重置", "fn": "resetPasswd(\'" + c.STAFF_ID + "','" + c.STAFF_NAME + "\')" });
                        if ("1" == c.STAFF_STATUS) {
                        	btnArray.push({ "name": "禁用", "fn": "changeStaffStatus(\'" + c.STAFF_ID + "','" + c.STAFF_NAME + "','" + c.ORG_NAME + "',0)" });
	                        
	                    } else {
	                    	btnArray.push({ "name": "启用", "fn": "changeStaffStatus(\'" + c.STAFF_ID + "','" + c.STAFF_NAME + "','" + c.ORG_NAME + "',1)" });
	                    }
	                    context = {
	                        func: btnArray
	                    }
	                    var template = Handlebars.compile(btnModel);
	                    var html = template(context);
	                    return html;
					} else {
						return '';
					}
                    return html;
                }
            },
            { "data": "STAFF_NAME", "title": "人员姓名", },
            { "data": "LOGIN_NAME", "title": "账号",  },
            { "data": "ORG_NAME", "title": "岗位",},
            {
                "data": "SEX",
                "title": "性别",
                render: function(a, b, c, d) {
                    return (c.SEX == 'M') ? '男' : '女';
                }
            },
            // { "data": "PHONE", "title": "电话号码", className: "text-center" },
            { "data": "EMAIL", "title": "邮箱账号",},
            { "data": "MOBIL_PHONE", "title": "手机号码",},
            {
                "data": "STAFF_STATUS",
                "title": "状态",
                render: function(a, b, c, d) {
                    return ('1' == c.STAFF_STATUS) ? '有效' : '无效';
                }
            }
        ],
        "fixedColumns": {
            'leftColumns': 2
        },
    });
   
});



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
                    searchStaff(true);
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
                    searchStaff(true);
                }
            });
        });
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
                return getFormatDate(new Date(data), "yyyy-MM-dd");
            }

            function statusCallback(data) {
                return data == '1' ? '有效' : '无效';
            }

            function sexCallback(data) {
                return data == 'W' ? '女' : '男';
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
function orgManage(staffId, staffName) {
    // var curTabstaffKind = $('#curTabstaffKind').val();
    $("#divStaffList").hide();
    //debugger;
    $('#staffLoadPart').load("staffOrgList.html", function() {
        // $('#staffOrgList').attr("id", "staffOrgList" + curTabstaffKind);
        // $('#searchStaffOrgTable').attr("id", "searchStaffOrgTable" + curTabstaffKind);
        // $('#selectedStaffOrgId').attr("id", "selectedStaffOrgId" + curTabstaffKind);
        // $('#staffOrgLoadPart').attr("id", "staffOrgLoadPart" + curTabstaffKind);
        // $('#staffManageTitle').attr("id", "staffManageTitle" + curTabstaffKind);
        $('#staffManageTitle').text(staffName + "的岗位操作");
        $('#staffLoadPart').show();
        App.initDataTables('#searchStaffOrgTable',  {
	        ajax: {
	            "type": "GET",
	            "url": parent.globalConfig.serverPath + 'staffs/' + staffId + '/staffOrgs'
	        },
	        "columns": [ // 对应列
	            {
	                "data": null,
	                className: "text-center",
	                title: "操作",
	                render: function(a, b, c, d) {
	                	if(c) {
							var btnArray = new Array();
		                    btnArray.push({ "name": "角色管理", "fn": "staffOrgRoleManage(\'" + c.STAFF_ORG_ID + "','" + c.ORG_NAME + "\')" });
		                    if ("1" == c.STAFF_ORG_STATUS) {
		                       	btnArray.push({ "name": "禁用", "fn": "changeStaffOrgStatus(\'" + c.STAFF_ORG_ID + "\',\'" + c.ORG_NAME + "\',\'0\')" });
		                    } else {
		                        btnArray.push({ "name": "启用", "fn": "changeStaffOrgStatus(\'" + c.STAFF_ORG_ID + "\',\'" + c.ORG_NAME + "\',\'1\')" });
		                    }
		                    context = {
		                        func: btnArray
		                    }
		                    var template = Handlebars.compile(btnModel);
		                    var html = template(context);
		                    return html;
						} else {
							return '';
						} 
	                }
	            }, {
	                "data": "STAFF_ORG_TYPE",
	                "title": "岗位类型",
	                className: "text-center",
	                render: function(a, b, c, d) {
	                    if ('F' == c.STAFF_ORG_TYPE) {
	                        return '主岗';
	                    } else if ('T' == c.STAFF_ORG_TYPE) {
	                        return '兼职';
	                    } else {
	                        return '借调';
	                    }
	                }
	            },
	            { "data": "ORG_NAME", "title": "组织名称", className: "text-center" },
	            {
	                "data": "STAFF_ORG_STATUS",
	                "title": "岗位状态",
	                className: "text-center",
	                render: function(a, b, c, d) {
	                    if ('1' == c.STAFF_ORG_STATUS) {
	                        return '有效';
	                    } else {
	                        return '无效';
	                    }
	                }
	            },
	            {
	                "data": "HIRE_DATE",
	                "title": "录用时间",
	                className: "text-center",
	                render: function(a, b, c, d) {
	                    return c.HIRE_DATE ? new Date(c.HIRE_DATE).format("yyyy-MM-dd") : '';
	                }
	            },
	            {
	                "data": "EFFECT_START_DATE",
	                "title": "生效时间",
	                className: "text-center",
	                render: function(a, b, c, d) {
	                    return c.EFFECT_START_DATE ? new Date(c.EFFECT_START_DATE).format("yyyy-MM-dd") : '';
	                }
	            },
	            {
	                "data": "EFFECT_END_DATE",
	                "title": "失效时间",
	                className: "text-center",
	                render: function(a, b, c, d) {
	                    return c.EFFECT_END_DATE ? new Date(c.EFFECT_END_DATE).format("yyyy-MM-dd") : '';
	                }
	            },
	            { "data": "DUTY", "title": "职责", className: "text-center" }
	        ],
	        "fixedColumns": {
                'leftColumns': 2
            }
		});
	})
}
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
    $.ajax({ //提交服务端
        "type": "PUT",
        "url": parent.globalConfig.serverPath + "staffs/" + parent.globalConfig.curStaffId + "/staffOrgs/" + staffOrgId + "/staffRoles?t=" + App.timestamp(),
        "contentType": "application/json",
        "data": JSON.stringify(obj),
        success: function(data) {
            layer.alert("保存成功", {
                icon: 0,
                skin: 'layer-ext-moon'
            });
            $('#roleModal').modal("hide");
        }
    });
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
            $.ajax({ //提交服务端
                "type": "PUT",
                "url": parent.globalConfig.serverPath + 'staffs/' + parent.globalConfig.curStaffId + "/staffOrgStatus/" + staffOrgStatus,
                "data": JSON.stringify(obj),
                "contentType": "application/json",
                success: function(data) {
                    layer.alert("启用成功", {
                        icon: 0,
                        skin: 'layer-ext-moon'
                    });
                    $('#searchStaffOrgTable').DataTable().ajax.reload(null, false);
                }
            });
        });
    } else {
        layer.confirm("确认禁用岗位:" + orgName + "吗？", {
            btn: ['禁用', '取消'],
            icon: 0,
            skin: 'layer-ext-moon'
        }, function() {
            $.ajax({ //提交服务端
                "type": "PUT",
                "url": parent.globalConfig.serverPath + 'staffs/' + parent.globalConfig.curStaffId + "/staffOrgStatus/" + staffOrgStatus,
                "data": JSON.stringify(obj),
                "contentType": "application/json",
                success: function(data) {
                    layer.alert("禁用成功", {
                        icon: 0,
                        skin: 'layer-ext-moon'
                    });
                    $('#searchStaffOrgTable').DataTable().ajax.reload(null, false);
                }
            });
        });
    }
}