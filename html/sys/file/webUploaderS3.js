
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
				var result = '<a href="/fileload/downloadS3?key=' + data.substr(0,data.lastIndexOf('.')) + '">下载</a>';
				result = result + '<a style="margin-left:15px" onclick="deleteFile(\''+data+'\')">删除</a>';
				if (/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(data)) {
					if($('#imgFile').css('display')=='none'){
						result = result + '<a class="btn primary btn-outline btn-xs" style="margin-left:15px" onclick = "downloadUrl(\'' + data + '\')">显示图片</a>';
					}else{
						var str = $('#imgFile')[0].src;
						if(decodeURI(str).indexOf(data) != -1){
							result = result + '<a class="btn primary btn-outline btn-xs" style="margin-left:15px" onclick = "disImg()">隐藏图片</a>';
						}else{
							result = result + '<a class="btn primary btn-outline btn-xs" style="margin-left:15px" onclick = "downloadUrl(\'' + data + '\')">显示图片</a>';
						}
					}
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
	var url = serverPath + 'fileload/downloadS3Url';
	var key = data.substr(0,data.lastIndexOf('.'));
	$.ajax({
        url : url,
        type : "post",
        data : {key:key},
        success : function(data) {
            if (data != "") {
            	console.log(data.data);
            	$('#imgFile').show();
                $('#imgFile').attr("src",data.data);
                $('#imgFile').attr("width","256px");
                $('#imgFile').attr("height","256px");
            }
            var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
    });
}

function disImg(){
	$('#imgFile').hide();
	var table = $('#uploadTable').DataTable();
	table.ajax.reload();
}

function deleteFile(data){
	var url = serverPath + 'fileload/delete';
	var key = data.substr(0,data.lastIndexOf('.'));
	$.ajax({
        url : url,
        type : "post",
        data : {key:key},
        success : function(data) {
        	alert(data.message);
        	var table = $('#uploadTable').DataTable();
        	table.ajax.reload();
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
    });
}
function test(){
	var url = serverPath + 'fileload/test?wardId=2296027497154600996';
	$.ajax({
        url : url,
        type : "get",
        success : function(data) {
        },
        error: function(result) {
			App.ajaxErrorCallback(result);
		}
    });
	
}
/*
 * 文件上传
 */
(function (_, $) {
    $("#fileName").fileinput({
        language: 'zh', 
        uploadUrl: serverPath + 'fileload/uploadFileS3TwoStage\n', // 用于文件上传的服务器端请求地址
        uploadAsync: false,
//         allowedFileExtensions: ['ini'],
        maxFileSize: 51200,
       	maxFileCount: 10,
       	dropZoneEnabled: false,
        slugCallback: function (filename) {
            return filename;
        },
        uploadExtraData: function(previewId, index) {	
			// 添加额外参数
			var obj = {
				displayName:''
			};
			return obj;
		}
    });
    // 异步上传成功结果处理
    $("#fileName").on("fileuploaded", function (event, data) {
    	alert(data.response.message+'key值：'+data.response.data);
    	var table = $('#uploadTable').DataTable();
    	table.ajax.reload();
    });
    // 同步上传成功结果处理
    $("#fileName").on("filebatchuploadsuccess", function (event, data) {
    	alert(data.response.message+'key值：'+data.response.data);
    	$("#fileName").fileinput('reset')
    	var table = $('#uploadTable').DataTable();
    	table.ajax.reload();
    });
})(window, jQuery);