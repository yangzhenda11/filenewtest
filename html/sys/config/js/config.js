//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function(){
	getConfigTable();
	$("#modalDetailContent").load("./html/configModal.html?" + App.timestamp()+" #modalDetail");
	$('#modalDetailContent').on('hidden.bs.modal', function() {
		$("#modalDetailContent").load("./html/configModal.html?" + App.timestamp()+" #modalDetail");
	});
	$("#modalEditContent").load("./html/configModal.html?" + App.timestamp()+" #modalEdit");
	$('#modalEditContent').on('hidden.bs.modal', function() {
		$("#modalEditContent").load("./html/configModal.html?" + App.timestamp()+" #modalEdit");
	});
})
/*
 * 获取系统参数列表
 */
function getConfigTable(){
	var searchContractTable = App.initDataTables('#configTable', {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'configs/',
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
	                btnArray.push({ "name": "详情", "fn": "detailConfigModal(\'" + full.id + "\')" });
	                btnArray.push({ "name": "修改", "fn": "editConfigModal(\'" + full.id + "\')" });
	                btnArray.push({ "name": "删除", "fn": "delConfig(\'" + full.id + "\',\'" + full.code + "\')" })
	                context = {
	                 	func: btnArray
	                }
	                var template = Handlebars.compile(btnModel);
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
        	{ "data": "attrb", "title": "可更改枚举值", className: "text-center", render: $.fn.dataTable.render.ellipsis(32, true) }
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
/*
 * 搜索点击事件
 */
function searchDict(resetPaging) {
	startLoading("#submitBtn");
	var table = $('#configTable').DataTable();
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
/*
 * 新增系统参数点击事件
 */
function addConfigModal(){
	
}
/*
 * 修改系统参数点击事件
 */
function editConfigModal(){
	
}

/*
 * 系统参数详情点击事件
 */
function detailConfigModal(){
	
}


/*
 * 获取人员信息详情
 */
function getInfor(id,type){
	App.formAjaxJson(serverPath + "staffPartner/getStaffPartner/" + id, "get", "", successCallback);
	function successCallback(result){
		var data = result.data;
		if(type == "edit"){
			setEditForm(data);
		}else{
			setDetailForm(data);
		}
		
	}
}
/*
 * 填充详情表单
 */
function setDetailForm(data){
	$("#modalDetailContent").modal("show");
	$("#staffNameDetail").text(data.staffName);
	var valueCallback = {'sex':function(value){return value == "W" ? "女" : "男"},
						'staffStatus':function(value){return value == "1" ? "有效" : "无效"},
						'hireDate':function(value){return App.formatDateTime(value,"yyyy-mm-dd")}}
	App.setFindValue("#baseInfo",data,valueCallback);
}
/*
 * 填充修改表单
 */
function setEditForm(data){
	$('#modalEditContent').modal('show');
	var valueCallback = {'hireDate':function(value){return App.formatDateTime(value,"yyyy-mm-dd")}}
	App.setFormValues("#externalPersonnelForm",data,valueCallback);
	$("#orgNameIn").attr("title",data.orgName);
	$("#orgNameIn").data("id",data.orgId);
	dateRegNameChose();
	validate("edit");
}
/*
 * 新增||修改提交
 */
function updateExternalPersonnel(editType) {
	var formObj = App.getFormValues($("#externalPersonnelForm"));
	var ms = "新增成功";
	var url = serverPath + "staffPartner/addStaffPartner";
	var pushType = "POST";
	if(editType == "add"){
		formObj.createBy = config.curStaffId;
		formObj.updateBy = config.curStaffId;
		formObj.orgId = $("#orgNameIn").data("id");
		formObj.staffKind = 2;
		delete formObj.staffId;
	}else{
		formObj.updateBy = config.curStaffId;
		formObj.orgId = $("#orgNameIn").data("id");
		ms = "修改成功";
		url = serverPath + "staffPartner/updateStaffPartner";
		pushType = "PUT";
	}
	App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback,improperCallbacks);
	function successCallback(result) {
		layer.msg(ms, {icon: 1});
		searchPersonnel(true);
		$('#modalEditContent').modal('hide');
	}
	function improperCallbacks(result){
		$('#externalPersonnelForm').data('bootstrapValidator').resetForm();
	}
}
/*
 * 表单验证
 */
function validate(editType) {
	$('#externalPersonnelForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup',
		message: '校验未通过',
		container: 'popover',
		fields: {
			loginName : {
				validators : {
					notEmpty : {
						message : '请输入账号'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					},
					regexp : {
						regexp : /^[a-zA-Z0-9_\-\.]+$/,
						message : '用户名由数字字母-_和.组成'
					}
				}
			},
			passwd : {
				validators : {
					notEmpty : {
						message : '请输入密码'
					},
					stringLength : {
						min : 5,
						message : '密码至少5位'
					}
				}
			},
			staffName : {
				validators : {
					notEmpty : {
						message : '请输入人员姓名'
					},
					stringLength : {
						min : 0,
						max : 15,
						message : '请输入不超过15个字'
					}
				}
			},
			orgName : {
				validators : {
					notEmpty : {
						message : '请选择所属组织'
					}
				},
				trigger: "focus blur keyup change",
			},
			empCode : {
				validators : {
					regexp : {
						regexp : /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
						message : '请输入15或18位身份证号'
					}
				}
			},
			sex : {
				validators : {
					notEmpty : {
						message : '请选择性别'
					}
				},
				trigger: "focus blur keyup change",
			},
			postcode : {
				validators : {
					regexp : {
						regexp : /^[0-9]+$/,
						message : '请检查邮政编码'
					},
					stringLength : {
						min : 0,
						max : 6,
						message : '请输入不超过6位数字'
					}
				}
			},
			mailAddr : {
				validators : {
					stringLength : {
						min : 0,
						max : 30,
						message : '请输入不超过30个字符'
					}
				}
			},
			phone : {
				validators : {
					regexp : {
						regexp : /(^(\d{3,4}-)?\d{7,8})$|(1[3|5|7|8]{1}[0-9]{9})/,
						message : '请检查电话是否正确'
					}
				}
			},
			mobilPhone : {
				validators : {
					notEmpty : {
						message : '请输入手机号'
					},
					stringLength : {
						min : 11,
						max : 11,
						message : '请输入11位手机号码'
					},
					regexp : {
						regexp : /^1[3|5|7|8]{1}[0-9]{9}$/,
						message : '请输入正确的手机号码'
					}
				}
			},
			email : {
				validators : {
					emailAddress : {
						message : '请检查Email拼写'
					},
					stringLength : {
						min : 0,
						max : 50,
						message : '请输入不超过50个字符'
					}
				}
			},
			staffSort : {
				validators : {
					stringLength : {
						min : 0,
						max : 8,
						message : '请输入不超过8位数字'
					},
					regexp : {
						regexp : /^[0-9]+$/,
						message : '排序只能输入数字'
					}
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		updateExternalPersonnel(editType);
	});
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