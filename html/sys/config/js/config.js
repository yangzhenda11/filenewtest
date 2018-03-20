//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function(){
	getConfigTable();
})
/*
 * 获取系统参数列表
 */
function getConfigTable(){
	var searchContractTable = App.initDataTables('#configTable', {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'dicconfigsts/',
	        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
	        "dataType":'json',
	        "beforeSend": startLoading("#submitBtn"),
	        "data":function(d){
	        	d.code = $('#configCode').val();
	            return d;
	        },
	        error: function (xhr, error, thrown) {  
	            stopLoading("#submitBtn");
	            layer.msg("接口错误", {icon: 2});
	        },
	        "dataSrc": judge
		},
		"columns": [{
                "data": null,
                title: "操作",
                className: "text-center",
                render: function(data, type, full, meta) {
	                var btnArray = new Array();
	                btnArray.push({ "name": "修改", "fn": "toConfigUpdate(\'" + full.id + "\')", "type": "user-button" });
	                btnArray.push({ "name": "删除", "fn": "delConfig(\'" + full.id + "\',\'" + full.code + "\')", "type": "user-button user-btn-n" })
	                context = {
	                    func: btnArray
	                }
	                var html = template(context);
	                return html;
	            }
            },
			{ "data": "code", "title": "参数名称", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        	{ "data": "val", "title": "参数值", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
            {"data": "attra",
            	"title": "允许用户更改",
            	className: "text-center",
            	render: function(data, type, full, meta) {
            		return  data == 0 ? "否" : "是";
            	}
        	},
        	{ "data": "attrb", "title": "可更改枚举值", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) }
		]
	});
}
/*
 * dataTable请求到结果后的回调事件
 */
function judge(result){
	stopLoading("#submitBtn");
	return resolveResult(result);
}




















var checkConfigValidator = {
    message: 'This value is not valid',
    feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh',
        errorClass: "invalid"
    },
    fields: {
        code: {
            validators: {
                notEmpty: {
                    message: '请输入参数名称'
                }
            }
        },
        val: {
            validators: {
                notEmpty: {
                    message: '请输入参数值'
                }
            }
        }
    },
    submitHandler: function(validator, form, submitButton) {
        var name = submitButton.attr("name");
        if (name == "addBtnName") {
            addConfig();
        }
        if (name == "updateBtnName") {
            updateConfig();
        }
    }

};

function selectConfig() {
    searchConfigTable.ajax.reload();
}

function resetSearchConfigform() {
    $("#searchConfigForm input").val("");
}

function toConfigAdd() {
    $('#configForm').bootstrapValidator(checkConfigValidator);
    $("#configForm").show();
    $("#orgOperationTitle").html("新增系统参数");
    $("#configForm button[name = 'addBtnName']").show();
    $("#configList").hide();
}

function addConfig() {
    var data = $("#configForm").serializeArray();
    var obj = {};
    $.each(data, function(i, v) {
        obj[v.name] = v.value;
    })
    $.ajax({
        "type": "POST",
        "url": serverPath + 'configs/',
        "contentType": "application/json",
        "data": JSON.stringify(obj),
        success: function(data) {
            returnConfigList();
            alert("添加成功！");
        },
        error: function(e) {
            alert("添加失败o_o请重试...");
        }
    })
}

function toConfigUpdate(id) {
    $("#configId").val(id);
    $('#configForm').bootstrapValidator(checkConfigValidator);
    $("#configForm").show();
    $("#orgOperationTitle").html("修改系统参数");
    $("#configForm button[name = 'updateBtnName']").show();
    $("#configList").hide();
    $.get(serverPath + 'configs/' + id, {}, function(data) {
        var sysConfig = data.sysConfig;
        for (var col in sysConfig) {
            if (col == 'attra') {
                $("#configForm select[name='attra'] option[value='" + sysConfig[col] + "']").attr("selected", "selected");
            } else {
                $("#configForm input[name='" + col + "']").val(sysConfig[col]);
            }
        }
    })
}

function updateConfig() {
    debugger;
    var id = $("#configId").val();
    var data = $("#configForm").serializeArray();
    var obj = {};
    $.each(data, function(i, v) {
        obj[v.name] = v.value;
    })
    $.ajax({
        "type": "PUT",
        "url": serverPath + 'configs/' + id,
        "contentType": "application/json",
        "data": JSON.stringify(obj),
        success: function(data) {
            returnConfigList();
            alert("修改成功！");
        },
        error: function(e) {
            alert("修改失败o_o请重试...");
        }
    })
}

function delConfig(id, code) {
    debugger;
    if (confirm('确认删除系统参数“' + code + '”么？')) {
        $.ajax({
            "type": "DELETE",
            "url": serverPath + 'configs/' + id,
            success: function(data) {
                selectConfig();
                alert("删除成功！");
            },
            error: function(e) {
                alert("删除失败o_o请重试...");
            }
        })
    }
}

function returnConfigList() {
    $("#configForm").hide();
    $('#configForm input').val("");
    $('#configForm').bootstrapValidator('resetForm', true);
    $("#configForm button[name = 'addBtnName']").hide();
    $("#configForm button[name = 'updateBtnName']").hide();
    $("#configList").show();
    selectConfig();
}