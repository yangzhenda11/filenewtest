var organisationTree = null;
var orgNameTree = null;
//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
//页面初始化事件
$(function() {
	getTreeInfo();
	$("#modalEditContent").load("./html/externalPersonnelModal.html?" + App.timestamp());
	$('#modalEditContent').on('hidden.bs.modal', function() {
		$("#modalEditContent").load("./html/externalPersonnelModal.html?" + App.timestamp());
	});
})
/*
 * 显示所属组织树
 */
function showTree(dom) {
	var selectObj = $("#" + dom + "");
	var selectOffset = selectObj.offset();
	$("#" + dom + "Content").css({
		left: "0",
		top: selectObj.outerHeight() + "px",
		width: selectObj.outerWidth() + (dom == "orgNameIn" ? 40 : 120)
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
		if(!(event.target.id == dom || event.target.id == dom + "Content" || $(event.target).parents("#" + dom + "Content").length > 0)) {
			hideMenu(dom);
		}
	});
}
/*
 * 所属组织树配置单选配置
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
		onClick: onClick,
		beforeAsync: zTreeBeforeAsync
	}
};

function orgsfilter(treeId, parentNode, responseData) {
	var responseData = responseData.data;
	if(responseData) {
		return responseData;
	} else {
		return null;
	}
}
/*
 * ztree异步加载之前
 */
function zTreeBeforeAsync(treeId, treeNode) {
	if(treeId == "organisationTree") {
		organisationTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
	}else if(treeId == "orgName"){
		orgNameTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
	}
	return true;
}

/*
 * ztree点击事件
 */
function onClick(event, treeId, treeNode) {
	var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
	var selectName = nodes[0].orgName;
	var selectId = nodes[0].orgId;
	$("input[name=" + treeId + "]").data("id", selectId);
	$("input[name=" + treeId + "]").val(selectName);
	$("input[name=" + treeId + "]").attr("title", selectName);
	if(treeId == "orgName"){
		$("#externalPersonnelForm").data("bootstrapValidator").updateStatus("orgName",  "NOT_VALIDATED",  null );
		$("#externalPersonnelForm").data("bootstrapValidator").validateField('orgName');
	}
}
/*
 * 获取组织
 * 所属组织树配置
 */
function getTreeInfo(code) {
	App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", "", successCallback);
	function successCallback(result) {
		var data = result.data;
		var allObj = {
			isParent: "false",
			orgId: "",
			orgName: "全部"
		}
		if(null == data) {
			layer.msg("没有相关组织和人员信息", {
				icon: 2
			});
		} else {
			data.unshift(allObj);
			organisationTree = $.fn.zTree.init($("#organisationTree"), orgsSetting, data);
		}
	}
}
/*
 * 请求到结果后的回调事件
 */
function judge(result) {
	stopLoading("#submitBtn");
	return resolveResult(result);
}
/*
 * 表格初始化
 */
var personnelTable = App.initDataTables('#personnelTable', {
	"serverSide": true,
	fixedColumns: {
		leftColumns: 2
	},
	buttons: ['copy', 'colvis'],
	ajax: {
		"type": "GET",
		"url": serverPath + 'staffs/',
		"contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
		"dataType": 'json',
		"beforeSend": startLoading("#submitBtn"),
		"data": function(d) {
			d.sysOrgId = config.curOrgId;
			d.staffName = $("input[name='staffName']").val();
			d.loginName = $("input[name='loginName']").val();
			d.staffStatus = $("select[name='staffStatus']").val();
			d.orgId = $("#organisation").data("id");
			return d;
		},
		error: function(xhr, error, thrown) {
			stopLoading("#submitBtn");
			layer.msg("接口错误", {
				icon: 2
			});
		},
		"dataSrc": judge
	},
	"columns": [{
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var html = "";
					var para = data.STAFF_ID + '&&' + data.STAFF_NAME + '&&' + data.LOGIN_NAME + '&&' + data.STAFF_STATUS;
					html += '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "personnelModal(\'edit&&' + data.STAFF_ID + '\')">修改</button>' +
						'<button class="btn primary btn-outline btn-xs dt-edit" onclick = "resetPasswd(\'' + para + '\')">密码重置</button>';
					if(data.STAFF_STATUS == '1') {
						html += '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "changeStaffStatus(\'' + para + '\')">禁用</button>';
					} else {
						html += '<button class="btn primary btn-outline btn-xs dt-edit" onclick = "changeStaffStatus(\'' + para + '\')">启用</button>';
					}
					return html;
				} else {
					return '';
				}
			}
		},
		{
			"data": null,
			"className": "text-center",
			"title": "人员姓名",
			render: function(data, type, full, meta) {
				return '<a href=\"javascript:void(0)\" onclick = "personnelModal(\'detail&&' + data.STAFF_ID + '\')">' + data.STAFF_NAME + '</a>';
			}
		},
		{
			"data": "LOGIN_NAME",
			"className": "text-center",
			"title": "账号"
		},
		{
			"data": "ORG_NAME",
			"className": "text-center",
			"title": "岗位"
		},
		{
			"data": "SEX",
			"className": "text-center",
			"title": "性别",
			render: function(data, type, full, meta) {
				return data == 'M' ? '男' : '女';
			}
		},
		{
			"data": "EMAIL",
			"className": "text-center",
			"title": "邮箱"
		},
		{
			"data": "MOBIL_PHONE",
			"className": "text-center",
			"title": "手机"
		},
		{
			"data": "STAFF_STATUS",
			"className": "text-center",
			"title": "岗位状态",
			render: function(data, type, full, meta) {
				return data == '1' ? '有效' : '无效';
			}
		},
	]
});
/*
 * 搜索点击事件
 */
