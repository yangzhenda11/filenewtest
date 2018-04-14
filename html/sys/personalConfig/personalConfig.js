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
 * 新增系统参数点击事件
 */
function addPersonalConfigModal(){
	$("#personalConfigModal").load("_personalConfigModal.html?" + App.timestamp()+" #modalEdit",function(){
		$("#modalTitle").text("新增系统参数");
		$("#personalConfigModal").modal("show");
		App.initFormSelect2("#personalConfigForm");
		validate("add");
	});
}
/*
 * 修改系统参数点击事件
 */
function editPersonalConfigModal(id){
	$("#personalConfigModal").load("_personalConfigModal.html?" + App.timestamp()+" #modalEdit",function(){
		$("#modalTitle").text("系统参数修改");
		App.initFormSelect2("#personalConfigForm");
		getPersonalConfig(id,"edit");
	});
}

/*
 * 系统参数详情点击事件
 */
function detailPersonalConfigModal(id){
	$("#personalConfigModal").load("_personalConfigModal.html?" + App.timestamp()+" #modalDetail",function(){
		getPersonalConfig(id,"detail");
	});
}

/*
 * 系统参数删除点击事件，提交删除
 */
function delPersonalConfig(id, code) {
	layer.confirm('确定删除系统参数<span style="color:red;margin:0 5px;">' + code + '</span>?', {
		icon: 3,
		title: '删除系统参数'
	}, function(index) {
		App.formAjaxJson(serverPath + 'personalConfig/' + id, "DELETE", "", successCallback);
		function successCallback(result) {
			layer.close(index);					
			layer.msg("删除成功", {
				icon: 1
			});
			searchPersonalConfig(true);
		}
	})
}
/*
 * 获取参数信息
 */
function getPersonalConfig(id,type){
	App.formAjaxJson(serverPath + 'personalConfig/selectOne/' + id +"?staffOrgId="+ globalConfig.curStaffOrgId+ App.timestamp(), "GET", null, successCallback, null, null, null, false);
	function successCallback(result){
		var data = result;
		if(type == "edit"){
			debugger
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
			validate("edit");
		}else{
			$("#personalConfigModal").modal("show");
			$("#codeDetail").text(data.code);
			var valueCallback = {'attra':function(value){return value == "0" ? "否" : "是"}}
			App.setFindValue("#personalConfigInfo",data,valueCallback);
		}	
	}
}

/*
 * 新增||修改提交
 */
function updatePersonalConfig(editType) {
	debugger
	var formObj = App.getFormValues($("#personalConfigForm"));
	var ms = "新增成功";
	var url = serverPath + 'personalConfig/';
	var pushType = "POST";
	if(editType == "add"){
		delete formObj.id;
	}else{
		ms = "修改成功";
		var id = $('#personalConfigForm input[name="id"]').val();
		url = serverPath + 'personalConfig/update';
		pushType = "PUT";
	}
	App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback,improperCallbacks, null, null, false);
	function successCallback(result) {
		layer.msg(ms, {icon: 1});
		searchPersonalConfig(true);
		$('#personalConfigModal').modal('hide');
	}
	function improperCallbacks(result){
		$('#personalConfigForm').data('bootstrapValidator').resetForm();
	}
}
/*
 * 表单验证
 */
function validate(editType) {
	$('#personalConfigForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup',
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
		updatePersonalConfig(editType);
	})
}
