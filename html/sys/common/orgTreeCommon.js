/**
 * 调用弹出框选组织组件
 * @param serial 唯一标识
 * @param curorgId 当前登录人组织id
 * @param curStaffOrgId 当前登录人岗位id 
 * @param callBackFun 回调函数
 * @param checked 已选节点
 * @param ifRadio 是否单选
 * @returns
 */
function selectOrg(serial,curorgId,curStaffOrgId,callBackFun,checked,ifRadio) {
	new selectOrgModal().orgModal(serial,curorgId,curStaffOrgId,callBackFun,checked,ifRadio);
}

function selectOrgModal(){
	//初始化参数配置，如果参数不为空值，则使用当前值，如果参数为空值
	this.initValOrg = {
			ifradio:"2",
			init:function(ifr){
				if(null != ifr && ""!=ifr){
					this.ifradio = ifr;
				}
			},
			getIfradio:function(){
				return this.ifradio;
			}
		}
	
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
	this.orgModal = function orgModal(serial,curorgId,curStaffOrgId,callBackFun,checked,ifRadio){
		checked=[{"staffId":10002,"staffName":"管理员"}];
		var intitOrg = this.initValOrg;
		var oset = this.orgSetting;
		if($("#example"+serial).size() == 0){
			$('body').append('<div class="" id="example"></div>');
			$("#example").attr("id","example"+serial);
		}
		
		$("#example"+serial).load("../common/orgTreeCommon.html",function (){
			// 弹出框关闭按钮的点击事件
			$('a.close_btn').click(function(){
				$(this).parents('.detail_layer_org').fadeOut();
				$('.fade_layer').fadeOut();
			});
			// 取消按钮的点击事件
			$('a.title_close').click(function(){
				$(this).parents('.detail_layer_org').fadeOut();
				$('.fade_layer').fadeOut();
			});
			//展示阴影层
			$('.fade_layer').fadeIn();
			//设置唯一id
			$("#orgTree").attr("id","orgTree"+serial);
			$("#buttonConfim").attr("id","buttonConfim"+serial);	
			$("#searchStaff").attr("id","searchStaff"+serial);
			intitOrg.init(ifRadio);
			curorgId = 34869;
			var orgid = curorgId;
			//请求组织树节点数据
			$.ajax({
			    url: serverPath + "orgs/"+orgid+"/orgTree",
			    type: "GET",
			    async: false,
			    success:(function(orgSetting){
					return function(data){
						if("1" == data.status){
							$("#orgTrees").attr("id","orgTrees"+serial);
							
						/*	orgSetting.async.otherParam ={
									"showType":showType,
							};*/
							debugger;
							if(intitOrg.getIfradio()=="1"){
								orgSetting.check.enable=false;
								orgSetting.callback.onClick = function(event,treeId, treeNode) {	
									var orgId = treeNode.orgId;	
						         	var orgName = treeNode.orgName;
						         	var orgCode = treeNode.orgCode;
						         	debugger;
						         	callBackFun(orgId, orgName, orgCode);
						         	buttonConfirm(orgId,orgName,orgCode,callBackFun);
								};
							}else if(intitOrg.getIfradio()=="2"){
								orgSetting.check.enable=true;
								orgSetting.check.chkStyle="checkbox";
								orgSetting.check.chkboxType = {"Y":'',"N":''};
							}
							if(data.data.length==0){
								$("#orgTrees"+serial).html("没有相关数据！");
							}else{
								$("#orgTree"+serial).css("overflow","auto");
								orgTrees = $.fn.zTree.init($("#orgTrees"+serial+""), orgSetting, data.data);
								orgTrees.expandAll(false);
							}
						}else{
							alert("cuole ");
						}
					}
				})(oset)
			  });
			buttonConfirm(serial,callBackFun);
		});
	}
}

/**
 * 确认按钮的回调函数
 * @param orgId 组织id 
 * @param orgName 组织名称
 * @param orgCode 组织编码
 * @param callBackFun 回调函数
 * @returns
 */
function buttonConfirm(serial,callBackFun){
	$('a.orgTreedo_add').click(function (){
		var treeObj=$.fn.zTree.getZTreeObj("orgTrees"+serial),
        nodes=treeObj.getCheckedNodes(true);
    	if (nodes.length === 0) {
   		callBackFun('', '', '');
   		return;
   	}
        orgIds="";
        orgNames="";
   	 	orgCodes="";
        for(var i=0;i<nodes.length;i++){
        	orgIds+= nodes[i].orgId+",";	
        	orgNames+= nodes[i].orgName + ",";
        	orgCodes += nodes[i].orgCode+",";
       	 }
       
		//调用回调函数
	    callBackFun(orgIds,orgCodes,orgNames);
	    //点击确定按钮后，关闭弹出 框和阴影层
	    debugger;
	    $(this).parents('.detail_layer').fadeOut();
		$('.fade_layer').fadeOut();
});
	
}
/**
 * 回调函数样例，本人员组件只提供了组织id和组织名称以及组织编码的回调参数
 * @param orgId 组织id
 * @param orgName 组织名称
 * @param orgCode 组织编码
 * @returns
 */
function yourFunction2(orgId,orgName,orgCode){
	console.log("ids:"+orgId+";names:"+orgName+";codes:"+orgCode);
	alert("ids:"+orgId+";names:"+orgName+";codes:"+orgCode);
}

