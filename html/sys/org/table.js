//datatable对象
var searchOrgTable;

var btnModel = '    \
	{{#each func}}\
    <button type="button" title="{{this.title}}" class="{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);

//datatable配置对象
var dataTableConfig = {
    "ordering": false, // 排序
    "serverSide": true, // 开启服务器模式
    "paging": true,
    "searching": false,
    "scrollX": true, //横向滚动
    "autoWidth": false,
    destroy: true,
    "dom": 'rt<"floatl mt5"l><"floatl mt4"i><"floatr mt5"p><"clear">', //生成样式
    // "lengthMenu": [
    //         menuLength,
    //         menuLength
    //     ],
    ajax: {
        "type": "GET",
        "url": parent.globalConfig.serverPath + 'orgs/', //请求路径
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType": "json",
    },
    columns: [ // 对应列
        {
            "data": null,
            className: "text-center",
            render: function(a, b, c, d) {
                var context;
                if ("1" == c.ORG_STATUS) {
                    context = {
                        func: [{
                            "name": "修改",
                            "fn": "orgUpdate(\'" + c.ORG_ID + "','" + c.ORG_NAME + "','" + c.ORG_CODE + "','" + c.ORG_TYPE + "','" + c.ORG_STATUS + "','" + c.PARENT_CODE + "','" + c.PARENT_ID + "','" + c.PARENT_NAME + "\')",
                            "type": "user-button",
                            "title": "hhahahahahahaah"
                        }, {
                            "name": "禁用",
                            "fn": "orgDel('" + c.ORG_ID + "')",
                            "type": "user-button user-btn-n"
                        }]
                    };
                } else {
                    context = {
                        func: [{
                            "name": "修改",
                            "fn": "orgUpdate(\'" + c.ORG_ID + "','" + c.ORG_NAME + "','" + c.ORG_CODE + "','" + c.ORG_TYPE + "','" + c.ORG_STATUS + "','" + c.PARENT_CODE + "','" + c.PARENT_ID + "','" + c.PARENT_NAME + "\')",
                            "type": "user-button",
                            "title": "hhahahahahahaah"
                        }, {
                            "name": "启用",
                            "fn": "orgRe('" + c.ORG_ID + "')",
                            "type": "user-button user-btn-n"
                        }]
                    };
                }


                var html = template(context);
                return html;
            }
        },
        {
            "data": "ORG_NAME",
            className: "text-center",
            render: function(a, b, c, d) {
                return "<a href=\"javascript:orgShowOrgDetail('" + c.ORG_ID + "')\">" + a + "</a>";
            }
        },
        { "data": "ORG_CODE", className: "text-center" },
        {
            "data": "ORG_TYPE",
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
    }]
};



