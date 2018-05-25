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
        $('#modal').on('shown.bs.modal', function() {
            App.initDataTables('#ouTable', {
                "serverSide": true, //开启服务器请求模式
                ajax: {
                    "type": "GET",
                    "url": serverPath + 'orgs/selectOuByOrgCode/' + curNode.orgCode, //请求路径
                    "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
                    "dataType": "json",
                    error: function(xhr, error, thrown) {
                        App.stopLoading("#searchOu");
                        layer.msg("接口错误", { icon: 2 });
                    },
                    "dataSrc": judge
                },
                "columns": [ // 对应列
                    {
                        "data": null,
                        className: "text-center",
                        title: "操作",
                        render: function(a, b, c, d) {
                            if (c) {
                                var btnArray = new Array();
                                btnArray.push({ "name": "修改", "fn": "updateOu(\'" + c.STAFF_ORG_ID + "\')" });
                                context = {
                                    func: btnArray
                                }
                                var template = Handlebars.compile(btnModel);
                                var html = template(context);
                                return html;
                            } else {
                                return '';
                            }
                        }
                    },
                    { "data": "ou_name", "title": "OU组织名称" },
                    { "data": "ou_short_code", "title": "OU组织简码" }
                ],
                "columnDefs": [{ // 所有列默认值
                        render: $.fn.dataTable.render.ellipsis(22, true),
                        "targets": "_all",
                        "defaultContent": ''
                    },
                    { // 添加按钮
                        targets: 0,
                        render: function(a, b, c, d) {
                            var context = btnFun(c);
                            var html = roletemplate(context);
                            return html;
                        }
                    }
                ],
                "fixedColumns": {
                    'leftColumns': 2
                },
            });
        });
    }
});

/*
 * 请求到结果后的回调事件
 */
function judge(result) {
    App.stopLoading("#searchBtn");
    return resolveResult(result);
}