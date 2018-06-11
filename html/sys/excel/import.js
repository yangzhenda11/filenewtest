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