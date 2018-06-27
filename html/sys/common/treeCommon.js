


function selectStaff(serial,curorgId,curStaffOrgId,callBackFun,checked,ifRadio) {
	new selectStaffModal().staffModal(serial,curorgId,curStaffOrgId,callBackFun,checked,ifRadio);
}



function selectStaffModal(){
	//初始化参数配置，如果参数为空，则为默认值，如果参数有值，则为此值
	this.initValStaff = {
			ifradio:"1",
			init:function(ifr,wid,hei){
				if(null != ifr && ""!=ifr){
					this.ifradio = ifr;
				}
			},
			getIfradio:function(){
				return this.ifradio;
			}
		}
	//orgTrees是组织树
	 this.orgTrees = null;
	//组织树设置
	this.orgSetting = {
			view: {
				selectedMulti: false
			},
			
			edit: {
				enable: false,
				editNameSelectAll: false,
			},
			data: {
				simpleData: {
					enable: true,
					idKey:"orgId", 
		            pIdKey:"parentId"
				},
				key : {
					name : "orgName"
				}
			},
			check:{
				chkStyle:"checkbox",//勾选框类型
				enable:false, //设置 zTree 的节点上是否显示 checkbox
				chkboxType:{"Y":'',"N":''}
			},
			async:{
				enable: true,
				url:'',
				type : "GET",// 默认post
				dataType : 'json',
				dataFilter: ajaxDataFilter//处理异步加载返回的数据
			},
			callback:{
				beforeAsync:function(treeId, treeNode) {	
					orgTrees.setting.async.url = serverPath + "orgs/"
					+ treeNode.orgId + "/children";
					return true;
				}
			}
		};

	//查看异步加载返回数据
	function ajaxDataFilter(treeId, parentNode, childNodes) {
		debugger;
		if (!childNodes) { 
	   	 return null;
	   }else{
	   	 childNodes = childNodes.data;
	   	 return childNodes;
	   }
	}
	
	this.staffModal = function staffModal(serial,curorgId,curStaffOrgId,callBackFun,checked,ifRadio){
		checked=[{"staffId":10002,"staffName":"管理员"}];
		var initParams = this.initValStaff;
		var oset = this.orgSetting;
		if($("#example"+serial).size() == 0){
			$('body').append('<div class="" id="example"></div>');
			$("#example").attr("id","example"+serial);
		}
		$("#example"+serial).load("../common/treeCommon.html",function (){
			// 弹出框关闭按钮的点击事件
			$('a.close_btn').click(function(){
				$(this).parents('.detail_layer').fadeOut();
				$('.fade_layer').fadeOut();
			});
			//取消按钮的点击事件
			$('a.title_close').click(function(){
				$(this).parents('.detail_layer').fadeOut();
				$('.fade_layer').fadeOut();
			});
			//展示阴影层
			$('.fade_layer').fadeIn();
			//设置唯一id
			$("#rightSelected").attr("id","rightSelected"+serial);
			$("#leftSelected").attr("id","leftSelected"+serial);
			$("#checkedStaff").attr("id","checkedStaff"+serial);
			$("#notStaffList").attr("id","notStaffList"+serial);
			$("#roleList").attr("id","roleList"+serial);
			$("#byOrg").attr("id","byOrg"+serial);
			$("#byRole").attr("id","byRole"+serial);
			$("#roleList").attr("id","roleList"+serial);
			$("#orgTree").attr("id","orgTree"+serial);
			$("#buttonConfim").attr("id","buttonConfim"+serial);
			$("#searchStaff").attr("id","searchStaff"+serial);
			$("#centerbutton").attr("id","centerbutton"+serial);
			//初始化参数
			initParams.init(ifRadio);	
			//如果为多选，则向页面添加功能为可以全部选择的按钮
			if(initParams.getIfradio()=="2"){
				$("#centerbutton"+serial).prepend('<button type="button" id="rightAll" class="btn btn-info btn-block">'+
						'<i class="glyphicon glyphicon-forward"></i>'+'</button>');
				$("#centerbutton"+serial).append('<button type="button" id="leftAll" class="btn btn-info btn-block">'+
						'<i class="glyphicon glyphicon-backward"></i>'+'</button>');
				$("#rightAll").attr("id","rightAll"+serial);
				$("#leftAll").attr("id","leftAll"+serial);
				$('#notStaffList'+serial).multiselect({
					rightAll: '#rightAll'+serial,
					leftAll: '#leftAll'+serial,
				});
			}
			//初始化左右选择控件
			$('#notStaffList'+serial).multiselect({
			       keepRenderingSort: true,
			       right: '#checkedStaff'+serial,
			       left:'notStaffList'+serial,
			       rightSelected: '#rightSelected'+serial,
			       leftSelected: '#leftSelected'+serial,
			       search: {
			            left: '<input type="text" name="q" class="form-control" style="margin:10px 0px;" placeholder="查询待选..." />',
			            right: '<input type="text" name="q" class="form-control" style="margin:10px 0px;" placeholder="查询已选..." />',
			        },
			        fireSearch: function(value) {
			            return value.length > 0;
			        },
			        //在向右添加选项之前进行判断
			        beforeMoveToRight:function (){
			        	debugger;
			        	if(initParams.getIfradio()=="2"){
			        		return true;
			        	}else{
			        		//获取已选择选项的长度
			        		var obj = document.getElementById("checkedStaff"+serial);
			        		var checkedLength = obj.options.length;
			        		debugger;
			        		if(1 > checkedLength){// 如果已选长度小于规定的个数，则可以操作，否则不可操作
			        			return true;
			        		}else{
			        			appendAlert('myStaffTreeModal',serial,'单选');
			        			return false;	
			        		}
			        	}
			        },
			   });
			// 给radio按钮绑定点击事件
			$("input[name=searchRadio]").click(function() {
				showCont(serial);
			});
			
			curorgId = 34869;
			var orgid = curorgId;
			//请求组织树数据
			$.ajax({
			    url: serverPath + "orgs/"+orgid+"/orgTree",
			    type: "GET",
			    async: false,
			    success:(function(orgSetting){
					return function(data){
						if("1" == data.status){
							$("#orgTrees").attr("id","orgTrees"+serial);
							//点击ztree上的节点时调用的函数，此时请求到人员数据，并向左右选择框添加
							orgSetting.callback.onClick = function(event,treeId, treeNode) {	
								$.ajax({
								    url: serverPath + "orgs/"+treeNode.orgId+"/staffs/list",
								    type: "GET",
								    async: false,
								    success:function(data){
						    	 		var allStaff = data.data;
						    			var checkedStaff = checked;
						    			//先清空左右选择框数据
						    			$("#checkedStaff"+serial).empty();
						    			$("#notStaffList"+serial).empty();
						    			//向右选择框添加数据
						    			for(var i=0;i<checkedStaff.length;i++){
						    				$("#checkedStaff"+serial).append($("<option defName=\""+checkedStaff[i].staffName+"\" value=\""+checkedStaff[i].staffId+"\">"+checkedStaff[i].staffName+"</option>"));
						    			}
						    			//筛出右选择框数据，向做选择框添加数据
						    			if(allStaff){
							    			for(var i=0;i<allStaff.length;i++){
							    				for(var j=0;j<checkedStaff.length;j++){
							    					if(!(allStaff[i].staffId == checkedStaff[j].staffId)){
									    				$("#notStaffList"+serial).append($("<option value=\""+allStaff[i].staffId+"\">"+allStaff[i].staffName+"</option>"));
									    				break;
							    					}
							    				}
							    			}
						    			}else{
						    				$("#notStaffList"+serial).append("<span>没有数据</span>");
						    			}
						    			//buttonOnclick(serial);
					    			},
					    			error:function(e){
					    				alert("查询人员失败");
					    			}
								  });
							};
							//初始化ztree
							orgTrees = $.fn.zTree.init($("#orgTrees"+serial), orgSetting, data.data);
							orgTrees.expandAll(false);
						}else{
							alert("cuole ");
						}
					}
				})(oset)
			  });
			
			
			curStaffOrgId =10001;
			var stafforgid = curStaffOrgId;
			//请求该人员可以查看的角色数据
			$.ajax({
			    url: serverPath + "roles/"+stafforgid+"/role",
			    type: "GET",
			    async: false,
			    success:function(data){
						var roles = data.roles;
						for(var i=0;i<roles.length;i++){
							$("#roleList"+serial).append("<div><input type='radio' name='roleCheckBox' value=\""+roles[i].roleId+"\"/>"+"<span>\""+roles[i].roleName+"\"</span></div>");
						}
						$("input[name=roleCheckBox]").click(function() {
							searchStaffByroleId(this.value,orgid,checked,serial,callBackFun);
						});
					},
	    			error:function(e){
	    				alert("查询角色失败");
	    			}
			  });
			//给确定按钮添加点击事件
			staffbuttonConfirm(serial,callBackFun);
		});
	}

}

