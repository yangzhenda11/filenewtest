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
                title: "操作",
                className: "text-center",
                render: function(data, type, full, meta) {
	                var btnArray = new Array();
	                btnArray.push({ "name": "修改", "fn": "editPersonalConfigModal(\'" + full.id + "\')" });
	                return App.getDataTableBtn(btnArray);
	            }
            },
			{ "data": "code", "title": "参数名称", render: $.fn.dataTable.render.ellipsis(22, true) },
        	{ "data": "val", "title": "参数值", render: $.fn.dataTable.render.ellipsis(22, true) }
		]
	});
}

/*
 * 搜索点击事件
 */
function searchPersonalConfig(resetPaging) {
	var table = $('#personalConfigTable').DataTable();
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

/*
 * 修改系统参数点击事件
 */
function editPersonalConfigModal(id){
	$("#personalConfigModal").load("_personalConfigModal.html?" + App.timestamp()+" #modalEdit",function(){
		$("#modalTitle").text("系统参数修改");
		getPersonalConfig(id,"edit");
	});
}

/*
 * 获取参数信息
 */
function getPersonalConfig(id,type){
	App.formAjaxJson(serverPath + 'personalConfig/selectOne/' + id +"?staffOrgId="+ globalConfig.curStaffOrgId+ App.timestamp(), "GET", null, successCallback, null, null, null, false);
	function successCallback(result){
		var data = result;
		if(type == "edit"){
			$('#personalConfigModal').modal('show');
			$('#personalConfigForm input[name="staffOrgId"]').val(globalConfig.curStaffOrgId);
			$('#personalConfigForm input[name="configId"]').val(data.data.id);
			$('#personalConfigForm input[name="code"]').val(data.data.code);
			var option =''
			if(data.data.attrb && data.data.attrb.length>0){
				var attrb = data.data.attrb.split("|");
				for (var i = 0 ; i < attrb.length ; i ++){
					option += "<option value='"+attrb[i]+"'>"+attrb[i]+"</option> "
				}
			}else{
				option += "<option value='"+data.data.val+"'>"+data.data.val+"</option> "
			}		
			$('#personalConfigForm select').append(option);
			$('#personalConfigForm select').val(data.data.val);
			App.initFormSelect2("#personalConfigForm");
			validate();
		}else{
			$("#personalConfigModal").modal("show");
			$("#codeDetail").text(data.code);
			var valueCallback = {'attra':function(value){return value == "0" ? "否" : "是"}}
			App.setFindValue("#personalConfigInfo",data,valueCallback);
		}	
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
		layer.msg("参数设置成功，重新登录后生效", {icon: 1});
		$('#personalConfigModal').modal('hide');
		searchPersonalConfig(true);
	}
	function improperCallbacks(result){
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
