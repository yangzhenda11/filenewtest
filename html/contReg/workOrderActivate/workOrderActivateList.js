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
        	var searchParmData = getSearchParm();
        	d = $.extend(d,searchParmData);
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
        {"data": "wcardStatusStr","title": "工单状态"},
        {
	        "data": "ctreatedDate",
	        "title": "创建日期",
	        render: function(data, type, full, meta) {
	            return App.formatDateTime(data,"yyyy-mm-dd");
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
         	if ( col > 0 && col < 6) {
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
	
	$("#undertakeName").on("change",function(){
		$(this).data("exactSearch",false);
	})
})


/*
 * 搜索点击事件
 */
function searchWorkOrderActivate(retainPaging) {
	var createDateBegin = $("#create_date_begin").val().trim();
	var createDateEnd = $("#create_date_end").val().trim();
	if(checkDate(createDateBegin,createDateEnd)){
		var table = $('#workOrderActivateListTable').DataTable();
		if(retainPaging) {
			table.ajax.reload(null, false);
		} else {
			table.ajax.reload();
		}
	}else{
		layer.msg("创建日期开始日期不得大于截止日期！");
		return;
	}
}

//跳转到上传页面
function jumpSanCpyQueryDetail(id){
	var src = "../workOrderEdit/workOrderEdit.html?pageType=2&taskFlag=db&taskDefinitionKey=GDQR&wcardId="+id;
	App.changePresentUrl(src);
}

/*
 * 获取查询参数
 */
function getSearchParm(){
	var searchData = {
		contractNumber : $("#contractNumber").val().trim(),
        contractName : $("#contractName").val().trim(),
		createDateBegin : $("#create_date_begin").val().trim(),
		createDateEnd : $("#create_date_end").val().trim()
	};
	if($("#undertakeName").data("exactSearch")){
        searchData.undertakerId = $("#undertakeName").data("id");
    }else{
        searchData.undertakeName = $("#undertakeName").val().trim();
    };
    return searchData;
}

//导出合同扫描件Excel
function exportResultExcel(){
	var searchParmData = getSearchParm();
	var url = serverPath + 'workOrderActivate/workOrderActivateExportList' + App.urlEncode(searchParmData);
    location.href = encodeURI(url);
}

/**
 * 校验开始时间是否大于截止时间
 * */
function checkDate(strDate1,strDate2){  
    var t1 = new Date(strDate1);     
    var t2 = new Date(strDate2);    
              
    if(Date.parse(t1) - Date.parse(t2) > 0){     
        return false;   
    }else{  
        return true;  
    }  
}