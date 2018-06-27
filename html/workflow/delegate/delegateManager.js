$(function(){
	// 加载表格
	searchTable = $("#searchTable").DataTable(dataTableConfig);
	//绑定验证事件
	$('#editTaskDelegateEntityForm').bootstrapValidator(validator);
});
// 后面构建btn 代码
var btnModel =  '    \
	{{#each func}}\
    <button type="button" class="user-button btn-sm {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);
var searchTable;
// 表格配置信息
var dataTableConfig = {
	"ordering": false,// 排序
	"serverSide": true,// 开启服务器模式
	"scrollX": true,// 横向滚动
	ajax: {
        "type": "POST",
        "url":'delegateManagerList',//请求路径
        "contentType": 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType":'json',
        "data":function(d){// 查询参数
        	d.startDate = $('#startDateDelegate').val();
        	d.endDate = $('#endDateDelegate').val();
        	return d;
        }
	},            
	columns: [// 对应列
		{"data": "ownerId","title":"委托人",className: "text-center"},
        {"data": "assigneeId","title":"被委托人",className: "text-center"},
        {"data": "flowKey","title":"类型",className: "text-center",render: function (a, b, c, d) {
    		return a.split("&")[0];
    	}},
        {"data": "startTime","title":"开始时间",className: "text-center",render: function (a, b, c, d) {
    		return getSmpFormatDateByLong(a, true);
    	}},
        {"data": "endTime","title":"结束时间",className: "text-center",render: function (a, b, c, d) {
    		return getSmpFormatDateByLong(a, true);
    	}},
        {"data": "createTime","title":"录入时间",className: "text-center",render: function (a, b, c, d) {
    		return getSmpFormatDateByLong(a, true);
    	}},
        {"data": "lastUpdateTime","title":"更新时间",className: "text-center",render: function (a, b, c, d) {
    		return getSmpFormatDateByLong(a, true);
    	}},
    	{"data": "remark","title":"备注",className: "text-center"},
        {"data": null,"title":"操作",className: "text-center"}
    ],
    "columnDefs": [
		{// 所有列默认值
			"targets": "_all",
			"defaultContent": ''
		},
       {// 最后一列添加按钮
        targets: -1,
        render: function (a, b, c, d) {
        	var status = c.status;
        	var title="启用";
        	var fn="onclick=updateStatus(\'" + c.authId + "\',1,\'" + c.endTime + "'\,\'" + c.startTime + "'\,\'" + c.ownerId + "'\,\'" + c.flowKey.split("&")[1] + "'\)";
        	if(status=='1'){
        		title="禁用";
        		fn="onclick=updateStatus(\'" + c.authId + "\',0,\'" + c.endTime + "'\,\'" + c.startTime + "'\,\'" + c.ownerId + "'\,\'" + c.flowKey.split("&")[1] + "'\)";
        	}
        	var context =
            {
                func: [
                	{"name": title, "title": "", "fn": fn, "type": ""}
                ]
            };
            var html = template(context);
            return html;
        }
    }]
	,"dom":'rt<"pull-left mt5"i><"pull-right mt5"p><"clear">'//'rt<"bottom"ip><"clear">' //生成样式
};


// 初始化页面信息
function initFrame(){
	serarch();
	$('#searchContent').show();
}
//重置查询信息
function resetCondition(){
	$("input[name='startDate']").val('');
	$("input[name='endDate']").val('');
}

//查询
function serarch(){
	searchTable.ajax.reload();
}
/**
 * 
 * @param acthId 单条数据主键
 * @param status 需要处理的状态
 * @param endTime 结束时间
 * @param ownerId 委托人
 * @param flowkey 类型
 */
function updateStatus(acthId,status,endTime,startTime,ownerId,flowKey){
	var data = {"acthId":acthId,"status":status,"endTime":endTime,"startTime":startTime,"ownerId":ownerId,"flowKey":flowKey}; 
//	alert(acthId+"-"+status+"-"+endTime+"-"+startTime+"-"+ownerId+"-"+flowKey);
	var title = "禁用";
	if(status=='1'){
		title = "启用";
	}
	if(confirm('确定'+title+'此条数据?')){
		$.ajax({
			url:"disableTaskDelegates",
			data:data,
			dataType:"text",
			type:"POST",
			success:function(data){
				if('1'==data){
					alert(title+"成功！");
				}else if('2'==data){
					alert("启用失败，当前时间已经超出所设定的时间。");
				}else{
					repeatShow();
	    			var html;
	    			eval("var data="+data);
	    			for(var i=0;i<data.length;i++){
	    				html += "<tr><td>"
	    					+ data[i].ownerId
							+ "</td><td>"
							+ data[i].assigneeId
							+ "</td><td>"
							+ data[i].flowKey
							+ "</td><td>"
							+ getSmpFormatDateByLong(data[i].startTime, true)
							+ "</td><td>"
							+  getSmpFormatDateByLong(data[i].endTime, true)
							+ "</td><td>"
							+ getSmpFormatDateByLong(data[i].createTime, true)
							+ "</td><td>"
							+ getSmpFormatDateByLong(data[i].lastUpdateTime, true)
							+ "</td><td style=\"word-wrap:break-word;word-break:break-all;\">"
							+ data[i].remark +"</td></tr>";
	    			}
	    			
	    			$("#repeatContent").html(html);
//					alert(title+"失败！");
				}
				searchTable.draw(false);
			},
			error:function(e){
				alert(title+"时信息异常："+e);
				App.ajaxErrorCallback(e);
			}
		})
	}
	
}

