var curNode; //当前节点
var dictTree; //字典树
//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function() {
    getDictTree();
})
/*
 * 获取字典树
 */
function getDictTree() {
	App.formAjaxJson(serverPath + "dicts/", "get", "", successCallback);
	function successCallback(result) {
		var data = result.dicts
		dictTree = $.fn.zTree.init($("#dictTree"), dictTreeSetting, data);
        var treeObj = $.fn.zTree.getZTreeObj("dictTree");
        var rootNode = dictTree.getNodes()[0];		//获取第一个节点
        dictTree.expandNode(rootNode);				//展开第一个节点
        treeObj.selectNode(rootNode, false, false);	//选中第一个节点
        if (rootNode) {
        	$("#dictParentId").val(rootNode.dictId);
            createDictTable();
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
        //beforeClick: function(treeId, treeNode) {},
        onClick: getDictChildInfo
    }
};
//获取给节点及其子节点的列表信息
function getDictChildInfo(event, treeId, treeNode) {
    $("#dictParentId").val(treeNode.dictId);
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
	        	d.dictParentId = $("#dictParentId").val();
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
                    var btnArray = new Array();
                    btnArray.push({ "name": "修改", "fn": "goDictEdit(\'" + c.dictId + "\')" });
                    btnArray.push({ "name": "删除", "fn": "delDict(\'" + c.dictId + "\',\'" + c.dictLabel + "\',\'" + c.dictParentId + "\')"});
                    if ('1' == c.dictStatus) {
                        btnArray.push({ "name": "禁用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictLabel + "\', \'0\')"});
                    } else {
                        btnArray.push({ "name": "启用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictLabel + "\', \'1\')"});
                    }
                    context = {
                        func: btnArray
                    }
                    var template = Handlebars.compile(btnModel);
                    var html = template(context);
                    return html;
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
	layer.confirm('确定删除名为<span style="color:red;margin:0 5px;">' + dictLabel + '</span>的字典?', {
		icon: 3,
		title: '删除节点'
	}, function(index) {
		App.formAjaxJson(serverPath + 'dicts/' + dictId + '/count', "get", "", successCallback);

		function successCallback(result) {
			layer.close(index);
			if(result.data > 0){
				layer.msg("当前字典含有子节点，不能删除!", {icon: 2});
			}else{
				App.formAjaxJson(serverPath + 'dicts/' + dictId, "DELETE", "", successPostCallback);
				function successPostCallback(result){
					curNode = dictTree.getNodeByParam("dictId", dictId);
                    dictTree.removeNode(curNode);
                    var parentNode = dictTree.getNodeByParam("dictId", dictParentId);
                    dictTree.selectNode(parentNode, false, false);
                    $("#dictParentId").val(parentNode.dictId);
					layer.msg("删除成功", {
						icon: 1
					});
					searchDict(true);
				}
			}
		}
	});
}
/*
 * 字典启用禁用
 */
function changeDictStatus(dictId, dictLabel, dictStatus) {
	var statusMsg = dictStatus == "1" ? "启用" : "禁用";
	layer.confirm('确定' + statusMsg + '名为<span style="color:red;margin:0 5px;">' + dictLabel + '</span>的字典?', {
		icon: 3,
		title: '字典' + statusMsg
	}, function(index) {
		doChangeDictStatus(dictId, dictStatus, index);
	});
}
/*
 * 启用禁用提交
 */
function doChangeDictStatus(dictId, dictStatus, index) {
	var obj = { "dictId": dictId, "dictStatus": dictStatus };
	App.formAjaxJson(serverPath + 'dicts/' + dictId, "PUT", JSON.stringify(obj), successCallback);
	function successCallback(result) {
		layer.close(index);
		var ms = dictStatus == "1" ? "启用成功" : "禁用成功";
		layer.msg(ms, {
			icon: 1
		});
		searchDict(true);
	}
}
























//重置查询条件
function searchDictReset() {
    $("#searchDictForm input").val("");
}
//新增字典
function goDictAdd() {
    $("#dictLoadPart").load("../dict/dictAdd.html", function() {
        $("#dictAddForm input[name='createBy']").val(curStaffId);
        $("#dictAddForm input[name='updateBy']").val(curStaffId);
        $("#dictAddForm input[name='dictStatus']").val("1");
    })
    $("#dictLoadPart").show();
    $("#dictManage").hide();
}

function goDictEdit(dictId) {
    // debugger;
    $("#selectedDictId").val(dictId);
    $("#dictLoadPart").load("../dict/dictEdit.html", function() {
        $("#dictEditForm input[name='updateBy']").val(curStaffId);
        $("#dictEditForm input[name='dictId']").val(dictId);
    })
    $("#dictLoadPart").show();
    $("#dictManage").hide();
}





function returnDict() {
    $("#dictLoadPart").empty();
    $("#dictManage").show();
    searchDict();
}