/* 工程订单管理-专用 */
var searchTable;

// 加载富文本编辑器
var notifyUM = UM.getEditor('notifyContent');
$('#notifyModal').on('shown.bs.modal',function(){
    notifyUM.setWidth($('#notifyContentWrapper').innerWidth());
})
$('#notifyModal').on('hide.bs.modal',function(){
    notifyUM.setContent('',false);
})

// 列表对象配置
var dataTableSearchConfig = {
    "toolbars":"#toolbars",
    'ajax' : {
        "type" : "POST",
        "url" : prc + '/notifyController/search4Page.action',// 请求路径
        "contentType" : 'application/x-www-form-urlencoded; charset=UTF-8',
        "dataType" : 'json',
        "data" : function(d) {// 查询参数
            // 查询参数
            d.notice_title = $('#notice_title').val();
            d.notify_state = $('#notify_state').val();
            d.submitDateA = $('#submit_date_a').val();
            d.submitDateZ = $('#submit_date_z').val();
            return d;
        }
    },
    "columns":[// 对应列
        {
            "data":null,
            "title":"操作",
            "className":"text-center",
            "orderable":false,
            "width":"40",
            "render":function(data,type,c,meta){
                var btnArray = [];

                if (c.createBy == userBean['staffOrgId']&& c.noticeState == '1') {
                    btnArray.push({
                        "name" : "修改",
                        "fn" : "editFun('" + c.notifyId + "')",
                        "icon":"iconfont icon-bianji"
                    });
                    btnArray.push({
                        "name" : "发布",
                        "fn" : "doFabu(\'" + c.notifyId + "\')",
                        "icon":"iconfont icon-tijiao"
                    });
                } else {
                    btnArray.push({
                        "name" : "修改",
                        "disabled":true,
                        "fn" : "",
                        "icon":"iconfont icon-bianji"
                    });
                    btnArray.push({
                        "name" : "发布",
                        "disabled":true,
                        "fn" : "",
                        "icon":"iconfont icon-tijiao"
                    });
                }
                if (c.createBy == userBean['staffOrgId']
                        && c.noticeState != '0') {
                    btnArray.push({
                        "name" : "作废",
                        "fn" : "delData(\'" + c.notifyId + "\','"
                                + c.noticeState + "\')",
                         "icon":"iconfont icon-shanchu"
                    });
                } else {
                    btnArray.push({
                        "name" : "作废",
                        "disabled":true,
                        "fn" : "",
                        "icon":"iconfont icon-shanchu"
                    });
                }
                return App.getDataTableBtn(btnArray);
            }
        },{
            "data" : "notifyTitle",
            "title" : "公告标题",
            "width" : '160',
            'render' : function(a, b, c, d) {
                var notifyTitle = c.notifyTitle;
                if (c.notifyTitle.length > 20) {
                    notifyTitle = c.notifyTitle.substr(0, 20) + "...";
                }
                var html = '<a href="javascript:void(0)" title='
                        + c.notifyTitle + ' onclick="viewFun(\'' + c.notifyId + '\')">' + notifyTitle + "</a>";
                return html;
            }
        },
        {
            "data" : "lastUpdateByName",
            "title" : "发布人",
            "width" : '80',
            "className":"text-center"
        }, {
            "data" : "lastUpdateByOrg",
            "title" : "发布人所属组织",
            "width" : '80'
        }, {
            "data" : "lastUpdateDate",
            "title" : "发布时间",
            "width" : '80',
            "className":"text-center"
        }, {
            "data" : "noticeState",
            "title" : "公告状态",
            "width" : '100',
            "className":"text-center",
            'render' : function(a, b, c, d) {
                return OBJ_NOTIFY_STATE[c.noticeState];
            }
        }, {
            "data" : "noticeTop",
            "title" : "是否置顶",
            "width" : '80',
            "className":"text-center",
            'render' : function(a, b, c, d) {
                if (c.noticeTop == '1') {
                    return "是";
                } else {
                    return "否";
                }
            }
        }
    ]
};

/**
 * 查询方法
 */
function searchFun() {
    searchTable.ajax.reload();
}

$(function(){
    // 加载表格
    searchTable = App.initDataTables('#searchTable',dataTableSearchConfig);
    // 绑定事件
    $("#saveBtn").click(function(){
        addNotify('1',$(this).attr('data-type'));
    });
    $("#fabuBtn").click(function(){
        addNotify('2',$(this).attr('data-type'));
    });
});

