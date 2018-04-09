var organisationTree = null;
var otherTree = null;
var legalTree = null;
var curOrgStaffNode = null;
var config = parent.globalConfig;
var serverPath = config.serverPath;
/*
 * 请求到结果后的回调事件
 */
function judge(result){
	return resolveResult(result);
}
var uploadTable = App.initDataTables('#uploadTable', {
	ajax: {
        "type": "GET",
        "url": serverPath + 'fileload/getAllBucketObject',
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType":'json',
        "data":function(d){
        	d.bucketName = "my-new-bucket";
        	return d;
        },
         error: function (xhr, error, thrown) {  
            layer.msg("接口错误", {icon: 2});
        },
        "dataSrc": judge
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
