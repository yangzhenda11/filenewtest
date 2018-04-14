<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>业务委托管理</title>
    <link href="${prcs}/css/def/ztree/metro.css" rel="stylesheet">
    <link href="${prcs}/css/def/bootstrap/ace/ace-part2.min.css" rel="stylesheet">
    <link href="${prcs}/css/def/bootstrap/ace/ace.css" rel="stylesheet">
    <link href="${prcs}/css/def/frm/common/common.css" rel="stylesheet">
    <script src="${pageContext.request.contextPath}/resource/js/jquery/plugin/handlebars-v3.0.1.js"></script>
	<script src="${pageContext.request.contextPath}/resource/js/jquery/plugin/My97DatePicker/WdatePicker.js"></script>
	<script src="${pageContext.request.contextPath}/resource/js/frm/workflow/delegateDemo/delegateDemo.js"></script>
		<script src="${pageContext.request.contextPath}/resource/js/frm/workflow/common/date-format.js"></script>
</head>
<body>
	<div class="head-title">
		<span>业务委托管理</span>
	</div>
		
		<div class="container-fluid" id="searchContent">
		<div class="row">
			<form class="form-inline" method="post" id="delegateManagerForm">
				
				<div class= "input-group col-md-3 free-3">
					 <span class="input-group-addon">录入开始时间:</span> 
					 <input type="text" name="startDate" id="startDate" size="30px" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" class="form-control" readonly="readonly"/>
				</div>
				<div class="input-group col-md-3 free-3">
					<span class="input-group-addon">录入结束时间:</span> 
				     <input type="text" name="endDate" id="endDate" size="30px" onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" class="form-control" readonly="readonly"/>
				</div>			
				<div class="div-button col-md-pull-3">
					<%-- <shiro:hasPermission name="sysDemoController/searchData4Page"> --%>
					<a type="button" class="btn btn-info" onclick="serarch();"><i
						class="ace-icon glyphicon glyphicon-search"></i>查询</a>
					<a type="button" class="btn btn-info" onclick="resetCondition();"><i
						class="ace-icon glyphicon glyphicon-search"></i>重置</a>
				<%-- </shiro:hasPermission> --%>
				</div>			   
			</form>
		</div>
<!--  		<hr/> -->
 		<div class="row">
 			<button type="button" class="btn btn-success" onclick="showAddPage();">
				<i class="ace-icon glyphicon glyphicon-plus align-top bigger-125"></i>新增
			</button>
		</div>
		<div class="row">
			<table id="searchTable" class="display table table-bordered" cellspacing="0" width="100%">
			</table>
		</div>
	</div>

		
<div class="container-fluid staffUpdate" id="editTaskDelegateEntityModal" style="display:none;"> 
	<div class="orderchek-body-row">
		<form  class="form-horizontal" role="form" id="editTaskDelegateEntityForm">
			<div class="orderchek-border">
			 <div class="orderchek-title" class="modal-title" id="permModalLabel1" style="width:auto;display:none;">
					任务委托新增
			 </div> 
	        <div id="roleModalTitle" class="orderchek-title"></div>
				<div class="ordercheck-table table-responsive">
					<div class="demo-row modal-body" id="TaskDelegateEntityField" >
					    <div class="form-group">
							<div class="input-group">
								<label for="name" class="input-group-addon">委托人<i class="iconfont icon-mi required"></i></label>
								<input type="text" class="form-control" name="ownerId"  placeholder="委托人" id="ownerId">
				    		</div>
						 </div>
						 <div class="form-group">
							<div class="input-group">
								<label for="name" class="input-group-addon">被委托人<i class="iconfont icon-mi required"></i></label>
								<input type="text" class="form-control" name="assigneeId"  placeholder="被委托人" id="assigneeId">
				    		</div>
						 </div>
						 <div class="form-group">
							<div class="input-group">
								<label for="name" class="input-group-addon">类型<i class="iconfont icon-mi required"></i></label>
								<select class="form-control" onchange="clearAssignee();"  name="flowKey" id="flowKey"></select>
				    		</div>
						 </div>
						 <div class="form-group">
							<div class="input-group">
								<label for="name" class="input-group-addon">开始时间<i class="iconfont icon-mi required"></i></label>
								 <input type="text" name="startTime" id="startTime" onclick="getDate();" placeholder="开始时间" class="form-control" readonly="readonly"/>
				    		</div>
						 </div>
						 <div class="form-group">
							<div class="input-group">
								<label for="name" class="input-group-addon">结束时间<i class="iconfont icon-mi required"></i></label>
								 <input type="text" name="endTime" id="endTime" onclick="getDate()" placeholder="结束时间" class="form-control" readonly="readonly"/>
				    		</div>
						 </div>
						 <div class="form-group">
							<div class="input-group">
								<label for="name" class="input-group-addon">备注</label>
								<input type="text" name="remark" class="form-control"  placeholder="备注" id="remark">
				    		</div>
						 </div>
				  		
			    		<div align="center"> 
								<button type="submit" class="btn btn-primary add" id="addBtn" onclick="ifclick()">提交</button>
								<button type="button" class="btn btn-primary"  onclick="goBack()">返回</button>        
					    </div>  
			    	</div>
			</div>
			</div>
		</form>
	</div>
</div>

   <div class="modal fade" id="repeat" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="static" aria-hidden="true">
		<div class="modal-dialog" style="width:1000px;">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<h4 class="modal-title" id="myModalLabel">
						在该时间段已存在重复人员
					</h4>
				</div>
				<div class="modal-body">
					<div class="row">
						<table class="table table-striped table-bordered table-condensed">
				   		<thead>
				   			<tr>
					   			<th>委托人</th>
					   			<th>被委托人</th>
					   			<th>类型</th>
					   			<th>开始时间</th>
					   			<th>结束时间</th>
					   			<th>录入时间</th>
					   			<th>更新时间</th>
					   			<th>备注</th>
				   			</tr>
				   		</thead>
				   		<tbody id="repeatContent">
				   		</tbody>
				   	</table>
					</div>
					<div class="clearfix"></div>
				</div>
				<div class="modal-footer">
	       			<button type="button" class="btn btn-success" onclick="repeatClose();">关闭</button>
				</div>
			</div>
		</div>
	</div>
</body>
</html>