var curNodeId;	 //当前选中的节点ID;
var dictTree;	//字典树
//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function() {
    getDictTree();
    $("#modalEditContent").load("./dictModal.html?" + App.timestamp()+" #modalEdit");
	$('#modalEditContent').on('hidden.bs.modal', function() {
		$("#modalEditContent").load("./dictModal.html?" + App.timestamp()+" #modalEdit");
	});
})
/*
 * 获取字典树
 */
function getDictTree() {
	App.formAjaxJson(serverPath + "dicts/", "get", "", successCallback);
	function successCallback(result) {
		var data = result.dicts;
		if(!dictTree){
			dictTree = $.fn.zTree.init($("#dictTree"), dictTreeSetting, data);
	        var rootNode = dictTree.getNodes()[0];		//获取第一个节点
	        dictTree.expandNode(rootNode);				//展开第一个节点
	        dictTree.selectNode(rootNode, false, false);	//选中第一个节点
	        if (rootNode) {
	        	curNodeId = rootNode.dictId;
	            createDictTable();
	        }
		}else{
			dictTree.destroy();
			dictTree = $.fn.zTree.init($("#dictTree"), dictTreeSetting, data);
			var checkNodes = dictTree.getNodeByParam("dictId", curNodeId);
			dictTree.expandNode(checkNodes);
			dictTree.selectNode(checkNodes, false, false);
			searchDict(true);
		}
	}
}
/*
 * 字典树的配置
 */
var dictTreeSetting = {
  	view : {
  		selectedMulti : false
  	},
    data: {
        simpleData: {
            enable: true,
            idKey: "dictId",
            pIdKey: "dictParentId",
            rootPId: 0
        },
        key: {
            name: "dictLabel"
        }
    },
    callback: {
        onClick: getDictChildInfo
    }
};
//获取给节点及其子节点的列表信息
function getDictChildInfo(event, treeId, treeNode) {
	curNodeId = treeNode.dictId;
    searchDict();
}
/*
 * dataTable请求到结果后的回调事件
 */
