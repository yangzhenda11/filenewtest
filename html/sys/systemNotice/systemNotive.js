//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
//获取按钮权限
parent.data_permFilter(document);
var noticeEditFilter = parent.data_tpFilter("sys:notice:edit");
var noticeReleaseFilter = parent.data_tpFilter("sys:notice:release");
var noticeAbolishFilter = parent.data_tpFilter("sys:notice:abolish");
var editor = null;
var submitType = null;
//页面初始化事件
$(function() {
	initNotiveTable();
})
/*
 * 表格初始化
 */
function initNotiveTable(){
	App.initDataTables('#notiveTable', "#submitBtn", {
		ajax: {
			"type": "post",
			"url": serverPath + 'notifyController/search4Page.do',
			"data": function(d) {
				d.notice_title = $('#notice_title').val().trim();
	            d.notify_state = $('#notify_state').val();
	            d.submitDateA = $('#submitDateA').val();
	            d.submitDateZ = $('#submitDateZ').val();
				return d;
			}
		},
		"columns": [{
				"data": null,
				"className": "text-center",
				"title": "操作",
				"render": function(data, type, full, meta) {
					if(data) {
	                    var btnArray = new Array();
	                    if(noticeEditFilter){
                    		if(data.noticeState == 1){
                    			btnArray.push({ "name": "修改", "fn": "notiveModal(\'edit&&" + data.notifyId + "\')"});
                    		}else{
                    			btnArray.push({ "name": "修改","disabled":"disabled"});
                    		}	
                    	};
	                    if(noticeReleaseFilter){
                    		if(data.noticeState == 1){
                    			btnArray.push({ "name": "发布", "fn": "noticeRelease(\'" + data.notifyId + "\')"});
                    		}else{
                    			btnArray.push({ "name": "发布","disabled":"disabled"});
                    		}	
                    	};
	                    if(noticeAbolishFilter){
                    		if(data.noticeState == 1 || data.noticeState == 2){
                    			btnArray.push({ "name": "废除", "fn": "noticeAbolish(\'" + data.notifyId + "\')"});
                    		}else{
                    			btnArray.push({ "name": "废除","disabled":"disabled"});
                    		}	
                    	};
	                    return App.getDataTableBtn(btnArray);
					} else {
						return '';
					}
				}
			},
			{
				"data": null,
				"title": "公告标题",
				render: function(data, type, full, meta) {
					return '<a href=\"javascript:void(0)\" title=' + data.notifyTitle + ' onclick = "viewNotify(\'' + data.notifyId + '\')">' + data.notifyTitle + '</a>';
				}
			},
			{
	            "data" : "lastUpdateByName",
	            "title" : "发布人",
	        },
			{
				"data": "lastUpdateDate",
				"title": "发布时间",
				"render": function(data, type, full, meta) {
		            return App.formatDateTime(data);
		        }
			},
			{
				"data": "noticeState",
				"title": "公告状态",
				render: function(data, type, full, meta) {
					var noticeState = "未知";
					if(data == 0){
						noticeState = "作废";
					}else if(data == 1){
						noticeState = "已发布";
					}else if(data == 2){
						noticeState = "未发布";
					};
					return noticeState;
				}
			},
			{
				"data": "noticeTop",
				"title": "是否置顶",
				render: function(data, type, full, meta) {
					return data == '1' ? '是' : '否';
				}
			}
		]
	})
}

/*
 * 搜索点击事件
 */
