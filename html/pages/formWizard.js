$(function() {
	var form = $('#submit_form');
	form.bootstrapValidator({
		/**
	    * 生效规则（三选一）
	    * enabled 字段值有变化就触发验证
	    * disabled,submitted 当点击提交时验证并展示错误信息
	    */
		live: 'enabled',
	    /**
	    * 为每个字段设置统一触发验证方式（也可在fields中为每个字段单独定义），默认是live配置的方式，数据改变就改变
	    * 也可以指定一个或多个（多个空格隔开） 'focus blur keyup'
	    */
		trigger:'live focus blur keyup',
	    message:'校验未通过',
	    container: 'popover',
	    excluded : [':disabled', ':hidden', ':not(:visible)'],//[':disabled', ':hidden', ':not(:visible)']
	    fields:{
	    	username:{
	    		validators:{
	                notEmpty:{
	                    message:'用户名不能为空'
	                }
               }
	    	},
	    	fullname:{
	    		validators:{
	                notEmpty:{
	                    message:'姓名不能为空'
	                }
               }
	    	},
	    	card_name:{
	    		validators:{
	                notEmpty:{
	                    message:'银行卡所有者不能为空'
	                }
               }
	    	}
	    }
    })
	
	var displayConfirm = function() {
		$('#tab4 .form-control-static', form).each(function() {
			var input = $('[name="' + $(this).attr("data-display") + '"]', form);
			if(input.is(":radio")) {
				input = $('[name="' + $(this).attr("data-display") + '"]:checked', form);
			}
			if(input.is(":text") || input.is("textarea")) {
				$(this).html(input.val());
			} else if(input.is("select")) {
				$(this).html(input.find('option:selected').text());
			} else if(input.is(":radio") && input.is(":checked")) {
				$(this).html(input.attr("data-title"));
			} else if($(this).attr("data-display") == 'payment[]') {
				var payment = [];
				$('[name="payment[]"]:checked', form).each(function() {
					payment.push($(this).attr('data-title'));
				});
				$(this).html(payment.join("<br>"));
			}
		});
	}

	var handleTitle = function(tab, navigation, index) {
		var total = navigation.find('li').length;
		var current = index + 1;
		$('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
		jQuery('li', $('#form_wizard_1')).removeClass("done");
		var li_list = navigation.find('li');
		for(var i = 0; i < index; i++) {
			jQuery(li_list[i]).addClass("done");
		}

		if(current == 1) {
			$('#form_wizard_1').find('.button-previous').hide();
		} else {
			$('#form_wizard_1').find('.button-previous').show();
		}

		if(current >= total) {
			$('#form_wizard_1').find('.button-next').hide();
			$('#form_wizard_1').find('.button-submit').show();
			displayConfirm();
		} else {
			$('#form_wizard_1').find('.button-next').show();
			$('#form_wizard_1').find('.button-submit').hide();
		}
		App.scrollTo($('.page-title'));
	}

	$('#form_wizard_1').bootstrapWizard({
		'nextSelector': '.button-next',
		'previousSelector': '.button-previous',
		onTabClick: function(tab, navigation, index, clickedIndex) {
			//业务处理
			//handleTitle(tab, navigation, clickedIndex);
		},
		onShow:function(tab, navigation, index){
			console.log(index);
			if(index != 0){
				handleTitle(tab, navigation, clickedIndex);
			}
		},
		onNext: function(tab, navigation, index) {
			//判断校验是否成功
			form.data('bootstrapValidator').validate();
			var isValid = form.data('bootstrapValidator').isValid();
			if(isValid){
				//业务处理
				//handleTitle(tab, navigation, index);
			}else{
				return false;
			}
		},
		onPrevious: function(tab, navigation, index) {
			//handleTitle(tab, navigation, index);
		},
		onTabShow: function(tab, navigation, index) {
			var total = navigation.find('li').length;
			var current = index + 1;
			var $percent = (current / total) * 100;
			$('#form_wizard_1').find('.progress-bar').css({
				width: $percent + '%'
			});
		}
	});
	//$('#form_wizard_1').data('bootstrapWizard').show(2);
	
	$('#form_wizard_1').find('.button-previous').hide();
	$('#form_wizard_1 .button-submit').click(function(){
		alert('执行提交。。。');
	}).hide();
})