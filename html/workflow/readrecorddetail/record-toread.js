function loadTaskPath(a,o,e,t,r){$.post(a+"flowReadRecord/findRecordPath/"+o+"/"+e+"/"+t,function(o){var e=o.retCode;if(1==e){var d=a+"/"+o.dataRows[0].url;$("#paramToread").val(d.substring(d.indexOf("?")+1)),$("#businessToread").load(d)}else 0==e&&alert(o.retVal);loadCustomTabs(a,$("#paramToread").val(),r,t)})}function loadCustomTabs(a,o,e,t){$.get(a+"workflowrest/taburls/"+e+"/"+t+"/"+!1,function(e){var t=e.retCode;if(1==t)for(var r=0;r<e.dataRows.length;r++){var d=e.dataRows[r].name,s=a+e.dataRows[r].url+"?"+o,l="custom_tab"+(r+1),n="custom_div"+(r+1),i='<div role="tabpanel" class="tab-pane fade" id=\''+n+"Toread'></div>",c="<li id='"+l+"Toread' role='presentation'></li>",f="<a href='#"+n+"Toread' aria-controls='"+n+'\' role="tab" data-toggle="tab">'+d+"</a>";$("#historyToread").before(i),$("#"+n+"Toread").load(s),$("#historyLiToread").before(c),$("#"+l+"Toread").append(f)}})}function loadHistoicFlow(a,o){$.get(a+"/workflowrest/histoicflow/"+o,function(a){var o=a.retCode;if(1==o){for(var e="",t=0;t<a.dataRows.length;t++){var r=a.dataRows[t].startTime;r=getSmpFormatDateByLong(r,!0);var d=a.dataRows[t].endTime;d=null==d?"":getSmpFormatDateByLong(d,!0);var s=t+1,l=a.dataRows[t].assigneeName,n=a.dataRows[t].fromUserName;1==a.dataRows[t].replace&&(l=l+"（ "+n+"——待办授权）"),e+="<tr><td>"+s+"</td><td>"+a.dataRows[t].linkName+"</td><td>"+l+"</td><td>"+a.dataRows[t].orgName+"</td><td>"+a.dataRows[t].handleType+"</td><td>"+r+"</td><td>"+d+'</td><td style="word-wrap:break-word;word-break:break-all;">'+a.dataRows[t].userComment+"</td></tr>"}$("#historyContentToread").html(e)}else 0==o&&alert(a.retVal)})}function doRead(a){var o=confirm("【已阅】确认后，请在已阅菜单查看，是否确认？");1==o&&$.post(serverPath+"flowReadRecord/signRecord",{recordId:a},function(a){1==a&&(alert("标记成功，请往已阅菜单查看!"),modal_close())})}function modal_close(){showToReadList()}function showToReadList(){serarchToread(),$("#goRecordToReadDetailToread").hide(),$("#searchContentToread").show()}$(function(){var a=$("#processDefinitionIdToread").val(),o=$("#processInstanceIdToread").val(),e=$("#taskDefinitionKeyToread").val(),t=$("#idToread").val();loadTaskPath(serverPath,o,t,e,a),loadHistoicFlow(serverPath,o),$("#diagramImgToread").attr("src",serverPath+"workflowrest/flowchart/"+o+"/"+parseInt(10*Math.random()))});