/**
 * 根据radio的选择不同，展示相应的内容
 */
function showCont(serial) {
	switch ($("input[name=searchRadio]:checked").attr("id")) {
	case "byOrg"+serial:
		$("#orgTree"+serial).removeClass('HdClass');
		$("#roleList"+serial).addClass('HdClass');
		break;
	case "byRole"+serial:
		$("#roleList"+serial).removeClass('HdClass');
		$("#orgTree"+serial).addClass('HdClass');
		;
		break;
	default:
		break;
	}
}
/**
 * 给按角色查人员的单选按钮添加点击事件，进行按角色id查人员
 * @param roleId 角色id
 * @param orgid  组织id
 * @param checked 已选数据
 * @param serial  唯一标识
 * @param callBackFun 回调函数
 * @returns
 */
function searchStaffByroleId(roleId,orgid,checked,serial,callBackFun){
	$.ajax({
	    url: serverPath + "roles/"+roleId+"/notstaffsList",
	    data:{"orgId":orgid},
	    type: "GET",
	    async: false,
	    success:function(data){
	    	if("1" == data.status){
		    	var staff = data.data;
		    	var checkedStaff = checked;
		    	$("#checkedStaff"+serial).empty();
				$("#notStaffList"+serial).empty();
				for(var i=0;i<checkedStaff.length;i++){
					$("#checkedStaff"+serial).append($("<option defName=\""+checkedStaff[i].staffName+"\" value=\""+checkedStaff[i].staffId+"\">"+checkedStaff[i].staffName+"</option>"));
				}
				if(staff){
	    			for(var i=0;i<staff.length;i++){
	    				for(var j=0;j<checkedStaff.length;j++){
	    					if(!(staff[i].staffId == checkedStaff[j].staffId)){
			    				$("#notStaffList"+serial).append($("<option value=\""+staff[i].staffId+"\">"+staff[i].staffName+"</option>"));
			    				break;
	    					}
	    				}
	    			}
				}
	    	}else{
	    		appendAlert('mysearchStaffByroleIdModal',serial,data.message);
	    	}
	    	//buttonOnclick(serial);
	        //staffbuttonConfirm(serial,callBackFun);
	    },
		error:function(e){
			appendAlert('myrolestaffModal',serial,'查询角色下人员失败');
		}
	  });
}


