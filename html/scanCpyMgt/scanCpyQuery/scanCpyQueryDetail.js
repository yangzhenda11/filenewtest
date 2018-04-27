//当前页面参数获取，针对不同的参数处理代办跳转还是数据列表跳转的页面差异项，站定为type值区分
var parm = App.getPresentParm();
console.log(parm);
var id = parm.id;

//系统的全局变量获取
var config = top.globalConfig;
var serverPath = config.serverPath;


$(function() {
	getContractInfo();
})

function getContractInfo(){
	var url = serverPath + 'contractUpload/getContractById?id=113';
	$.ajax({
		url : url,
        type : "post",
        success : function(data) {
        	$("#contractNumber").val(data.data.contractNumber);
        	$("#undertakeName").val(data.data.undertakeName);
        	$("#undertakePhone").val(data.data.undertakePhone);
        	$("#undertakeMobile").val(data.data.undertakeMobile);
        	$("#contractName").val(data.data.contractName);
        	$("#executeDeptName").val(data.data.executeDeptName);
        	$("#unicomPartyName").val(data.data.unicomPartyName);
        	$("#oppoPartyName").val(data.data.oppoPartyName);
        }
	});
}

App.initDataTables('#contractTextTable', {
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
    	{"data": "displayName","title": "文件列表"},
    	{
	        "data": "ctreatedDate",
	        "title": "上传日期",
	        render: function(data, type, full, meta) {
	            return formatDateTime(data);
	        }
	    },
    	{"data": "storeIdDisplay","title": "存储id"},
    	{"data": "createdByName","title": "上传人"},
    	{
			"data": "key1",
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				//console.log(full);
				var result = '<a href="/contractUpload/downloadS3?key1=' + full.storeIdDisplay + '">下载</a>';
				return result;
			}
		}
    ],
    "fnRowCallback" : function(nRow, aData, iDisplayIndex){
        $("td:first", nRow).html(iDisplayIndex +1);//设置序号位于第一列，并顺次加一
        return nRow;
    },
});

App.initDataTables('#contractAttachmentTable', {
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
    	{"data": "displayName","title": "文件列表"},
    	{
	        "data": "ctreatedDate",
	        "title": "上传日期",
	        render: function(data, type, full, meta) {
	            return formatDateTime(data);
	        }
	    },
	    {"data": "storeIdDisplay","title": "存储id"},
    	{"data": "createdByName","title": "上传人"},
    	{
			"data": "key1",
			"className": "text-center",
			"title": "操作",
			"render": function(data, type, full, meta) {
				console.log(full.storeIdDisplay);
				var result = '<a href="/contractUpload/downloadS3?key1=' + full.storeIdDisplay + '">下载</a>';
				return result;
			}
		}
    ],
    "fnRowCallback" : function(nRow, aData, iDisplayIndex){
        $("td:first", nRow).html(iDisplayIndex +1);//设置序号位于第一列，并顺次加一
        return nRow;
    },
});

//调整时间显示，不显示时分秒
function formatDateTime(inputTime,type) {
	if(inputTime){
		var date = new Date(inputTime);
	}else{
		return "";
	}
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	m = m < 10 ? ('0' + m) : m;
	var d = date.getDate();
	d = d < 10 ? ('0' + d) : d;
	return y + '-' + m + '-' + d;
}