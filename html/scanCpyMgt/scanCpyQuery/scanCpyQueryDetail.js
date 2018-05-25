//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
var id = parm.id;

//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;

$(function() {
	//获取合同正文扫描件
    App.formAjaxJson(serverPath+'contractScanQuery/listContractText?id='+id, "POST", null, listContractTextSuccess);

    function listContractTextSuccess(result) {
		var data = result.data;
		if(data.length > 0){
			var contractTextTbodyHtml = "";
			$.each(data, function(k,v) {
				contractTextTbodyHtml += "<tr>"+
										"<td>" + (k+1) +"</td>"+
										"<td><a href='"+serverPath+"contractUpload/downloadS3?key1="+v.storeIdDisplay+"'>"+v.displayName+"</td>"+
										"<td>" + App.formatDateTime(v.ctreatedDate,"yyyy-MM-dd") +"</td>"+
										"<td>" + v.createdByName +"</td>"+
										"<tr>";
			});
			$("#contractTextTbody").html(contractTextTbodyHtml);
		}
	}
	
	//获取合同附件扫描件
    App.formAjaxJson(serverPath+'contractScanQuery/listContractAttachment?id='+id, "POST", null, listContractAttachmentSuccess);

    function listContractAttachmentSuccess(result) {
		var data = result.data;
		if(data.length > 0){
			var contractAttachmentTbodyHtml = "";
			$.each(data, function(k,v) {
				contractAttachmentTbodyHtml += "<tr>"+
										"<td>" + (k+1) +"</td>"+
										"<td><a href='"+serverPath+"contractUpload/downloadS3?key1="+v.storeIdDisplay+"'>"+v.displayName+"</td>"+
										"<td>" + App.formatDateTime(v.ctreatedDate,"yyyy-MM-dd") +"</td>"+
										"<td>" + v.createdByName +"</td>"+
										"<tr>";
			});
			$("#contractAttachmentTbody").html(contractAttachmentTbodyHtml);
		}
	};
	getContractInfo();
})

function getContractInfo(){
	$.ajax({
		url : serverPath + 'contractUpload/getContractById?id='+id,
        type : "post",
        success : function(result) {
        	var data = result.data;
        	$("#contractNumber").val(data.contractNumber);
        	$("#undertakeName").val(data.undertakeName);
        	$("#undertakePhone").val(data.undertakePhone);
        	$("#undertakeMobile").val(data.undertakeMobile);
        	$("#contractName").val(data.contractName);
        	$("#executeDeptName").val(data.executeDeptName);
        	$("#unicomPartyName").text(data.unicomPartyName);
        	$("#oppoPartyName").text(data.oppoPartyName);
			$("#contractType").html(data.contractType);
        },
		error: function(result) {
			App.ajaxErrorCallback(result);
		}
	});
}
//返回上一页
function backPage(){
	window.history.go(-1);
}
/*App.initDataTables('#contractTextTable', {
	ajax: {
        "type": "POST",
        "url": serverPath+'contractScanQuery/listContractText',
        "data": function(d) {
            d.id = id;
            return d;
        }
    },
    "columns": [
    	{"data": "","title": "序号"},
    	{"data": null,"title": "文件列表",
            render: function(data, type, full, meta) {
                //return '<a href="javascript:void(0);" onclick="showScan(\'' + data + '\')">'+full.displayName+'</a>';
                return '<a href="/contractUpload/downloadS3?key1=' + full.storeIdDisplay + '">'+full.displayName+'</a>';
            }
        },
    	{
	        "data": "ctreatedDate",
	        "title": "上传日期",
	        render: function(data, type, full, meta) {
	            return formatDateTime(data);
	        }
	    },
    	{"data": "createdByName","title": "上传人"},
    ],
    "fnRowCallback" : function(nRow, aData, iDisplayIndex){
        $("td:first", nRow).html(iDisplayIndex +1);//设置序号位于第一列，并顺次加一
        return nRow;
    },
});*/

/*App.initDataTables('#contractAttachmentTable', {
	ajax: {
        "type": "POST",
        "url": serverPath+'contractScanQuery/listContractAttachment',
        "data": function(d) {
            d.id = id;
            return d;
        }
    },
    "columns": [
    	{"data": "","title": "序号"},
    	{"data": null,"title": "文件列表",
            render: function(data, type, full, meta) {
                return '<a href="/contractUpload/downloadS3?key1=' + full.storeIdDisplay + '">'+full.displayName+'</a>';
            }
        },
    	{
	        "data": "ctreatedDate",
	        "title": "上传日期",
	        render: function(data, type, full, meta) {
	            return formatDateTime(data);
	        }
	    },
    	{"data": "createdByName","title": "上传人"},
    ],
    "fnRowCallback" : function(nRow, aData, iDisplayIndex){
        $("td:first", nRow).html(iDisplayIndex +1);//设置序号位于第一列，并顺次加一
        return nRow;
    },
});*/
