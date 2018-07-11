//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function(){
	gerOrgIdByStaffOrgId();
})
/**
 * 根据当前登录人的岗位id,查询其组织id
 * @returns staffOrgId 岗位id
 * @author cuiy 2017/7/13
 */
function gerOrgIdByStaffOrgId() {
	var staffOrgId = config.curStaffOrgId;
	App.formAjaxJson(serverPath + "staffOrgs/" + staffOrgId + "/Org","get", null, successCallback)
	function successCallback(result){
		if (null != result.data) {
            orgId = result.data.orgId;
        	getOrgTable(orgId);
        } else {
        	layer.alert("组织id查询失败", { icon: 2 });
        }
	}
}
/*
 * 根据组织id获取列表
 * orgId
 */
function getOrgTable(orgId){
	App.initDataTables('#orgSearchTable', "#searchBtn", {
        ajax: {
            "type": "GET",
            "url": serverPath + 'orgs/', //请求路径
            "data": function(d) { // 查询参数
                d.orgKind = "1";
                d.orgName = $("#orgName").val();
                d.orgCode = $("#orgCode").val();
                d.orgType = $("#orgType").val();
                d.orgStatus = $("#orgStatus").val();
                d.orgId = orgId;
                return d;
            }
        },
        "columns": [ // 对应列
            {
                data: null,
                className: "text-center",
                title: "操作",
                render: function(a, b, c, d) {
                	if(c) {
						var btnArray = new Array();
	                    if ("1" == c.ORG_STATUS) {
	                       	btnArray.push({ "name": "禁用", "fn": "orgDel(\'" + c.ORG_ID + "\')" });
	                    } else {
	                        btnArray.push({ "name": "启用", "fn": "orgRe(\'" + c.ORG_ID + "\')" });
	                    }
	                    return App.getDataTableBtn(btnArray);
					} else {
						return '';
					}
                }
            },
            {"data": null,
            	title: "组织名称",
            	render: function(data, type, full, meta) {
					return '<a href=\"javascript:void(0)\" onclick = "orgShowOrgDetail(\'' + full.ORG_ID + '\')">' + full.ORG_NAME + '</a>';
					
				}
            },
            { "data": "ORG_CODE", title: "组织编码"},
            {
                "data": "ORG_TYPE",
                "title": "组织类型",
                render: function(data, type, full) {
                    var value = "";
                    if (data == 1) {
                        value = "公司";
                    } else if (data == 2) {
                        value = "部门";
                    } else if (data == 3) {
                        value = "处室";
                    } else if (data == 4) {
                        value = "虚拟组织";
                    }
                    return value;
                }
            },
            {
                "data": "ORG_STATUS",
                "title": "状态",
                render: function(data, type, full) {
                    return value = data == 1 ? "有效" : "无效";
                }
            }
        ]
    });
}

/**
 * 根据查询条件，查询组织列表
 * @returns 
 * @author cuiy 2017/7/14
 */
function orgSearchOrg(resetPaging) {
    var table = $('#orgSearchTable').DataTable();
    if (resetPaging) {
        table.ajax.reload(null, false);
    } else {
        table.ajax.reload();
    }
}


function orgShowOrgDetail(itemId) {
	$("#modal").load("_orgModal.html #modalDetail",function(){
		$("#modal").modal("show");
		App.formAjaxJson(serverPath + "orgs/" + itemId, "GET", null, ajaxSuccess);
	    /**成功回调函数 */
	    function ajaxSuccess(result) {
	        /**根据返回结果给表单赋值 */
	        App.setFindValue($("#orgDetail"), result.data, { 'orgStatus': function(value) { return value == '1' ? "有效" : "无效" }, "orgType": orgTypeCallback });
	        /**表单赋值时的回调函数 */
	        function orgTypeCallback(data) {
	            var value = "";
	            if (data == 1) {
	                value = "公司";
	            } else if (data == 2) {
	                value = "部门";
	            } else if (data == 3) {
	                value = "处室";
	            } else if (data == 4) {
	                value = "虚拟组织";
	            }
	            return value;
	        }
	    }
	});
}


/**
 * 根据组织id禁用组织
 * @author wangwj 2018-3-20
 */
function orgDel(orgId) {
    layer.confirm('确定要将其禁用吗', {
        btn: ['禁用', '取消'],
        icon: 3,
        title: '禁用组织'
    }, function() {
    	App.formAjaxJson(serverPath + 'orgs/' + orgId, "DELETE", null, successCallback);
    	function successCallback(result){
    		layer.msg('禁用成功', {icon: 1});
            orgSearchOrg(true);
    	}
    });
}


/**
 * 根据组织id回复组织状态
 * @author cuiy 2017/9/5
 */
