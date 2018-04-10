
var config = parent.globalConfig;
var serverPath = config.serverPath;

var uploadTable = App.initDataTables('#uploadTable', {
	ajax: {
        "type": "GET",
        "url": serverPath + 'fileload/getAllBucketObject',
        "data":function(d){
        	d.bucketName = "my-new-bucket";
        	return d;
        }
	},
	"columns": [{
			"data": "key",
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				var result = '<a href="/fileload/downloadS3?key=' + data + '">下载</a>';
				result = result + '<a style="margin-left:15px" href="#" onclick="deleteFile(\''+data+'\')">删除</a>';
				if (/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(data)) {
					result = result + '<a class="btn primary btn-outline btn-xs" style="margin-left:15px" onclick = "downloadUrl(\'' + data + '\')">显示图片</a>';
				}
				return result;
			}
		},
		{
			"data": "key",
			"title": "key",
			"className": "text-center"
		},
		{
			"data": "size",
			"className": "text-center",
			"title": "size"
		}
	]
});

function downloadUrl(data){
	var url = serverPath + 'fileload/downloadS3Url?key=' + data ;
	$.ajax({
        url : url,
        type : "get",
        success : function(data) {
            if (data != "") {
                $('#imgFile').attr("src",data);
                $('#imgFile').attr("width","256px");
                $('#imgFile').attr("height","256px");
            }
        }
    });
}
function fileUpLoad(){
	$.ajaxFileUpload({
		url : serverPath + 'fileload/uploadFileS3', //用于文件上传的服务器端请求地址
		fileElementId : 'fileName',
		dataType : 'json',
		type : "post",
		success : function(data) {
			alert(data.message);
			var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
		},
		error : function(data, status, e){
	        alert(e);
	        var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
	    }
	});
}

function fileMultiUpLoad(){
	$.ajaxFileUpload({
		url : serverPath + 'fileload/uploadMultiFilesS3', //用于文件上传的服务器端请求地址
		fileElementId : 'multiFileName',
		dataType : 'json',
		type : "post",
		success : function(data) {
			alert(data.message);
			var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
		},
		error : function(data, status, e){
	        alert(e);
	        var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
	    }
	});
}
function deleteFile(data){
	var url = serverPath + 'fileload/delete?key=' + data ;
	$.ajax({
        url : url,
        type : "get",
        success : function(data) {
        	alert(data.message);
        	var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
        }
    });
}
/*
 * 文件上传
 */
(function (_, $) {
    $("#fileName").fileinput({
        language: 'zh', 
        uploadUrl: serverPath + 'fileload/uploadFileS3', //用于文件上传的服务器端请求地址
        uploadAsync: true,
//   	allowedFileExtensions: ['ini'],
        maxFileSize: 51200,
        // maxFileCount: 10,
        //showPreview:false,
        slugCallback: function (filename) {
        	console.log(filename)
            return filename;
        },
        uploadExtraData: function(previewId, index) {	
			//添加额外参数
			var obj = {
				
			};
			return obj;
		}
    });
    $("#fileName").on("fileuploaded", function (event, data) {
        var res=data.response;
        console.log(res);
    });
})(window, jQuery);