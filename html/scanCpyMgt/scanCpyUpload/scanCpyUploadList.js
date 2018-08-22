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
	        {"data" : null,"title":"序号","className": "text-center","width":"5%","render" :function(data, type, full, meta){
				return meta.row + 1;
				}
			},
	        {"data": "contractNumber","title": "合同编号","className":"whiteSpaceNormal","width":"40%"},
	        {"data": "fileName","title": "文件名称","className":"whiteSpaceNormal","width":"40%"},
	        {"data": "uploadTime","title": "上传时间","className":"whiteSpaceNormal","width":"15%","render": function(data, type, full, meta) {
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
/*
 * 当上传文件后模态框关闭刷新列表
 */
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
			var fullNameList = [];
			var isCheckFileIsExistList = [];
			var isCheckFileNormList = [];
			var repeatList = [];
			var ret = /^([\-0-9]*)$/;
			var errorMsg = "文件：";
			for(var i = 0; i < nowUploadFileNumber; i++){
				var fileFullName = isCheckFileList[i].name;
				fullNameList.push(fileFullName);
				var fileFullNameSplit = fileFullName.split(".");
				fileFullNameSplit.pop();
				fileFullNameSplit = fileFullNameSplit.join(".");
				isCheckFileIsExistList.push(fileFullNameSplit);
				var letter2 = fileFullNameSplit.substr(0,2);
				var letterOther = fileFullNameSplit.substr(2,fileFullNameSplit.length-2);
				if(!(letter2 == "CU" && ret.test(letterOther))){
					isCheckFileNormFlag = false;
					isCheckFileNormList.push(fileFullName);
				};
			};
		    var s = fullNameList.join(",") + ",";
		    for (var p = 0; p < fullNameList.length; p++) {
		        if (s.replace(fullNameList[p] + ",", "").indexOf(fullNameList[p] + ",") > -1) {
		            repeatList.push(fullNameList[p]);
		            break;
		        }
		    };
			if(repeatList.length > 0){
				for(var o = 0; o < repeatList.length; o++){
					errorMsg += repeatList[o]+"、";
				};
				errorMsg = errorMsg.substring(0, errorMsg.length - 1);
				errorMsg += "命名重复，请点击删除图标，删除后再进行上传。";
				layer.alert(errorMsg,{icon:2,width:"200px"});
				return false;
			};
			if(isCheckFileNormList.length > 0){
				for(var o = 0; o < isCheckFileNormList.length; o++){
					errorMsg += isCheckFileNormList[o]+"、"
				};
				errorMsg = errorMsg.substring(0, errorMsg.length - 1);
				errorMsg += "命名有误，请点击删除图标，删除后重新选择上传。";
				layer.alert(errorMsg,{icon:2,width:"200px"});
				return false;
			};
		}else{
			return false;
		}
		var postData = {
			contractNumberList: isCheckFileIsExistList
		}
		App.formAjaxJson(serverPath+"contractHistoricalFileController/getContractUploadFileInfo", "post", JSON.stringify(postData), successCallback, improperCallback,null,null,false);
		function successCallback(result) {
			fileIsExist = true;
		}
		function improperCallback(result){
			fileIsExist = false;
			layer.alert(result.message,{icon:2,width:"200px"});
		};
		return fileIsExist;
	}
	App.getFileUploadsModal(setting);
}

