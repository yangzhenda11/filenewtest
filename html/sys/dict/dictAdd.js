var addDictValidator = {
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
	$("#dictAddForm input[name = 'dictParentId']").val(curNode.dictId);
	$("#dictAddForm input[name = 'dictParentName']").val(curNode.dictLabel);
	$('#dictAddForm').bootstrapValidator(addDictValidator);
})

function addDict(){
	// debugger;
	var sysDict = $("#dictAddForm").serializeArray();
	var obj = {};
	$.each(sysDict, function(i, v) {
		obj[v.name] = v.value;
	})
	$.ajax({
			"type":"POST",
			"url":serverPath +'dicts/', 
			"contentType":"application/json",
			"data":JSON.stringify(obj),
		        success:function(data){
		        	var dict = {'dictId':data.sysDict.dictId,'dictLabel':data.sysDict.dictLabel,'dictParentId':data.sysDict.dictParentId};
		        	dictTree.addNodes(curNode,dict);
		        	returnDict();
					alert("添加成功！");
				},
				error:function(e){
					alert("添加失败，请重试...");
				}
		})
}