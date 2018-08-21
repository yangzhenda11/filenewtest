//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
$(function(){
	getScanCpyUploadList();
})
/*
 * 初始化表格
 */
function getScanCpyUploadList(){
	App.initDataTables('#scanCpyUploadList', "#submitBtn", {
		 ajax: {
	        "type": "POST",
	        "contentType":"application/json;charset=utf-8",
	        "url": serverPath+'contractHistoricalFileController/listContractUploadFileInfo',
	        "data": function(d) {//自定义传入参数
	        	d.contractNumber = $("#contractNumber").val().trim();
				return JSON.stringify(d);
	        }
	    },
	    "columns": [
	    	//增加序号列
	        {"data" : null,
	         "title":"序号",
	         "className": "text-center",
	         "width":"5%",
			"render" : function(data, type, full, meta){
				return meta.row + 1;
			}}, 
	        
	        {"data": "contractNumber","title": "合同编号"},
	        {"data": "staffName","title": "上传人"},
	        {"data": "uploadTime","title": "上传时间","render": function(data, type, full, meta) {
	            return App.formatDateTime(data);
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

}

/*
 * 搜索点击事件
 */
function searchScanCpyUploadList(retainPaging) {
	var table = $('#scanCpyUploadList').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
function initScanUpload(){
	var setting = {
		title: "合同扫描件上传",
		url: 'fileload/uploadMultiFileFTP',
		maxNumber: 5,
		uploadBeforFn: uploadBeforFn
	};
	function uploadBeforFn($upload){
		var isCheckFileList = $upload.getFileStack();
		var fileIsExist = true;
		if(isCheckFileList.length > 0){
			var isCheckFileNameList = [];
			for(var i = 0; i < isCheckFileList.length; i++){
				isCheckFileNameList.push(isCheckFileList[i].name);
			}
		}
		var postData = {
			contractNumberList: isCheckFileNameList
		}
		App.formAjaxJson(serverPath+"contractHistoricalFileController/getContractUploadFileInfo", "post", JSON.stringify(postData), successCallback, improperCallback);
		function successCallback(result) {
			console.log(result)
		}
		function improperCallback(result){
			console.log(result);
		}
		return false;
	}
	function queryCallback() {
		var fileInfo = getFileItemInfo(); //可以在此获取上传列表的内容，通过内置getFileItem获取；
		$("#commomModal").modal("hide");
		console.log(fileInfo);
	}
	App.getFileUploadsModal(setting, queryCallback);
}
function checkFileIsExist(){
	
}
