
var table = App.initDataTables('#dataTable',{
	"ajax":"../../static/data/datatable_rowspan.json",
	"columns": [
		{
			"data": "col1",
			"title": "工单名称",
			"width": '160',
			"className": "text-center",
			"render":function(data, type, row, meta){
				return "<div class='text-left'>"+data+"</div>"
			}
		},
		{
			"data": "col2",
			"title": "工单编码",
			"width": '120'
		},
		{
			"data": "col3",
			"title": "项目编码",
			"width": '190'
		},
		{
			"data": "col4",
			"title": "其他",
			"width": '120'
		}
	],
	"drawCallback":function(settings){
		table_rowspan("#dataTable",[1,2,3,4]);
     }
})
