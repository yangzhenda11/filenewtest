//系统的全局变量获取
var config = parent.globalConfig;
var serverPath = config.serverPath;
//获取按钮权限
var noticeEdit = parent.data_tpFilter("sys:notice:edit");
var noticeRelease = parent.data_tpFilter("sys:notice:release");
var noticeAbolish = parent.data_tpFilter("sys:notice:abolish");
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
	                    if(noticeEdit){
                    		if(data.noticeState == 1){
                    			btnArray.push({ "name": "修改", "fn": "personnelModal(\'edit&&" + data.notifyId + "\')"});
                    		}else{
                    			btnArray.push({ "name": "修改","disabled":"disabled"});
                    		}	
                    	};
	                    if(noticeRelease){
                    		if(data.noticeState == 1){
                    			btnArray.push({ "name": "发布", "fn": "noticeRelease(\'" + data.notifyId + "\')"});
                    		}else{
                    			btnArray.push({ "name": "发布","disabled":"disabled"});
                    		}	
                    	};
	                    if(noticeAbolish){
                    		if(data.noticeState == 1 || data.noticeState == 2){
                    			btnArray.push({ "name": "废除", "fn": "personnelModal(\'" + c.notifyId + "\','"+ c.noticeState + "\')"});
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
				"data": "notifyTitle",
				"title": "公告标题",
				render: function(data, type, full, meta) {
					return '<a href=\"javascript:void(0)\" title=' + c.notifyTitle + ' onclick = "notiveModal(\'detail&&' + data.staffId + '\')">' + data + '</a>';
				}
			},
			{
	            "data" : "lastUpdateByName",
	            "title" : "发布人",
	            "className":"text-center"
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
	//App.formAjaxJson(url,"post",postData,successCallback,null,null,null,null,"formData");
	$.ajax({
        "type" : "POST",
        "dataType" : 'json',
        "data" : {
            "notifyId" : notifyId
        },
        "success" : function(data) {
            if (data.status == 1) {
                layer.msg(data.msg);
                searchNotiveTable(true);
            } else {
                layer.msg(data.msg);
            }
        }
    })
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
			loadEditor()
			if(editType == "add"){
				$("#modalTitle").text("新增公告信息");
//				validate(editType);
				$('#modal').modal('show');
			}else{
				$("#modalTitle").text("编辑公告信息");
			}
		});
	} else {
		$("#modal").load("_notiveModal.html #modalDetail",function(){
			
		});
	}
}

/*
 * 实例化编辑器
 */
function loadEditor() {
	var toolbar = ['title', 'bold', 'italic', 'underline', 'strikethrough',
		'color', '|', 'ol', 'ul', 'blockquote', 'code', 'table', '|',
		'link', 'image', 'hr', '|', 'indent', 'outdent'
	];
	editor = new Simditor({
		textarea: $('#editor'),
		placeholder: '这里输入内容...',
		toolbar: toolbar, //工具栏  
		defaultImage: '', //编辑器插入图片时使用的默认图片  
		upload: {
			url: serverPath+'/fileload/uploadFileS3', //文件上传的接口地址  
			leaveConfirm: '正在上传文件'
		}
	});

	function get() {
		var value = editor.getValue();
		var html = value.replace(/[\n\r]/g, ''); //ie要先去了\n在处理
		//html =  html.replace(/<[^>]+>/g,"")
		html = html.replace(/<.*?>/ig, function(tag) {
			if(tag === '</a>' || tag.indexOf('<a ') === 0 || tag.indexOf('<img ') === 0) {
				return tag;
			} else {
				return '';
			}
		});
	}
}