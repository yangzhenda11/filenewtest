function getPersonalConfigTable(){App.initDataTables("#personalConfigTable","#submitBtn",{ajax:{type:"GET",url:serverPath+"personalConfig/list",data:function(a){return a.code=$("#personalConfigCode").val(),a.staffOrgId=globalConfig.curStaffOrgId,a}},columns:[{data:null,title:"操作",className:"text-center",render:function(a,e,o){var n=new Array;return n.push({name:"修改",fn:"editPersonalConfigModal('"+o.id+"')"}),App.getDataTableBtn(n)}},{data:"code",title:"参数名称",render:$.fn.dataTable.render.ellipsis(22,!0)},{data:"val",title:"参数值",render:$.fn.dataTable.render.ellipsis(22,!0)}]})}function searchPersonalConfig(a){var e=$("#personalConfigTable").DataTable();a?e.ajax.reload(null,!1):e.ajax.reload()}function editPersonalConfigModal(a){$("#personalConfigModal").load("_personalConfigModal.html?"+App.timestamp()+" #modalEdit",function(){$("#modalTitle").text("系统参数修改"),getPersonalConfig(a,"edit")})}function getPersonalConfig(a,e){function o(a){var o=a;if("edit"==e){$("#personalConfigModal").modal("show"),$('#personalConfigForm input[name="staffOrgId"]').val(globalConfig.curStaffOrgId),$('#personalConfigForm input[name="configId"]').val(o.data.id),$('#personalConfigForm input[name="code"]').val(o.data.code);var n="";if(o.data.attrb&&o.data.attrb.length>0)for(var t=o.data.attrb.split("|"),l=0;l<t.length;l++)n+="<option value='"+t[l]+"'>"+t[l]+"</option> ";else n+="<option value='"+o.data.val+"'>"+o.data.val+"</option> ";$("#personalConfigForm select").append(n),$("#personalConfigForm select").val(o.data.val),App.initFormSelect2("#personalConfigForm"),validate()}else{$("#personalConfigModal").modal("show"),$("#codeDetail").text(o.code);var r={attra:function(a){return"0"==a?"否":"是"}};App.setFindValue("#personalConfigInfo",o,r)}}App.formAjaxJson(serverPath+"personalConfig/selectOne/"+a+"?staffOrgId="+globalConfig.curStaffOrgId+App.timestamp(),"GET",null,o,null,null,null,!1)}function updatePersonalConfig(){function a(){layer.msg("参数设置成功，重新登录后生效",{icon:1}),$("#personalConfigModal").modal("hide"),searchPersonalConfig(!0)}function e(){$("#personalConfigForm").data("bootstrapValidator").resetForm()}var o=App.getFormValues($("#personalConfigForm")),n=serverPath+"personalConfig/update";App.formAjaxJson(n,"POST",JSON.stringify(o),a,e,null,null,!1)}function validate(){$("#personalConfigForm").bootstrapValidator({live:"enabled",trigger:"live focus blur keyup change",message:"校验未通过",container:"popover",fields:{code:{validators:{notEmpty:{message:"请输入参数名称"}}},val:{validators:{notEmpty:{message:"请输入参数值"}}},attra:{validators:{notEmpty:{message:"请选择允许用户更改"}},trigger:"change"}}}).on("success.form.bv",function(a){a.preventDefault(),updatePersonalConfig()})}var globalConfig=parent.globalConfig,serverPath=globalConfig.serverPath;$(function(){getPersonalConfigTable()});