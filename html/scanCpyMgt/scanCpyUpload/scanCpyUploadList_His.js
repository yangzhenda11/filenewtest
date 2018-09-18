//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var nowUploadFileNumber = 0;
var fileUploadFlag = 0;

function convertFilePath(){
	var url = serverPath + 'contractHistoricalFileController/convertHistoryContractList';
	layer.alert("正在处理中，稍后请查看数据库日志表！",{icon:1});
	$.ajax({
        url : url,
        type : "post",
        global : false
    });
}

function convertFilePathFTP(){
	if($("#count").val().trim() == ""){
		layer.alert("请输入处理件数",{icon:2});
		return;
	}
	var url = serverPath + 'contractHisOriginScanFileController/convertHisOriginScanFile';
	layer.alert("正在处理中，稍后请查看数据库日志表！",{icon:1});
	$.ajax({
        url : url,
        type : "post",
        data : {count:$("#count").val().trim()},
        global : false
    });
}


function getConvertContractFailList(){
	App.initDataTables('#convertList', "", {
		 ajax: {
	        "type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'contractHistoricalFileController/getConvertHistoryContractFailList',
	        "data": function(d) {//自定义传入参数
				return JSON.stringify(d);
	        }
	    },
	    "columns": [
	        {"data" : null,"title":"序号","className": "text-center","width":"5%","render" :function(data, type, full, meta){
				return meta.row + 1;
				}
			},
	        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"20%"},
	        {"data": "fileName","title": "文件名称","className":"whiteSpaceNormal","width":"20%"},
	        {"data": "convertTime","title": "转交时间","className":"whiteSpaceNormal","width":"15%","render": function(data, type, full, meta) {
	            	return App.formatDateTime(data);
	        	}
	        },
	        {"data": "convertFailReason","title": "失败原因","className":"whiteSpaceNormal","width":"40%"}
	    ],
		"columnDefs": [{
	   		"createdCell": function (td, cellData, rowData, row, col) {
	         	if ( col > 0 ) {
	           		$(td).attr("title", $(td).text())
	         	}
	   		}
	 	}]
	});
}