function searchPersonnel(resetPaging) {
	startLoading("#submitBtn");
	var table = $('#personnelTable').DataTable();
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

/*
 * 密码重置
 * para = data.STAFF_ID + '&&' + data.STAFF_NAME + '&&' + data.LOGIN_NAME + data.STAFF_STATUS;
 */
function resetPasswd(para) {
	para = para.split("&&");
	layer.confirm('确定重置<span style="color:red;margin:0 5px;">' + para[1] + '</span>的密码?', {
		icon: 3,
		title: '密码重置'
	}, function(index) {
		App.formAjaxJson(serverPath + 'staffs/' + para[0] + "/passwd/" + para[2], "PUT", "", successCallback);

		function successCallback(result) {
			layer.close(index);
			layer.alert("用户<span style='color:red;margin:0 5px;'>" + para[1] + "</span>的密码重置成功，</br>新密码为<span style='color:red;margin:0 5px;'>" + result.data + "</span>。", {
				icon: 1
			});
		}
	});
}
/*
 * 用户启用禁用
 * STAFF_STATUS 1已经启用    0禁用
 * para = data.STAFF_ID + '&&' + data.STAFF_NAME + '&&' + data.LOGIN_NAME + data.STAFF_STATUS;
 */
function changeStaffStatus(para) {
	para = para.split("&&");
	var statusMsg = "启用";
	var status = 1;
	if(para[3] == "1") {
		statusMsg = "禁用";
		status = 0;
	};
	layer.confirm('确定' + statusMsg + '<span style="color:red;margin:0 5px;">' + para[1] + '</span>的账号?', {
		icon: 3,
		title: '账号' + statusMsg
	}, function(index) {
		doChangeStaffStatus(para[0], status, index);
	});
}
/*
 * 启用禁用提交
 */
function doChangeStaffStatus(staffId, staffStatus, index) {
	App.formAjaxJson(serverPath + "staffs/" + staffId + "/status/" + staffStatus, "PUT", "", successCallback);
	function successCallback(result) {
		layer.close(index);
		var ms = staffStatus == "1" ? "启用成功" : "禁用成功";
		layer.msg(ms, {
			icon: 1
		});
		searchPersonnel(true);
	}
}
/*
 * 判断modal类型
 */
function personnelModal(code) {
	var code = code.split("&");
	var editType = code[0];
	if(editType == "add") {
		$("#modalTitle").text("新增外部人员");
		$("#modalDefault").addClass("hide");
		$("#mainContent").removeClass("hide");
		dateRegNameChose();
		validate(editType);
	} else if(editType == "edit") {
		$("#modalTitle").text("外部人员信息编辑");
		$("#modalDefault").addClass("hide");
		$("#mainContent").removeClass("hide");
		validate(editType);
	} else {
		$("#modalTitle").text("外部人员信息详情");
	}
	$('#modalEditContent').modal('show');
}
//日期和组织树选择触发
function dateRegNameChose(){
	if($.fn.datepicker) {
		$.fn.datepicker.defaults.format = 'yyyy-mm-dd';
		$.fn.datepicker.defaults.language = 'zh-CN';
		$.fn.datepicker.defaults.autoclose = true;
		$('.date-picker').datepicker({
			format: "yyyy-mm-dd"
		});
	};
	$("#orgNameIn").on("click",function(){
		showTree('orgNameIn');
	});
	App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", "", successCallback);
	function successCallback(result) {
		var data = result.data;
		if(null == data) {
			layer.msg("没有相关组织和人员信息", {icon: 2});
		} else {
			orgNameTree = $.fn.zTree.init($("#orgName"), orgsSetting, data);
		}
	}
}
/*
 * 提交
 */
function updateExternalPersonnel(editType) {
	var formObj = App.getFormValues($("#externalPersonnelForm"));
	console.log(formObj);
	
	//App.formAjaxJson("/orgPartner", "PUT", JSON.stringify(obj), successCallback);

	function successCallback(result) {
		layer.msg("修改成功", {icon: 1});
		searchPersonnel(true);
		$('#modalEditContent').modal('hide');
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
						max : 30,
						message : '请输入5或30位密码'
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