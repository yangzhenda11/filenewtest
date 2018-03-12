var editDictValidator = {
	message : 'This value is not valid',
	feedbackIcons : {
		valid : 'glyphicon glyphicon-ok',
		invalid : 'glyphicon glyphicon-remove',
		validating : 'glyphicon glyphicon-refresh'
	},
	submitHandler : function(validator, form, submitButton) {},
	fields : {
		dictLabel : {
			validators : {
				notEmpty : {
					message : '请输入字典名称'
				}
			}

		},
		dictValue : {
			validators : {
				notEmpty : {
					message : '请输入字典值'
				}
			}

		},
		dictSort : {
			validators : {
				notEmpty : {
					message : '请输入字典顺序'
				},
				numeric : {
					message : "只能输入纯数字"
				}
			}
		}
	}
};

$(function() {
	// debugger;
	var dictId = $("#selectedDictId").val();
	$.get(serverPath+"dicts/"+dictId,function(data){
		for(var col in data.sysDict){
			$("#dictEditForm input[name='"+col+"']").val(data.sysDict[col]);
		}
	});
	$('#dictEditForm').bootstrapValidator(editDictValidator);
})

function updateDict(){
	// debugger;
	var sysDict = $("#dictEditForm").serializeArray();
	var obj = {};
	$.each(sysDict, function(i, v) {
		obj[v.name] = v.value;
	})
	var dictId = $("#selectedDictId").val();
	$.ajax({
			"type":"PUT",
			"url":serverPath +'dicts/'+dictId, 
			"contentType":"application/json",
			"data":JSON.stringify(obj),
		        success:function(data){
		        	curNode = dictTree.getNodeByParam("dictId",data.sysDict.dictId);
	        		curNode.dictLabel=data.sysDict.dictLabel;
	        		dictTree.updateNode(curNode);
		        	returnDict();
					alert("修改成功！");
				},
				error:function(e){
					alert("修改失败，请重试...");
				}
		})
}