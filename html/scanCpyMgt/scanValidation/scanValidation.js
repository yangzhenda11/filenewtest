/**
 * Created by huol on 2018/4/24.
 */
var config = parent.globalConfig;
var serverPath = config.serverPath;

/** ----------------------------查询弹框的js-start-------------------------------------- */
$("#searchContractType").click(function(){
    App.getCommonModal("contractType","#contractType","typeFullname","typeId");
})
$("#searchAgentStaff").click(function(){
    App.getCommonModal("agentStaff","#agentStaff","name",["id","parentId","id"]);
})
$("#searchAgentDepartment").click(function(){
    App.getCommonModal("agentDepartment","#agentDepartment","orgName","orgId");
})
$("#searchContractData").click(function(){
    App.getCommonModal("contractDataSearch","#contractDataSearch","contractNumber","contractId");
})
$("#searchOtherSubject").click(function(){
    App.getCommonModal("otherSubject","#otherSubject","partnerName","partnerId");
})
//$("#otherSubject").on("input",function(){
//  $(this).data("exactSearch",false);
//});
/** ----------------------------查询弹框的js-end-------------------------------------- */
/*******************************进行分页查询数据-start******************************************* */
/*
 * 初始化表格
 */
verifyProcessTrue();
function verifyProcessTrue() {
    App.initDataTables('#getScanValidationList', "#submitBtn", {
        "destroy": true,
        ajax: {
            "type": "POST",
            "url": serverPath + 'sysScanValidation/listSysScanValidationInfo',
            "data": function(d) {
                var body = {};
                body.start = d.start;//开始的
                body.length = d.length;//要取的数据的
                var formData = $("#scanValidationForm").serializeArray();//把form里面的数据序列化成数组
                formData.forEach(function (e) {
                    d[e.name] = e.value.trim();
                });
                if(d.verifyStatus == 0 || d.verifyStatus == undefined){
                    d.verifyStatus = "";
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
            {"data": null,"title": "合同编号",
                render: function(data, type, full, meta) {
                    return '<a href=\"javascript:void(0)\" onclick = "jumpScanValidationView(\'' + data.verifyId + '\')">' + data.contractNumber + '</a>';
                }
            },
            {"data": "contractName","className": "text-center","title": "合同名称"},
            {"data": "typeName","className": "text-center","title": "合同类型"},
            {"data": "ourPartyName","className": "text-center","title": "我方主体"},
            {"data": "otherPartyName","className": "text-center","title": "对方主体"},
            {"data": "executeDeptName","className": "text-center","title": "承办部门"},
            {"data": "undertakeName","className": "text-center","title": "承办人"},
            {"data": "verifyStatus","className": "text-center","title": "合同验证状态",
                "render": function(data, type, full, meta) {
                if (data == 1) {
                    return '草稿';
                } else if(data == 2){
                    return '审批中';
                }else if(data == 3){
                    return '生效';
                }else if(data == 4){
                    return '失效';
                }else{
                    return "";
                }
            }},
            {"data": "verifyVersion","className": "text-center","title": "版本号"},
            {"data": "ctreatedDateString","className": "text-center","title": "验证日期"}
        ]
    });
}

function verifyProcessFalse() {
    App.initDataTables('#getScanValidationList', "#submitBtn", {
        "destroy": true,
        ajax: {
            "type": "POST",
            "url": serverPath + 'sysScanValidation/listSysScanValidationInfo',
            "data": function(d) {
                var body = {};
                body.start = d.start;//开始的
                body.length = d.length;//要取的数据的
                var formData = $("#scanValidationForm").serializeArray();//把form里面的数据序列化成数组
                formData.forEach(function (e) {
                    d[e.name] = e.value.trim();
                });
                if(d.verifyStatus == 0 || d.verifyStatus == undefined){
                    d.verifyStatus = "";
                };
                return d;
            }
        },
        "columns": [
            {"className": "text-center",
                "data": "contractId",
                "render": function (data, type, full, meta) {
                    return '<label class="ui-checkbox"><input id="checkchild" type="checkbox" value="' + data + '" /><span></span> </label>';
                }
            },
            {"data": null,"title": "合同编号","className": "text-center",
                render: function(data, type, full, meta) {
                    return '<a href=\"javascript:void(0)\" onclick = "jumpScanValidationView(\'' + data.verifyId + '\')">' + data.contractNumber + '</a>';
                }
            },
            {"data": "contractName","className": "text-center","title": "合同名称"},
            {"data": "typeName","className": "text-center","title": "合同类型"},
            {"data": "ourPartyName","className": "text-center","title": "我方主体"},
            {"data": "otherPartyName","className": "text-center","title": "对方主体"},
            {"data": "executeDeptName","className": "text-center","title": "承办部门"},
            {"data": "undertakeName","className": "text-center","title": "承办人"},
            {"data": "verifyStatus","className": "text-center","title": "合同验证状态",
                "render": function(data, type, full, meta) {
                    if (data == 1) {
                        return '草稿';
                    } else if(data == 2){
                        return '审批中';
                    }else if(data == 3){
                        return '生效';
                    }else if(data == 4){
                        return '失效';
                    }else{
                        return "";
                    }
                }},
            {"data": "verifyVersion","className": "text-center","title": "版本号"},
            {"data": "ctreatedDateString","className": "text-center","title": "验证日期"}
        ]
    });
}

/*******************************进行分页查询数据-end******************************************* */

function listScanValidationInfo(retainPaging) {
    var table = $('#getScanValidationList').DataTable();
    if(retainPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}

/*
 * 扫描件是否验证点击判断
 */
$("input[name=verifyProcess]").on("click",function(){
	if($(this).val() == 3){
		$("#startValidation").removeClass("hidden");
		$("#verifyStatus").val(0).attr("disabled","").trigger("change");
        verifyProcessFalse();
	}else{
		$("#startValidation").addClass("hidden");
		$("#verifyStatus").val(3).removeAttr("disabled").trigger("change");
        verifyProcessTrue();
	}
})
/*
 * 跳转到验证页面
 */
//跳转到上传页面
function jumpScanValidationView(verifyId){
	var src = "/html/scanCpyMgt/scanValidation/scanValidationView.html?pageType=2&verifyId="+verifyId;
	App.changePresentUrl(src);
}