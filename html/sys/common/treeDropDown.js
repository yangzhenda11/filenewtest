/**
 * 下拉框显示组织机构树
 * @param serial 唯一标记
 * @param parent  下拉框所展示位置的父级元素
 * @param orgId	  组织id
 * @param callBackFunc 回调函数
 * @param showType 规定所要显示组织的层级
 * @param ifRadio 单选还是多选 "1": 单选 "2": 多选(默认)
 * @param width  控制下拉框的展示最大宽度 默认:300px
 * @param height 控制下拉框的展示最大高度 默认：200px
 */
function selectOrgTree(serial, parent, orgId, callBackFunc, showType, ifRadio, width, height) {
    new newselectOrg().orgTreeDrop(serial, parent, orgId, callBackFunc, showType, ifRadio, width, height);
}

var initVal = {
    ifradio: "2",
    width: 300,
    height: 200,
    init: function(ifr, wid, hei) {
        if (null != ifr && "" != ifr) {
            this.ifradio = ifr;
        }
        if (!isNaN(wid) && wid > 100) {
            this.width = wid;
        }
        if (!isNaN(hei) && hei > 100) {
            this.height = hei;
        }
    },
    getIfradio: function() {
        return this.ifradio;
    },
    getWidth: function() {
        return this.width;
    },
    getHeight: function() {
        return this.height;
    }
}

function newselectOrg() {

    //orgTree是组织树
    this.orgTrees = null;
    //组织树设置
    this.orgSetting = {
        view: {
            selectedMulti: false
        },

        edit: {
            enable: false,
            editNameSelectAll: false,
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "orgId",
                pIdKey: "parentId"
            },
            key: {
                name: "orgName"
            }
        },
        check: {
            chkStyle: "checkbox", //勾选框类型
            enable: true, //设置 zTree 的节点上是否显示 checkbox
            chkboxType: { "Y": '', "N": '' }
        },
        async: {
            enable: true,
            url: '',
            type: "GET", // 默认post
            dataType: 'json',
            dataFilter: ajaxDataFilter //处理异步加载返回的数据
        },
        callback: {
            beforeAsync: function(treeId, treeNode) {
                debugger;
                orgTrees.setting.async.url = serverPath + "orgs/" +
                    treeNode.orgId + "/children";
                return true;
            }
        }
    };

    //查看异步加载返回数据
    function ajaxDataFilter(treeId, parentNode, childNodes) {
        debugger;
        if (!childNodes) {
            return null;
        } else {
            childNodes = childNodes.data;
            return childNodes;
        }
    }
    //加载组织树方法
    //orgId:组织id  orgId不可为空
    //
    this.orgTreeDrop = function orgTreeDrop(serial, parent, orgId, callBackFunc, showType, ifRadio, width, height) {
            var oset = this.orgSetting;
            if (null == serial || '' == serial) {
                appendAlert('myTreeModal', serial, "serial cannot null");
            }
            if (null == parent || "" == parent || null == orgId || "" == orgId || null == callBackFunc || "" == callBackFunc) {
                appendAlert('myTreeModal', serial, "请检查传入参数");
            }

            $.ajax({
                url: serverPath + "orgs/" + orgId + "/orgTree",
                type: "GET",
                async: false,
                success: (function(orgSetting) {
                    return function(data) {
                        if ("1" == data.status) {
                            initVal.init(ifRadio, width, height);
                            orgSetting.async.otherParam = {
                                "showType": showType,
                            };
                            debugger;
                            if (initVal.getIfradio() == "1") {
                                orgSetting.check.enable = false;
                                orgSetting.callback.onClick = function(event, treeId, treeNode) {
                                    var orgId = treeNode.orgId;
                                    var orgName = treeNode.orgName;
                                    var orgCode = treeNode.orgCode;
                                    callBackFunc(orgId, orgName, orgCode);
                                };
                            } else if (initVal.getIfradio() == "2") {
                                orgSetting.check.enable = true;
                                orgSetting.check.chkStyle = "checkbox";
                                orgSetting.check.chkboxType = { "Y": '', "N": '' };
                                orgSetting.callback.onCheck = function(e, treeId, treeNode) {
                                    var treeObj = $.fn.zTree.getZTreeObj("orgTrees" + serial),
                                        nodes = treeObj.getCheckedNodes(true);
                                    if (nodes.length === 0) {
                                        callBackFunc('', '', '');
                                        return;
                                    }
                                    orgIds = "";
                                    orgNames = "";
                                    orgCodes = "";
                                    for (var i = 0; i < nodes.length; i++) {
                                        orgIds += nodes[i].orgId + ",";
                                        orgNames += nodes[i].orgName + ",";
                                        orgCodes += nodes[i].orgCode + ",";
                                    }
                                    callBackFunc(orgIds.substr(0, orgIds.length - 1), orgNames.substr(0, orgNames.length - 1), orgCodes.substring(0, orgCodes.length - 1));
                                };
                            }
                            var parentObj = $(parent);
                            var parentOffset = $(parent).offset();
                            if ($("#orgDIV" + serial).size() == 0) {
                                //$("#orgDIV"+serial).empty();
                                $('body').append("<div id='orgDIV" + serial + "' class='wodetreeclass'>" +
                                    "</div>");
                            }
                            $("#orgDIV" + serial).css({ left: parentOffset.left + "px", top: parentOffset.top + parentObj.outerHeight() + "px" }).slideDown("fast");
                            //$("#orgDIV"+serial).empty();
                            $('#orgDIV' + serial).append("<ul id='orgTrees" + serial + "' class='ztree'></ul>");

                            if (data.data.length == 0) {
                                $("#orgDIV" + serial).css("width", "160px");
                                $("#orgDIV" + serial).css("height", "33px");
                                $("#orgTrees" + serial).html("没有相关数据！");
                            } else {
                                $("#orgDIV" + serial).css("max-width", initVal.getWidth() + "px");
                                $("#orgDIV" + serial).css("max-height", initVal.getHeight() + "px");
                                $("#orgDIV" + serial).css("overflow", "auto");
                                orgTrees = $.fn.zTree.init($("#orgTrees" + serial + ""), orgSetting, data.data);
                                orgTrees.expandAll(false);
                            }
                        } else {
                            appendAlert('myTreeModal', serial, data.message);
                        }
                    }
                })(oset)
            });
        }
        //点击空白消除绑定事件
    $("html").bind("mousedown", { view: this }, function(event) {

        if (!(event.target.classname == "wodetreeclass" || $(event.target).parents(".wodetreeclass").length > 0)) {
            $(".wodetreeclass").fadeOut("fast");
        }

    });
}