/**
 * 新增
 */
function addNotify(state,type){
    if($("#notifyForm").data('bootstrapValidator').validate().isValid()){
        if(notifyUM.getContent()==''){
            layer.msg('请填写公告内容！');
            return false;
        }
        var $submitBtn = $('#saveBtn');
        $("#noticeState").val(state);
        if(type == 'add'){
            addNotifySubmit();
        }else if(type == 'edit'){
            editNotifySubmit();
        }
    }
}

// 新增页面
function addFun() {
    $('#saveBtn').attr('data-type','add');
    $('#fabuBtn').attr('data-type','add');
    $('#notifyModal').find('.modal-title').text("新增公告信息");
    $('#notifyForm')[0].reset();
    $('#notifyModal').modal('show');

    // 获取token
    App.getFormToken("#token");
    //设定主键
    App.getUUID("#notifyId");

    if(null == $('#notifyForm').data('bootstrapValidator')){
        initValidatorForm();
    }
    resetValidator();

    initFile();
}

// 修改页面
function editFun(notifyId) {
    // 获取token
    App.getFormToken("#token");
    $.ajax({
        "type" : "POST",
        "url" : prc + '/notifyController/findNotifyById',// 请求路径
        "async" : true, // 同步
        "dataType" : 'json',
        "data" : {
            "notifyId" : notifyId
        },
        "success" : function(notify) {
            $('#saveBtn').attr('data-type','edit');
            $('#fabuBtn').attr('data-type','edit');
            $('#notifyModal').find('.modal-title').text("修改公告信息");
            $('#notifyForm')[0].reset();
            $('#notifyModal').modal('show');

            // form表单赋值
            App.setFormValues('#notifyForm',notify);
            notifyUM.setContent(notify.notifyContent, false);

            if(null == $('#notifyForm').data('bootstrapValidator')){
                initValidatorForm();
            }
            resetValidator();
            initFile();
        }
    });
}


/*
 * 公告信息添加/编辑表单校验
 */
function initValidatorForm(){
    
    $('#notifyForm').bootstrapValidator({
        message:'校验未通过',
        trigger:'live focus blur keyup',
        container:'popover',
        fields : {
            notifyTitle : {
                validators : {
                    notEmpty : {
                        message : '请输入公告标题！' 
                    },
                    stringLength: {
                        max: 100, 
                        message: '输入不能超过100个字符！' 
                    }
                }
            },
            noticeType : {
                validators : {
                    notEmpty: {
                        message: '请选择公告类型！'
                    }
                }
            },
            noticeTop: {
                validators: {
                    notEmpty: {
                        message: '请选择是否置顶！'
                    }
                }
            },
            notifyContent: {
                validators: {
                   selector:'#ue_wrapper',
                   ue_notEmpty: {
                       message: '请填写公告内容！'
                   }
                }
            }
        }
    })
}

/**
 * 新增保存
 */
function addNotifySubmit(){
    // 异步操作执行插入
    $.ajax({
        url:prc+'/notifyController/saveNotify',
        data:$("#notifyForm").serializeArray(),// 提交form表单
        dataType:"JSON",
        type:"POST",
        success:function(data){
            if(null != data){
                // 判断是否保存成功
                if(data.success){
                    searchTable.draw(false);
                    $('#notifyModal').modal('hide');
                    layer.msg(data.msg);
                }else{
                    // 重新赋值token
                    $("#token").val(data.attributes.token);
                    layer.msg(data.msg);
                }
            }
        },
        error:function(e){
            layer.msg("添加失败o_o请重试...");
        }
    })
}

/**
 * 更新公告信息
 */
function editNotifySubmit(){
    // 异步操作执行插入
    $.ajax({
        url:prc+'/notifyController/modifyNotify',
        data:$("#notifyForm").serializeArray(),// 提交form表单
        dataType:"JSON",
        type:"POST",
        success:function(data){
            if(null != data){
                // 判断是否保存成功
                if(data.success){
                    searchTable.draw(false);
                    $('#notifyModal').modal('hide');
                    layer.msg(data.msg);
                }else{
                    // 重新赋值token
                    $("#token").val(data.attributes.token);
                    layer.msg(data.msg);
                }
            }
        },
        error:function(e){
            layer.msg("添加失败o_o请重试...");
        }
    })
}

