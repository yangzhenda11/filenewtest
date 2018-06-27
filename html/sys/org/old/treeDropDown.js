/**
 * 弹出层选择组织机构树
 * @param orgCode
 * @param has_bm
 * @param orgKind
 * @param ifRadio
 * @param callBackFunc
 */
function selectOrgTree(parent,orgCode,callBackFunc,has_bm,orgKind,ifRadio,serial,width,height) {
	new newselectOrg().orgTreeDrop(parent,orgCode,callBackFunc,has_bm,orgKind,ifRadio,serial,width,height);
}

/**
 * 弹出层选择建设单位树
 * @param disId
 * @param has_qx
 * @param only_qx
 * @param ifRadio
 * @param callBackFunc
 */
function selectDisTree(parent,disId,callBackFunc,has_qx,only_qx,ifRadio,serial,width,height) {
	new newselectDis().disTreeDrop(parent,disId,callBackFunc,has_qx,only_qx,ifRadio,serial,width,height);
}

/**
 * 弹出层选择人员树
 * @param orgCode
 * @param orgKind
 * @param staffKind
 * @param ifRadio
 * @param callBackFunc
 */
function selectStaffTree(parent,orgCode, callBackFunc,orgKind, staffKind, ifRadio,serial,width,height) {
	new newselectStaff().staffTreeDrop(parent,orgCode, callBackFunc,orgKind, staffKind, ifRadio,serial,width,height);
}