function yourFunction1(ids, names, codes) {
    console.log("ids:" + ids + ";names:" + names + ";codes:" + codes);
    $("#orgId1").val(ids);
    $("#orgName1").val(names);
    $("#orgCode1").val(codes);
}


//*************************************************************************

/**
 * 下拉框显示人员树
 * @param serial 唯一标记
 * @param parent  下拉框所展示位置的父级元素
 * @param orgId	  组织id
 * @param callBackFunc 回调函数
 * @param ifRadio 单选还是多选 "1": 单选 "2": 多选(默认)
 * @param width  控制下拉框的展示最大宽度 默认:300px
 * @param height 控制下拉框的展示最大高度 默认：200px
 */
function selectStaffTree(serial, parent, orgId, callBackFunc, ifRadio, width, height) {
    new newselectStaff().staffTreeDrop(serial, parent, orgId, callBackFunc, ifRadio, width, height);
}

function newselectStaff() {
    //staffTree是人员选择树
    this.staffTrees = null;
    //人员选择树设置
    this.staffSetting = {
        view: {
            selectedMulti: false
        },
        edit: {
            enable: false,
            editNameSelectAll: false,
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "orgId",
                pIdKey: "parentId"
            },
            key: {
                name: "orgName"
            }
        },
        check: {
            chkStyle: "checkbox", //勾选框类型
            enable: true, //设置 zTree 的节点上是否显示 checkbox
            chkboxType: { "Y": '', "N": '' }
        },
        async: {
            enable: true,
            url: '',
            type: "GET", // 默认post
            dataType: 'json',
            dataFilter: ajaxDataFilter2 //处理异步加载返回的数据
        },
        callback: {
            beforeAsync: function(treeId, treeNode) {
                staffTrees.setting.async.url = serverPath + "orgs/" +
                    treeNode.orgId + "/staffChildren";
                return true;
            }
        }
    };
    //查看异步加载返回数据
    function ajaxDataFilter2(treeId, parentNode, childNodes) {
        debugger;
        if (!childNodes) {
            return null;
        } else {
            childNodes = childNodes.data;
            return childNodes;
        }
    }
    //加载人员选择方法
    //orgId: 组织id
    //ifRadio:'1'单选'2'多选
    this.staffTreeDrop = function staffTreeDrop(serial, parent, orgId, callBackFunc, ifRadio, width, height) {
            var sset = this.staffSetting;
            if (null == serial || '' == serial) {
                appendAlert('myStaffTreeModal', serial, "serial cannot null");
            }
            if (null == parent || "" == parent || null == orgId || "" == orgId || null == callBackFunc || "" == callBackFunc) {
                appendAlert('myStaffTreeModal', serial, "请检查传入参数！");
            }

            $.ajax({
                url: serverPath + "orgs/" + orgId + "/staffTree",
                type: "GET",
                async: false,
                success: (function(staffSetting) {
                    return function(data) {
                        if ("1" == data.status) {
                            initVal.init(ifRadio, width, height);
                            if (initVal.getifRadio() == "1") {
                                staffSetting.check.enable = false;
                                staffSetting.callback.onClick = function(event, treeId, treeNode) {
                                    var treeObj = $.fn.zTree.getZTreeObj("staffTrees" + serial);
                                    if (treeNode.isParent) {
                                        appendAlert('myStaffTreeModal', serial, "组织节点不可选！");
                                        treeObj.cancelSelectedNode(treeNode);
                                        treeObj.checkNode(treeNode);
                                        return;
                                    }
                                    orgId = treeNode.orgId;
                                    soid = treeNode.staffOid;
                                    staffId = treeNode.staffId;
                                    staffName = treeNode.orgName;
                                    callBackFunc(orgId, soid, staffId, staffName);
                                }
                            } else if (initVal.getifRadio() == "2") {
                                staffSetting.check.enable = true;
                                staffSetting.check.chkStyle = "checkbox";
                                staffSetting.check.chkboxType = { "Y": '', "N": '' };
                                staffSetting.callback.onCheck = function(e, treeId, treeNode) {
                                    var treeObj = $.fn.zTree.getZTreeObj("staffTrees" + serial);
                                    nodes = treeObj.getCheckedNodes(true);
                                    orgIds = "";
                                    orgNames = "";
                                    soid = "";
                                    staffId = "";
                                    staffName = "";
                                    for (var i = 0; i < nodes.length; i++) {
                                        if (nodes[i].isParent) {
                                            appendAlert('myStaffTreeModal', serial, "组织节点不可选！");
                                            treeObj.cancelSelectedNode(nodes[i]);
                                            treeObj.checkNode(nodes[i]);
                                            return;
                                        }
                                        orgIds += nodes[i].orgId + ",";
                                        soid += nodes[i].staffOid + ",";
                                        staffId += nodes[i].staffId + ",";
                                        staffName += nodes[i].orgName + ",";
                                        callBackFunc(orgIds.substr(0, orgIds.length - 1), soid.substr(0, soid.length - 1), staffId.substr(0, staffId.length - 1), staffName.substr(0, staffName.length - 1));
                                    }
                                };
                            }


                            var parentObj = $(parent);
                            var parentOffset = $(parent).offset();
                            if ($("#staffDIV" + serial).size() == 0) {
                                $("#staffDIV" + serial).empty();
                                $('body').append("	<div id='staffDIV" + serial + "'  class='wodetreeclass'>" +
                                    "</div>");
                            }
                            $("#staffDIV" + serial).css({ left: parentOffset.left + "px", top: parentOffset.top + parentObj.outerHeight() + "px" }).slideDown("fast");
                            $("#staffDIV" + serial).empty();
                            $('#staffDIV' + serial).append("<ul id='staffTrees" + serial + "' class='ztree'></ul>");
                            if (data.data.length == 0) {
                                $("#staffDIV" + serial).css("width", "160px");
                                $("#staffDIV" + serial).css("height", "33px");
                                $("#staffTrees" + serial).html("没有相关数据！");
                            } else {
                                $("#staffDIV" + serial).css("max-width", width + "px");
                                $("#staffDIV" + serial).css("max-height", height + "px");
                                $("#staffDIV" + serial).css("overflow", "auto");
                                staffTrees = $.fn.zTree.init($("#staffTrees" + serial), staffSetting, data.data);
                                staffTrees.expandAll(false);
                            }
                        } else {
                            appendAlert('myStaffTreeModal', serial, data.message);
                        }


                    }
                })(sset)
            });
        }
        //点击空白消除绑定事件
    $("html").bind("mousedown", { view: this }, function(event) {
        if (!(event.target.classname == "class='wodetreeclass'" || $(event.target).parents(".wodetreeclass").length > 0)) {
            $(".wodetreeclass").fadeOut("fast");
        }
    });
}