function orgRe(orgId) {
    layer.confirm('确定要将其启用吗', {
        btn: ['启用', '取消'],
        icon: 3,
         title: '启用组织'
    }, function() {
    	App.formAjaxJson(serverPath + 'orgs/' + orgId + "/orgStatus/?" + App.timestamp(), "PUT", null, successCallback);
    	function successCallback(result){
    		layer.msg('启用成功', {icon: 1});
            orgSearchOrg(true);
    	}
    });
}
/*
 * 之前代码
 */
// $(function() {
//     //根据当前登录人的岗位id查询其组织id
//     var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
//     //	debugger;
//     gerOrgIdByStaffOrgId(curStaffOrgId1);
//     //将当前tab的orgKind值设为1
//     $("#curTaborgKind").val("1");
//     //查询数据库中所有组织种类，生成tab页
//     searchAllOrgKind();
// });

/**
 * 查询所有组织种类,并且创建组织管理页面中的各个组织种类的tao页的li
 * @returns allKind 查询到的所有组织种类
 * @author cuiy 2017/7/10
 */
// function searchAllOrgKind() {
//     var allKind = new Array();
//     $.ajax({
//         url: parent.globalConfig.serverPath + "orgs/orgKind",
//         type: "GET",
//         success: function(data) {
//             if ("1" == data.status) {
//                 allKind = data.data;
//                 if (0 < allKind.length) {
//                     creatKindTab(allKind);
//                 }

//             } else {
//                 alert("组织种类查询失败");
//             }

//         }
//     });
// }

/**
 * 创建组织管理页面中的各个组织种类的tao页的li
 * @returns allKind 查询到的所有组织种类
 * @author cuiy 2017/7/11
 */
//function creatKindTab(allKind) {
//  var allOrgKind = new Array();
//  for (i = 0; i < allKind.length; i++) {
//      allOrgKind.push(allKind[i].DICT_VALUE);
//      if (0 == i) {
//          $("#orgMyTab").append('<li class="active">' +
//              '<a id="orgAnchor' + allKind[i].DICT_VALUE + '" href="#orgTabOrg' + allKind[i].DICT_VALUE + '" data-toggle="tab" onclick="getOrgObj(this)">' + allKind[i].DICT_LABEL + '</a>' +
//              '</li>');
//          $("#orgKindTab").append('<div class="body tab-pane fade active in" role="tabpanel" id="orgTabOrg' + allKind[i].DICT_VALUE + '">' + '</div>');
//
//      } else {
//          $("#orgMyTab").append(
//              '<li>' +
//              '<a id="orgAnchor' + allKind[i].DICT_VALUE + '" href="#orgTabOrg' + allKind[i].DICT_VALUE + '" data-toggle="tab" onclick="getOrgObj(this)">' + allKind[i].DICT_LABEL + '</a>' +
//              '</li>');
//          $("#orgKindTab").append('<div class="body tab-pane fade" role="tabpanel" id="orgTabOrg' + allKind[i].DICT_VALUE + '">' + '</div>');
//      }
//      loadOrgKindTab(allKind[i].DICT_VALUE);
//  }
//  $("#orgMyTabContent").append('<input type="hidden" id="allOrgKind" value="' + allOrgKind + '"/>');
//}
/**
 * 组织类别tab中的a标签的点击事件，
 * 在点击时获取当前点击a标签的id，
 * 通过这个a标签的id来获取当前展示的tab的组织种类
 * @param obj 当前点击的a标签的这个对象
 * @returns 将当前展示tab的组织种类值存在id为curTaborgKind的input隐藏域
 * @author cuiy 2017/7/12
 */
//function getOrgObj(obj) {
//  //获取当前点击按标签的id属性值
//  var aId = obj.id;
//  //从id属性值上截取出orgKind值
//  var curTabOrgKind = aId.substring(9, aId.length);
//  $("#curTaborgKind").val(curTabOrgKind);
//  $("#orgSearchTableDiv" + curTabOrgKind).load("../org/table.html");
//  orgReset();
//}

/**
 * 加载组织tab页
 * @param val 当前组织类型
 * @returns
 */
//function loadOrgKindTab(val) {
//  $("#orgTabOrg" + val).load("../org/orgKindTab.html", function() {
//      //加载组织tab页后，动态修改各元素id
//      $("#orgTabOrg" + val).append('<input type="hidden" id="orgKind' + val + '" value="' + val + '"/>');
//      $("#orgSearchTableDiv").attr("id", "orgSearchTableDiv" + val);
//      $("#orgSearchForm").attr("id", "orgSearchForm" + val);
//      $("#orgDetailModalPart").attr("id", "orgDetailModalPart" + val);
//      //在tab页中load列表datatable
//      $("#orgSearchTableDiv" + val).load("../org/table.html");
//  });
//}
/**
 * 返回组织列表页
 * @returns
 */
//function orgAddBack() {
//  var curTabOrgKind = $('#curTaborgKind').val();
//  loadOrgKindTab(curTabOrgKind);
//}