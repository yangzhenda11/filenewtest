function selectStaff(t,e,a,n,l,o){(new selectStaffModal).staffModal(t,e,a,n,l,o)}function selectStaffModal(){function t(t,e,a){return a?a=a.data:null}this.initValStaff={ifradio:"1",init:function(t){null!=t&&""!=t&&(this.ifradio=t)},getIfradio:function(){return this.ifradio}},this.orgTrees=null,this.orgSetting={view:{selectedMulti:!1},edit:{enable:!1,editNameSelectAll:!1},data:{simpleData:{enable:!0,idKey:"orgId",pIdKey:"parentId"},key:{name:"orgName"}},check:{chkStyle:"checkbox",enable:!1,chkboxType:{Y:"",N:""}},async:{enable:!0,url:"",type:"GET",dataType:"json",dataFilter:t},callback:{beforeAsync:function(t,e){return orgTrees.setting.async.url=serverPath+"orgs/"+e.orgId+"/children",!0}}},this.staffModal=function(t,e,a,n,l,o){l=[{staffId:10002,staffName:"管理员"}];var i=this.initValStaff,r=this.orgSetting;0==$("#example"+t).size()&&($("body").append('<div class="" id="example"></div>'),$("#example").attr("id","example"+t)),$("#example"+t).load("../common/treeCommon.html",function(){$("a.close_btn").click(function(){$(this).parents(".detail_layer").fadeOut(),$(".fade_layer").fadeOut()}),$("a.title_close").click(function(){$(this).parents(".detail_layer").fadeOut(),$(".fade_layer").fadeOut()}),$(".fade_layer").fadeIn(),$("#rightSelected").attr("id","rightSelected"+t),$("#leftSelected").attr("id","leftSelected"+t),$("#checkedStaff").attr("id","checkedStaff"+t),$("#notStaffList").attr("id","notStaffList"+t),$("#roleList").attr("id","roleList"+t),$("#byOrg").attr("id","byOrg"+t),$("#byRole").attr("id","byRole"+t),$("#roleList").attr("id","roleList"+t),$("#orgTree").attr("id","orgTree"+t),$("#buttonConfim").attr("id","buttonConfim"+t),$("#searchStaff").attr("id","searchStaff"+t),$("#centerbutton").attr("id","centerbutton"+t),i.init(o),"2"==i.getIfradio()&&($("#centerbutton"+t).prepend('<button type="button" id="rightAll" class="btn btn-info btn-block"><i class="glyphicon glyphicon-forward"></i></button>'),$("#centerbutton"+t).append('<button type="button" id="leftAll" class="btn btn-info btn-block"><i class="glyphicon glyphicon-backward"></i></button>'),$("#rightAll").attr("id","rightAll"+t),$("#leftAll").attr("id","leftAll"+t),$("#notStaffList"+t).multiselect({rightAll:"#rightAll"+t,leftAll:"#leftAll"+t})),$("#notStaffList"+t).multiselect({keepRenderingSort:!0,right:"#checkedStaff"+t,left:"notStaffList"+t,rightSelected:"#rightSelected"+t,leftSelected:"#leftSelected"+t,search:{left:'<input type="text" name="q" class="form-control" style="margin:10px 0px;" placeholder="查询待选..." />',right:'<input type="text" name="q" class="form-control" style="margin:10px 0px;" placeholder="查询已选..." />'},fireSearch:function(t){return t.length>0},beforeMoveToRight:function(){if("2"==i.getIfradio())return!0;var e=document.getElementById("checkedStaff"+t),a=e.options.length;return 1>a?!0:(appendAlert("myStaffTreeModal",t,"单选"),!1)}}),$("input[name=searchRadio]").click(function(){showCont(t)}),e=34869;var s=e;$.ajax({url:serverPath+"orgs/"+s+"/orgTree",type:"GET",async:!1,success:function(e){return function(a){"1"==a.status?($("#orgTrees").attr("id","orgTrees"+t),e.callback.onClick=function(e,a,n){$.ajax({url:serverPath+"orgs/"+n.orgId+"/staffs/list",type:"GET",async:!1,success:function(e){var a=e.data,n=l;$("#checkedStaff"+t).empty(),$("#notStaffList"+t).empty();for(var o=0;o<n.length;o++)$("#checkedStaff"+t).append($('<option defName="'+n[o].staffName+'" value="'+n[o].staffId+'">'+n[o].staffName+"</option>"));if(a){for(var o=0;o<a.length;o++)for(var i=0;i<n.length;i++)if(a[o].staffId!=n[i].staffId){$("#notStaffList"+t).append($('<option value="'+a[o].staffId+'">'+a[o].staffName+"</option>"));break}}else $("#notStaffList"+t).append("<span>没有数据</span>")},error:function(){alert("查询人员失败")}})},orgTrees=$.fn.zTree.init($("#orgTrees"+t),e,a.data),orgTrees.expandAll(!1)):alert("cuole ")}}(r)}),a=10001;var d=a;$.ajax({url:serverPath+"roles/"+d+"/role",type:"GET",async:!1,success:function(e){for(var a=e.roles,o=0;o<a.length;o++)$("#roleList"+t).append("<div><input type='radio' name='roleCheckBox' value=\""+a[o].roleId+'"/><span>"'+a[o].roleName+'"</span></div>');$("input[name=roleCheckBox]").click(function(){searchStaffByroleId(this.value,s,l,t,n)})},error:function(){alert("查询角色失败")}}),staffbuttonConfirm(t,n)})}}function showCont(t){switch($("input[name=searchRadio]:checked").attr("id")){case"byOrg"+t:$("#orgTree"+t).removeClass("HdClass"),$("#roleList"+t).addClass("HdClass");break;case"byRole"+t:$("#roleList"+t).removeClass("HdClass"),$("#orgTree"+t).addClass("HdClass")}}function searchStaffByroleId(t,e,a,n){$.ajax({url:serverPath+"roles/"+t+"/notstaffsList",data:{orgId:e},type:"GET",async:!1,success:function(t){if("1"==t.status){var e=t.data,l=a;$("#checkedStaff"+n).empty(),$("#notStaffList"+n).empty();for(var o=0;o<l.length;o++)$("#checkedStaff"+n).append($('<option defName="'+l[o].staffName+'" value="'+l[o].staffId+'">'+l[o].staffName+"</option>"));if(e)for(var o=0;o<e.length;o++)for(var i=0;i<l.length;i++)if(e[o].staffId!=l[i].staffId){$("#notStaffList"+n).append($('<option value="'+e[o].staffId+'">'+e[o].staffName+"</option>"));break}}else appendAlert("mysearchStaffByroleIdModal",n,t.message)},error:function(){appendAlert("myrolestaffModal",n,"查询角色下人员失败")}})}function staffbuttonConfirm(t,e){$("a.do_add").click(function(){var a="",n="";$("#checkedStaff"+t+" option").each(function(){a+=$(this).attr("value")+",",n+=$(this).attr("defName")+","}),e(a.substr(0,a.length-1),n.substr(0,n.length-1)),$(this).parents(".detail_layer").fadeOut(),$(".fade_layer").fadeOut()})}function yourFunction1(t,e){console.log("ids:"+t+";names:"+e),alert("ids:"+t+";names:"+e)}function appendAlert(t,e,a){return 0==$("#"+t+e).size()?($("#"+t+e).empty(),$("body").append("<div class='modal fade' id='"+t+e+"' tabindex='-1' role='dialog' aria-labelledby='"+t+e+"'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button><h4 class='modal-title' id='myModalLabel"+e+"'>提示</h4></div><div class='modal-body'><div class='form-group'><label id='tishi"+e+"' for='txt_departmentname'></label></div></div><div class='modal-footer'><button type='button' class='btn btn-default' data-dismiss='modal'><span class='glyphicon' aria-hidden='true'></span>关闭</button><button type='button' id='btn_submit"+e+"' class='btn btn-primary' data-dismiss='modal'><span class='glyphicon' aria-hidden='true'></span>确定</button></div></div></div></div>"),$("#tishi"+e).html(a),void $("#"+t+e).modal("show")):($("#tishi"+e).html(a),void $("#"+t+e).modal("show"))}