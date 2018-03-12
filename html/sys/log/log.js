var searchLogTable;
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
var logTableSetting = {
    "ordering": false, // 排序
    "serverSide": true, // 开启服务器模式
    "scrollX": true, // 横向滚动
    ajax: {
        "type": "GET",
        "url": parent.globalConfig.serverPath + 'operateLog/', // 请求路径
        "data": function(d) { // 查询参数
            //d.code = $('#configCode').val();
            d.operAccount = $("#operAccountObj").val();
            d.operIp = $("#operIpObj").val();
            d.operPermissionName = $("#operPermissionNameObj").val();
            d.operUrl = $("#operUrlObj").val();
            d.operStatus = $("#operStatusObj").val();
            return d;
        }
    },
    columns: [ // 对应列
        /*{"data" : null,"title":"操作",className:"text-center",render : function(data, type, full, meta) {
					var btnArray = new Array();
	    			btnArray.push({"name": "删除", "fn": "delLog(\'" + full.id + "\')", "type": "user-button user-btn-n"})
		    		context = {
		    			func:btnArray
		    		}
		    		var html = template(context);
		    		return html;
				}}, */
        { "data": "operAccount", "title": "操作者账户", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        { "data": "operIp", "title": "操作者IP", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        { "data": "operHostIp", "title": "项目主机IP", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        { "data": "operPermissionName", "title": "操作功能模块", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        { "data": "operUrl", "title": "模块URL", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        {
            "data": "operTime",
            "title": "操作时间",
            className: "text-center",
            render: function(data, type, full, meta) {
                if (data) {
                    return new Date(data).format("yyyy-MM-dd hh:mm:ss");
                } else {
                    return "";
                }
            }
        },
        { "data": "operTotalTime", "title": "操作耗时", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        { "data": "operParameter", "title": "参数值", className: "text-center", render: $.fn.dataTable.render.ellipsis(22, true) },
        {
            "data": "operStatus",
            "title": "操作结果",
            className: "text-center",
            render: function(data, type, full, meta) {
                return data == "1" ? "成功" : "失败";
            }
        }
    ],
    "columnDefs": [{ // 所有列默认值
        "targets": "_all",
        "defaultContent": ''
    }],
    // lengthMenu: [
    //     menuLength,
    //     menuLength
    // ],
    "dom": 'rt<"floatl mt5"l><"floatl mt5"i><"floatr mt5"p><"clear">', // 生成样式
};

$(function() {
    searchLogTable = $("#searchLogTable").DataTable(logTableSetting);
})

function selectLog() {
    searchLogTable.ajax.reload();
}

function delLog(id) {
    debugger;
    if (confirm('确认删除么？')) {
        $.ajax({
            "type": "DELETE",
            "url": parent.globalConfig.serverPath + 'operateLog/' + id,
            success: function(data) {
                selectLog();
                alert("删除成功！");
            },
            error: function(e) {
                alert("删除失败o_o请重试...");
            }
        })
    }
}