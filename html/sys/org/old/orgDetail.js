
//展示人员信息
function doDetail(orgId){
	debugger;
	$.ajax({
	    url: serverPath + "orgs/"+orgId,
	    type: "GET",
	    async: false,
	    success: function(data) {
	    	if(null != data.data){
	    		debugger;
	    		var sysOrg = data.data;
	    		for(var col in data.data){
	    			if(col == 'orgKind'){
	    				$("#orgKindInfoObj").html(sysOrg[col]==='1'?'甲方':'乙方');
	    			}else if(col == 'orgType'){
	    				if(sysOrg[col]==='1'){
	    					$("#orgTypeInfoObj").html("公司");
	    				}else if(sysOrg[col]==='2'){
	    					$("#orgTypeInfoObj").html("部门");
	    				}else if(sysOrg[col]==='3'){
	    					$("#orgTypeInfoObj").html("处室");
	    				}else if(sysOrg[col]==='4'){
	    					$("#orgTypeInfoObj").html("虚拟组织");
	    				}
	    			}else{
	    				$('#'+col+'InfoObj').html(sysOrg[col]);
	    			}
	    		}
	    	}else{
	    		console.log("无组织详细信息");
	    	}
	    	
	    }
	  });
}