/**
 * 添加按钮触发
 */
function showAddPage(){
	getSelectFlowKey();
	$(".add").show();
	$("#editTaskDelegateEntityModal").show();
	$("#permModalLabel1").show();
	$("#searchContent").hide();
}

//退出修改或新增模态框
function goBack(){
	$("#editTaskDelegateEntityModal").hide();
	$("#searchContent").show();
	resetForm();
}


var isClick=false;
function ifclick(){
	isClick=true;
}

/**
 * 验证表单
 */
var validator = {
		message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitHandler: function(validator, form, submitButton) {
        	if(isClick){
        		var startTime = $("#startTime").val();
        		var endTime = $("#endTime").val();
        		if(startTime==""){
        			alert("请选择开始时间。");return;
        		}
        		if(endTime==""){
        			alert("请选择结束时间。");return;
        		}
        		addTaskDelegateEntity();
	    	}
        },
	    fields: {
	    	ownerId: {
	            validators: {
	                notEmpty: {
	                    message: '请输入委托人'
	                },
	            	numeric: {
						message: "只能输入纯数字"

					},
					stringLength: {
	                    min: 0,
	                    max: 255,
	                    message: '委托人不能超过255位'
	                }
	            }
	        },
	        assigneeId: {
	            validators: {
	                notEmpty: {
	                    message: '请输入被委托人'
	                },
	            	numeric: {
						message: "只能输入纯数字"

					},
					stringLength: {
	                    min: 0,
	                    max: 255,
	                    message: '被委托人不能超过255位'
	                }
	            }
	        },
	        flowKey: {
	            validators: {
	            	notEmpty: {
	                    message: '请输入类型'
	                },
	                stringLength: {
	                    min: 0,
	                    max: 64,
	                    message: '类型不能超过64位'
	                }
	            }
	               
	         },
	         startTime: {
		            validators: { 
		                date : {  
		                    format : 'yyyy-MM-dd HH:mm:ss',  
		                    message : '请输入开始时间'  
		                }
		            }
		               
		       },
		       endTime: {
			            validators: {
			            	date : {  
			                    format : 'yyyy-MM-dd HH:mm:ss',  
			                    message : '请输入开始时间'  
			                }
			            }
			               
			     },
			     remark: {
			            validators: {
			            	stringLength: {
		                         min: 0,
		                         max: 255,
		                         message: '备注不能超过255位'
		                     }
			            }
			               
			     }
	    }
	};
/**
 * 重置form表单的值
 */
function resetForm(){
	if($('#editTaskDelegateEntityForm').data('bootstrapValidator')){
		$('#editTaskDelegateEntityForm').data('bootstrapValidator').resetForm(true);
	}
}
/**
 * 新委托任务典信息
 * @returns
 */
function addTaskDelegateEntity(){
	$.ajax({
		url:"addNewTaskDelegate.action",
		data:$("#editTaskDelegateEntityForm").serialize(),
		dataType:"text",
		type:"POST",
		success:function(data){
			eval("var data = "+data);
			if(data[0].flag){
    			serarch();
    			$("#editTaskDelegateEntityModal").hide();
    			isClick=false;
    	    	$("#searchContent").show();
    	    	alert("添加成功！");
    	    	resetForm();
    		}else{
    			repeatShow();
    			var html;
    			for(var i=0;i<data.length;i++){
    				html += "<tr><td>"
    					+ data[i].ownerId
						+ "</td><td>"
						+ data[i].assigneeId
						+ "</td><td>"
						+ data[i].flowKey
						+ "</td><td>"
						+ getSmpFormatDateByLong(data[i].startTime, true)
						+ "</td><td>"
						+  getSmpFormatDateByLong(data[i].endTime, true)
						+ "</td><td>"
						+ getSmpFormatDateByLong(data[i].createTime, true)
						+ "</td><td>"
						+ getSmpFormatDateByLong(data[i].lastUpdateTime, true)
						+ "</td><td style=\"word-wrap:break-word;word-break:break-all;\">"
						+ data[i].remark +"</td></tr>";
    			}
    			
    			$("#repeatContent").html(html);
    			$("#startTime").val('');
    		}
		},
		error:function(e){
			alert("添加信息时异常："+e);
			App.ajaxErrorCallback(e);
		}
	})
    	
    	
    	
}

/**
 * 获取类型下拉数据
 * 表 flow_cfg_type
 */
function getSelectFlowKey(){
	$("#flowKey").empty();
	$.ajax({
		url:"getSelectFlowKey.action",
		type:"POST",
		success:function(data){
			$.each(data, function(i, obj){
				$("#flowKey").append("<option value='" + obj.flowkey + "'>" + obj.flowname + "</option>");
			});
		},
		error:function(e){
			alert("获取类型下拉数据时信息异常："+e);
			App.ajaxErrorCallback(e);
		}
	})
	
}

/**
 * 重复人员modal窗口展示
 */

function repeatShow(){
	$("#repeat").modal("show");
}
/**
 * 关闭
 */
function repeatClose(){
	$("#addBtn").button("reset");
	$("#repeat").modal("hide");
}
function getDate(){
	$("#addBtn").button("reset");
	WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'});
}

