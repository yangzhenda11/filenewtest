var staffId = $("#selectedStaffId"+curTabstaffKind).val();
var searchStaffOrgTable;
var btnModel = '    \
	{{#each func}}\
    <button type="button" class="{{this.type}} btn-sm" onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);

$(function(){	
	debugger;
	$("#searchStaffOrgTable").DataTable({
			"ordering": false,// 排序
			"serverSide": true,// 开启服务器模式
			"scrollX": true,// 横向滚动   
		    fixedColumns:{
		        leftColumns: 1
		    },
			ajax:{
	            "type": 'GET',
	            "url": serverPath +'staffs/'+ staffId +'/staffOrgs',//请求路径
			},
			columns: [// 对应列 
			    {"data": null,"title":"操作",className: "text-center",render:function(a,b,c,d){
			        	var staffOrgBtnArray = new Array();
			    		if('F' == c.STAFF_ORG_TYPE){
			    			staffOrgBtnArray.push({"name": "修改", "fn": "goStaffOrgEdit(\'" + c.STAFF_ORG_ID + "\')","type": "user-button"});
			    		}else{
			    			staffOrgBtnArray.push({"name": "修改", "fn": "goStaffOrgEdit(\'" + c.STAFF_ORG_ID + "\')","type": "user-button"});
			    			staffOrgBtnArray.push({"name": "删除", "fn": "delStaffOrg(\'" + c.STAFF_ORG_ID + "\',\'" + c.ORG_NAME + "\')", "type": "user-button user-btn-n"});
			    		}
			    		staffOrgBtnArray.push({"name":"角色管理","fn":"staffOrgRoleManage('"+c.STAFF_ORG_ID+"','"+c.ORG_NAME+"')","type":"user-button"});
			    		if('1' == c.STAFF_ORG_STATUS){
			    			staffOrgBtnArray.push({"name": "禁用", "fn": "changeStaffOrgStatus(\'"+c.STAFF_ORG_ID+"\',\'"+c.ORG_NAME+"\',\'0\')", "type": "user-button user-btn-n"});
		    			}else{
		    				staffOrgBtnArray.push({"name": "启用", "fn": "changeStaffOrgStatus(\'"+c.STAFF_ORG_ID+"\',\'"+c.ORG_NAME+"\',\'1\')", "type": "user-button"});
			    		}
			    		var context =
				             {
				                 func:staffOrgBtnArray
				                 };
				             var html = template(context);
				             return html;
			        	}
			    },
		        {"data": "STAFF_ORG_TYPE","title":"岗位类型",className: "text-center",render: function (a, b, c, d) {
		                if('F' == c.STAFF_ORG_TYPE){
		                	return '主岗';
		                }else if('T' == c.STAFF_ORG_TYPE){
		                	return '兼职';
		                }else{
		                	return '借调';
		                }
		            }
			    },
		        {"data": "ORG_NAME","title":"组织名称",className: "text-center"},
		        {"data": "STAFF_ORG_STATUS","title":"岗位状态",className: "text-center",render: function (a, b, c, d) {
		                if('1' == c.STAFF_ORG_STATUS){
		                	return '有效';
		                }else{
		                	return '无效';
		                }
		            }
		        },
		        {"data": "HIRE_DATE","title":"录用时间",className: "text-center",render:function(a,b,c,d){
		        	return c.HIRE_DATE?new Date(c.HIRE_DATE).format("YYYY-MM-dd"):'';
		        }},
		        {"data": "EFFECT_START_DATE","title":"生效时间",className: "text-center",render:function(a,b,c,d){
		        	return c.EFFECT_START_DATE?new Date(c.EFFECT_START_DATE).format("YYYY-MM-dd"):'';
		        }},
		        {"data": "EFFECT_END_DATE","title":"失效时间",className: "text-center",render:function(a,b,c,d){
		        	return c.EFFECT_END_DATE?new Date(c.EFFECT_END_DATE).format("YYYY-MM-dd"):'';
		        }},
		        {"data": "DUTY","title":"职责",className: "text-center"}
		    ],
		    "columnDefs": [
				{// 所有列默认值
					"targets": "_all",
					"defaultContent": ''
				}
			],
			"dom": 'rt<"pull-left mt5"l><"pull-left mt5"i><"pull-right mt5"p><"clear">' //生成样式
		}).draw(false);
})
//新增岗位
function goStaffOrgAdd(){
	debugger;
	var curTabstaffKind = $('#curTabstaffKind').val();
	$('#staffOrgLoadPart'+curTabstaffKind).show();
	$('#staffOrgList'+curTabstaffKind).hide();
	$("#staffBody"+curTabstaffKind).hide();
	$("#header"+curTabstaffKind).hide();
	$('#staffOrgLoadPart'+curTabstaffKind).load("../staff/staffOrgAdd.html",function(){
		$("#staffOrgAddForm").attr("id","staffOrgAddForm"+curTabstaffKind);
		$("#staffOrgAddField").attr("id","staffOrgAddField"+curTabstaffKind);
		if (null == $('#staffOrgAddForm'+curTabstaffKind).data('bootstrapValidator')) {
			$('#staffOrgAddForm'+curTabstaffKind).bootstrapValidator(staffOrgAddValidator);
		}
		$("input[name='staffId']",$('#staffOrgAddForm'+curTabstaffKind)).val($("#selectedStaffId"+curTabstaffKind).val());
		$("input[name='createBy']",$('#staffOrgAddForm'+curTabstaffKind)).val(curStaffId);
		$("input[name='updateBy']",$('#staffOrgAddForm'+curTabstaffKind)).val(curStaffId);
	});
}

