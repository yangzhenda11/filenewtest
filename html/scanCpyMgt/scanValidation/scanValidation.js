/**
 * Created by huol on 2018/4/24.
 */
var config = parent.globalConfig;
var serverPath = config.serverPath;

/** ----------------------------查询弹框的js-start-------------------------------------- */
$("#searchContractType").click(function() {
    App.getCommonModal("contractType", "#contractType", "typeFullname", "typeId");
})
$("#searchAgentStaff").click(function() {
    App.getCommonModal("agentStaff", "#agentStaff", "name", ["id", "parentId", "id"]);
})
$("#searchAgentDepartment").click(function() {
    App.getCommonModal("agentDepartment", "#agentDepartment", "orgName", "orgId");
})
$("#searchOtherSubject").click(function() {
    App.getCommonModal("otherSubject", "#otherSubject", "partnerName", "partnerId");
})
$("#contractType").on("change", function() {
    $(this).data("exactSearch", false);
})
$("#agentStaff").on("change", function() {
    $(this).data("exactSearch", false);
})
$("#agentDepartment").on("change", function() {
    $(this).data("exactSearch", false);
})
$("#otherSubject").on("change", function() {
    $(this).data("exactSearch", false);
})
    /** ----------------------------查询弹框的js-end-------------------------------------- */
    /*******************************进行分页查询数据-start******************************************* */
    /*
     * 初始化表格
     */
verifyProcessTrue();

function verifyProcessTrue() {
    App.initDataTables('#getScanValidationListTrue', "#submitBtn", {
        "destroy": true,
        ajax: {
            "type": "POST",
            "url": serverPath + 'sysScanValidation/listSysScanValidationInfo',
            "data": function(d) {
                var formData = $("#scanValidationForm").serializeArray(); //把form里面的数据序列化成数组
                formData.forEach(function(e) {
                    d[e.name] = e.value.trim();
                });
                if ($("#contractType").data("exactSearch")) {
                    d.contractTypeId = $("#contractType").data("typeId");
                } else {
                    d.contractTypeId = "";
                    d.contractType = $("#contractType").val();
                };
                if ($("#agentStaff").data("exactSearch")) {
                    d.undertakeNameId = $("#agentStaff").data("id");
                } else {
                    d.undertakeNameId = "";
                    d.undertakeName = $("#agentStaff").val();
                };
                if ($("#agentDepartment").data("exactSearch")) {
                    d.executeDeptNameId = $("#agentDepartment").data("orgId");
                } else {
                    d.executeDeptNameId = "";
                    d.executeDeptName = $("#agentDepartment").val();
                };
                if ($("#otherSubject").data("exactSearch")) {
                    d.partyNameId = $("#otherSubject").data("partnerId");
                } else {
                    d.partyNameId = "";
                    d.partyName = $("#otherSubject").val();
                };
                return d;
            }
        },
        "columns": [{
                "data": "contractNumber",
                "className": "text-center",
                "title": "序号",
                "render": function(data, type, full, meta) {
                    return meta.row + 1;
                }
            },
            {
                "data": null,
                "title": "合同编号",
                "className": "whiteSpaceNormal",
                "width": "10%",
                render: function(data, type, full, meta) {
                    return '<a href=\"javascript:void(0)\" onclick = "jumpScanValidationView(\'' + data.verifyId + '\')">' + data.contractNumber + '</a>';
                }
            },
            { "data": "contractName", "title": "合同名称", "className": "whiteSpaceNormal", "width": "15%" },
            { "data": "typeName", "title": "合同类型", "className": "whiteSpaceNormal", "width": "10%" },
            { "data": "ourPartyName", "title": "我方主体", "className": "whiteSpaceNormal", "width": "15%" },
            { "data": "otherPartyName", "title": "对方主体", "className": "whiteSpaceNormal", "width": "15%" },
            { "data": "executeDeptName", "title": "承办部门", "className": "whiteSpaceNormal", "width": "10%" },
            { "data": "undertakeName", "title": "承办人", "className": "whiteSpaceNormal", "width": "5%" },
            {
                "data": "verifyStatus",
                "title": "合同验证状态",
                "className": "whiteSpaceNormal",
                "width": "5%",
                "render": function(data, type, full, meta) {
                    if (data == 903010) {
                        return '草稿';
                    } else if (data == 903020) {
                        return '审批中';
                    } else if (data == 903030) {
                        return '生效';
                    } else if (data == 903040) {
                        return '失效';
                    } else {
                        return "";
                    }
                }
            },
            { "data": "verifyVersion", "className": "text-center", "title": "版本号" },
            {
                "data": "verifyDate",
                "className": "text-center",
                "title": "验证日期",
                render: function(data, type, full, meta) {
                    return data.substr(0,10);
                }
            }

        ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 ) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
    });
}

