var curNodeId;	 //当前选中的节点ID;
var dictTree;	//字典树
//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function() {
	parent.data_permFilter(document);
    getDictTree();
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
	        	curNodeId = rootNode.dictValue;
	            createDictTable();
	            $("#toolbars").removeClass("hide");
	        }
		}else{
			dictTree.destroy();
			dictTree = $.fn.zTree.init($("#dictTree"), dictTreeSetting, data);
			var checkNodes = dictTree.getNodeByParam("dictValue", curNodeId);
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
            idKey: "dictValue",
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
	curNodeId = treeNode.dictValue;
	if(treeNode.level < 2){
		$("#toolbars").removeClass("hide");
	}else{
		$("#toolbars").addClass("hide");
	}
    searchDict();
}
/*
 * dataTable初始化事件
 */
/*var dictUpdate = parent.data_tpFilter("sys:dict:update");
var dictDelete = parent.data_tpFilter("sys:dict:delete");*/
function createDictTable() {
	App.initDataTables('#dictTable', "#submitBtn", {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'dicts/dictList',
	        "data":function(d){
	        	d.dictParentId = curNodeId;
	            d.dictLabel = $('#dictName').val();
	            d.dictCode = $('#dictCode').val();
	            return d;
	        }
		},
		"columns": [{
                data: null,
                title: "操作",
                className: "text-center",
                render: function(a, b, c, d) {
                	if(c.dictParentId == 0){
                		return "";
                	}else{
                		var btnArray = new Array();
            			btnArray.push({ "name": "修改", "fn": "dictModal(\'edit\',\'" + c.dictId + "\',\'" + c.dictParentId + "\',\'" + c.orgName +"\')" });
                    //btnArray.push({ "name": "删除", "fn": "delDict(\'" + c.dictId + "\',\'" + c.dictLabel + "\',\'" + c.dictParentId + "\')"});
            			if ('1' == c.dictStatus) {
	                        btnArray.push({ "name": "禁用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictParentId + "\',\'" + c.dictLabel + "\', \'0\')"});
	                    } else {
	                        btnArray.push({ "name": "启用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictParentId + "\',\'" + c.dictLabel + "\', \'1\')"});
	                    }
	                    return App.getDataTableBtn(btnArray);;
                	}
                }
            },
			//{ "data": "dictId", title: "编号"},
            { "data": "dictParentId", title: "字典编码"},
            { "data": "dictLabel", title: "字典项名称"},
            { "data": "dictValue", title: "字典项编码"},
            {"data": "provinceCode","title": "适用范围",
            	"render": function(data, type, full, meta) {
                	if(data == null){
                    	return "";
                	}
                	return provinceCodeInfo[data];
            	}
        	},
            { "data": "dictSort", title: "顺序"}
		],
		drawCallbackFn:function(){
			var windowHeigth = $(window).height();
			var documentHeight = $(".portlet").outerHeight();
			if(windowHeigth > documentHeight){
				$("#dictTree").css("max-height",windowHeigth - 110);
			}else{
				$("#dictTree").css("max-height",documentHeight - 110);
			}
		}
	})
}

/*
 * 搜索点击事件
 */
function searchDict(resetPaging) {
	var table = $('#dictTable').DataTable();
	var checkNode =  dictTree.getSelectedNodes()[0];
	console.log(checkNode)
	if(checkNode.level > 1){
		curNodeId = checkNode.dictParentId;
	}
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

/*
 * 删除字典
 */
/*function delDict(dictId,dictLabel,dictParentId) {
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
}*/
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
 * 启用禁用验证是否为根节点
 */
function doChangeDictStatus(dictId, dictParentId, dictStatus, index) {
	if(dictParentId == 0){
		layer.msg("根节点禁止“启用禁用”操作", {icon: 2});
		return false;
	}else if(dictStatus == 0){
		var checkTreeLevel = dictTree.getNodeByParam("dictId", dictId).level;
		if(checkTreeLevel == 0){
			layer.confirm("树的根节点将消失无法恢复，确认禁用？", {icon: 3},function(){
				postDictChangeStatus(dictId,dictStatus);
			});
		}else{
			postDictChangeStatus(dictId,dictStatus);
		}
	}else{
		postDictChangeStatus(dictId,dictStatus);
	}
}

function postDictChangeStatus(dictId,dictStatus){
	var obj = { "dictId": dictId, "dictStatus": dictStatus };
	App.formAjaxJson(serverPath + 'dicts/' + dictId, "PUT", JSON.stringify(obj), successCallback);
	function successCallback(result) {
		var ms = dictStatus == "1" ? "启用成功" : "禁用成功";
		var checkTree = dictTree.getSelectedNodes()[0];
		layer.msg(ms, {
			icon: 1
		});
		if(checkTree.dictValue == dictValue){
			if(checkTree.level == 0){
				curNodeId = dictTree.getNodes()[0].dictValue;
			}else{
				curNodeId = checkTree.dictParentId;
			}
		}else{
			curNodeId = checkTree.dictValue;
		};
		getDictTree();
	}
}


/*
 * 字典新增修改弹出框
 */
function dictModal(editType,dictId,dictParentId,provinceName){
	$("#modal").load("_dictModal.html?" + App.timestamp()+" #modalEdit",function(){
		//加载组织树
		/*App.formAjaxJson(serverPath + "orgs/" + config.curOrgId + "/orgTree", "get", null, successCallback);
		function successCallback(result) {
			var data = result.data;
			if(null == data) {
				layer.msg("没有相关组织和人员信息", {icon: 2});
			} else {
				orgNameTree = $.fn.zTree.init($("#provinceName"), orgsSetting, data);
			}
		};
		$("#provinceCodeTree").on("click",function(){
			showTree('provinceCodeTree');
		});*/
		
		App.initFormSelect2("#dictForm");
        var ajaxObj = {
        	"url" :  serverPath + "dicts/listChildrenByDicttId",
        	"type" : "post",
        	"data" : {"dictId": 9075},
        	"async" : false
        }
        App.initAjaxSelect2("#provinceCode",ajaxObj,"dictValue","dictLabel","请选择省分编码");
        
		if(editType == "add") {
			$("#modalTitle").text("新增字典");
			var checkTree = dictTree.getSelectedNodes()[0];
			$("#dictParentName").val(checkTree.dictLabel);
			$("#dictParentId").val(checkTree.dictValue);
			$("#dictValue").removeAttr("disabled");
			validate(editType);
			$('#modal').modal('show');
		} else if(editType == "edit") {
			if(dictParentId == 0){
				layer.msg("根节点禁止“编辑”操作", {icon: 2});
				return false;
			}
			$("#modalTitle").text("字典修改");
			$("#dictValue").attr("disabled", "disabled");
			getDictInfor(editType,dictId,provinceName)

		}
	});
}


/*
 * 获取字典信息详情填充表单
 */
function getDictInfor(editType,dictId,provinceName){
	App.formAjaxJson(serverPath + "dicts/"+dictId, "get", "", successCallback);
	function successCallback(result){
		$('#modal').modal('show');
		App.setFormValues("#dictForm",result.sysDict);
		//$("#provinceCodeTree").val(provinceName);
		//$("#provinceCodeTree").attr("title",provinceName);
		//$("#provinceCodeTree").data("id",result.sysDict.provinceCode);
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
	//formObj.provinceCode = $("#provinceCodeTree").data("id");
	App.formAjaxJson(url, pushType, JSON.stringify(formObj), successCallback,improperCallbacks);
	function successCallback(result) {
		layer.msg(ms);
		getDictTree();
		$('#modal').modal('hide');
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
		trigger: 'live focus blur keyup change',
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
			provinceCode: {
                validators: {
                    notEmpty: {
                        message: '请选择适用范围'
                    }
                }
            }
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		updateDict(editType,dictId);
	});
}
// 刷新站点树
function refreshTree() {
	App.formAjaxJson(serverPath + "dicts/", "get", "", successCallback);
	function successCallback(result) {
		dictTree.destroy();
		var data = result.dicts;
		dictTree = $.fn.zTree.init($("#dictTree"), dictTreeSetting, data);
        var rootNode = dictTree.getNodes()[0];
        dictTree.expandNode(rootNode);
        dictTree.selectNode(rootNode, false, false);
        if (rootNode) {
     		curNodeId = rootNode.dictId;
        	$("#toolbars").removeClass("hide");
        	curNodeId = rootNode.dictId;
			searchDict(true);
        }
	}
}
// 展开所有
function expandAll() {
    var nodes = dictTree.getNodes();
    expandNodes(nodes);
}

//展开所有节点及其子节点
function expandNodes(nodes) {
    if (!nodes)
        return;
    for (var i = 0, l = nodes.length; i < l; i++) {
        dictTree.expandNode(nodes[i], true, false, false);
        if (nodes[i].isParent) {
            expandNodes(nodes[i].children);
        }
    }
}
// 关闭所有
function collapseAll() {
    dictTree.expandAll(false);
}

var ajaxObj = {
    "url" :  serverPath + "dicts/listChildrenByDicttId",
    "type" : "post",
    "data" : {"dictId": 9075},
    "async" : false
};
//从缓存中取关联编码字典集
var provinceCodeInfo = new Array();
var postData = JSON.stringify(ajaxObj.data);
App.formAjaxJson(ajaxObj.url,ajaxObj.type,postData,succssCallback1,null,null,null,ajaxObj.async);
function succssCallback1(result) {
    var data = result.data;
    $.each(data, function (i, item) {
        provinceCodeInfo[item.dictValue] = item.dictLabel;
    });
}
/*
 * 显示所属组织树
 */
/*function showTree(dom) {
	var selectObj = $("#" + dom + "");
	var selectOffset = selectObj.offset();
	$("#" + dom + "Content").css({
		left: "0",
		top: selectObj.outerHeight() + "px",
		width: selectObj.outerWidth() + 50
	}).slideDown("fast");
	onBodyDown(dom);
}*/
/*
 * 隐藏所属组织树
 */
/*function hideMenu(dom) {
	$("#" + dom + "Content").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}*/
/*
 * 组织树点击事件
 */
/*function onBodyDown(dom) {
	$("body").on("mousedown", function(event) {
		if(!(event.target.id == dom || event.target.id == dom + "Content" || $(event.target).parents("#" + dom + "Content").length > 0)) {
			hideMenu(dom);
		}
	});
}*/
/*
 * 所属组织树配置单选配置
 */
/*var orgsSetting = {
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
}*/

 /* ztree异步加载之前
 
function zTreeBeforeAsync(treeId, treeNode) {
	orgNameTree.setting.async.url = serverPath + "orgs/" + treeNode.orgId + "/children";
	return true;
}*/


 /* ztree点击事件
 */
/*function onClick(event, treeId, treeNode) {

	var nodes = $.fn.zTree.getZTreeObj(treeId).getSelectedNodes();
	var selectName = nodes[0].orgName;
	var selectId = nodes[0].orgId;
	$("input[name=" + treeId + "]").data("id", selectId);
	$("input[name=" + treeId + "]").val(selectName);
	$("input[name=" + treeId + "]").attr("title", selectName);
	if(treeId == "provinceName"){
		$("#dictForm").data("bootstrapValidator").updateStatus("provinceName",  "NOT_VALIDATED",  null );
		$("#dictForm").data("bootstrapValidator").validateField('provinceName');
	}
}*/