function newselectOrg(){

	//orgTree是组织树
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
					idKey:"oCode", 
		            pIdKey:"pCode"
				}
			},
			check:{
				chkStyle:"checkbox",//勾选框类型
				enable:true, //设置 zTree 的节点上是否显示 checkbox
				chkboxType:{"Y":'',"N":''}
			},
			callback: {
				beforeClick: function(treeId, treeNode) {}
			},
			async:{
				enable: true,
				url:prc+"/sysOrgTreeController/disOrgTree",
				autoParam:["oCode","has_bm","orgKind"],
				dataFilter: ajaxDataFilter//处理异步加载返回的数据
			}
		};

	//查看异步加载返回数据的childNodes是否有值,有值说明展示处室节点,无值说明不展示处室节点
	function ajaxDataFilter(treeId, parentNode, childNodes) {
		 var dd=childNodes.length;//只要有一个childNOdes节点的id,就证明可以展示下一级
		  if (dd==0) { 
	    	 return null;
	    }else{
	    	return childNodes;

	    }
	}
	//加载组织树方法
	//orgCode:组织编码  如果orgCode为空,则传山东省的orgID作为根节点
	//has_bm:1 (默认)展示处室  0  不展示处室
	this.orgTreeDrop = function orgTreeDrop(parent,orgCode,callbackFunc,has_bm,orgKind,ifRadio,serial,width,height){
		var oset = this.orgSetting;
		if(null==orgCode||""==orgCode||undefined == orgCode){
			if($('#myTreeModal').size()==0){
				 $('#myTreeModal').empty();
				 $('body').append("<div class='modal fade' id='myTreeModal' tabindex='-1' role='dialog' aria-labelledby='myTreeModal'>" +
				"<div class='modal-dialog' role='document'><div class='modal-content'>"+
				"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
				"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
				"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
				"</div></div>"+
				"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
				"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
				"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
				"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
				 $('#myTreeModal').modal('show');
				return;
			}
		}
		if(null==has_bm||""==has_bm||undefined == has_bm){
			has_bm="1";
		}
		if(null==orgKind||""==orgKind||undefined == orgKind){
			orgKind="1";
		}
		$.post(prc+'/sysOrgTreeController/selectorgTree.action',{'oCode':orgCode,'has_bm':has_bm,'orgKind':orgKind},(function(orgSetting){
			return function(data){
				if(ifRadio=="1"||null==ifRadio||""==ifRadio){
					orgSetting.check.enable=false;
					orgSetting.callback.beforeClick = function(treeId, treeNode) {	
						var id = treeNode.id;	
			         	var name = treeNode.name;
			         	var ocode = treeNode.oCode;
						callbackFunc(id, name, ocode);
					};
				}else if(ifRadio=="2"){
					orgSetting.check.enable=true;
					orgSetting.check.chkStyle="checkbox";
					orgSetting.check.chkboxType = {"Y":'',"N":''};
					orgSetting.callback.onCheck = function (e,treeId,treeNode){
					    var treeObj=$.fn.zTree.getZTreeObj("orgTrees"+serial),
				         nodes=treeObj.getCheckedNodes(true);
				     	if (nodes.length === 0) {
				    		callbackFunc('', '', '');
				    		return;
				    	}
				         ids="";
				    	 names="";
				    	 ocode="";
				         for(var i=0;i<nodes.length;i++){
				         	ids+= nodes[i].id+",";	
				         	names+= nodes[i].name + ",";
				         	ocode += nodes[i].oCode+",";
				        	 }
				         callbackFunc(ids.substr(0,ids.length-1), names.substr(0,names.length-1), ocode.substring(0,ocode.length-1));
					};
				}
				
					$("#orgDIV"+serial).empty();
					$('#orgDIV'+serial).append("<ul id='orgTrees"+serial+"' class='ztree'></ul>");
				
				//$('#orgDIV').modal('show');
				if(data.length==0){
					
					$("#orgDIV"+serial).css("width","160px");
					$("#orgDIV"+serial).css("height","33px");
					$("#orgTrees"+serial).html("没有相关数据！");
				}else{
					orgTrees = $.fn.zTree.init($("#orgTrees"+serial+""), orgSetting, data);
					orgTrees.expandAll(false);

				}
			}
		})(oset)
		);
		var parentObj = $(parent);
	  	var parentOffset = $(parent).offset();
		if($("#orgDIV"+serial).size()==0){
			$("#orgDIV"+serial).empty();
			$('body').append("<div id='orgDIV"+serial+"' class='wodetreeclass' style='position: absolute;background-color: white;border:1px solid #3aa5ff;z-index: 1052;'>" +
					"</div>");
		}
	  	//判断是否为空
		if(Math.round(width) == width&&Math.round(height) == height){
			if(width<100){
				width = 100;
			}
			if(height < 200){
				height = 200;
			}
			$("#orgDIV"+serial).css("max-width",width+"px");
			$("#orgDIV"+serial).css("max-height",height+"px");
			$("#orgDIV"+serial).css("overflow","auto");
		}
	  	$("#orgDIV"+serial).css({left:parentOffset.left + "px", top:parentOffset.top + parentObj.outerHeight() + "px"}).slideDown("fast");
		}
	//点击空白消除绑定事件
	$("html").bind("mousedown",{view : this},function(event){
		
			if (!(event.target.classname == "wodetreeclass"|| $(event.target).parents(".wodetreeclass").length>0)) {
			  	$(".wodetreeclass").fadeOut("fast");
			  	}
	
	});
}


