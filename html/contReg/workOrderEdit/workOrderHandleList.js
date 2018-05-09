//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#workOrderHandleListTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'workOrderHandle/workOrderHandleList',
        "data": function(d) {//自定义传入参数
        	d.contractNumber = $("#contractNumber").val();
        	d.contractName = $("#contractName").val();
			d.createDateBegin = $("#create_date_begin").val();
			d.createDateEnd = $("#create_date_end").val();
           	return JSON.stringify(d);
        }
    },
    "columns": [
    	{"data" : null,
         "title":"序号",
		"render" : function(data, type, full, meta){
						return meta.row + 1;
				   }
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "wcardNumber","title": "工单编号"},
        {"data": "wcardStatus","title": "工单状态"},
        {
	        "data": "ctreatedDate",
	        "title": "创建日期",
	        render: function(data, type, full, meta) {
	            return formatDateTime(data);
	        }
	    },
	    {
			"data": null,
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "编辑", "fn": "jumpSanCpyQueryDetail(\'"+data.wcardId+"\')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		}
    ]
});

/*
 * 搜索点击事件
 */
function searchWorkOrderHandle(retainPaging) {
	var table = $('#workOrderHandleListTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}


//调整时间显示，不显示时分秒
function formatDateTime(inputTime,type) {
	if(inputTime){
		var date = new Date(inputTime);
	}else{
		return "";
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
}

function manualCreation(){
	var src = "/html/contReg/workOrderEdit/manualCreationEdit.html";
	App.changePresentUrl(src);
}