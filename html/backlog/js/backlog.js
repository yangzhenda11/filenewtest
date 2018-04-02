var table = App.initDataTables('#dataTable',{
	"ajax":"../../static/data/backlog.json",
	"columns": [{
			"data": "proName",
			"title": "主题",
			"width": '160',
			"className": "text-center",
			"render":function(data, type, row, meta){
				return "<div class='text-left'><a>" + data + "</a></div>"
			}
		},
		{
			"data": "type",
			"title": "流程类型",
			"width": '120',
		},
		{
			"data": "data",
			"title": "接收日期",
			"width": '190'
		},
		{
			"data": "userName",
			"title": "发送人",
			"width": '120'
		}
	],
	"scrollX":true
})
function saveToModal(){
	function test(){
		$("#submitBtn").button('reset');
		alert(1);
	}
	App.buttonLoading("#submitBtn",test);
}
