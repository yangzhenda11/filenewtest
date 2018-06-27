function judge(a){return App.stopLoading("#searchBtn"),resolveResult(a)}function searchStaff(a){var e=$("#staffSearchOnlyTable").DataTable();a?e.ajax.reload(null,!1):e.ajax.reload()}function showStaffDetail(a){$("#infoModal").load("staffDetailModal.html",function(){function e(a){function e(a){return a?App.formatDateTime(new Date(a),"yyyy-mm-dd"):""}function t(a){return"1"==a?"有效":"无效"}function r(a){return"F"==a?"女":"男"}App.setFindValue($("#infoDiv"),a.data.staffInfo,{hireDate:e,staffStatus:t,sex:r});var n=a.data.staffOrgs;if(n.length>0)for(p in n){var l=n[p],o='<div class="col-sm-12">                         <div class="form-group">                             <label class="control-label col-sm-2">所属岗位:</label>                             <div class="col-sm-10">                                 <p class="form-control-static">'+l.orgName+"("+orgTypeSet[l.staffOrgType]+")</p>                             </div>                         </div>                     </div>";$("#staffOrgInfos").append(o)}else $("#staffOrgInfos").append('<h5 class="text-center">无岗位数据</h5>');var s=a.data.roles;if(s.length>0)for(p in s){var f=s[p],i='<div class="col-sm-6">                         <div class="form-group">                             <label class="control-label col-sm-4">角色名称:</label>                             <div class="col-sm-8">                                 <p class="form-control-static">'+f.roleName+'</p>                             </div>                         </div>                     </div>                     <div class="col-sm-6">                         <div class="form-group">                             <label class="control-label col-sm-4">适用范围:</label>                             <div class="col-sm-8">                                 <p class="form-control-static">'+f.provName+"</p>                             </div>                         </div>                     </div>";$("#roleDiv").append(i)}else $("#roleDiv").append('<h5 class="text-center">无角色数据</h5>');var c=a.data.permissions;if(c.length>0){$.fn.zTree.destroy("staffDetailPermtree");{$.fn.zTree.init($("#staffDetailPermtree"),{data:{simpleData:{enable:!0,idKey:"PERM_ID",pIdKey:"PARENT_ID"},key:{name:"PERM_NAME"}}},c)}}else $("#staffDetailPermtree").detach(),$("#permission").append('<h5 class="text-center">无权限数据</h5>')}$("#infoModal").modal({show:!0,backdrop:"static"}),App.formAjaxJson(parent.globalConfig.serverPath+"staffs/"+a,"GET",null,e),$("#infoModal").on("hide.bs.modal",function(){$("#infoModal").empty()})})}function returnStaffList(){$("#staffLoadPart").empty(),$("#staffLoadPart").hide(),$("#divStaffList").show()}function searchPersonnel(a){var e=$("#staffSearchOnlyTable").DataTable();a?e.ajax.reload(null,!1):e.ajax.reload()}function getStaffSearch_OrgTree(a){selectOrgTree("staffSearch_OrgTree",a,parent.globalConfig.curCompanyId,getStaffSearch_OrgTreeId,"","1","400","300")}function getStaffSearch_OrgTreeId(a,e){$("input[name='orgName']",$("#searchOnlyStaffForm")).val(e),$("input[name='orgId']",$("#searchOnlyStaffForm")).val(a)}var serverPath=parent.globalConfig.serverPath;$(function(){function a(a){e=a.sysConfig.val,1==e&&$("#addBtn").show(),App.initDataTables("#staffSearchOnlyTable",{serverSide:!0,ajax:{type:"GET",url:parent.globalConfig.serverPath+"staffs/",data:function(a){a.sysOrgId=parent.globalConfig.curCompanyId,a.staffName=$("input[name='staffName']",$("#searchOnlyStaffForm")).val(),a.loginName=$("input[name='loginName']",$("#searchOnlyStaffForm")).val();var e=$("input[name='orgId']",$("#searchOnlyStaffForm")).val();return null!=e&&""!=e&&(a.sysOrgId=$("input[name='orgId']",$("#searchOnlyStaffForm")).val()),a.staffStatus=$("select[name='staffStatus']",$("#searchOnlyStaffForm")).val(),a.mobilPhone=$("input[name='mobilPhone']",$("#searchOnlyStaffForm")).val(),a.staffKind="1",a.attra=$("select[name='staffOrgType']",$("#searchOnlyStaffForm")).val(),a},contentType:"application/x-www-form-urlencoded; charset=UTF-8",dataType:"json",error:function(){App.stopLoading("#searchBtn"),layer.msg("接口错误",{icon:2})},dataSrc:judge},columns:[{data:null,title:"人员姓名",render:function(a){return'<a href="javascript:void(0)" onclick = "showStaffDetail('+a.STAFF_ID+')">'+a.STAFF_NAME+"</a>"}},{data:"LOGIN_NAME",title:"账号"},{data:"ORG_NAME",title:"部门名称"},{data:"STAFF_ORG_TYPE",title:"岗位类别",className:"text-center",render:function(a,e,t){return"F"==t.STAFF_ORG_TYPE?"主岗":"T"==t.STAFF_ORG_TYPE?"兼岗":"借调"}},{data:"SEX",title:"性别",className:"text-center",render:function(a,e,t){return"M"==t.SEX?"男":"女"}},{data:"EMAIL",title:"邮箱账号"},{data:"MOBIL_PHONE",title:"手机号码"},{data:"STAFF_ORG_STATUS",title:"岗位状态",className:"text-center",render:function(a,e,t){return"1"==t.STAFF_ORG_STATUS?"有效":"无效"}}],columnDefs:[{targets:"_all",defaultContent:""},{targets:0,render:function(a,e,t){var r=btnFun(t),n=roletemplate(r);return n}}],fixedColumns:{leftColumns:2},scrollX:!0})}var e;App.formAjaxJson(parent.globalConfig.serverPath+"configs/13","GET",null,a)});var orgTypeSet={F:"主岗",T:"兼职",J:"借调"};