//系统的全局变量获取
var globalConfig = parent.globalConfig;
var serverPath = globalConfig.serverPath;
$(function(){
	getPersonalConfigTable();
})
/*
 * 获取系统参数列表
 */
function getPersonalConfigTable(){
	App.initDataTables('#personalConfigTable', "#submitBtn", {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'personalConfig/list',
	        "data":function(d){
	        	d.code = $('#personalConfigCode').val();
	        	d.staffOrgId = globalConfig.curStaffOrgId;
	            return d;
	        }
		},
		"columns": [{
                "data": null,
                "title": "操作",
                "className": "text-center",
                "render": function(data, type, full, meta) {
	                var btnArray = new Array();
	                btnArray.push({ "name": "修改", "fn": "editPersonalConfigModal(\'" + full.id + "\')" });
	                return App.getDataTableBtn(btnArray);
	            }
            },
			{ 	"data": "code", 
				"title": "参数名称",
				"render": function(data, type, full, meta) {
					var name = data;
					if(data == "config_page_size"){
						name = "每页查询结果显示条数";
					}else if(data == "message_space"){
						name = "待办数量刷新间隔（分钟）";
					}
                    return name;
                }
			},
        	{ 	"data": "val",
        		"title": "参数值"
        	}
		]
	});
}

/*
 * 搜索点击事件
 */
function searchPersonalConfig(retainPaging) {
	var table = $('#personalConfigTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

/*
 * 修改系统参数点击事件
 */
function editPersonalConfigModal(id){
	$("#personalConfigModal").load("_personalConfigModal.html #modalEdit",function(){
		$("#modalTitle").text("系统参数修改");
		getPersonalConfig(id);
	});
}

/*
 * 获取参数信息
 */
function getPersonalConfig(id){
	App.formAjaxJson(serverPath + 'personalConfig/selectOne/' + id +"?staffOrgId="+ globalConfig.curStaffOrgId+ App.timestamp(), "GET", null, successCallback);
	function successCallback(result){
		var data = result.data;
		var codeName = data.code;
		if(codeName == "config_page_size"){
			codeName = "每页查询结果显示条数";
		}else if(codeName == "message_space"){
			codeName = "待办数量刷新间隔（分钟）";
		};
		$('#personalConfigModal').modal('show');
		$('#personalConfigForm input[name="staffOrgId"]').val(globalConfig.curStaffOrgId);
		$('#personalConfigForm input[name="configId"]').val(data.id);
		$('#personalConfigForm input[name="code"]').val(data.code);
		
		$('#personalConfigForm input[name="codeName"]').val(codeName);
		var option ='';
		if(data.attrb && data.attrb.length > 0){
			var attrb = data.attrb.split("|");
			for (var i = 0 ; i < attrb.length ; i ++){
				option += "<option value='"+attrb[i]+"'>"+attrb[i]+"</option> "
			}
		}else{
			option += "<option value='"+data.val+"'>"+data.val+"</option> "
		}		
		$('#personalConfigForm select').html(option);
		$('#personalConfigForm select').val(data.val);
		App.initFormSelect2("#personalConfigForm");
		validate();
	}
}

/*
 * 修改提交
 */
function updatePersonalConfig() {
	var formObj = App.getFormValues($("#personalConfigForm"));
	var	url = serverPath + 'personalConfig/update';
	App.formAjaxJson(url, "POST", JSON.stringify(formObj), successCallback,improperCallbacks, null, null, false);
	function successCallback(result) {
		layer.msg("参数设置成功，重新登录后生效");
		$('#personalConfigModal').modal('hide');
		searchPersonalConfig(true);
	}
	function improperCallbacks(result){
		layer.msg(result.message);
		$('#personalConfigForm').data('bootstrapValidator').resetForm();
	}
}
/*
 * 表单验证
 */
function validate() {
	$('#personalConfigForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup change',
		message: '校验未通过',
		container: 'popover',
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
	        },
			attra : {
				validators : {
					notEmpty: {
	                    message: '请选择允许用户更改'
	                }
				},
				trigger: "change"
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		updatePersonalConfig();
	})
}