function yourFunction1(ids,names,codes){
	console.log("ids:"+ids+";names:"+names+";codes:"+codes);
    $("#orgId1").val(ids);
    $("#orgName1").val(names);
    $("#orgCode1").val(codes);
}
function yourFunction2(ids,names,codes){
	console.log("ids:"+ids+";names:"+names+";codes:"+codes);
    $("#orgId2").val(ids);
    $("#orgName2").val(names);
    $("#orgCode2").val(codes);
}
function yourFunction7(ids,names,codes){
	console.log("ids:"+ids+";names:"+names+";codes:"+codes);
    $("#orgId3").val(ids);
    $("#orgName3").val(names);
    $("#orgCode3").val(codes);
}
//*****************************************************************************
function newselectDis(){
	//disTree是建设单位树
	this.disTrees = null;
	//建设单位树设置
	this.disSetting = {
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
					idKey:"disId", 
		            pIdKey:"pId"
				}
			},
			check:{
				chkStyle:"checkbox",//勾选框类型
				enable:true, //设置 zTree 的节点上是否显示 checkbox
				chkboxType:{"Y":'',"N":''}
			},
			callback: {
				beforeClick: function(treeId, treeNode) {}
				
				},
			async:{
				enable: true,
				url:prc+"/sysOrgTreeController/disDisTree",
				autoParam:["disId","has_qx","only_qx"],
				dataFilter: ajaxDataFilterDis//处理异步加载返回的数据
			}
		};
	//查看异步加载返回数据的childNodes是否有值,有值说明展示处室节点,无值说明不展示处室节点
	function ajaxDataFilterDis(treeId, parentNode, childNodes) {
		 var dd=childNodes.length;//只要有一个childNOdes节点的id,就证明可以展示下一级
	  if (dd==0) { 
	  	 return null;
	  }else{
	  	return childNodes;

	  }
	}
	//加载建设单位树方法
	//disId:建设单位编码  如果disId为空,则传山东省的disID作为根节点
	//has_qx:1 (默认)展示处室  0  不展示处室
	this.disTreeDrop = function  disTreeDrop(parent,disId,callbackFunc,has_qx,only_qx,ifRadio,serial,width,height){
		var dset = this.disSetting;
		if(null==disId||""==disId||undefined == disId){
			if($('#myTreeModal').size()==0){
				 $('#myTreeModal').empty();
				 $('#myTreeModal').prepend("<div class='modal fade' id='myTreeModal' tabindex='-1' role='dialog' aria-labelledby='myTreeModal'>" +
				"<div class='modal-dialog' role='document'><div class='modal-content'>"+
				"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
				"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
				"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
				"</div></div>"+
				"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
				"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
				"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
				"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div>");
				 $('#myTreeModal').modal('show');
				return;
			}
		}
		if(null==has_qx||""==has_qx||undefined == has_qx){
			has_qx="1";
		}
		if(null==only_qx||""==only_qx||undefined == only_qx){
			only_qx="1";
		}
		$.post(prc+'/sysOrgTreeController/selectdisTree.action',{'disId':disId,'has_qx':has_qx,'only_qx':only_qx},(function(disSetting){
			return function(data){
			if(ifRadio=="1"||null==ifRadio||""==ifRadio){
				//disSetting.check.chkStyle="radio";
				disSetting.check.enable=false;
				disSetting.callback.beforeClick = function(treeId, treeNode) {	
					 var treeObj=$.fn.zTree.getZTreeObj("disTrees"+serial);
					if("1"==treeNode.only_qx){
		        		 if(treeNode.isParent){
		        				if($('#myTreeModal').size()==0){
		        					 $('#myTreeModal').empty();
		        					 $('body').prepend("<div class='modal fade' id='myTreeModal' tabindex='-1' role='dialog' aria-labelledby='myTreeModal'>" +
		        					"<div class='modal-dialog' role='document'><div class='modal-content'>"+
		        					"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
		        					"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
		        					"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
		        					"</div></div>"+
		        					"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
		        					"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
		        					"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
		        					"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
		        					 $('#myTreeModal').modal('show');
		        				}else{
		        					 $('#myTreeModal').modal('show');
		        				}
		            		 $("#tishi").html("只可选择区县节点！");
		                	 //alert("组织节点不可选！");
		                	 treeObj.cancelSelectedNode(treeNode);
		                	 treeObj.checkNode(treeNode);
		                	 return;
		                 } 
		        	 }
		        	
		         	n = treeNode.disId;	
		         	v=treeNode.name;
		         	callbackFunc(n, v);
				};
			}else if(ifRadio=="2"){
				disSetting.check.enable=true;
				disSetting.check.chkStyle="checkbox";
				disSetting.check.chkboxType = {"Y":'',"N":''};
				disSetting.callback.onCheck = function (e,treeId,treeNode){
				    var treeObj=$.fn.zTree.getZTreeObj("disTrees"+serial);
			        nodes=treeObj.getCheckedNodes(true);
			     	if (nodes.length === 0) {
			    		callbackFunc('', '', '');
			    		return;
			    	}
			         ids="";
			    	 names="";
			         for(var i=0;i<nodes.length;i++){
			        		if("1"==nodes[i].only_qx){
				        		 if(nodes[i].isParent){
				        				if($('#myTreeModal').size()==0){
				        					 $('#myTreeModal').empty();
				        					 var content = "<div class='modal fade' id='myTreeModal' tabindex='-1' role='dialog' aria-labelledby='myTreeModal'>" +
				        					"<div class='modal-dialog' role='document'><div class='modal-content'>"+
				        					"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
				        					"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
				        					"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
				        					"</div></div>"+
				        					"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
				        					"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
				        					"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
				        					"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>";
				        					 $('body').prepend(content);
				        					 $('#myTreeModal').modal('show');
				        					 //alert("ddd");
				        				}else{
				        					 $('#myTreeModal').modal('show');
				        				}
				            		 $("#tishi").html("只可选择区县节点！");
				                	 //alert("组织节点不可选！");
				                	 treeObj.cancelSelectedNode(nodes[i]);
				                	 treeObj.checkNode(nodes[i]);
				                	 return;
				                 } 
				        	 }
			         	ids+= nodes[i].disId+",";	
			         	names+= nodes[i].name + ",";
			        	 }
			         callbackFunc(ids.substr(0,ids.length-1), names.substr(0,names.length-1));
				};
			}	
				$("#disDIV"+serial).empty();
				$('#disDIV'+serial).append("<ul id='disTrees"+serial+"' class='ztree'></ul>");
				
			if(data.length==0){
				$("#disDIV"+serial).css("width","160px");
				$("#disDIV"+serial).css("height","33px");
				$("#disTrees"+serial).html("没有相关数据！");
			}else{
				disTrees = $.fn.zTree.init($("#disTrees"+serial), disSetting, data);
				disTrees.expandAll(false);	
			}
			}
			} )(dset)
			);
		var parentObj = $(parent);
	  	var parentOffset = $(parent).offset();
		if($("#disDIV"+serial).size()==0){
			$("#disDIV"+serial).empty();
			$('body').append("<div id='disDIV"+serial+"'class='wodetreeclass' style='position: absolute;background-color: white;border:1px solid #3aa5ff;z-index: 1052;'>"+
				"</div>");
		}
		if(Math.round(width) == width&&Math.round(height) == height){
			if(width<100){
				width = 100;
			}
			if(height < 200){
				height = 200;
			}
			$("#disDIV"+serial).css("max-width",width+"px");
			$("#disDIV"+serial).css("max-height",height+"px");
			$("#disDIV"+serial).css("overflow","auto");
		}
	  	$("#disDIV"+serial).css({left:parentOffset.left + "px", top:parentOffset.top + parentObj.outerHeight() + "px"}).slideDown("fast");
}
	//点击空白消除绑定事件
	$("html").bind("mousedown",{view : this},function(event){
		for(i=1;i<3;i++){
			if (!(event.target.classname == "wodetreeclass" || $(event.target).parents(".wodetreeclass").length>0)) {
		  	  	$(".wodetreeclass").fadeOut("fast");
		  	}
		}

	});
}

