//全局变量
var config = parent.globalConfig;
var serverPath = config.serverPath;
var organisationTree = null;
var otherTree = null;
var legalTree = null;
var curOrgStaffNode = null;

/*
 * 角色ID的获取，目前写死，待协调
 */
var curOrgStaffRole = 1;
/*
 * 初始化表格
 */
App.initDataTables('#searchContractTable', "#submitBtn", {
    ajax: {
        "type": "GET",
        "url": serverPath + 'orgPartner',
        "data": function(d) {
            d.partnerName = $("#partnerName").val();
            d.isPartner = $("#isPartner").val();
            return d;
        }
    },
    "columns": [{
            "data": "partnerId",
            "className": "text-center",
            "title": "操作",
            "render": function(data, type, full, meta) {
            	if(data) {
					var btnArray = new Array();
                    btnArray.push({ "name": "编辑", "fn": "editContract(\'" + data + "\')" });
                    context = {
                        func: btnArray
                    }
                    var template = Handlebars.compile(btnModel);
                    var html = template(context);
                    return html;
				} else {
					return '';
				}
            }
        },
        {"data": "partnerMdmCode","title": "编码"},
        {"data": "partnerName","title": "签约主体名称"},
        {"data": "isPartner","title": "是否联通方",
            "render": function(data, type, full, meta) {
                if (data == 0) {
                    return '是';
                } else {
                    return '否';
                }
            }
        },
        {"data": "partnerCode","title": "关联编码"},
        {"data": "orgName","title": "所属组织"}
    ]
});
/*
 * 搜索点击事件
 */
function searchContract(retainPaging) {
	var table = $('#searchContractTable').DataTable();
	if(retainPaging) {
		table.ajax.reload(null, false);
	} else {
		table.ajax.reload();
	}
}
/*
 * 表格内编辑按钮点击获取结果事件
 */
function editContract(data) {
	$("#modal").load("_contractPartyModal.html?" + App.timestamp()+" #modalEdit",function(){
		$.getScript("_contractPartyModal.js",function(){
			getContractInfo(data);
		})
	});
}

$('#contractEditModal').on('hide.bs.modal', function() {
    $("#contractModalDefault").removeClass("hide");
    $("#mainContent").addClass("hide");
});