function yourFunction5(ids, soid, sid, sname) {
    console.log("ids:" + ids + "soid:" + soid + ";sid:" + sid + "sname:" + sname);
    $("#orgId5").val(ids);
    $("#staffOrgId5").val(soid);
    $("#staffId5").val(sid);
    $("#staffName5").val(sname);
}

function checkedParam(ifRadio, width, height) {
    if (null == ifRadio || "" == ifRadio) {
        ifr = "1";
    }
    if (Math.round(width) == width || Math.round(height) == height) {
        if (width < 100) {
            width = 100;
        }
        if (height < 200) {
            height = 200;
        }
    }
    debugger;
    return ifr;
}

function appendAlert(modalId, serial, message) {
    debugger;
    if ($('#' + modalId + serial).size() == 0) {
        $('#' + modalId + serial).empty();
        $('body').append("<div class='modal fade' id='" + modalId + serial + "' tabindex='-1' role='dialog' aria-labelledby='" + modalId + serial + "'>" +
            "<div class='modal-dialog' role='document'><div class='modal-content'>" +
            "<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
            "<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel" + serial + "'>提示</h4></div>" +
            "<div class='modal-body'><div class='form-group'><label id='tishi" + serial + "' for='txt_departmentname'></label>" +
            "</div></div>" +
            "<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>" +
            "<span class='glyphicon' aria-hidden='true'></span>关闭</button>" +
            "<button type='button' id='btn_submit" + serial + "' class='btn btn-primary' data-dismiss='modal'>" +
            "<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
        $("#tishi" + serial).html(message);
        $('#' + modalId + serial).modal('show');
        return;
    } else {
        $("#tishi" + serial).html(message);
        $('#' + modalId + serial).modal('show');
        return;
    }
}