function yourFunction3(ids,names){
	console.log("ids:"+ids+";names:"+names);
    $("#disId1").val(ids);
    $("#disName1").val(names);
}
function yourFunction4(ids,names){
	console.log("ids:"+ids+";names:"+names);
    $("#disId2").val(ids);
    $("#disName2").val(names);
}
function yourFunction8(ids,names){
	console.log("ids:"+ids+";names:"+names);
    $("#disId3").val(ids);
    $("#disName3").val(names);
}

//*************************************************************************
function newselectStaff(){
	//staffTree是人员选择树
	this.staffTrees = null;
	//人员选择树设置
	this.staffSetting = {
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
					idKey:"oCode", 
		            pIdKey:"pCode"
				}
			},
			check:{
				chkStyle:"checkbox",//勾选框类型
				enable:true, //设置 zTree 的节点上是否显示 checkbox
				chkboxType:{"Y":'',"N":''}
			},
			callback: {
				beforeClick: function(treeId, treeNode) {}
			},
			async:{
				enable: true,
				url:prc+"/sysOrgTreeController/disStaffTree",
				autoParam:["oCode","orgKind","staffKind"],
				dataFilter: ajaxDataFilter2//处理异步加载返回的数据
			}
		};
	//查看异步加载返回数据的childNodes是否有值,有值说明展示处室节点,无值说明不展示处室节点
	function ajaxDataFilter2(treeId, parentNode, childNodes) {
		 var dd=childNodes.length;//只要有一个childNOdes节点的id,就证明可以展示下一级
		  if (dd==0) { 
	  	 return null;
	  }else{
	  	return childNodes;

	  }
	}
	//加载人员选择方法
	//orgCode:组织编码
	//orgKind:'1' 甲方 '2' 乙方
	//staffKind:'1' 甲方 '2' 乙方 
	//ifRadio:'1'单选'2'多选
	this.staffTreeDrop = function staffTreeDrop(parent,orgCode, callbackFunc,orgKind, staffKind,ifRadio,serial,width,height){
		var sset = this.staffSetting;
		if(null==orgCode||""==orgCode||undefined == orgCode){
			if($('#myStaffTreeModal').size()==0){
				 $('#myStaffTreeModal').empty();
				 $('body').prepend("<div class='modal fade' id='myStaffTreeModal' tabindex='-1' role='dialog' aria-labelledby='myStaffTreeModal'>" +
				"<div class='modal-dialog' role='document'><div class='modal-content'>"+
				"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
				"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
				"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
				"</div></div>"+
				"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
				"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
				"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
				"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
				 $('#myStaffTreeModal').modal('show');
				return;
			}
		}
		if(null==orgKind||""==orgKind||undefined == orgKind){
			orgKind="1";
		}
		if(null==staffKind||""==staffKind||undefined == staffKind){
			staffKind="1";
		}
		$.post(prc+'/sysOrgTreeController/selectStaffTree.action',{'orgCode':orgCode,'orgKind':orgKind,'staffKind':staffKind},(function(staffSetting){
			return function(data){
				if(ifRadio=="1"||null==ifRadio||""==ifRadio){
					//staffSetting.check.chkStyle="radio";
					staffSetting.check.enable=false;
					staffSetting.callback.beforeClick = 	function(treeId, treeNode) {	
						 var treeObj=$.fn.zTree.getZTreeObj("staffTrees"+serial);
						if(treeNode.isParent){
							if($('#myStaffTreeModal').size()==0){
								 $('#myStaffTreeModal').empty();
								 $('body').prepend("<div class='modal fade' id='myStaffTreeModal' tabindex='-1' role='dialog' aria-labelledby='myStaffTreeModal'>" +
								"<div class='modal-dialog' role='document'><div class='modal-content'>"+
								"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
								"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
								"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
								"</div></div>"+
								"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
								"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
								"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
								"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
								 $('#myStaffTreeModal').modal('show');
							}else{
								$('#myStaffTreeModal').modal('show');
							}
			        		 $("#tishi").html("组织节点不可选！");
			            	 //alert("组织节点不可选！");
			            	 treeObj.cancelSelectedNode(treeNode);
			            	 treeObj.checkNode(treeNode);
			            	 return;
			             }
			         	orgId = treeNode.orgId;	
			         	name=treeNode.getParentNode().name;
			         	soid=treeNode.staffOid;
			         	sid=treeNode.staffId;
			         	sname=treeNode.name;
			         	callbackFunc(orgId,name,soid,sid,sname);
					}
				}else if(ifRadio=="2"){
					staffSetting.check.enable=true;
					staffSetting.check.chkStyle="checkbox";
					staffSetting.check.chkboxType = {"Y":'',"N":''};
					staffSetting.callback.onCheck = function (e,treeId,treeNode){
						var treeObj=$.fn.zTree.getZTreeObj("staffTrees"+serial);
				         nodes=treeObj.getCheckedNodes(true);
				         
				         ids="";
				    	 names="";
				    	 soid="";
				    	 sid="";
				    	 sname = "";
				         for(var i=0;i<nodes.length;i++){
				        	 if(nodes[i].isParent){
				        			if($('#myStaffTreeModal').size()==0){
				        				 $('#myStaffTreeModal').empty();
				        				 $('body').prepend("<div class='modal fade' id='myStaffTreeModal' tabindex='-1' role='dialog' aria-labelledby='myStaffTreeModal'>" +
				        				"<div class='modal-dialog' role='document'><div class='modal-content'>"+
				        				"<div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
				        				"<span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel'>提示</h4></div>"+
				        				"<div class='modal-body'><div class='form-group'><label id='tishi' for='txt_departmentname'>根节点不可为空</label>"+
				        				"</div></div>"+
				        				"<div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'>"+
				        				"<span class='glyphicon' aria-hidden='true'></span>关闭</button>"+
				        				"<button type='button' id='btn_submit' class='btn btn-primary' data-dismiss='modal'>"+
				        				"<span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>");
				        				 $('#myStaffTreeModal').modal('show');
				        			}
				        			else{
										$('#myStaffTreeModal').modal('show');
									}
				        		 $("#tishi").html("组织节点不可选！");
				            	 treeObj.cancelSelectedNode(nodes[i]);
				            	 treeObj.checkNode(nodes[i]);
				            	 return;
				             }
				         	ids += nodes[i].orgId+",";	
				         	names += nodes[i].getParentNode().name + ",";
				         	soid+=nodes[i].staffOid + ",";
				         	sid+=nodes[i].staffId+",";
				         	sname+=nodes[i].name+",";
				         	callbackFunc(ids.substr(0,ids.length-1),names.substr(0,names.length-1),soid.substr(0,soid.length-1),sid.substr(0,sid.length-1),sname.substr(0,sname.length-1));
				        	 }
					}
				}	
					$("#staffDIV"+serial).empty();
					$('#staffDIV'+serial).append("<ul id='staffTrees"+serial+"' class='ztree'></ul>");
				if(data.length==0){
					$("#staffDIV"+serial).css("width","160px");
					$("#staffDIV"+serial).css("height","33px");
					$("#staffTrees"+serial).html("没有相关数据！");
				}else{
					staffTrees = $.fn.zTree.init($("#staffTrees"+serial), staffSetting, data);
					staffTrees.expandAll(false);
				}
			}
		})(sset)
		);
		var parentObj = $(parent);
	  	var parentOffset = $(parent).offset();
		if($("#staffDIV"+serial).size()==0){
			$("#staffDIV"+serial).empty();
	  		$('body').append("	<div id='staffDIV"+serial+"'  class='wodetreeclass'style='position: absolute;background-color: white;border:1px solid #3aa5ff;z-index: 1052;'>"+
			"</div>");
	  	}
		if(Math.round(width) == width&&Math.round(height) == height){
			if(width<100){
				width = 100;
			}
			if(height < 200){
				height = 200;
			}
			$("#staffDIV"+serial).css("max-width",width+"px");
			$("#staffDIV"+serial).css("max-height",height+"px");
			$("#staffDIV"+serial).css("overflow","auto");
		}
	  	$("#staffDIV"+serial).css({left:parentOffset.left + "px", top:parentOffset.top + parentObj.outerHeight() + "px"}).slideDown("fast");
}
	//点击空白消除绑定事件
	$("html").bind("mousedown",{view : this},function(event){
		if (!(event.target.classname == "class='wodetreeclass'" || $(event.target).parents(".wodetreeclass").length>0)) {
	  	  	$(".wodetreeclass").fadeOut("fast");
	  	}
	});
}

function yourFunction5(ids,names,soid,sid,sname){
	console.log("ids:"+ids+";names:"+names+"soid:"+soid+";sid:"+sid+"sname:"+sname);
    $("#orgId5").val(ids);
    $("#orgName5").val(names);
    $("#staffOrgId5").val(soid);
    $("#staffId5").val(sid);
    $("#staffName5").val(sname);
}
function yourFunction6(ids,names,soid,sid,sname){
	console.log("ids:"+ids+";names:"+names+"soid:"+soid+";sid:"+sid+"sname:"+sname);
    $("#orgId6").val(ids);
    $("#orgName6").val(names);
    $("#staffOrgId6").val(soid);
    $("#staffId6").val(sid);
    $("#staffName6").val(sname);
}
function yourFunction9(ids,names,soid,sid,sname){
	console.log("ids:"+ids+";names:"+names+"soid:"+soid+";sid:"+sid+"sname:"+sname);
    $("#orgId7").val(ids);
    $("#orgName7").val(names);
    $("#staffOrgId7").val(soid);
    $("#staffId7").val(sid);
    $("#staffName7").val(sname);
}