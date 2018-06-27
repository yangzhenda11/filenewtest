var curTabstaffKind = $("#curTabstaffKind").val();
$(function(){
	debugger;
	$("#havingRoles").empty();
	$("#notHavingRoles").empty();
	var staffId = $("#selectedStaffId"+curTabstaffKind).val();
	var staffOrgId = $("#selectedStaffOrgId"+curTabstaffKind).val();	
	$.get(serverPath+"/staffs/"+staffId+"/staffOrgs/"+curStaffOrgId+"/staffRoles/"+staffOrgId,{},function(array){
		var havingRoles = array.data.havingRoles;
		var notHavingRoles = array.data.notHavingRoles;
		for(var i=0;i<havingRoles.length;i++){
			$("#havingRoles"+curTabstaffKind).append($("<option value=\""+havingRoles[i].ROLE_ID+"\">"+havingRoles[i].ROLE_NAME+"</option>"));
		}
		for(var i=0;i<notHavingRoles.length;i++){
			$("#notHavingRoles"+curTabstaffKind).append($("<option value=\""+notHavingRoles[i].ROLE_ID+"\">"+notHavingRoles[i].ROLE_NAME+"</option>"));
		}
		//初始化左右选择控件
		$('#notHavingRoles'+curTabstaffKind).multiselect({
		       keepRenderingSort: true,
		       right: '#havingRoles'+curTabstaffKind,
		       rightAll: '#rightAll'+curTabstaffKind,
		       rightSelected: '#rightSelected'+curTabstaffKind,
		       leftSelected: '#leftSelected'+curTabstaffKind,
		       leftAll: '#leftAll'+curTabstaffKind,
		       undo:'#notHavingRoles_undo'+curTabstaffKind,
		       search: {
		            left: '<input type="text" name="q" class="form-control" style="margin-bottom:10px" placeholder="查询待选..." />',
		            right: '<input type="text" name="q" class="form-control" style="margin-bottom:10px" placeholder="查询已选..." />',
		        },
		        fireSearch: function(value) {
		            return value.length > 0;
		        }
		   });
	});

})


function saveStaffOrgRoles(){
	debugger;
	var all = "";
	$("option",$('#havingRoles'+curTabstaffKind)).each(function() {
        all += $(this).attr("value")+",";
    });
	var staffOrgId = $("#selectedStaffOrgId"+curTabstaffKind).val();
	var obj = {"roleIds":all,"staffOrgId":staffOrgId,"createBy":curStaffId};
    $.ajax({
    	"url":serverPath+"/staffs/"+staffId+"/staffOrgs/"+staffOrgId+"/staffRoles",
//    	"data":{'roleIds':all,'staffOrgId':staffOrgId,'createBy':curStaffId},
    	"type" : "PUT",
		"contentType" : "application/json",
		"data" : JSON.stringify(obj),
		success : function(data) {
			returnStaffOrgList();
			alert("保存成功！");
		},
		error : function(e) {
			alert("添加失败o_o请重试...");
		}
    })
}