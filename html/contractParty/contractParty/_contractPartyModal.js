/*
 * 获取签约主体详情
 */
function getContractInfo(data){
	$('#modal').modal('show');
    var url = serverPath + "orgPartner/" + data;
    App.formAjaxJson(url, "get", "", successCallback);
    function successCallback(result) {
        var data = result.data;
        $("#partnerId").val(data.partnerId);
        $("#partnerNameM").text(data.partnerName);
        $("#partnerCode").val(data.partnerCode)
        $("#isPartnerM").val(data.isPartner);
        if (data.isPartner == 0) {
            $("#isunicom").removeClass("hide");
            $("#ouOrgId").val(data.ouOrgId);
            $("#organisation").val(data.orgName);
            $("#organisation").data("id", data.orgId);
            $("#organisation").attr("title", data.orgName);
            $("#legal").val(data.staffName);
            $("#legal").data("id", data.legalPersonName);
            $("#legal").attr("title", data.staffName);
            $("#other").val(data.otherOrgName);
            $("#other").data("id", data.otherOrgId);
            $("#other").attr("title", data.otherOrgName);
            getTreeInfo();
        } else {
            $("#isunicom").addClass("hide");
            $("#organisation,#legal,#other").data("id", "");
            $("#organisation,#legal,#other").attr("title", "");
            $("#organisation,#legal,#other,#ouOrgId").val("");
        };
        validate();
    }
}
/*
 * 是否联通方切换
 */
function changeIsunicom() {
    var isPartnerValue = $("#isPartnerM").val();
    if (isPartnerValue == 0) {
        $("#isunicom").removeClass("hide");
        getTreeInfo();
    } else {
        $("#isunicom").addClass("hide");
        $("#organisation,#legal,#other").data("id", "");
        $("#organisation,#legal,#other").attr("title", "");
        $("#organisation,#legal,#other,#ouOrgId").val("");
    }
}
/*
 * 获取树信息
 */
function getTreeInfo() {
    /*
     * 所属组织树配置
     *  orgs/{orgId}/orgTree
     */
    App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", "", successCallback);

    function successCallback(result) {
        var data = result.data;
        if (null == data) {
            layer.msg("没有相关组织和人员信息", { icon: 2 });
        } else {
            var otherTreeResult = otherFilter("", "", result);
            organisationTree = $.fn.zTree.init($("#organisationTree"), orgsSetting, data);
            otherTree = $.fn.zTree.init($("#otherTree"), otherSetting, otherTreeResult);
            var otherIds = $("#other").data("id");
            var otherTreeObj = $.fn.zTree.getZTreeObj("otherTree");
            if (otherIds) {
                otherIdsArr = otherIds.split(",");
                for (var i = 0; i < otherIdsArr.length; i++) {
                    var nodes = otherTreeObj.getNodesByParam("orgId", otherIdsArr[i], null);
                    if (nodes.length > 0) {
                        otherTreeObj.checkNode(nodes[0], true, false);
                    }
                }
            }
        }
    }
    /*
     * 所属人员树配置
     *  roles/orgStaffsTreeRoot
     * get  data:{"curOrgId":curOrgId}
     */
    $.get(serverPath + "roles/orgStaffsTreeRoot", { "curOrgId": config.curOrgId }, function(result) {
        if (null == result) {
            layer.msg("没有相关组织和人员信息", { icon: 2 });
        } else {
            legalTree = $.fn.zTree.init($("#legalTree"), legalSetting, result);
            curOrgStaffNode = legalTree.getNodes()[0];
        }
    });
}

/*
 * 修改提交
 */
function saveContract() {
    var formObj = App.getFormValues($("#contractEditForm"));
    formObj.partnerName = $("#partnerNameM").text();
    App.changeObjKey({ "legalTree": "legalPersonName", "organisationTree": "orgId", "otherTree": "otherOrgId" }, formObj)
    formObj.orgId = $("#organisation").data("id");
    formObj.legalPersonName = $("#legal").data("id");
    formObj.otherOrgId = $("#other").data("id");
    App.formAjaxJson(serverPath + "orgPartner", "PUT", JSON.stringify(formObj), successCallback);

    function successCallback(result) {
        layer.msg("修改成功", { icon: 1 });
        searchContract(true);
        $('#modal').modal('hide');
    }
}
/*
 * 表单验证
 */
