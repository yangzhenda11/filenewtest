$(function() {
    var cloudSwitch;
    //查询云门户开关参数
    App.formAjaxJson(parent.globalConfig.serverPath + "configs/" + 13, "GET", null, ajaxSuccess);

    function ajaxSuccess(result) {
        cloudSwitch = result.sysConfig.val;
        /*if (cloudSwitch == 1) {
            $('#addBtn').show();
        }*/
        //根据当前登录人的岗位id查询其组织id
        //var curStaffOrgId1 = parent.globalConfig.curStaffOrgId;
        $('#modal').off("shown.bs.modal").on('shown.bs.modal', function() {
            App.initDataTables('#ouTable', {
                scrollY:$(".page-content").height() - 340,
                "ajax": {
                    "type": "GET", //请求方式
                    "url": serverPath + 'orgs/selectOuByOrgCode/' + curNode.orgCode, //请求路径
                    "data": function(d) { // 查询参数
                        return d;
                    }
                },
                "columns": [{
                        "data": null,
                        "className": "text-center",
                        "title": "操作",
                        "render": function(data, type, full, meta) {
                            if (data) {
                                var btnArray = new Array();
                                btnArray.push({ "name": "删除", "fn": "delOu(\'" + data.ouName + "\')" });
                                return App.getDataTableBtn(btnArray);
                            } else {
                                return '';
                            }
                        }
                    },
                    {"data": "ouName", "title": "ou组织名称"},
                    {"data": "ouShortCode", "title": "OU组织简码" }
                ]
            });
        });
    }
});