function verifyProcessFalse() {
    App.initDataTables('#getScanValidationListFalse', "#submitBtn", {
        "destroy": true,
        ajax: {
            "type": "POST",
            "url": serverPath + 'sysScanValidation/listSysScanValidationInfo',
            "data": function(d) {
                var body = {};
                body.start = d.start; //开始的
                body.length = d.length; //要取的数据的
                var formData = $("#scanValidationForm").serializeArray(); //把form里面的数据序列化成数组
                formData.forEach(function(e) {
                    d[e.name] = e.value.trim();
                });
                d.verifyStatus = "90300";
                if ($("#contractType").data("exactSearch")) {
                    d.contractTypeId = $("#contractType").data("typeId");
                } else {
                    d.contractTypeId = "";
                    d.contractType = $("#contractType").val();
                };
                if ($("#agentStaff").data("exactSearch")) {
                    d.undertakeNameId = $("#agentStaff").data("id");
                } else {
                    d.undertakeNameId = "";
                    d.undertakeName = $("#agentStaff").val();
                };
                if ($("#agentDepartment").data("exactSearch")) {
                    d.executeDeptNameId = $("#agentDepartment").data("orgId");
                } else {
                    d.executeDeptNameId = "";
                    d.executeDeptName = $("#agentDepartment").val();
                };
                if ($("#otherSubject").data("exactSearch")) {
                    d.partyNameId = $("#otherSubject").data("partnerId");
                } else {
                    d.partyNameId = "";
                    d.partyName = $("#otherSubject").val();
                };
                return d;
            }
        },
        "columns": [{
                "title": '<label class="ui-checkbox"><input id="checkchild" type="checkbox" /><span></span> </label>',
                "data": "contractId",
                "className": "whiteSpaceNormal",
                "width": "3%",
                "render": function(data, type, full, meta) {
                    return '<label class="ui-checkbox"><input id="checkchild" type="checkbox" value="' + data + '" /><span></span> </label>';
                }
            },
            {
                "data": "contractNumber",
                "className": "whiteSpaceNormal text-center",
                "width": "3%",
                "title": "序号",
                "render": function(data, type, full, meta) {
                    return meta.row + 1;
                }
            },
            { "data": "contractNumber", "title": "合同编号", "className": "whiteSpaceNormal", "width": "10%" },
            { "data": "contractName", "title": "合同名称", "className": "whiteSpaceNormal", "width": "15%" },
            { "data": "typeName", "title": "合同类型", "className": "whiteSpaceNormal", "width": "10%" },
            { "data": "ourPartyName", "title": "我方主体", "className": "whiteSpaceNormal", "width": "10%" },
            { "data": "otherPartyName", "title": "对方主体", "className": "whiteSpaceNormal", "width": "10%" },
            { "data": "executeDeptName", "title": "承办部门", "className": "whiteSpaceNormal", "width": "5%" },
            { "data": "undertakeName", "title": "承办人", "className": "whiteSpaceNormal", "width": "5%" },
            {
                "data": "verifyStatus",
                "title": "合同验证状态",
                "className": "whiteSpaceNormal",
                "width": "5%",
                "render": function(data, type, full, meta) {
                    if (data == 903010) {
                        return '草稿';
                    } else if (data == 903020) {
                        return '审批中';
                    } else if (data == 903030) {
                        return '生效';
                    } else if (data == 903040) {
                        return '失效';
                    } else {
                        return "";
                    }
                }
            },
            { "data": "verifyVersion", "className": "whiteSpaceNormal", "width": "5%", "title": "版本号" }
        ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 1 ) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
    });
}

/*******************************进行分页查询数据-end******************************************* */

function listScanValidationInfo(retainPaging) {
    if ($("#scanValidationListTrue").hasClass("hidden")) {
        var table = $('#getScanValidationListFalse').DataTable();
    } else {
        var table = $('#getScanValidationListTrue').DataTable();
    }
    if (retainPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}

/*
 * 扫描件是否验证点击判断
 */
$("input[name=verifyProcess]").on("click", function() {
        if ($(this).val() == 1) {
            $("#scanValidationListTrue").addClass("hidden");
            $("#startValidation,#scanValidationListFalse").removeClass("hidden");
            $("#verifyStatus").val(9030).attr("disabled", "").trigger("change");
            verifyProcessFalse();
        } else {
            $("#scanValidationListTrue").removeClass("hidden");
            $("#startValidation,#scanValidationListFalse").addClass("hidden");
            $("#verifyStatus").val(903030).removeAttr("disabled").trigger("change");
            verifyProcessTrue();
        }
    })
    /*
     * 跳转到验证页面
     */
    //跳转到上传页面
function jumpScanValidationView(verifyId) {
    var src = "/html/scanCpyMgt/scanValidation/scanValidationView.html?pageType=2&verifyId=" + verifyId;
    App.changePresentUrl(src);
}
/*
 * 重置表单
 */
function resetValiForm(){
	var verifyProcessStatus = $("input[name='verifyProcess']:checked").val();
	App.resetForm('.form-horizontal');
	if(verifyProcessStatus == 1){
		$("input[name='verifyProcess'][value='1']").attr("checked",true);
		$("#verifyStatus").val("9030").trigger("change");
	}
}
