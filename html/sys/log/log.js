//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
/*
 * 页面初始化操作
 */
$(function(){
	getLog();
})
/*
 * 获取系统日志生成table
 */
function getLog(){
	App.initDataTables('#logTable',"#submitBtn", {
		ajax: {
	        "type": "post",
	        "url": serverPath + 'operateLog/getLogList',
	        "contentType":"application/json;charset=utf-8",
	        "data":function(d){
	            d.operType = $("#operType").val();
	            if($("#startDate").val()){
	            	d.startDate = new Date($("#startDate").val()).getTime();
	            }
	            if($("#endDate").val()){
	            	d.endDate = new Date($("#endDate").val()).getTime();
	            }
	            return JSON.stringify(d);
	        }
		},
		"columns": [
			{ "data": "operAccount", "title": "操作者账户"},
	        { "data": "operIp", "title": "操作者IP"},
	        { "data": "operHostIp", "title": "项目主机IP"},
	        { "data": "operPermissionName", "title": "操作功能模块"},
	        { "data": "operUrl", "title": "模块URL"},
	        {
	            "data": "operTime",
	            "title": "操作时间",
	            render: function(data, type, full, meta) {
	                return App.formatDateTime(data);
	            }
	        },
	        { "data": "operTotalTime", "title": "操作耗时"},
	        { "data": "operParameter", "title": "参数值"},
	        {
	            "data": "operStatus",
	            "title": "操作结果",
	            render: function(data, type, full, meta) {
	                return data == "1" ? "成功" : "失败";
	            }
	        }
		],
		"columnDefs": [{
                render: $.fn.dataTable.render.ellipsis(22, true)
            }
        ]
	});
}

/*
 * 查询点击
 */
function selectLog() {
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	if(!App.checkDate(startDate,endDate)){
		layer.msg("接收开始日期不能早于截止日期");
		return;
	}else{
		var table = $('#logTable').DataTable();
		table.ajax.reload();
	}
}
/*
 * 日期修改时监听事件
 */
$("#startDate,#endDate").on("blur",function(){
	var startDate = $("#startDate").val();
	var endDate = $("#endDate").val();
	if(!App.checkDate(startDate,endDate)){
		layer.msg("接收开始日期不能早于截止日期");
		$(this).val("");
	};
})