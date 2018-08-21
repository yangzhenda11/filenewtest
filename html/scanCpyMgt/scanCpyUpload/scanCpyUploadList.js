//系统的全局变量
var config = top.globalConfig;
var serverPath = config.serverPath;
var nowUploadFileNumber = 0;
var fileUploadFlag = 0;
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
	        {"data": "fileName","title": "文件名称"},
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

$('#commomModal').on('hide.bs.modal', function () {
	if($("#uploadSuccessFiles .orderNumber").length > 0){
		searchScanCpyUploadList();
	}
})
/*
 * 初始化上传
 */
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
		nowUploadFileNumber = isCheckFileList.length;
		fileUploadFlag = 0;
		if(nowUploadFileNumber > 0){
			var isCheckFileNameList = [];
			for(var i = 0; i < nowUploadFileNumber; i++){
				isCheckFileNameList.push(isCheckFileList[i].name.split(".")[0]);
			}
		}else{
			return false;
		}
		var postData = {
			contractNumberList: isCheckFileNameList
		}
		//App.formAjaxJson(serverPath+"contractHistoricalFileController/getContractUploadFileInfo", "post", JSON.stringify(postData), successCallback, improperCallback,null,null,false);
		function successCallback(result) {
			fileIsExist = true;
		}
		function improperCallback(result){
			fileIsExist = false;
			layer.alert(result.message,{icon:2});
		};
		return fileIsExist;
	}
	App.getFileUploadsModal(setting);
}