/**
 * 重置校验
 */
function resetValidator(){
    if($('#notifyForm').data('bootstrapValidator')){
        $('#notifyForm').data('bootstrapValidator').resetForm(false);
    }
}

/**
 * 废弃公告
 * 
 * @param notifyId
 * @param noticeState
 */
function delData(notifyId, noticeState) {
    if (noticeState == '1' || noticeState == '2') {
        layer.confirm('确定要废弃所选公告吗？',{
            btn:[
                 '废弃','取消'
                 ],
                 icon:0,
                 skin:'layer-ext-moon'
        },function(){
            modifyNotifyStateFeiqi(notifyId);
        })
    }
}

/**
 * 废弃公告数据
 * 
 * @param notifyId
 */
function modifyNotifyStateFeiqi(notifyId) {
    $.ajax({
        "type" : "POST",
        "url" : prc + '/notifyController/modifyNotifyStateFeiqi',// 请求路径
        "async" : false, // 同步
        "dataType" : 'json',
        "data" : {
            "notifyId" : notifyId
        },
        "success" : function(data) {
            if (data.success) {
                layer.msg(data.msg);
                searchTable.ajax.reload();
            } else {
                layer.msg(data.msg);
            }
        }
    });
}

/**
 * 查看公告信息
 * 
 * @param notifyId
 */
function viewFun(notifyId) {
    if (doRead(notifyId)) {
        $.ajax({
            "type" : "POST",
            "url" : prc + '/notifyController/findNotifyById',// 请求路径
            "async" : true, // 同步
            "dataType" : 'json',
            "data" : {
                "notifyId" : notifyId
            },
            "success" : function(notify) {
                $('#notifyViewModal').find('.modal-title').text("查看公告信息");
                $('#notifyViewModal').modal('show');
                $("#notifyId").val(notify.notifyId);
                // form表单赋值
                App.setFindValue('#notifyViewForm',notify,{
                    'noticeTop':function(value){
                        return value== '1' ? '置顶':'非置顶';
                    },
                    'noticeType':function(value){
                        return noticeTypeJson[value];
                    }
                });
                initFileView();
                searchTable.ajax.reload();
            }
        });
    }
}

/**
 * 发布公告
 * 
 * @param notifyId
 */
function doFabu(notifyId) {
    $.ajax({
        "type" : "POST",
        "url" : prc + '/notifyController/modifyNotifyStateFabu',// 请求路径
        "async" : false, // 同步
        "dataType" : 'json',
        "data" : {
            "notifyId" : notifyId
        },
        "success" : function(data) {
            if (data.success) {
                layer.msg(data.msg);
                searchTable.ajax.reload();
            } else {
                layer.msg(data.msg);
            }
        }
    });
}

/**
 * 记录读取状态
 * 
 * @param notifyId
 * @returns {Boolean}
 */
function doRead(notifyId) {
    var doread = false;
    $.ajax({
        "type" : "POST",
        "url" : prc + '/notifyController/saveNotifyRead',// 请求路径
        "async" : false, // 同步
        "dataType" : 'json',
        "data" : {
            "notifyId" : notifyId
        },
        "success" : function(data) {
            if (data.success) {
                doread = true;
            } else {
                layer.msg(data.msg);
            }
        }
    });
    return doread;
}

/**
 * 加载附件
 */
function initFile(){
    var busiId = $('#notifyId').val();// 业务主键
    var linkCode = 'NOTI';// 流程环节编码
    var taskId='0';// 任务id，固定写法在待办页面隐藏域里有，首环节因没有任//务id可不传数据库默认0
    $('#iframeFile').attr('src',prc+'/uploadDocController/showUploadDocList.action?busiId='+busiId
            +'&linkCode='+linkCode
            +'&show=1'+'&taskID='+taskId);
}

/**
 * 查看页面加载附件
 */
function initFileView(){
    var busiId = $('#notifyId').val();// 业务主键
    var linkCode = 'NOTI';// 流程环节编码
    var taskId='0';// 任务id，固定写法在待办页面隐藏域里有，首环节因没有任//务id可不传数据库默认0
    $('#iframeFileView').attr('src',prc+'/uploadDocController/showUploadDocList.action?busiId='+busiId
            +'&linkCode='+linkCode
            +'&show=0'+'&taskID='+taskId);
}