//@ sourceURL=assigneeList.js
/**
 * 人员列表单选页
 * @author ctt
 */
var tablestr='';
var dataTableConfig = {};
var chooseType;
var _documentHeight = 0;
var _checkedPerArr = [];
function setParam(flowKey,linkcode,prov,callbackFun,staffSelectType,city,contracType,attrA,attrB,attrC){
	$("#wfflowKey").val(flowKey);
	$("#wflinkCode").val(linkcode);
	$("#wfprov").val(prov);
	$("#wfcallbackFun").val(callbackFun);
	$("#wfstaffSelectType").val(staffSelectType);
	$("#wfcity").val(city);
	$("#wfcontracType").val(contracType);
	$("#wfattrA").val(attrA);
	$("#wfattrB").val(attrB);
	$("#wfattrC").val(attrC);
	
	//chooseType=$("#wfstaffSelectType").val();
	chooseType = staffSelectType;
	if(chooseType==2){
		$("#duoxuan,#checkedPer").show();
		tablestr='<input type="checkbox" class="checkall" />';
	}else if(chooseType==1){
		$("#duoxuan,#checkedPer").hide();
		tablestr="操作"
	}else{
		$("#duoxuan,#checkedPer").hide();
		tablestr="未知"
	};
	_documentHeight = $(".page-content").height() - 320;
	$("#_searchStaffTableDom").css("height",_documentHeight + 90);
	setDataTableConfig();
}

$(function(){
	// 加载表格
	$("#currentId").val(curStaffOrgId);
});
var searchStaffTable;
// 后面构建btn 代码
var btnModel =  '    \
	{{#each func}}\
    <button type="button" class="btn primary btn-outline btn-xs {{this.type}}" {{this.title}} onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);

function setDataTableConfig(){
	if(App.isIE9() || App.isIE8()){
		_documentHeight = "";
	}
	dataTableConfig={
		scrollY:_documentHeight,
		ajax: {
			"type": "GET",					//请求方式
			"url": serverPath + 'assignee/searchMap4Page',	//请求地址
			"data": function(d) {							//自定义传入参数
				d.flowKey	=$("#wfflowKey").val();
				d.linkCode	=$("#wflinkCode").val(); 
				d.prov		=$("#wfprov").val();  
				d.city=$("#wfcity").val();
				d.contracType=$("#wfcontracType").val();
				d.attrA=$("#wfattrA").val();
				d.attrB=$("#wfattrB").val();
				d.attrC=$("#wfattrC").val();
				
				d.orgFullName=$("#searchEfOName").val();
				d.staffName  =$("#searchEfstaffName").val();
				d.loginName  =$("#loginname").val();
	        	return d;
			}
		},           
		columns: [// 对应列
			{	"data"      : "",
				"title"     : tablestr,
				"width"     : "20",
				"className" : "text-center",	
				"render"    : function (data, type, row, meta) {		        	
						if(chooseType==2){
							return '<input type="checkbox" class="checkchild" value="' + row.STAFF_ORG_ID + '-'+row.STAFF_NAME+'" />';
						}else{
							var fn = "selectStaffValue(\'"+row.ORG_ID+"\',\'"+row.org_code+"\',\'"+row.full_name+"\',\'"+row.STAFF_NAME+"\',\'"+row.STAFF_ORG_ID+"\','"+$("#wfcallbackFun").val()+"')"; 
							var context =
							{
								func: [
									{	"name": "选择", 
										"title": "请选择人员", 
										"fn": fn, 
										"type": ""
									}
									]
							};
							var html = template(context);
							return html;
						}
					}
			},
			{"data": "STAFF_NAME","title":"姓名",className: "text-center"},
			{"data": "STAFF_ID","title":"人员id",className: "text-center","visible" : false},
			{"data": "LOGIN_NAME","title":"帐号",className: "text-center"},
			{"data": "STAFF_ORG_ID","title":"岗位id",className: "text-center","visible" : false},
			{"data": "full_name","title":"组织机构名称",className: "text-center"},
			{"data": "STAFF_ORG_TYPE","title":"岗位类型",className: "text-center", 
				render:function (data, type, row, meta){
					if('F' == data){
						return '主岗';
					}else if('T' == data){
						return '兼职';
					}else {
						return '借调';
					}
				}
			},
			{"data": "ORG_ID","title":"组织id",className: "text-center","visible" : false},
			{"data": "org_code","title":"组织code",className: "text-center","visible" : false},
	        {"data": "staff_sort","title":"人员排序",className: "text-center","visible" : false}
	    ]
	};
}

/*
 * 表格初始化
 */
//App.initDataTables('#searchStaffTable', "#searchEforgHome", dataTableConfig);
  
/*
 * 搜索点击事件
 */
function selectStaffList(retainPaging) {
	var table = $('#searchStaffTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
//	if(searchStaffTable){
//		//重载表格
//		searchStaffTable.ajax.reload();
//	}else{
//		// 加载表格
//		searchStaffTable = App.initDataTables('#searchStaffTable', "#searchEforgHome", dataTableConfig);
//	}
}

//人员列表的回调函数
function selectStaffValue(ORG_ID,org_code,full_name,STAFF_NAME,STAFF_ORG_ID,callbackFun){
	if(typeof(eval(callbackFun))=="function"){
		eval(callbackFun+"("+ORG_ID+","+org_code+",\'"+full_name+"\',\'"+STAFF_NAME+"\',"+STAFF_ORG_ID+")");
	}
	//window.parent[callbackFun](orgId,orgCode,orgFullName,staffName,staffOrgId,modelId);
}

function resetFun(){
	$("#searchEfstaffName").val('');
	$("#loginname").val('');
	$("#searchEfOName").val('');
} 
function addMultiStaff(){
	  funName=$("#wfcallbackFun").val();
	  if ($(".checkchild:checked").length == 0){
			layer.msg("请选人员，可以多选！",{time:1000});
			return;
		}
	  var ids='';
	  var names='';
	  $(".checkchild:checked").each(function(i){
	      var value = $(this).val();
	      value=value.split("-");
	      ids=ids+value[0]+',';
	      names=names+value[1]+',';
	    });
	  ids=ids.substring(0,ids.length-1);
	  names=names.substring(0,names.length-1);
	  eval(funName+"(\'"+ids+"\',\'"+names+"\')");
}
/*
 * 多选点击事件
 */
$("#searchStaffTable").on("change",".checkchild",function(){
	var itemValue = $(this).val().split("-");
	var item = {
		id: itemValue[0],
		name:  itemValue[1]
	};
	var index = null;
	$.each(_checkedPerArr,function(k,v){
		if(v.id == item.id){
			index = k;
			return false;
		}
	});
	if($(this).prop("checked")){
		if(index == null){
			_checkedPerArr.push(item);
		};
	}else{
		_checkedPerArr.splice(index,1);
	};
	$("#checkedPerLen").text(_checkedPerArr.length);
});

