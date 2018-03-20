//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
$(function(){
	getLog();
})
/*
 * 获取系统日志生成table
 */
function getLog(){
	var logTable = App.initDataTables('#logTable', {
		ajax: {
	        "type": "GET",
	        "url": serverPath + 'operateLog/',
	        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
	        "dataType":'json',
	        "beforeSend": startLoading("#submitBtn"),
	        "data":function(d){
	            d.operAccount = $("#operAccountObj").val();
	            d.operIp = $("#operIpObj").val();
	            d.operPermissionName = $("#operPermissionNameObj").val();
	            d.operUrl = $("#operUrlObj").val();
	            d.operStatus = $("#operStatusObj").val();
	            return d;
	        },
	         error: function (xhr, error, thrown) {  
	            stopLoading("#submitBtn");
	            layer.msg("接口错误", {icon: 2});
	        },
	        "dataSrc": judge
		},
		"columns": [
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
	                    return App.formatDateTime(data);
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
		]
	});
}
/*
 * dataTable请求到结果后的回调事件
 */
function judge(result){
	stopLoading("#submitBtn");
	return resolveResult(result);
}

/*
 * 查询点击
 */
function selectLog() {
	startLoading("#submitBtn");
	var table = $('#logTable').DataTable();
	table.ajax.reload();
}