function judge(result){
	stopLoading("#submitBtn");
	return resolveResult(result);
}
function createDictTable() {
	var searchContractTable = App.initDataTables('#dictTable', {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'dicts/dictList',
	        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
	        "dataType":'json',
	        "beforeSend": startLoading("#submitBtn"),
	        "data":function(d){
	        	d.dictParentId = curNodeId;
	            d.dictLabel = $('#dictName').val();
	            d.dictCode = $('#dictCode').val();
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
                render: function(a, b, c, d) {
                	if(c.dictParentId == 0){
                		return "";
                	}else{
                		var btnArray = new Array();
	                    btnArray.push({ "name": "修改", "fn": "dictModal(\'edit\',\'" + c.dictId + "\',\'" + c.dictParentId +"\')" });
	                    btnArray.push({ "name": "删除", "fn": "delDict(\'" + c.dictId + "\',\'" + c.dictLabel + "\',\'" + c.dictParentId + "\')"});
	                    if ('1' == c.dictStatus) {
	                        btnArray.push({ "name": "禁用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictParentId + "\',\'" + c.dictLabel + "\', \'0\')"});
	                    } else {
	                        btnArray.push({ "name": "启用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictParentId + "\',\'" + c.dictLabel + "\', \'1\')"});
	                    }
	                    context = {
	                        func: btnArray
	                    }
	                    var template = Handlebars.compile(btnModel);
	                    var html = template(context);
	                    return html;
                	}
                }
            },
			{ "data": "dictId", title: "编号", className: "text-center" },
            { "data": "dictParentId", title: "父节点编号", className: "text-center" },
            { "data": "dictLabel", title: "字典名称", className: "text-center" },
            { "data": "dictValue", title: "值", className: "text-center" },
            { "data": "dictType", title: "类型", className: "text-center" },
            { "data": "dictSort", title: "顺序", className: "text-center" }
		]
	});
}

/*
 * 搜索点击事件
 */
function searchDict(resetPaging) {
	startLoading("#submitBtn");
	var table = $('#dictTable').DataTable();
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

/*
 * 删除字典
 */
function delDict(dictId,dictLabel,dictParentId) {
	if(dictParentId == 0){
		layer.msg("当前字典为根节点，不能删除！", {icon: 2});
		return false;
	}
	layer.confirm('确定删除名为<span style="color:red;margin:0 5px;">' + dictLabel + '</span>的字典?', {
		icon: 3,
		title: '删除节点'
	}, function(index) {
		App.formAjaxJson(serverPath + 'dicts/' + dictId + '/count', "get", "", successCallback);

		function successCallback(result) {
			layer.close(index);
			if(result.data > 0){
				layer.msg("当前字典含有子节点，不能删除！", {icon: 2});
			}else{
				App.formAjaxJson(serverPath + 'dicts/' + dictId, "DELETE", "", successPostCallback);
				function successPostCallback(result){
					var checkTree = dictTree.getSelectedNodes()[0];
					if(checkTree.dictId == dictId){
						if(checkTree.level == 0){
							curNodeId = dictTree.getNodes()[0].dictId;
						}else{
							curNodeId = checkTree.dictParentId;
						}
					}else{
						curNodeId = checkTree.dictId;
					};
					layer.msg("删除成功", {
						icon: 1
					});
					getDictTree();
				}
			}
		}
	})
}
/*
 * 字典启用禁用
 */
function changeDictStatus(dictId, dictParentId, dictLabel, dictStatus) {
	var statusMsg = dictStatus == "1" ? "启用" : "禁用";
	layer.confirm('确定' + statusMsg + '名为<span style="color:red;margin:0 5px;">' + dictLabel + '</span>的字典?', {
		icon: 3,
		title: '字典' + statusMsg
	}, function(index) {
		layer.close(index);
		doChangeDictStatus(dictId, dictParentId, dictStatus, index);
	});
}
/*
 * 启用禁用提交
 */
function doChangeDictStatus(dictId, dictParentId, dictStatus, index) {
	if(dictParentId == 0){
		layer.msg("根节点禁止“启用禁用”操作", {icon: 2});
		return false;
	}else if(dictTree.getNodeByParam("dictId", dictId).level == 0){
		layer.confirm("树的根节点将消失无法恢复，确认禁用？", {icon: 3},function(){
			var obj = { "dictId": dictId, "dictStatus": dictStatus };
			App.formAjaxJson(serverPath + 'dicts/' + dictId, "PUT", JSON.stringify(obj), successCallback);
			function successCallback(result) {
				var ms = dictStatus == "1" ? "启用成功" : "禁用成功";
				var checkTree = dictTree.getSelectedNodes()[0];
				layer.msg(ms, {
					icon: 1
				});
				if(checkTree.dictId == dictId){
					if(checkTree.level == 0){
						curNodeId = dictTree.getNodes()[0].dictId;
					}else{
						curNodeId = checkTree.dictParentId;
					}
				}else{
					curNodeId = checkTree.dictId;
				};
				getDictTree();
			}
		})
	}
}

/*
 * 字典新增修改弹出框
 */
function dictModal(editType,dictId,dictParentId){
	if(editType == "add") {
		$("#modalTitle").text("新增字典");
		var checkTree = dictTree.getSelectedNodes()[0];
		$("#dictParentName").val(checkTree.dictLabel);
		$("#dictParentId").val(checkTree.dictId);
		validate(editType);
		$('#modalEditContent').modal('show');
	} else if(editType == "edit") {
		if(dictParentId == 0){
			layer.msg("根节点禁止“编辑”操作", {icon: 2});
			return false;
		}
		$("#modalTitle").text("外部人员信息编辑");
		getDictInfor(editType,dictId)
	}
}


/*
 * 获取字典信息详情填充表单
 */
function getDictInfor(editType,dictId){
	App.formAjaxJson(serverPath + "dicts/"+dictId, "get", "", successCallback);
	function successCallback(result){
		$('#modalEditContent').modal('show');
		App.setFormValues("#dictForm",result.sysDict);
		validate(editType,dictId);
	}
}

/*
 * 验证提交
 */
function updateDict(editType,dictId){
	var formObj = App.getFormValues($("#dictForm"));
	var ms = "新增成功";
	var url = serverPath + 'dicts/';
	var pushType = "POST";
	if(editType == "add"){
		formObj.createBy = config.curStaffId;
		formObj.updateBy = config.curStaffId;
		formObj.dictStatus = 1;
		delete formObj.dictId;
	}else{
		formObj.updateBy = config.curStaffId;
		ms = "修改成功";
		url = serverPath + 'dicts/'+dictId;
		pushType = "PUT";
	}
	App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback,improperCallbacks);
	function successCallback(result) {
		layer.msg(ms, {icon: 1});
		getDictTree();
		$('#modalEditContent').modal('hide');
	}
	function improperCallbacks(result){
		$('#externalPersonnelForm').data('bootstrapValidator').resetForm();
	}
}
/*
 * 表单验证
 */
function validate(editType,dictId) {
	$('#dictForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup',
		message: '校验未通过',
		container: 'popover',
		fields: {
			dictLabel : {
				validators : {
					notEmpty : {
						message : '请输入字典名称'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					}
				}
			},
			dictValue : {
				validators : {
					notEmpty : {
						message : '请输入字典值'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					}
				}
			},
			dictType : {
				validators : {
					notEmpty : {
						message : '请输入字典类型'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					}
				}
			},
			dictSort : {
				validators : {
					notEmpty : {
						message : '请输入字典顺序'
					},
					numeric : {
						message : "只能输入纯数字"
					},
					stringLength : {
						min : 0,
						max : 6,
						message : '请输入不超过6个字符'
					}
				}
			},
			dictDesc : {
				validators : {
					stringLength : {
						min : 0,
						max : 50,
						message : '请输入不超过50个字符'
					}
				}
			},
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		updateDict(editType,dictId);
	});
}