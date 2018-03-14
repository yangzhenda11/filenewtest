var curNode; //当前节点
var dictTree; //字典树
var dictTable; //字典列表
//按钮
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="user-button user-{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
//字典树配置信息
var dictTreeSetting = {
    check: {
        enable: false
    },
    //	view : {
    //		selectedMulti : true
    //	},
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
        beforeClick: function(treeId, treeNode) {},
        onClick: getDictChildInfo

    }
};

$(function() {
        // debugger;
        getDictTree();
    })
    //获取字典树
function getDictTree() {
    // debugger;
    $.get(parent.globalConfig.serverPath + "dicts/", function(data) {
        dictTree = $.fn.zTree.init($("#dictTree"), dictTreeSetting, data.dicts);
        var treeObj = $.fn.zTree.getZTreeObj("dictTree");
        var rootNode = dictTree.getNodes()[0];
        dictTree.expandNode(rootNode); //展开根节点
        //获取根节点  
        treeObj.selectNode(rootNode, false, false);
        var nodes = treeObj.getNodes();
        if (nodes.length > 0) {
            var node = nodes[0];
            getDictChildInfo(null, null, node);
        }
    });
}

//获取给节点及其子节点的列表信息
function getDictChildInfo(event, treeId, treeNode) {
    curNode = treeNode;
    getDictTable(treeNode.dictId);
}
//获取字典列表
function getDictTable(dictParentId) {
    // debugger;
    $("#dictTable").show();
    if (dictTable) {
        dictTable.destroy();
    }
    dictTable = $("#dictTable").DataTable({ //字典表绑定datatables
        "ordering": false, // 排序
        "serverSide": true, // 开启服务器模式
        ajax: {
            "type": "GET",
            "url": parent.globalConfig.serverPath + 'dicts/dictList', //请求路径
            "data": function(d) { // 查询参数
                d.dictParentId = dictParentId;
                d.dictLabel = $('#dictName').val();
                d.dictCode = $('#dictCode').val();
                return d;
            }
        },
        columns: [ // 对应列
            {
                "data": null,
                title: "操作",
                className: "text-center",
                render: function(a, b, c, d) {
                    var btnArray = new Array();
                    btnArray.push({ "name": "修改", "fn": "goDictEdit(\'" + c.dictId + "\')" });
                    btnArray.push({ "name": "删除", "fn": "delDict(\'" + c.dictId + "\',\'" + c.dictLabel + "\',\'" + c.dictParentId + "\')", "type": "btn-n" });
                    if ('1' == c.dictStatus) {
                        btnArray.push({ "name": "禁用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictLabel + "\', \'0\')", "type": "user-button user-btn-n" });
                    } else {
                        btnArray.push({ "name": "启用", "fn": "changeDictStatus(\'" + c.dictId + "\',\'" + c.dictLabel + "\', \'1\')", "type": "user-button" });
                    }
                    context = {
                        func: btnArray
                    }
                    var html = template(context);
                    return html;
                }
            },
            { "data": "dictId", title: "编号", className: "text-center" },
            { "data": "dictParentId", title: "父节点编号", className: "text-center" },
            { "data": "dictLabel", title: "名称", className: "text-center" },
            { "data": "dictValue", title: "值", className: "text-center" },
            { "data": "dictType", title: "类型", className: "text-center" },
            { "data": "dictSort", title: "顺序", className: "text-center" }
        ],
        "columnDefs": [{ // 所有列默认值
            "targets": "_all",
            "defaultContent": ''
        }],
        // lengthMenu: [
        //     menuLength,
        //     menuLength
        // ],
        "dom": 'rt<"pull-left mt5"l><"pull-left mt5"i><"pull-right mt5"p><"clear">' //生成样式
    });

}
//按条件查询字典列表
function searchDict() {
    dictTable.ajax.reload();
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

function delDict(dictId, dictLabel, dictParentId) {
    $.ajax({
        "type": "GET",
        "url": parent.globalConfig.serverPath + 'dicts/' + dictId + '/count',
        success: function(data) {
            if (data.data > 0) {
                alert("当前字典含有子节点，不能删除!");
                return;
            } else {
                // debugger;
                if (confirm("确认删除此字典" + dictLabel + "么？")) {
                    $.ajax({
                        "type": "DELETE",
                        "url": parent.globalConfig.serverPath + 'dicts/' + dictId,
                        success: function(data) {
                            curNode = dictTree.getNodeByParam("dictId", dictId);
                            dictTree.removeNode(curNode);
                            var parentNode = dictTree.getNodeByParam("dictId", dictParentId);
                            dictTree.selectNode(parentNode, false, false);
                            getDictTable(dictParentId);
                            alert("删除成功！");
                        },
                        error: function(e) {
                            alert("删除失败，请重试...");
                        }
                    })
                }
            }
        }
    });
}

function changeDictStatus(dictId, dictLabel, dictStatus) {
    if ('1' === dictStatus) {
        if (confirm("确认恢复" + dictLabel + "吗？")) { doChangeDictStatus(dictId, dictStatus); }
        return;
    }
    if (confirm("确认禁用" + dictLabel + "吗？")) { doChangeDictStatus(dictId, dictStatus); }
}

function doChangeDictStatus(dictId, dictStatus) {
    // debugger;
    var obj = { "dictId": dictId, "dictStatus": dictStatus };
    $.ajax({
        "type": "PUT",
        "url": parent.globalConfig.serverPath + 'dicts/' + dictId,
        "contentType": "application/json",
        "data": JSON.stringify(obj),
        success: function(data) {
            dictTable.ajax.reload();
        },
        error: function(e) {
            alert("修改失败，请重试...");
        }
    })
}

function returnDict() {
    $("#dictLoadPart").empty();
    $("#dictManage").show();
    searchDict();
}