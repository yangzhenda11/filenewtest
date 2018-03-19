$(function() {
    //根据当前登录人的岗位id查询其组织id
    var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
    //	debugger;
    gerOrgIdByStaffOrgId(curStaffOrgId1);
    //将当前tab的orgKind值设为1
    $("#curTaborgKind").val("1");
    //查询数据库中所有组织种类，生成tab页
    searchAllOrgKind();
});

/**
 * 查询所有组织种类,并且创建组织管理页面中的各个组织种类的tao页的li
 * @returns allKind 查询到的所有组织种类
 * @author cuiy 2017/7/10
 */
function searchAllOrgKind() {
    var allKind = new Array();
    $.ajax({
        url: parent.globalConfig.serverPath + "orgs/orgKind",
        type: "GET",
        success: function(data) {
            if ("1" == data.status) {
                allKind = data.data;
                if (0 < allKind.length) {
                    creatKindTab(allKind);
                }

            } else {
                alert("组织种类查询失败");
            }

        }
    });
}

/**
 * 创建组织管理页面中的各个组织种类的tao页的li
 * @returns allKind 查询到的所有组织种类
 * @author cuiy 2017/7/11
 */
function creatKindTab(allKind) {
    var allOrgKind = new Array();
    for (i = 0; i < allKind.length; i++) {
        allOrgKind.push(allKind[i].DICT_VALUE);
        if (0 == i) {
            $("#orgMyTab").append('<li class="active">' +
                '<a id="orgAnchor' + allKind[i].DICT_VALUE + '" href="#orgTabOrg' + allKind[i].DICT_VALUE + '" data-toggle="tab" onclick="getOrgObj(this)">' + allKind[i].DICT_LABEL + '</a>' +
                '</li>');
            $("#orgKindTab").append('<div class="body tab-pane fade active in" role="tabpanel" id="orgTabOrg' + allKind[i].DICT_VALUE + '">' + '</div>');

        } else {
            $("#orgMyTab").append(
                '<li>' +
                '<a id="orgAnchor' + allKind[i].DICT_VALUE + '" href="#orgTabOrg' + allKind[i].DICT_VALUE + '" data-toggle="tab" onclick="getOrgObj(this)">' + allKind[i].DICT_LABEL + '</a>' +
                '</li>');
            $("#orgKindTab").append('<div class="body tab-pane fade" role="tabpanel" id="orgTabOrg' + allKind[i].DICT_VALUE + '">' + '</div>');
        }
        loadOrgKindTab(allKind[i].DICT_VALUE);
    }
    $("#orgMyTabContent").append('<input type="hidden" id="allOrgKind" value="' + allOrgKind + '"/>');
}
/**
 * 组织类别tab中的a标签的点击事件，
 * 在点击时获取当前点击a标签的id，
 * 通过这个a标签的id来获取当前展示的tab的组织种类
 * @param obj 当前点击的a标签的这个对象
 * @returns 将当前展示tab的组织种类值存在id为curTaborgKind的input隐藏域
 * @author cuiy 2017/7/12
 */
function getOrgObj(obj) {
    //获取当前点击按标签的id属性值
    var aId = obj.id;
    //从id属性值上截取出orgKind值
    var curTabOrgKind = aId.substring(9, aId.length);
    $("#curTaborgKind").val(curTabOrgKind);
    $("#orgSearchTableDiv" + curTabOrgKind).load("../org/table.html");
    orgReset();
}

/**
 * 根据当前登录人的岗位id,查询其组织id
 * @returns staffOrgId 岗位id
 * @author cuiy 2017/7/13
 */
function gerOrgIdByStaffOrgId(curStaffOrgId2) {
    var staffOrgId = curStaffOrgId2;
    $.ajax({
        url: parent.globalConfig.serverPath + "staffOrgs/" + staffOrgId + "/Org",
        type: "GET",
        async: false,
        success: function(data) {
            if (null != data.data) {
                orgId = data.data.orgId;
                $("#orgCurOrgId").val(orgId);
            } else {
                console.log("组织id查询失败");
            }

        }
    });
}

/**
 * 加载组织tab页
 * @param val 当前组织类型
 * @returns
 */
function loadOrgKindTab(val) {
    $("#orgTabOrg" + val).load("../org/orgKindTab.html", function() {
        //加载组织tab页后，动态修改各元素id
        $("#orgTabOrg" + val).append('<input type="hidden" id="orgKind' + val + '" value="' + val + '"/>');
        $("#orgSearchTableDiv").attr("id", "orgSearchTableDiv" + val);
        $("#orgSearchForm").attr("id", "orgSearchForm" + val);
        $("#orgDetailModalPart").attr("id", "orgDetailModalPart" + val);
        //在tab页中load列表datatable
        $("#orgSearchTableDiv" + val).load("../org/table.html");
    });
}
/**
 * 返回组织列表页
 * @returns
 */
function orgAddBack() {
    var curTabOrgKind = $('#curTaborgKind').val();
    loadOrgKindTab(curTabOrgKind);
}