//修改岗位
function goStaffOrgEdit(staffOrgId){
	debugger;
	var curTabstaffKind = $('#curTabstaffKind').val();
	$('#staffOrgLoadPart'+curTabstaffKind).show();
	$('#staffOrgList'+curTabstaffKind).hide();
	$("#staffBody"+curTabstaffKind).hide();
	$("#header"+curTabstaffKind).hide();
	$('#selectedStaffOrgId'+curTabstaffKind).val(staffOrgId);
	$('#staffOrgLoadPart'+curTabstaffKind).load("../staff/staffOrgEdit.html",function(){
		$("#staffOrgEditForm").attr("id","staffOrgEditForm"+curTabstaffKind);
		$("#staffOrgEditField").attr("id","staffOrgEditField"+curTabstaffKind);
		if (null == $('#staffOrgEditForm'+curTabstaffKind).data('bootstrapValidator')) {
			$('#staffOrgEditForm'+curTabstaffKind).bootstrapValidator(staffOrgEditValidator);
		}
		$("input[name='staffId']",$('#staffOrgEditForm'+curTabstaffKind)).val($("#selectedStaffId"+curTabstaffKind).val());
		$("input[name='staffOrgId']",$('#staffOrgEditForm'+curTabstaffKind)).val(staffOrgId);
		$("input[name='updateBy']",$('#staffOrgEditForm'+curTabstaffKind)).val(curStaffId);
	});
}

function delStaffOrg(staffOrgId,orgName){
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	if(confirm("确认删除岗位："+orgName+"吗？（不可恢复）")){
		$.ajax({
			"url":serverPath+"staffs/"+staffId+"/staffOrg/"+staffOrgId,
			"type":"DELETE",
			 success:function(data){
					$("#searchStaffOrgTable"+curTabstaffKind).DataTable().ajax.reload();
//					alert("修改成功！");
				},
				error:function(e){
					alert("修改失败o_o请重试...");
				}
		})
	}
}


//角色管理
function staffOrgRoleManage(staffOrgId,orgName){
	debugger;
	var curTabstaffKind = $('#curTabstaffKind').val();
	$('#staffOrgLoadPart'+curTabstaffKind).show();
	$('#staffOrgList'+curTabstaffKind).hide();
	$('#selectedStaffOrgId'+curTabstaffKind).val(staffOrgId);
//	$("#staffBody"+curTabstaffKind).hide();
//	$("#header"+curTabstaffKind).hide();
	$('#staffOrgLoadPart'+curTabstaffKind).load("../staff/staffOrgRole.html",function(){
		$("#staffOrgRoleManage").attr("id","staffOrgRoleManage"+curTabstaffKind);
		$("#notHavingRoles").attr("id","notHavingRoles"+curTabstaffKind);
		$("#havingRoles").attr("id","havingRoles"+curTabstaffKind);
		$("#rightAll").attr("id","rightAll"+curTabstaffKind);
		$("#rightSelected").attr("id","rightSelected"+curTabstaffKind);
		$("#leftSelected").attr("id","leftSelected"+curTabstaffKind);
		$("#leftAll").attr("id","leftAll"+curTabstaffKind);
		$("#notHavingRoles_undo").attr("id","notHavingRoles_undo"+curTabstaffKind);
	});
}
function returnStaffOrgList() {
	var curTabstaffKind = $('#curTabstaffKind').val();
	$("#searchStaffOrgTable"+curTabstaffKind).DataTable().ajax.reload();
	$('#staffOrgList' + curTabstaffKind).show();
	$('#staffOrgLoadPart' + curTabstaffKind).empty();
	$('#staffOrgLoadPart' + curTabstaffKind).hide();
	$("#staffBody" + curTabstaffKind).hide();
	$("#header" + curTabstaffKind).hide();
}

function changeStaffOrgStatus(staffOrgId,orgName,staffOrgStatus){
	debugger;
	if('1'===staffOrgStatus){
		if(confirm("确认恢复岗位："+orgName+"吗？")){
			doChangeStaffOrgStatus(staffOrgId,staffOrgStatus);
			}
		return;
	}
	if(confirm("确认禁用岗位："+orgName+"吗？")){
		doChangeStaffOrgStatus(staffOrgId,staffOrgStatus);
		}
}
function doChangeStaffOrgStatus(staffOrgId,staffOrgStatus){
	var curTabstaffKind = $('#curTabstaffKind').val();
	var obj = {"staffOrgId":staffOrgId,"updateBy":curStaffId};	
	$.ajax({
		"type":"PUT",
		"url":serverPath +'staffs/'+staffId+"/staffOrgStatus/"+staffOrgStatus, 
		"contentType":"application/json",
		"data":JSON.stringify(obj),
	        success:function(data){
				$("#searchStaffOrgTable"+curTabstaffKind).DataTable().ajax.reload();
//				alert("修改成功！");
			},
			error:function(e){
				alert("修改失败o_o请重试...");
			}
	})
}