/*function buttonOnclick(serial){
	//移到右边
    $('#rightSelected'+serial).click(function(){
        //获取选中的选项，删除并追加给对方
        $('#notStaffList'+serial+' option:selected').appendTo('#checkedStaff'+serial); 
    });
    //移到左边
    $('#leftSelected'+serial).click(function(){
        $('#checkedStaff'+serial+' option:selected').appendTo('#notStaffList'+serial);
    });
    //全部移到右边
    $('#rightAll'+serial).click(function(){
        //获取全部的选项,删除并追加给对方
        $('#notStaffList'+serial+' option').appendTo('#checkedStaff'+serial);
    });
    //全部移到左边
    $('#leftAll'+serial).click(function(){
        $('#checkedStaff'+serial+' option').appendTo('#notStaffList'+serial);
    });
    //双击选项
    $('#notStaffList'+serial).dblclick(function(){ //绑定双击事件
        //获取全部的选项,删除并追加给对方
        $("option:selected",this).appendTo('#checkedStaff'+serial); //追加给对方
    });
    //双击选项
    $('#checkedStaff'+serial).dblclick(function(){
        $("option:selected",this).appendTo('#notStaffList'+serial);
    });
}*/

/**
 * 确认按钮的点击事件，可以给回调函数提供参数
 * @param serial 唯一标识
 * @param callBackFun 回调函数
 * @returns
 */
function staffbuttonConfirm(serial,callBackFun){
	$('a.do_add').click(function (){
		var staffId = "";
		var staffName="";
		//获取右选择框的选项属性
	    $("#checkedStaff"+serial+" option").each(function() {
	        staffId += $(this).attr("value")+",";
	        staffName +=$(this).attr("defName")+",";
	    });
		callBackFun(staffId.substr(0,staffId.length-1),staffName.substr(0,staffName.length-1));
		//关闭弹出页面
		$(this).parents('.detail_layer').fadeOut();
		$('.fade_layer').fadeOut();
	});
}

/**
 * 回调函数样例，本人员组件只提供了人员id和人员姓名的回调参数
 * @param staffId 人员id
 * @param staffName 人员姓名
 * @returns
 */
function yourFunction1(staffId,staffName){
	console.log("ids:"+staffId+";names:"+staffName);
	alert("ids:"+staffId+";names:"+staffName);
}

/**
 * 提示框
 * @param modalId 提示框的id
 * @param serial 唯一标识
 * @param message 要展示的信息
 * @returns 页面会弹出一个模态框的提示框
 */
function appendAlert(modalId,serial,message){
	if($('#'+modalId+serial).size()==0){
		 $('#'+modalId+serial).empty();
		 $('body').append("<div class='modal fade' id='"+modalId+serial+"' tabindex='-1' role='dialog' aria-labelledby='"+modalId+serial+"'>" +
		"<div class='modal-dialog' role='document'><div class='modal-content'>"+
		"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
		"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel"+serial+"'>提示</h4></div>"+
		"<div class='modal-body'><div class='form-group'><label id='tishi"+serial+"' for='txt_departmentname'></label>"+
		"</div></div>"+
		"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
		"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
		"<button type='button' id='btn_submit"+serial+"' class='btn btn-primary' data-dismiss='modal'>"+
		"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
		 $("#tishi"+serial).html(message); 
		 $('#'+modalId+serial).modal('show');
		 return;
	}
	else{
		 $("#tishi"+serial).html(message); 
		$('#'+modalId+serial).modal('show');
		 return;
	}
}
