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
App.initDataTables('#getScanValidationList', "#submitBtn", {
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
				return '<a href=\"javascript:void(0)\" onclick = "jumpScanValidationView(\'' + data.contractId + '\')">' + data.contractNumber + '</a>';
			}
        },
        {"data": "contractName","title": "合同名称"},
        {"data": "contractType","title": "合同类型"},
        {"data": "ourPartyName","title": "我方主体"},
        {"data": "otherPartyName","title": "对方主体"},
        {"data": "executeDeptName","title": "承办部门"},
        {"data": "undertakeName","title": "承办人"},
        {"data": "verifyStatus","title": "合同验证状态",
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
        {"data": "verifyVersion","title": "版本号"},
        {"data": "ctreatedDateString","title": "验证日期"}
    ]
});
function listScanValidationInfo(retainPaging) {
    var table = $('#getScanValidationList').DataTable();
    if(retainPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}
/*******************************进行分页查询数据-end******************************************* */
/*
 * 跳转到验证页面
 */
//跳转到上传页面
function jumpScanValidationView(contractId){
	var src = "/html/scanCpyMgt/scanValidation/scanValidationView.html?pageType=2&contractId="+contractId;
	App.changePresentUrl(src);
}