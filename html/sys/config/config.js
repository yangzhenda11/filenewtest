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
	App.initDataTables('#configTable', "#submitBtn", {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'configs/',
	        "data":function(d){
	        	d.code = $('#configCode').val();
	            return d;
	        }
		},
		"columns": [{
                "data": null,
                title: "操作",
                className: "text-center",
                render: function(data, type, full, meta) {
                	if(full){
                		var btnArray = new Array();
		                btnArray.push({ "name": "修改", "fn": "editConfigModal(\'" + full.id + "\')" });
		                btnArray.push({ "name": "删除", "fn": "delConfig(\'" + full.id + "\',\'" + full.code + "\')" })
		                return App.getDataTableBtn(btnArray);
                	}else{
                		return "";
                	}
	            }
            },
            {"data": null,
            	title: "参数名称",
            	render: function(data, type, full, meta) {
					return '<a href=\"javascript:void(0)\" onclick = "detailConfigModal(\'' + full.id + '\')">' + full.code + '</a>';
					
				}
           },
        	{ "data": "val", "title": "参数值", render: $.fn.dataTable.render.ellipsis(22, true) },
            {"data": "attra",
            	"title": "允许用户更改",
            	render: function(data, type, full, meta) {
            		return  data == 0 ? "否" : "是";
            	}
        	},
        	{ "data": "attrb", "title": "可更改枚举值", render: $.fn.dataTable.render.ellipsis(22, true) }
		]
	});
}

/*
 * 搜索点击事件
 */
function searchConfig(retainPaging) {
	var table = $('#configTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
/*
 * 系统参数详情点击事件
 */
function detailConfigModal(id){
	$("#modal").load("_configModal.html?" + App.timestamp()+" #modalDetail",function(){
		getConfig(id,"detail");
	});
}
/*
 * 新增系统参数点击事件
 */
function addConfigModal(){
	$("#modal").load("_configModal.html?" + App.timestamp()+" #modalEdit",function(){
		$("#modalTitle").text("新增系统参数");
		$("#modal").modal("show");
		App.initFormSelect2("#configForm");
		validate("add");
	});
}
/*
 * 修改系统参数点击事件
 */
function editConfigModal(id){
	$("#modal").load("_configModal.html?" + App.timestamp()+" #modalEdit",function(){
		$("#modalTitle").text("系统参数修改");
		App.initFormSelect2("#configForm");
		getConfig(id,"edit");
	});
}
/*
 * 获取参数信息
 */
function getConfig(id,type){
	App.formAjaxJson(serverPath + 'configs/' + id, "get", "", successCallback);
	function successCallback(result){
		var data = result.sysConfig;
		if(type == "edit"){
			$('#modal').modal('show');
			App.setFormValues("#configForm",data);
			validate("edit");
		}else{
			$("#modal").modal("show");
			$("#codeDetail").text(data.code);
			var valueCallback = {'attra':function(value){return value == "0" ? "否" : "是"}}
			App.setFindValue("#configInfo",data,valueCallback);
		}	
	}
}

/*
 * 系统参数删除点击事件，提交删除
 */
function delConfig(id, code) {
	layer.confirm('确定删除系统参数<span style="color:red;margin:0 5px;">' + code + '</span>?', {
		icon: 3,
		title: '删除系统参数'
	}, function(index) {
		App.formAjaxJson(serverPath + 'configs/' + id, "DELETE", "", successCallback);
		function successCallback(result) {
			layer.close(index);					
			layer.msg("删除成功");
			searchConfig(true);
		}
	})
}
/*
 * 新增||修改提交
 */
function updateConfig(editType) {
	var formObj = App.getFormValues($("#configForm"));
	var ms = "新增成功";
	var url = serverPath + 'configs/';
	var pushType = "POST";
	if(editType == "add"){
		delete formObj.id;
	}else{
		ms = "修改成功";
		url = serverPath + 'configs/' + formObj.id;
		pushType = "PUT";
	}
	App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback,improperCallbacks);
	function successCallback(result) {
		layer.msg(ms);
		searchConfig(true);
		$('#modal').modal('hide');
	}
	function improperCallbacks(result){
		$('#configForm').data('bootstrapValidator').resetForm();
	}
}
/*
 * 表单验证
 */
function validate(editType) {
	$('#configForm').bootstrapValidator({
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
				}
			}
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		updateConfig(editType);
	})
}