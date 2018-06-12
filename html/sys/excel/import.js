var config = top.globalConfig;
var serverPath = config.serverPath;

function importContractUpload(){
    $("#importForm").attr("action",serverPath+'contractScanQuery/importContract');
    $("#importForm").submit();
    $("#importForm").attr("action",'');
}

function fileUpload(){
	var setting = {
		title : "文件上传导入测试",
		isUploadFile: false,
		url:'contractScanQuery/importContract',
		maxNumber:1,
		//fileExtensions:['pdf']
	};
	function queryCallback(){
		var fileInfo = getFileItemInfo();
		$("#commomModal").modal("hide");
	}
	App.getFileUploadModal(setting,queryCallback);
}
function ajaxSubmit(){
	$("#bulk").modal("show");
}
function gosubmit(){
	$("#myupload").ajaxSubmit({
        dataType: 'json',
        url: serverPath + 'contractScanQuery/importContract',
        resetForm: "true",
        timeout: 3000,
        beforeSend: function() {
            $('#upload').html('上传中..');
        },
        success: function(result) {
           	console.log(result);
           	$('#upload').html('上传成功');
        },
        error: function(xhr) {
        	console.log(result)
        }
    })
}
function fileImport(){
	var setting = {
		title : "文件导入测试",
		url:'contractScanQuery/importContract',
		accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",				//导入文件类型
		extraData:{test:123,test2:456}		//导入时额外附加的参数
	};
	function callback(result){
		if(result.status == 1){
			layer.msg(result.data);
		}else{
			layer.msg(result.message);
		}
	}
	App.getFileImportModal(setting,callback);
}