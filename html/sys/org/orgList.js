$(function() {
    //根据当前登录人的岗位id查询其组织id
    var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
    //	debugger;
    gerOrgIdByStaffOrgId(curStaffOrgId1, function() {
        App.initDataTables('#orgSearchTable', {
            "serverSide": true, //开启服务器请求模式
            buttons: ['copy', 'colvis'], //显示的工具按钮
            ajax: {
                "type": "GET",
                "url": parent.globalConfig.serverPath + 'orgs/', //请求路径
                "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
                "dataType": "json",
                "data": function(d) { // 查询参数
                    d.orgKind = "1";
                    d.orgName = $("input[name='orgName']", $("#orgSearchForm")).val();
                    d.orgCode = $("input[name='orgCode']", $("#orgSearchForm")).val();
                    d.orgType = $("select[name='orgType']", $("#orgSearchForm")).val();
                    d.orgStatus = $("select[name='orgStatus']", $("#orgSearchForm")).val();
                    d.orgId = $("#orgCurOrgId").val();
                    return d;
                },
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
                        html += "<button title=\"查看\" onclick=\"orgShowOrgDetail('" + c.ORG_ID + "')\" class=\"btn btn-info btn-link btn-xs\"><i class=\"fa fa-search-plus\"></i></button>";
                        // html += "<button title=\"修改\" onclick=\"orgUpdate('" + c.ORG_ID + "')\" class=\"btn btn-info btn-link btn-xs\"><i class=\"fa fa-edit\"></i></button>";
                        if ("1" == c.ORG_STATUS) {
                            html += '<button title="禁用" onclick="orgDel(' + c.ORG_ID + ')" class="btn btn-success btn-link btn-xs"><i class="fa fa-close"></i></button>';
                        } else {
                            html += '<button title="启用" onclick="orgRe(' + c.ORG_ID + ')" class="btn btn-success btn-link btn-xs"><i class="fa fa-check"></i></button>';
                        }
                        return html;
                    }
                },
                {
                    "data": "ORG_NAME",
                    title: "组织名称",
                    className: "text-center"
                },
                { "data": "ORG_CODE", title: "组织编码", className: "text-center" },
                {
                    "data": "ORG_TYPE",
                    "title": "组织类型",
                    className: "text-center",
                    render: function(data, type, full) {
                        var value;
                        if (data == 1) {
                            value = "公司";
                        } else if (data == 2) {
                            value = "部门";
                        } else if (data == 3) {
                            value = "处室";
                        } else if (data == 4) {
                            value = "虚拟组织";
                        }
                        return value;
                    }
                },
                {
                    "data": "ORG_STATUS",
                    "title": "状态",
                    className: "text-center",
                    render: function(data, type, full) {
                        var value;
                        if (data == 1) {
                            value = "有效";
                        } else if (data == 0) {
                            value = "无效";
                        }
                        return value;
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
});

/**
 * 根据查询条件，查询组织列表
 * @returns 
 * @author cuiy 2017/7/14
 */
function orgSearchOrg(resetPaging) {
    startLoading("#searchBtn");
    var table = $('#orgSearchTable').DataTable();
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
    stopLoading("#searchBtn");
    return resolveResult(result);
}

function orgShowOrgDetail(itemId) {
    App.formAjaxJson(parent.globalConfig.serverPath + "orgs/" + itemId, "GET", null, ajaxSuccess, null, ajaxError);
    /**成功回调函数 */
    function ajaxSuccess(result) {
        /**根据返回结果给表单赋值 */
        App.setFindValue($("#orgDetail"), result.data, { 'orgStatus': function(value) { return value == '1' ? "有效" : "无效" }, "orgType": orgTypeCallback });
        /**表单赋值时的回调函数 */
        function orgTypeCallback(data) {
            var value;
            if (data == 1) {
                value = "公司";
            } else if (data == 2) {
                value = "部门";
            } else if (data == 3) {
                value = "处室";
            } else if (data == 4) {
                value = "虚拟组织";
            }
            return value;
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
 * 根据组织id禁用组织
 * @author wangwj 2018-3-20
 */
function orgDel(orgId) {
    layer.confirm('确定要将其禁用吗', {
        btn: ['禁用', '取消'],
        icon: 0,
        skin: 'layer-ext-moon'
    }, function() {
        $.ajax({ //提交服务端
            url: parent.globalConfig.serverPath + 'orgs/' + orgId,
            type: "DELETE",
            success: function(data) {
                layer.alert('禁用成功', {
                    icon: 0,
                    skin: 'layer-ext-moon'
                });
                // $('#_frm_confirm_modal').modal('hide');
                orgSearchOrg(false);
            }
        });
    });
}


/**
 * 根据组织id回复组织状态
 * @author cuiy 2017/9/5
 */
function orgRe(orgId) {
    layer.confirm('确定要将其启用吗', {
        btn: ['启用', '取消'],
        icon: 0,
        skin: 'layer-ext-moon'
    }, function() {
        $.ajax({ //提交服务端
            url: parent.globalConfig.serverPath + 'orgs/' + orgId + "/orgStatus/?" + App.timestamp(),
            type: "PUT",
            contentType: "application/json",
            success: function(data) {
                layer.alert('启用成功', {
                    icon: 0,
                    skin: 'layer-ext-moon'
                });
                // $('#_frm_confirm_modal').modal('hide');
                orgSearchOrg(false);
            }
        });
    });
}



// $(function() {
//     //根据当前登录人的岗位id查询其组织id
//     var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
//     //	debugger;
//     gerOrgIdByStaffOrgId(curStaffOrgId1);
//     //将当前tab的orgKind值设为1
//     $("#curTaborgKind").val("1");
//     //查询数据库中所有组织种类，生成tab页
//     searchAllOrgKind();
// });

/**
 * 查询所有组织种类,并且创建组织管理页面中的各个组织种类的tao页的li
 * @returns allKind 查询到的所有组织种类
 * @author cuiy 2017/7/10
 */
// function searchAllOrgKind() {
//     var allKind = new Array();
//     $.ajax({
//         url: parent.globalConfig.serverPath + "orgs/orgKind",
//         type: "GET",
//         success: function(data) {
//             if ("1" == data.status) {
//                 allKind = data.data;
//                 if (0 < allKind.length) {
//                     creatKindTab(allKind);
//                 }

//             } else {
//                 alert("组织种类查询失败");
//             }

//         }
//     });
// }

/**
 * 创建组织管理页面中的各个组织种类的tao页的li
 * @returns allKind 查询到的所有组织种类
 * @author cuiy 2017/7/11
 */
function creatKindTab(allKind) {
    var allOrgKind = new Array();
    for (i = 0; i < allKind.length; i++) {
        allOrgKind.push(allKind[i].DICT_VALUE);
        if (0 == i) {
            $("#orgMyTab").append('<li class="active">' +
                '<a id="orgAnchor' + allKind[i].DICT_VALUE + '" href="#orgTabOrg' + allKind[i].DICT_VALUE + '" data-toggle="tab" onclick="getOrgObj(this)">' + allKind[i].DICT_LABEL + '</a>' +
                '</li>');
            $("#orgKindTab").append('<div class="body tab-pane fade active in" role="tabpanel" id="orgTabOrg' + allKind[i].DICT_VALUE + '">' + '</div>');

        } else {
            $("#orgMyTab").append(
                '<li>' +
                '<a id="orgAnchor' + allKind[i].DICT_VALUE + '" href="#orgTabOrg' + allKind[i].DICT_VALUE + '" data-toggle="tab" onclick="getOrgObj(this)">' + allKind[i].DICT_LABEL + '</a>' +
                '</li>');
            $("#orgKindTab").append('<div class="body tab-pane fade" role="tabpanel" id="orgTabOrg' + allKind[i].DICT_VALUE + '">' + '</div>');
        }
        loadOrgKindTab(allKind[i].DICT_VALUE);
    }
    $("#orgMyTabContent").append('<input type="hidden" id="allOrgKind" value="' + allOrgKind + '"/>');
}
/**
 * 组织类别tab中的a标签的点击事件，
 * 在点击时获取当前点击a标签的id，
 * 通过这个a标签的id来获取当前展示的tab的组织种类
 * @param obj 当前点击的a标签的这个对象
 * @returns 将当前展示tab的组织种类值存在id为curTaborgKind的input隐藏域
 * @author cuiy 2017/7/12
 */
function getOrgObj(obj) {
    //获取当前点击按标签的id属性值
    var aId = obj.id;
    //从id属性值上截取出orgKind值
    var curTabOrgKind = aId.substring(9, aId.length);
    $("#curTaborgKind").val(curTabOrgKind);
    $("#orgSearchTableDiv" + curTabOrgKind).load("../org/table.html");
    orgReset();
}

/**
 * 根据当前登录人的岗位id,查询其组织id
 * @returns staffOrgId 岗位id
 * @author cuiy 2017/7/13
 */
function gerOrgIdByStaffOrgId(curStaffOrgId2, callback) {
    var staffOrgId = curStaffOrgId2;
    $.ajax({
        url: parent.globalConfig.serverPath + "staffOrgs/" + staffOrgId + "/Org",
        type: "GET",
        async: false,
        success: function(data) {
            if (null != data.data) {
                orgId = data.data.orgId;
                $("#orgCurOrgId").val(orgId);
                if (callback) {
                    callback();
                }
            } else {
                console.log("组织id查询失败");
            }

        }
    });
}

/**
 * 加载组织tab页
 * @param val 当前组织类型
 * @returns
 */
function loadOrgKindTab(val) {
    $("#orgTabOrg" + val).load("../org/orgKindTab.html", function() {
        //加载组织tab页后，动态修改各元素id
        $("#orgTabOrg" + val).append('<input type="hidden" id="orgKind' + val + '" value="' + val + '"/>');
        $("#orgSearchTableDiv").attr("id", "orgSearchTableDiv" + val);
        $("#orgSearchForm").attr("id", "orgSearchForm" + val);
        $("#orgDetailModalPart").attr("id", "orgDetailModalPart" + val);
        //在tab页中load列表datatable
        $("#orgSearchTableDiv" + val).load("../org/table.html");
    });
}
/**
 * 返回组织列表页
 * @returns
 */
function orgAddBack() {
    var curTabOrgKind = $('#curTaborgKind').val();
    loadOrgKindTab(curTabOrgKind);
}