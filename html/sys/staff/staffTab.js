$(function() {

		createStaffTab();

})

function createStaffTab() {
	var allKind = new Array();
	$.get(serverPath + 'staffs/staffKind', {}, function(data) {
		if ("1" == data.status) {
			allKind = data.sysDicts;
			if (0 < allKind.length) {
				creatKindTab(allKind);
			}
		} else {
			alert("人员类别查询失败");
		}
	})
}

function creatKindTab(allKind){
	var allStaffKind = new Array();
	for(i=0;i<allKind.length;i++){
		allStaffKind.push(allKind[i].DICT_VALUE);
		if(0 == i){
			$("#myStaffTab").append('<li class="active">'+
					'<a id="staffAnchor'+allKind[i].DICT_VALUE+'" href="#tabStaff'+allKind[i].DICT_VALUE+'" data-toggle="tab" onclick="getStaffObj(this)">'+allKind[i].DICT_LABEL+'</a>'+
					'</li>');
			$("#staffTab").append('<div class="body tab-pane fade active in" role="tabpanel" id="tabStaff'+allKind[i].DICT_VALUE+'">'+'</div>');
			$("#curTabstaffKind").val(allKind[i].DICT_VALUE);
			(function(val){$("#tabStaff"+allKind[i].DICT_VALUE).load("../staff/staffList.html",function(){
				$("#selectedStaffId").attr("id","selectedStaffId"+curTabstaffKind);
				$("#header").attr("id","header"+curTabstaffKind);
				$("#staffBody").attr("id","staffBody"+curTabstaffKind);
				$("#staffBody"+curTabstaffKind).show();
				$("#header"+curTabstaffKind).show();
				$("#searchStaffForm").attr("id","searchStaffForm"+curTabstaffKind);
				$("#searchStaffTable").attr("id","searchStaffTable"+curTabstaffKind);
				$("#staffModalPart").attr("id","staffModalPart"+curTabstaffKind);
				$("#staffLoadPart").attr("id","staffLoadPart"+curTabstaffKind);
				$('#staffLoadPart'+curTabstaffKind).hide();
			});})(allKind[i].DICT_VALUE);
		}else{
			$("#myStaffTab").append(
					'<li>'+
					'<a id="staffAnchor'+allKind[i].DICT_VALUE+'" href="#tabStaff'+allKind[i].DICT_VALUE+'" data-toggle="tab" onclick="getStaffObj(this)">'+allKind[i].DICT_LABEL+'</a>'+
					'</li>');	
			$("#staffTab").append('<div class="body tab-pane fade" role="tabpanel" id="tabStaff'+allKind[i].DICT_VALUE+'">'+'</div>');	
		}
	}
	$("#myStaffTabContent").append('<input type="hidden" id="allStaffKind" value="'+allStaffKind+'"/>');
}

function getStaffObj(obj){
	var aId = obj.id;
	var curTabstaffKind = aId.substring(11,aId.length);
	$("#curTabstaffKind").val(curTabstaffKind);	
	if(!($("#tabStaff"+curTabstaffKind).find("div").length>0)){
		$("#tabStaff"+curTabstaffKind).load("../staff/staffList.html",function(){
			$("#selectedStaffId").attr("id","selectedStaffId"+curTabstaffKind);
			$("#header").attr("id","header"+curTabstaffKind);
			$("#header"+curTabstaffKind).show();
			$("#staffBody").attr("id","staffBody"+curTabstaffKind);
			$("#staffBody"+curTabstaffKind).show();
			$("#searchStaffForm").attr("id","searchStaffForm"+curTabstaffKind);
			$("#searchStaffTable").attr("id","searchStaffTable"+curTabstaffKind);
			$("#staffModalPart").attr("id","staffModalPart"+curTabstaffKind);
			$("#staffLoadPart").attr("id","staffLoadPart"+curTabstaffKind);
			$('#staffLoadPart'+curTabstaffKind).hide();
		});
	}
//	$("#tabStaff"+curTabstaffKind).load("../staff/staffList.html",function(){
//		$("#header").attr("id","header"+curTabstaffKind);
//		$("#header"+curTabstaffKind).show();
//		$("#staffBody").attr("id","staffBody"+curTabstaffKind);
//		$("#staffBody"+curTabstaffKind).show();
//		$("#searchStaffForm").attr("id","searchStaffForm"+curTabstaffKind);
//		$("#searchStaffTable").attr("id","searchStaffTable"+curTabstaffKind);
//		$("#staffModalPart").attr("id","staffModalPart"+curTabstaffKind);
//		$("#staffLoadPart").attr("id","staffLoadPart"+curTabstaffKind);
//		$('#staffLoadPart'+curTabstaffKind).hide();
//	});
}