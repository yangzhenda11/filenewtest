//@ sourceURL=assigneeList.js
/**
 * 人员列表单选页
 * @author ctt
 */
$(function(){
	// 加载表格
$("#currentId").val(curStaffOrgId);

});
// 后面构建btn 代码
var btnModel =  '    \
	{{#each func}}\
    <button type="button" class="btn primary btn-outline btn-xs {{this.type}}" {{this.title}} onclick="{{this.fn}}">{{this.name}}</button>\
    {{/each}}';
var template = Handlebars.compile(btnModel);

var chooseType=1

var tablestr="操作";
if(chooseType==2){
	$("#duoxuan").show();
	tablestr='<input type="checkbox" class="checkall" />';
}else{
	$("#duoxuan").hide();
}
/*
 * 表格初始化
 */
App.initDataTables('#searchStaffTable', "#searchEforgHome", {
	fixedColumns: {
		leftColumns: 2					//固定左侧两列
	},
	buttons: [],		//显示的工具按钮
	ajax: {
		"type": "GET",					//请求方式
		"url": serverPath + 'assignee/searchMap4Page',	//请求地址
		"data": function(d) {							//自定义传入参数
			d.flowKey	=$("#wfflowKey").val();
			d.linkCode	=$("#wflinkCode").val(); 
			d.prov		=$("#wfprov").val();  
			
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
	        	
				
					if(chooseType=='2'){
						return '<input type="checkbox"  class="checkchild"  value="' + row.staffOrgId + '-'+row.staffName+'" />';
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
});
  
/*
 * 搜索点击事件
 */
function selectStaffList(resetPaging) {
	var table = $('#searchStaffTable').DataTable();
	if(resetPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
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
	  funName=$("#callbackFun").val();
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
	  window.parent[funName](ids,names);
	}