$(function() {
    //获取当前tab的组织类型
    var curTabOrgKind = $('#curTaborgKind').val();
    $("#OrgSearchTable").attr("id", "OrgSearchTable" + curTabOrgKind);
    dataTableConfig.ajax.data = function(d) { // 查询参数
        d.orgKind = $("#curTaborgKind").val();
        d.orgName = $("input[name='orgName']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgCode = $("input[name='orgCode']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgType = $("select[name='orgType']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgStatus = $("select[name='orgStatus']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgId = $("#orgCurOrgId").val();
        return d;
    };
    //
    $("#OrgSearchTable" + curTabOrgKind).dataTable().fnDestroy();
    searchOrgTable = $("#OrgSearchTable" + curTabOrgKind).DataTable(dataTableConfig);
});

/**
 * 根据查询条件，查询组织列表
 * @returns 
 * @author cuiy 2017/7/14
 */
function orgSearchOrg() {
    debugger;
    var curTabOrgKind = $('#curTaborgKind').val();
    dataTableConfig.ajax.data = function(d) { // 查询参数
        d.orgKind = $("#curTaborgKind").val();
        d.orgName = $("input[name='orgName']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgCode = $("input[name='orgCode']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgType = $("select[name='orgType']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgStatus = $("select[name='orgStatus']", $("#orgSearchForm" + curTabOrgKind)).val();
        d.orgId = $("#orgCurOrgId").val();
        return d;
    };
    searchOrgTable.ajax.reload();
}
/**
 * 展示修改组织页面
 * @author cuiy 2017/7/24
 */
function orgUpdate(orgId, orgName, orgCode, orgType, orgStatus, parentCode, parentId, parentName) {
    var curTabOrgKind = $('#curTaborgKind').val();
    $("#orgTabOrg" + curTabOrgKind).load("../org/orgEdite.html", function() {
        $("#orgUpdateModle").attr("id", "orgUpdateModle" + curTabOrgKind);
        $("#orgUpdateModleTitle").attr("id", "orgUpdateModleTitle" + curTabOrgKind);
        $("#orgUpdateForm").attr("id", "orgUpdateForm" + curTabOrgKind);
        $("#orgUpdateSaveBtn").attr("id", "orgUpdateSaveBtn" + curTabOrgKind);
        if ("1" == curTabOrgKind) {
            $("#orgUpdateModleTitle" + curTabOrgKind).html("修改联通组织");
        } else if ("2" == curTabOrgKind) {
            $("#orgUpdateModleTitle" + curTabOrgKind).html("修改乙方组织");
        }
        resetValidator();
        if (null == $('#orgUpdateForm' + curTabOrgKind).data('bootstrapValidator')) {
            $('#orgUpdateForm' + curTabOrgKind).bootstrapValidator(orgUpdateCheckValidator);
        }
        /*    	$.ajax({
            		"type":"GET",
            		"url":serverPath +'orgs/'+orgId, 
            		async: false,
            	    success:function(data){
            	    	    if(data.stauts == "1"){
            	    	    	debugger;
            	    	    	formValForInput("orgUpdateForm"+curTabOrgKind,data.data);
            	    	    } 
            			},
            		 error:function(e){
            				alert("组织信息查询失败");
            			}*/
        $("input[name='orgId']", $("#orgUpdateForm" + curTabOrgKind)).val(orgId);
        $("input[name='orgName']", $("#orgUpdateForm" + curTabOrgKind)).val(orgName);
        $("input[name='orgCode']", $("#orgUpdateForm" + curTabOrgKind)).val(orgCode);
        $("input[name='parentCode']", $("#orgUpdateForm" + curTabOrgKind)).val(parentCode);
        $("input[name='parentId']", $("#orgUpdateForm" + curTabOrgKind)).val(parentId);
        $("input[name='parentName']", $("#orgUpdateForm" + curTabOrgKind)).val(parentName);
        $("select[name='orgType'] option[value='" + orgType + "']").attr("selected", true);

        $("#orgUpdateModle" + curTabOrgKind).removeClass("HdClass");
    });

}

/**
 * 根据组织id逻辑删除组织
 * @author cuiy 2017/7/25
 */
function orgDel(orgId) {
    if (confirm("确定要禁用组织吗")) {
        var curTabOrgKind = $('#curTaborgKind').val();
        $.ajax({
            "type": "DELETE",
            "url": serverPath + 'orgs/' + orgId,
            "contentType": "application/json",
            //"data":JSON.stringify(obj),
            success: function(data) {
                alert("组织禁用" + data.message);
                loadOrgKindTab(curTabOrgKind);
            },
            error: function(e) {
                alert("组织禁用失败");
            }
        });
    }
}


/**
 * 根据组织id回复组织状态
 * @author cuiy 2017/9/5
 */
function orgRe(orgId) {
    debugger;
    if (confirm("确定要启用此组织吗")) {
        var curTabOrgKind = $('#curTaborgKind').val();
        $.ajax({
            "type": "PUT",
            "url": serverPath + 'orgs/' + orgId + '/orgStatus',
            "contentType": "application/json",
            //"data":JSON.stringify(obj),
            success: function(data) {
                if (data.data > 0) {
                    alert("组织启用" + data.message);
                    loadOrgKindTab(curTabOrgKind);
                }
            },
            error: function(e) {
                alert("组织启用失败");
            }
        });
    }
}
/**
 * 点击组织姓名，弹出模态框显示组织详细信息
 * param：orgId 组织id
 */
function orgShowOrgDetail(orgId) {
    var curTabOrgKind = $('#curTaborgKind').val();

    debugger;
    $('#orgDetailModalPart' + curTabOrgKind).load("../org/orgDetailModal.html", function() {
        var curTabOrgKind = $('#curTaborgKind').val();
        $("#orgDetailInfoModal").attr("id", "orgDetailInfoModal" + curTabOrgKind);
        $("#orgModalDetail").attr("id", "orgModalDetail" + curTabOrgKind);
        $("#orgDetailModal_orgId").attr("id", "orgDetailModal_orgId" + curTabOrgKind);
        $("#orgDetailModal_orgId" + curTabOrgKind).val(orgId);
    });

}