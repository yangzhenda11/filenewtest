function serarchToread(){searchTableToread.ajax.reload()}function resetCondition(){$("#processTitleToread").val(""),$("#linkNameToread").val(""),$("input[name='startDateToread']").val(""),$("input[name='endDateToread']").val("")}function handleTaskToread(e,a,t,r,o,n,d,l,i,c){$("#recordIdToread").val(c),$("#idToread").val(e),$("#taskDefinitionKeyToread").val(a),$("#nameToread").val(t),$("#processInstanceIdToread").val(r),$("#titleToread").val(o),$("#processDefinitionIdToread").val(n),$("#processDefinitionKeyToread").val(d),$("#executionIdToread").val(l),$("#assigneeIdToread").val(i),$("#goRecordToReadDetailToread").load("../workflow/readrecorddetail/record-toread.html"),$("#goRecordToReadDetailToread").show(),$("#searchContentToread").hide()}$(function(){$("#currentIdToread").val(curStaffOrgId),searchTableToread=$("#searchTableToread").DataTable(dataTableConfig)});var btnModel='    	{{#each func}}    <button type="button" class="user-button btn-sm {{this.type}}" {{this.title}} {{this.fn}}>{{this.name}}</button>    {{/each}}',template=Handlebars.compile(btnModel),searchTableToread,dataTableConfig={ordering:!1,serverSide:!0,scrollX:!0,ajax:{type:"POST",url:serverPath+"flowReadRecord/recordToRead",contentType:"application/x-www-form-urlencoded; charset=UTF-8",dataType:"json",data:function(e){return e.title=$("#processTitleToread").val(),e.name=$("#linkNameToread").val(),e.createTimeStart=$("#startDateToread").val(),e.createTimeEnd=$("#endDateToread").val(),e}},columns:[{data:"title",title:"流程标题",className:"text-center"},{data:"processDefinitionName",title:"流程名称",className:"text-center"},{data:"name",title:"环节名称",className:"text-center"},{data:"createTime",title:"接收时间",className:"text-center",render:function(e){return getSmpFormatDateByLong(e,!0)}},{data:null,title:"操作",className:"text-center"}],columnDefs:[{targets:"_all",defaultContent:""},{targets:-1,render:function(e,a,t){var r=$("#currentIdToread").val(),o=t.receiverId,n="disabled",d="title=当前任务属于【"+t.orgName+"】，请切换岗位后查看",l="";r==o&&(n="",d="",l="onclick=handleTaskToread('"+t.id+"','"+t.taskDefinitionKey+"','"+t.name+"','"+t.processInstanceId+"','"+t.title+"','"+t.processDefinitionId+"','"+t.processDefinitionKey+"','"+t.executionId+"','"+t.assignee+"','"+t.recordId+"')");var i={func:[{name:"查看",title:d,fn:l,type:n}]},c=template(i);return c}}],dom:'rt<"pull-left mt5"i><"pull-right mt5"p><"clear">'};