function validate() {
	$('#contractEditForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup',
		message: '校验未通过',
		container: 'popover',
		fields: {
			partnerCode : {
				validators : {
					notEmpty : {
						message : '请选择关联编码'
					}
				}
			},
			isPartner : {
				validators : {
					notEmpty : {
						message : '请选择是否是联通方'
					}
				}
			},
			organisationTree : {
				validators : {
					notEmpty : {
						message : '请选择所属组织'
					}
				},
				trigger: "focus blur keyup change",
			},
			ouOrgId : {
				validators : {
					notEmpty : {
						message : '请输入OU组织名称'
					}
				}
			},
			legalTree : {
				validators : {
					notEmpty : {
						message : '请选择法人代表'
					}
				},
				trigger: "focus blur keyup change",
			},
			otherTree : {
				validators : {
					notEmpty : {
						message : '请选择其他映射组织'
					}
				},
				trigger: "focus blur keyup change",
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		saveContract();
	});
}
/*
 * 显示所属组织树
 */
function showTree(dom) {
    var selectObj = $("#" + dom + "");
    var selectOffset = selectObj.offset();
    $("#" + dom + "Content").css({
        left: "10px",
        top: selectObj.outerHeight() + "px",
        width: selectObj.outerWidth() + 40
    }).slideDown("fast");
    onBodyDown(dom);
}
/*
 * 隐藏所属组织树
 */
function hideMenu(dom) {
    $("#" + dom + "Content").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
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
 * 所属组织树配置单选
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
        beforeClick: beforeClick,
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
 * 所属人员树配置单选
 */
var legalSetting = {
    async: {
        enable: true,
        url: serverPath + "roles/" + curOrgStaffRole + "/orgStaffsTreeChildren",
        type: "get",
        dataType: 'json',
        dataFilter: orgsFilter,
        otherParam: {
            "orgId": function() {
                return curOrgStaffNode.id
            }
        },
    },
    data: {
        simpleData: {
            enable: true,
        }
    },
    view: {
        dblClickExpand: false
    },
    callback: {
        onAsyncError: onAsyncError,
        beforeClick: beforeClick,
        onClick: onClick,
        beforeAsync: zTreeBeforeAsync
    }
};

function orgsFilter(treeId, parentNode, responseData) {
    var responseData = responseData.children;
    if (responseData) {
        return responseData;
    } else {
        return null;
    }
}
/*
 * 所属组织树多选配置
 */
var otherSetting = {
    async: {
        enable: true,
        url: "",
        type: "get",
        dataType: 'json',
        dataFilter: otherFilter
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
    check: {
        enable: true
    },
    callback: {
        onCheck: onCheck,
        onAsyncError: onAsyncError,
        onAsyncSuccess: onAsyncSuccess,
        beforeAsync: zTreeBeforeAsync
    }
}

function otherFilter(treeId, parentNode, responseData) {
    var responseData = responseData.data;
    if (responseData.length > 0) {
        for (var i = 0; i < responseData.length; i++) {
            if ("true" == responseData[i].isParent) {
                responseData[i].nocheck = true;
            }
        }
    }
    return responseData;
}

function zTreeBeforeAsync(treeId, treeNode) {
    if (treeId == "organisationTree") {
        organisationTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
    } else if (treeId == "otherTree") {
        otherTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
    } else if (treeId == "legalTree") {
        curOrgStaffNode = treeNode;
    }
    return true;
}
/*
 * ztree异步加载成功事件
 */
function onAsyncSuccess(event, treeId, treeNode, msg) {
    var otherIds = $("#other").data("id");
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    if (otherIds) {
        otherIdsArr = otherIds.split(",");
        for (var i = 0; i < otherIdsArr.length; i++) {
            var nodes = treeObj.getNodesByParam("orgId", otherIdsArr[i], null);
            if (nodes.length > 0) {
                treeObj.checkNode(nodes[0], true, false);
            }
        }
    }
}

/*
 * ztree点击事件之前
 */
function beforeClick(treeId, treeNode) {
    var check = (treeNode && !treeNode.isParent);
    return check;
}
/*
 * ztree点击事件
 */
function onClick(event, treeId, treeNode) {
    var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
    if (treeId == "organisationTree") {
        var selectName = nodes[0].orgName;
        var selectId = nodes[0].orgId;
        $("input[name=" + treeId + "]").val(selectName);
        $("#contractEditForm").data("bootstrapValidator").updateStatus("organisationTree",  "NOT_VALIDATED",  null );
		$("#contractEditForm").data("bootstrapValidator").validateField('organisationTree');
    } else if (treeId == "legalTree") {
        var selectName = nodes[0].name;
        var selectId = nodes[0].id;
        $("input[name=" + treeId + "]").val(selectName);
        $("#contractEditForm").data("bootstrapValidator").updateStatus("legalTree",  "NOT_VALIDATED",  null );
		$("#contractEditForm").data("bootstrapValidator").validateField('legalTree');
    };
    $("input[name=" + treeId + "]").data("id", selectId);
    $("input[name=" + treeId + "]").attr("title", selectName);
}
/*
 * ztree选中事件
 */
function onCheck(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.getCheckedNodes(true);
    var idAll = [],
        nameAll = [];
    for (var i = 0; i < nodes.length; i++) {
        idAll.push(nodes[i].orgId);
        nameAll.push(nodes[i].orgName)
    }
    $("input[name=" + treeId + "]").data("id", idAll.join(","));
    $("input[name=" + treeId + "]").attr("title", nameAll.join(","));
    $("input[name=" + treeId + "]").val(nameAll.join(","));
    if(treeId == "otherTree"){
		$("#contractEditForm").data("bootstrapValidator").updateStatus("otherTree",  "NOT_VALIDATED",  null );
		$("#contractEditForm").data("bootstrapValidator").validateField('otherTree');
	}
}