function searchNotiveTable(retainPaging) {
	var table = $('#notiveTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
/*
 * 发布公告
 */
function noticeRelease(notifyId){
	var url = serverPath + 'notifyController/modifyNotifyStateFabu';
	App.formAjaxJson(url,"post",{notifyId:notifyId},successCallback,null,null,null,null,"formData");
	function successCallback(result){
		searchNotiveTable(true);
		layer.msg(result.message);
	}
}
/*
 * 废弃公告
 */
function noticeAbolish(notifyId){
	layer.confirm('确定要废弃所选公告吗？',{btn:['废弃','取消'],icon:0},function(index){
        modifyNotifyStateFeiqi(notifyId);
        layer.close(index);
    })
}
/*
 * 废弃公告提交
 */
function modifyNotifyStateFeiqi(notifyId){
	var url = serverPath + 'notifyController/modifyNotifyStateFeiqi';
	App.formAjaxJson(url,"post",{notifyId:notifyId},successCallback,null,null,null,null,"formData");
	function successCallback(result){
		searchNotiveTable(true);
		layer.msg(result.message);
	}
}

/**
 * 查看公告并记录读取状态
 */
function viewNotify(notifyId) {
    var url = serverPath + 'notifyController/saveNotifyRead';
	App.formAjaxJson(url,"post",{notifyId:notifyId},successCallback,null,null,null,null,"formData");
	function successCallback(result){
		notiveModal("detail&&"+notifyId);
	}
}

/*
 * 判断modal类型
 */
function notiveModal(code) {
	var code = code.split("&&");
	var editType = code[0];
	if(editType == "add" || editType == "edit") {
		$("#modal").load("_notiveModal.html #modalEdit",function(){
			var ajaxObj = {
			    "url" :  serverPath + "dicts/listChildrenByDicttId",
			    "type" : "post",
			    "data" : {"dictId": 9110}
			}
			App.initAjaxSelect2("#noticeType",ajaxObj,"dictValue","dictLabel","请选择公告类型");
			initEditor();
			initFileUpload();
			validate();
			if(editType == "add"){
				$("#modalTitle").text("新增公告信息");
				$('#modal').modal('show');
			}else{
				$("#modalTitle").text("编辑公告信息");
				getSystemNotive("edit",code[1]);
			}
		});
	} else {
		$("#modal").load("_notiveModal.html #modalDetail",function(){
			getSystemNotive("detail",code[1]);
		});
	}
}
/*
 * 获取公告详情
 */
function getSystemNotive(type,notifyId){
	var url = serverPath + "notifyController/findNotifyById"
	App.formAjaxJson(url,"post",{notifyId:notifyId},successCallback,null,null,null,null,"formData");
	function successCallback(result){
		var data = result.data;
		if(data){
			$('#modal').modal('show');
			if(type == "edit"){
				$("#notifyId").val(data.notifyId);
				$("#notifyTitle").val(data.notifyTitle);
				$("#noticeType").val(data.noticeType).trigger('change');
				$("input[name='noticeTop'][value='"+data.noticeTop+"']").attr("checked","checked");
				editor.setValue(data.notifyContent);
			}else{
				var noticeTypeDict = App.getDictInfo(9110);
				var noticeTopName = data.noticeTopName == "1" ? "置顶" : "非置顶";
				var notiveDetailAttribute = noticeTypeDict[data.noticeType] + " | " + noticeTopName;
				$(".notiveDetailTitle").text(data.notifyTitle);
				$(".notiveDetailAttribute").text(notiveDetailAttribute);
				$("#notifyContent").html(data.notifyContent);
			}
		}
	}
}
/*
 * 公告发布和保存
 * submitType：1  保存
 * submitType：2  发布
 */
function notiveSubmit(){
	var notifyContent = editor.getValue();
	var storeIdList = [];
	if(notifyContent){
    	$.each($("#notiveSuccessList tr"),function(k,v){
    		if(!$(v).hasClass("defaultTr")){
    			storeIdList.push($(v).data("storeid"));
    		}
    	});
    	var submitData = {
    		notifyContent: editor.getValue(),
    		noticeState: submitType,
    		notifyTitle: $("#notifyTitle").val().trim(),
    		noticeType: $("#noticeType").val(),
    		noticeTop: $("input[name='noticeTop']:checked").val(),
    		storeIdList: storeIdList
    	};
    	if($("#notifyId").val() != ""){
    		submitData.notifyId = $("#notifyId").val();
    		var url = serverPath + "notifyController/modifyNotify";
    	}else{
    		var url = serverPath +"notifyController/saveNotify";
    	}
		App.formAjaxJson(url,"post",JSON.stringify(submitData),successCallback);
		function successCallback(result){
			searchNotiveTable(true);
			$("#modal").modal("hide");
			if(submitType == 1){
				layer.msg("公告保存成功");
			}else{
				layer.msg("公告发布成功");
			}
			
		}
	}else{
		layer.msg("请填写公告内容");
		$('#notiveModalForm').data('bootstrapValidator').resetForm();
	}
}
function setsubmitType(type){
	submitType = type;
}
/*
 * 实例化文件上传
 */
function initFileUpload(){
	$("#uploadFileName").fileinput({
        language: 'zh', 
        uploadUrl: serverPath + "fileload/uploadFileS3",
        uploadAsync: true,
        allowedFileExtensions: [],
        maxFileSize: 102400,
       	maxFileCount: 1,
       	dropZoneEnabled: false,
       	notallowedFilenameExtensions:" |%",
        slugCallback: function (filename) {
        	if($(".kv-fileinput-error").css("display") == "block"){
        		$(".fileinput-upload-button").addClass("aDisable");
        		$(".fileinput-upload-button").attr("title","禁止上传");
        	}else{
        		$(".fileinput-upload-button").removeClass("aDisable");
        		$(".fileinput-upload-button").attr("title","点击上传");
        	}
            return filename;
        },
        uploadExtraData: function(previewId, index) {
			return {displayName:""};
		}
    });
    // 异步上传成功结果处理
    $("#uploadFileName").on("fileuploaded", function (event, data) {
    	parseResult(data);
    });
    // 同步上传成功结果处理
    $("#uploadFileName").on("filebatchuploadsuccess", function (event, data) {
    	parseResult(data);
    });
    function parseResult(data){
    	var fileValue = data.files;
    	if(data.response.status == 1){
	    	$("#uploadFileName").fileinput('reset');
	    	getNotifyFileID(data.response.data);
    	}else{
    		layer.alert(data.response.message,{icon:2,title:"错误"});
    	}
    }
}
/*
 * 获取文件信息
 */
function getNotifyFileID(id){
	App.formAjaxJson(serverPath + 'notifyController/getNotifyFileID',"get",{storeIdStr:id},successCallback);
	function successCallback(result){
		var data = result.data[0];
		if(data){
			layer.msg("上传成功");
			$(".defaultTr").addClass("hidden");
			var html = '<tr data-storeid="'+data.storeId+'"><td><button type="button" onclick="delectNotiveSuccess(this)" class="btn primary btn-outline btn-xs fileItem">删除</button></td>'+
				'<td><a href="'+serverPath+"fileload/downloadS3?key="+id+'">'+ data.displayName+'</td>'+
				'<td>'+ data.updatedBy+'</td>'+
				'<td>'+ App.formatDateTime(data.updatedDate)+'</td></tr>';
			$("#notiveSuccessList").append(html);
		}
	}
}
/*
 * 列表内删除
 */
function delectNotiveSuccess(dom){
	layer.confirm('确定删除该文件吗？',{icon:0},function(index){
		layer.close(index);
        $(dom).parent().parent().remove();
		if($("#notiveSuccessList").children().length == 1){
			$(".defaultTr").removeClass("hidden");
		}
   	})
}
/*
 * 实例化编辑器
 */
function initEditor() {
	var toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough',
		'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|',
		'link', 'image', 'hr', '|', 'indent', 'outdent'
	];
	editor = new Simditor({
		textarea: $('#editor'),
		placeholder: '这里输入公告内容...',
		toolbar: toolbar,
		defaultImage: '', //编辑器插入图片时使用的默认图片  
		upload: {
			url: serverPath+'fileload/uploadFileS3', //文件上传的接口地址  
			leaveConfirm: '正在上传文件'
		}
	});
	function get(){
		var value = editor.getValue();		
        var html = value.replace(/[\n\r]/g, '');//ie要先去了\n在处理
        //html =  html.replace(/<[^>]+>/g,"")
        html = html.replace(/<.*?>/ig, function (tag) {
		    if (tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
		        return tag;
		    } else {
		        return '';
		    }
		});
	}
}
function validate(){
	$('#notiveModalForm').bootstrapValidator({
		live: 'enabled',
		trigger: 'live focus blur keyup change',
		message: '校验未通过',
		container: 'popover',
		fields: {
			notifyTitle : {
				validators : {
					notEmpty : {
						message : '请输入公告标题'
					},
					stringLength : {
						min : 0,
						max : 20,
						message : '请输入不超过20个字符'
					}
				}
			},
			noticeType : {
				validators : {
					notEmpty : {
						message : '请选择公告类型'
					}
				}
			},
		}
	}).on('success.form.bv', function(e) {
		e.preventDefault();
		notiveSubmit();
	});
}
