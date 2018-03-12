var searchConfigTable;
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
var configTableSetting = {
    "ordering": false, // 排序
    "serverSide": true, // 开启服务器模式
    "scrollX": true, // 横向滚动
    ajax: {
        "type": "GET",
        "url": parent.globalConfig.serverPath + 'configs/', // 请求路径
        "data": function(d) { // 查询参数
            d.code = $('#configCode').val();
            return d;
        }
    },
    columns: [ // 对应列
        {
            "data": null,
            "title": "操作",
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
        {
            "data": "attra",
            "title": "允许用户更改",
            className: "text-center",
            render: function(data, type, full, meta) {
                if (data == 0) { return "否"; } else { return "是"; }
            }
        },
        { "data": "attrb", "title": "可更改枚举值", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) }
    ],
    "columnDefs": [{ // 所有列默认值
        "targets": "_all",
        "defaultContent": ''
    }],
    // lengthMenu: [
    //     menuLength,
    //     menuLength
    // ],
    "dom": 'rt<"floatl mt5"l><"floatl mt5"i><"floatr mt5"p><"clear">', // 生成样式
    //	"lengthMenu" : [ menuLength, menuLength ]
};

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
$(function() {
    searchConfigTable = $("#searchConfigTable").DataTable(configTableSetting);
})

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