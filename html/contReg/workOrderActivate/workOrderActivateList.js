//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;

/*
 * 初始化表格
 */
App.initDataTables('#workOrderActivateListTable', "#submitBtn", {
	ajax: {
        "type": "POST",
        "contentType":"application/json;charset=utf-8",
        "url": serverPath+'workOrderActivate/workOrderActivateList',
        "data": function(d) {//自定义传入参数
        	if($("#undertakeName").data("exactSearch")){
        		d.undertakerId = $("#undertakeName").data("id");
        	}else{
        		d.undertakeName = $("#undertakeName").val();
        	};
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
         "className": "text-center",
		"render" : function(data, type, full, meta){
						return meta.row + 1;
				   }
		},
		{"data": "contractName","title": "合同名称","className":"whiteSpaceNormal","width":"25%"},
        {"data": "contractNumber","title": "合同编号"},
        {"data": "wcardNumber","title": "工单编号"},
        {
        	"data": "wcardStatus",
        	"title": "工单状态",
        	render: function(data, type, full, meta) {
	            if(data=='904010'){
	            	return "工单草稿";
	            }else if(data=='904020'){
	            	return "工单复核";
	            }else if(data=='904030'){
	            	return "合同已激活";
	            }
	        }
        },
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
                    btnArray.push({ "name": "激活", "fn": "jumpSanCpyQueryDetail(\'"+data.wcardId+"\')","icon":"iconfont icon-add"});
                    return App.getDataTableBtn(btnArray);
				} else {
					return '';
				}
			}
		}
    ],
	"columnDefs": [{
   		"createdCell": function (td, cellData, rowData, row, col) {
         	if ( col > 0 ) {
           		$(td).attr("title", $(td).text())
         	}
   		}
 	}]
});


//点击iconfont弹出模态框事件
$(function(){
	//承办人
	$("#searchUndertaker").click(function(){
		App.getCommonModal("agentStaff","#undertakeName","name","id");
	})
	
	$("#undertakeName").on("input",function(){
		$(this).data("exactSearch",false);
	})
})

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

/*
 * 搜索点击事件
 */
function searchWorkOrderActivate(retainPaging) {
	var table = $('#workOrderActivateListTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}

//跳转到上传页面
function jumpSanCpyQueryDetail(id){
	var src = "/html/contReg/workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey=GDQR&wcardId="+id;
	App.changePresentUrl(src);
}