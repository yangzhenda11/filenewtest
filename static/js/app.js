var layerIndex = null;
/**
Core script to handle the entire theme and core functions
**/
var App = function() {
	// IE mode
	var isRTL = false;
	var isIE8 = false;
	var isIE9 = false;
	var isIE10 = false;

	var resizeHandlers = [];

	var assetsPath = '../../';

	var globalImgPath = 'static/img/';

	var globalPluginsPath = 'static/plugins/';

	var globalCssPath = 'static/css/';
	
	var _getResponsiveBreakpoint = function(size) {
			// bootstrap responsive breakpoints
			var sizes = {
				'xs': 480, // extra small
				'sm': 768, // small
				'md': 992, // medium
				'lg': 1200 // large
			};

			return sizes[size] ? sizes[size] : 0;
	};
	
	var resBreakpointMd = _getResponsiveBreakpoint('md');
	
	// initializes main settings
	var handleInit = function() {

		if($('body').css('direction') === 'rtl') {
			isRTL = true;
		}

		isIE8 = !!navigator.userAgent.match(/MSIE 8.0/);
		isIE9 = !!navigator.userAgent.match(/MSIE 9.0/);
		isIE10 = !!navigator.userAgent.match(/MSIE 10.0/);

		if(isIE10) {
			$('html').addClass('ie10'); // detect IE10 version
		}

		if(isIE10 || isIE9 || isIE8) {
			$('html').addClass('ie'); // detect IE10 version
		}
	};

	// runs callback functions set by App.addResponsiveHandler().
    var _runResizeHandlers = function(){
        // reinitialize other subscribed elements
        for(var i = 0;i < resizeHandlers.length;i++){
            var each = resizeHandlers[i];
            each.call();
        }
    };
   
    var handelCheckbox = function(){
    	if(isIE8){
			$('body').on('click','.ui-checkbox-inline span',function(){
	  		  if($(this).siblings("input[type='checkbox']").is(':checked')){
	  			  $(this).siblings("input[type='checkbox']").removeAttr("checked");     
	  		  }else{
	  			  $(this).siblings("input[type='checkbox']").attr("checked",'true');
	  		  }
	    	});
    	}
    }
    
    var handelRadio = function(){
    	if(isIE8){
	    	$('body').on('click','.ui-radio-inline span',function(){
	    		if(!$(this).siblings("input[type='radio']").is(':checked')){
	    			$(this).siblings("input[type='radio']").attr("checked",'true'); 
	    		}
	    	});
    	}
    }
    // handle content fullHeight with .full-height-content .full-height-content-body
    var handle100HeightContent = function(){
        $('.full-height-content').each(
        function(){
            var target = $(this);
            var height;
            
            height = App.getViewPort().height - $('.page-header').outerHeight(true) - $('.page-footer').outerHeight(true) - $('.page-title').outerHeight(true) - $('.page-bar').outerHeight(true);
            
            if(target.hasClass('portlet')){
                var portletBody = target.children('.portlet-body');
                
                App.destroySlimScroll(portletBody.find('.full-height-content-body')); // destroy slimscroll 
                
                    height = height - target.children('.portlet-title').outerHeight(true) - parseInt(target.children('.portlet-body').css('padding-top')) -
                        parseInt(target.children('.portlet-body').css('padding-bottom')) - 5;
                var portletFooter = target.children('.portlet-footer');
                
                if(portletFooter.length > 0){
                    height = height - portletFooter.outerHeight(true);
                }
                
                if(App.getViewPort().width >= resBreakpointMd && target.hasClass("full-height-content-scrollable")){
                    height = height - 30;
                    portletBody.children('.full-height-content-body').css('height',height);
                    App.initSlimScroll(portletBody.children('.full-height-content-body'));
                }else{
                    portletBody.css('min-height',height-20);
                }
            }else{
                App.destroySlimScroll(target.children('.full-height-content-body')); // destroy slimscroll 
                
                if(App.getViewPort().width >= resBreakpointMd && target.hasClass("full-height-content-scrollable")){
                    height = height - 35;
                    target.children('.full-height-content-body').css('height',height);
                    App.initSlimScroll(target.find('.full-height-content-body'));
                }else{
                    target.css('min-height',height);
                }
            }
        });
    };
    
    /**
     * 在内页打开页面层级tab时，为按钮或链接增加 .J_pageItem
     * */
    var handleSubpageTab = function(){
        $('.J_pageItem').click(function(e){
            e.preventDefault();
            e.stopPropagation();
            var me = $(this);
            var linkUrl = '';
            if(me[0].nodeName == 'A'){
                linkUrl = me.attr('href');
            }else{
                linkUrl = me.data('href');
            }
            var title = me.data('title');
            if(linkUrl == '' || title == '')
                return false;
            window.top.showSubpageTab(linkUrl,title);
        })
    }

    var handleOnResize = function(){
        var windowWidth = $(window).width();
        var resize;
        if(isIE8){
            var currheight;
            $(window).resize(function(){
                if(currheight == document.documentElement.clientHeight){
                    return; // quite event since only body resized not window.
                }
                if(resize){
                    clearTimeout(resize);
                }
                resize = setTimeout(function(){
                    _runResizeHandlers();
                },50); // wait 50ms until window resize finishes.
                currheight = document.documentElement.clientHeight; // store
                // last body
                // client
                // height
            });
        }else{
            $(window).resize(function(){
                if($(window).width() != windowWidth){
                    windowWidth = $(window).width();
                    if(resize){
                        clearTimeout(resize);
                    }
                    resize = setTimeout(function(){
                        _runResizeHandlers();
                    },50); // wait 50ms until window resize finishes.
                }
            });
        }
    };

	// Handles portlet tools & actions
	var handlePortletTools = function() {
		// handle portlet remove
		$('body').on('click', '.portlet > .portlet-title .remove', function(e) {
			e.preventDefault();
			var portlet = $(this).closest(".portlet");

			if($('body').hasClass('page-portlet-fullscreen')) {
				$('body').removeClass('page-portlet-fullscreen');
			}

			portlet.find('.portlet-title .fullscreen').tooltip('destroy');
			portlet.find('.portlet-title .reload').tooltip('destroy');
			portlet.find('.portlet-title .remove').tooltip('destroy');
			portlet.find('.portlet-title .config').tooltip('destroy');
			portlet.find('.portlet-title .more').tooltip('destroy');
			portlet.find('.portlet-title .collapse, .portlet-title .expand').tooltip('destroy');

			portlet.remove();
		});

		$('body').on('click', '.portlet > .portlet-title  .reload', function(e) {
			e.preventDefault();
			var el = $(this).closest(".portlet").children(".portlet-body");
			var url = $(this).attr("data-url");
			var error = $(this).attr("data-error-display");
			if(url) {
				App.blockUI({
					target: el,
					animate: true,
					overlayColor: 'none'
				});
				$.ajax({
					type: "GET",
					cache: false,
					url: url,
					dataType: "html",
					success: function(res) {
						App.unblockUI(el);
						el.html(res);
						App.initAjax() // reinitialize elements & plugins for newly loaded content
					},
					error: function(xhr, ajaxOptions, thrownError) {
						App.unblockUI(el);
						var msg = 'Error on reloading the content. Please check your connection and try again.';
						if(error == "toastr" && toastr) {
							toastr.error(msg);
						} else if(error == "notific8" && $.notific8) {
							$.notific8('zindex', 11500);
							$.notific8(msg, {
								theme: 'ruby',
								life: 3000
							});
						} else {
							alert(msg);
						}
					}
				});
			} else {
				// for demo purpose
				App.blockUI({
					target: el,
					animate: true,
					overlayColor: 'none'
				});
				window.setTimeout(function() {
					App.unblockUI(el);
				}, 1000);
			}
		});

		// load ajax data on page init
		$('.portlet .portlet-title a.reload[data-load="true"]').click();

		$('body').on('click', '.portlet > .portlet-title .collapse, .portlet .portlet-title .expand', function(e) {
			e.preventDefault();
			var el = $(this).closest(".portlet").children(".portlet-body");
			if($(this).hasClass("collapse")) {
				$(this).removeClass("collapse").addClass("expand");
				el.slideUp(200);
			} else {
				$(this).removeClass("expand").addClass("collapse");
				el.slideDown(200);
			}
		});
	};

	// Handles custom checkboxes & radios using jQuery iCheck plugin
	var handleiCheck = function() {
		if(!$().iCheck) {
			return;
		}

		$('.icheck').each(function() {
			var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
			var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';

			if(checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
				$(this).iCheck({
					checkboxClass: checkboxClass,
					radioClass: radioClass,
					insert: '<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
				});
			} else {
				$(this).iCheck({
					checkboxClass: checkboxClass,
					radioClass: radioClass
				});
			}
		});
	};

	// Handles Bootstrap switches
	var handleBootstrapSwitch = function() {
		if(!$().bootstrapSwitch) {
			return;
		}
		$('.make-switch').bootstrapSwitch();
	};

	// Handles Bootstrap confirmations
	var handleBootstrapConfirmation = function() {
		if(!$().confirmation) {
			return;
		}
		$('[data-toggle=confirmation]').confirmation({
			btnOkClass: 'btn btn-sm btn-success',
			btnCancelClass: 'btn btn-sm btn-danger'
		});
	}

	// Handles Bootstrap Accordions.
	var handleAccordions = function() {
		$('body').on('shown.bs.collapse', '.accordion.scrollable', function(e) {
			App.scrollTo($(e.target));
		});
	};

	// Handles Bootstrap Tabs.
	var handleTabs = function() {
		//activate tab if tab id provided in the URL
		if(encodeURI(location.hash)) {
			var tabid = encodeURI(location.hash.substr(1));
			$('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function() {
				var tabid = $(this).attr("id");
				$('a[href="#' + tabid + '"]').click();
			});
			$('a[href="#' + tabid + '"]').click();
		}

		if($().tabdrop) {
			$('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
				text: '<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
			});
		}
	};

	// Handles Bootstrap Modals.
	var handleModals = function() {
		// fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class. 
		$('body').on('hide.bs.modal', function() {
			if($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
				$('html').addClass('modal-open');
			} else if($('.modal:visible').size() <= 1) {
				$('html').removeClass('modal-open');
			}
		});

		// fix page scrollbars issue
		$('body').on('show.bs.modal', '.modal', function() {
			if($(this).hasClass("modal-scroll")) {
				$('body').addClass("modal-open-noscroll");
			}
		});

		// fix page scrollbars issue
		$('body').on('hidden.bs.modal', '.modal', function() {
			$('body').removeClass("modal-open-noscroll");
		});

		// remove ajax content and remove cache on modal closed 
		$('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function() {
			$(this).removeData('bs.modal');
		});
	};

	// Handles Bootstrap Tooltips.
	var handleTooltips = function() {
		// global tooltips
		$('.tooltips').tooltip();

		// portlet tooltips
		$('.portlet > .portlet-title .fullscreen').tooltip({
			trigger: 'hover',
			container: 'body',
			placement:'bottom',
			title: '全屏浏览'
		});
		$('.portlet > .portlet-title .reload').tooltip({
			trigger: 'hover',
			placement:'bottom',
			container: 'body',
			title: '刷新'
		});
		$('.portlet > .portlet-title .remove').tooltip({
			trigger: 'hover',
			placement:'bottom',
			container: 'body',
			title: '移除'
		});
		$('.portlet > .portlet-title .config').tooltip({
			trigger: 'hover',
			placement:'bottom',
			container: 'body',
			title: '设置'
		});
		$('.portlet > .portlet-title .more').tooltip({
			trigger: 'hover',
			placement:'bottom',
			container: 'body',
			title: '查看更多>'
		});
		$('.portlet > .portlet-title .collapse, .portlet > .portlet-title .expand').tooltip({
			trigger: 'hover',
			placement:'bottom',
			container: 'body',
			title: '折叠/展开'
		});
	};

	// Handles Bootstrap Dropdowns
	var handleDropdowns = function() {
		/*
		  Hold dropdown on click  
		*/
		$('body').on('click', '.dropdown-menu.hold-on-click', function(e) {
			e.stopPropagation();
		});
	};

	var handleAlerts = function() {
		$('body').on('click', '[data-close="alert"]', function(e) {
			$(this).parent('.alert').hide();
			$(this).closest('.note').hide();
			e.preventDefault();
		});

		$('body').on('click', '[data-close="note"]', function(e) {
			$(this).closest('.note').hide();
			e.preventDefault();
		});

		$('body').on('click', '[data-remove="note"]', function(e) {
			$(this).closest('.note').remove();
			e.preventDefault();
		});
	};

	// Handle textarea autosize 
	var handleTextareaAutosize = function() {
		if(typeof(autosize) == "function") {
			autosize(document.querySelector('textarea.autosizeme'));
		}
	}

	// Handles Bootstrap Popovers

	// last popep popover
	var lastPopedPopover;

	var handlePopovers = function() {
		$('.popovers').popover();

		// close last displayed popover

		$(document).on('click.bs.popover.data-api', function(e) {
			if(lastPopedPopover) {
				lastPopedPopover.popover('hide');
			}
		});
	};

	// Handles scrollable contents using jQuery SlimScroll plugin.
	var handleScrollers = function() {
		App.initSlimScroll('.scroller');
	};

	// Handles Image Preview using jQuery Fancybox plugin
	var handleFancybox = function() {
		if(!jQuery.fancybox) {
			return;
		}

		if($(".fancybox-button").size() > 0) {
			$(".fancybox-button").fancybox({
				groupAttr: 'data-rel',
				prevEffect: 'none',
				nextEffect: 'none',
				closeBtn: true,
				helpers: {
					title: {
						type: 'inside'
					}
				}
			});
		}
	};

	// Handles counterup plugin wrapper
	var handleCounterup = function() {
		if(!$().counterUp) {
			return;
		}

		$("[data-counter='counterup']").counterUp({
			delay: 10,
			time: 1000
		});
	};

	// Fix input placeholder issue for IE8 and IE9
	var handleFixInputPlaceholderForIE = function() {
		//fix html5 placeholder attribute for ie7 & ie8
		if(isIE8 || isIE9) { // ie8 & ie9
			// this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
			$('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function() {
				var input = $(this);

				if(input.val() === '' && input.attr("placeholder") !== '') {
					input.addClass("placeholder").val(input.attr('placeholder'));
				}

				input.focus(function() {
					if(input.val() == input.attr('placeholder')) {
						input.val('');
					}
				});

				input.blur(function() {
					if(input.val() === '' || input.val() == input.attr('placeholder')) {
						input.val(input.attr('placeholder'));
					}
				});
			});
		}
	};

	// Handle Select2 Dropdowns
    var handleSelect2 = function(){
        if($().select2){
            $.fn.select2.defaults.set("theme","bootstrap");
            $('.select2me').each(function(){
                var allowClearFlag = $(this).attr('data-allowClear');
                var allowSearch = $(this).attr('data-allowSearch');
                if(allowClearFlag != "false"){
                	allowClearFlag = true;
                }else{
                	allowClearFlag = false;
                }
                options = {
                    placeholder:"全部",
                    language:'zh-CN',
                    width:'100%',
                    allowClear:allowClearFlag
                };
                if(allowSearch == undefined){
            	 	options.minimumResultsForSearch = -1;
                };
                $(this).select2(options);
            })
        }
    };
    
    // Handle datePicker
    var handleDatePicker = function(){
        if($.fn.datepicker){
            $.fn.datepicker.defaults.format = 'yyyy-mm-dd';
            $.fn.datepicker.defaults.language = 'zh-CN';
            $.fn.datepicker.defaults.autoclose = true;
            $('.date-picker').datepicker({
                format:"yyyy-mm-dd"
            });
        }
    };
	
    // Handle datetimePicker
    var handleDateTimePicker = function(){
        if($.fn.datetimepicker){
            $.fn.datetimepicker.defaults.format = 'yyyy-mm-dd hh:ii:ss';
            $.fn.datetimepicker.defaults.language = 'zh-CN';
            $.fn.datetimepicker.defaults.autoclose = true;
            $.fn.datetimepicker.defaults.pickerPosition="bottom-left";
            $('.datetime-picker').datetimepicker({
                format:"yyyy-mm-dd hh:ii:ss"
            });
        }
    };

	var panelAction = function(el, parentEl, bodyEl, icon1, icon2, times) {
		$(el).on('click',function() {
			var me = $(this);
			var pnode = me.closest(parentEl);
			var pbody = pnode.nextAll(bodyEl).first();
			var meicon = me.find('.fa');
			if(times != 0) {
				times = times ? times : 200;
			}
			pbody.slideToggle(times);
			meicon.toggleClass(icon1).toggleClass(icon2);
//			if(el == '.page-search-more a') {
//				var panelSearch = me.closest('.page-search');
//				var resetBtn = panelSearch.find('.page-search-action').find('button[type=reset]');
//				resetBtn.toggleClass('hidden');
//			}
		})
	}

	var handlePagesearch = function() {
		if($('.page-search-more').length) {
			panelAction('.page-search-more a', '.page-search-more', '.page-search-moreBody', 'fa-angle-double-right', 'fa-angle-double-up', 0);
		}
	}

	var handleFileInput = function() {
		$('.form-group-file .input-group').click(function() {
			var pnode = $(this).closest('.form-group-file');
			var fileNode = pnode.find('input[type=file]');
			fileNode.trigger('click');
		});
		$('.form-group-file input[type=file]').change(function() {
			var pnode = $(this).parent('.form-group-file');
			var fileNode = pnode.find('.input-group input[type=text]');
			fileNode.val($(this).val());
		})
	}
	// Handle formFieldset
	var handleFormFieldset = function() {
		if($('.form-fieldset .form-collapse').length) {
			panelAction('.form-fieldset .form-collapse', '.form-fieldset-title', '.form-fieldset-body', 'fa-angle-up', 'fa-angle-down');
		}
	}

	// handle group element heights
	var handleHeight = function() {
		$('[data-auto-height]').each(function() {
			var parent = $(this);
			var items = $('[data-height]', parent);
			var height = 0;
			var mode = parent.attr('data-mode');
			var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);

			items.each(function() {
				if($(this).attr('data-height') == "height") {
					$(this).css('height', '');
				} else {
					$(this).css('min-height', '');
				}

				var height_ = (mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true));
				if(height_ > height) {
					height = height_;
				}
			});

			height = height + offset;

			items.each(function() {
				if($(this).attr('data-height') == "height") {
					$(this).css('height', height);
				} else {
					$(this).css('min-height', height);
				}
			});

			if(parent.attr('data-related')) {
				$(parent.attr('data-related')).css('height', parent.height());
			}
		});
	}
	//检查缓存，刷新
//	var checkCache = function(){
//		if (self == top) { 
//			var timestamp = new Date().getTime();
//			
//		}else{
//			
//		}
//	};
	
	/*
	 * 页面上调用要return出来
	 * init为页面初始项
	 */
	return {

		//main function to initiate the theme
		init: function() {
			// IMPORTANT!!!: Do not modify the core handlers call order.
        	handelCheckbox();
        	handelRadio();
            // Core handlers
            handleInit(); // initialize core variables
            handleSubpageTab();// 子页面打开tab页控制
            
            // UI Component handlers
            // handleiCheck(); // handles custom icheck radio and checkboxes
            // handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleScrollers(); // handles slim scrolling contents
            // handleFancybox(); // handle fancy box
            handleSelect2(); // handle custom Select2 dropdowns
            handleDatePicker();
            handlePagesearch();
            handleFileInput();// 上传文件的伪装触发
            handleFormFieldset();// 表单分区的展开折叠控制
            handlePortletTools(); // handles portlet action bar
            // functionality(refresh, configure, toggle,
            // remove)
            handleAlerts(); // handle closabled alerts
            handleDropdowns(); // handle dropdowns
            handleTabs(); // handle tabs
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            handleAccordions(); // handles accordions
            handleModals(); // handle modals
            handleBootstrapConfirmation(); // handle bootstrap confirmations
            // handleTextareaAutosize(); // handle autosize textareas
            // handleCounterup(); // handle counterup instances
            handle100HeightContent(); //handle content fullHeight
            this.addResizeHandler(handle100HeightContent);
			// Hacks
			//handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder issue fix
			handleOnResize(); // set and handle responsive    
		},

		// main function to initiate core javascript after ajax complete
        initAjax:function(){
            // handleiCheck(); // handles custom icheck radio and checkboxes
            // handleBootstrapSwitch(); // handle bootstrap switch plugin
            handleScrollers(); // handles slim scrolling contents
            handleSelect2(); // handle custom Select2 dropdowns
            handleFormFieldset();
            handleFileInput();// 上传文件的伪装触发
            handleDatePicker();
            // handleFancybox(); // handle fancy box
            // handleDropdowns(); // handle dropdowns
            handleTooltips(); // handle bootstrap tooltips
            handlePopovers(); // handles bootstrap popovers
            // handleAccordions(); //handles accordions
            handleBootstrapConfirmation(); // handle bootstrap confirmations
        },
		/*
		 * @param url  地址
		 * @param type 请求方式
		 * @param data  传输的数据
		 * @param succCallback  正确回调函数
		 * @param improperCallbacks 异常回调方法
		 * @param errorCallback  错误回调函数
		 * @param animation 动画
		 * @param async 同步异步
		 * @param dataType 数据类型
		 */
		formAjaxJson : function (url, type, data, successCallbacks, improperCallbacks, errorCallbacks, animations, asyncs, dataType){
			var emptyFn = function(){};
			var type = type || "get";
			var data = data || "";
			var dataType = dataType || "json";
			var async = asyncs == null ? true : asyncs;
			//var animation = animations == null ? true : animations;
			var successCallback = successCallbacks == null || successCallbacks == "" ? emptyFn : successCallbacks;
			var improperCallback = improperCallbacks == null || improperCallbacks == "" ? emptyFn : improperCallbacks;
			var errorCallback = errorCallbacks == null || errorCallbacks == "" ? emptyFn : errorCallbacks;
			$.ajax({
				type: type,
				url: url,
				data: data,
				dataType: dataType,
				async: async,
				contentType: "application/json",
				success: function(result){
					var result = result;
					if (result.status == 1) {
						successCallback(result);
					} else {
						var ms = result.message;
						layer.msg(ms);
						improperCallback(result);
					};
				},
				error: function(result) {
					layer.alert("接口错误", {icon: 2,title:"错误"});
					errorCallback(result);
				}
			});
		},
		//datatable中button点击或者提交后台时显示提交中的禁用选项(设置：data-loading-text)
		startLoading: function(el){
			$("table").css("width","100%");
			$(el).button('loading');
		},
		//button点击或者提交后台时显示提交中的取消禁用选项
		stopLoading: function(el){
    		$(el).button('reset');
		},
		//判断是否存在指定函数   
		isExitsFunction : function(funcName) {  
		    try {  
		        if (typeof (eval(funcName)) == "function") {  
		            return true;  
		        }  
            } catch (e) {}
		    return false;  
		},
		/**
		 * 表单元素序列化
		 * 根据name值取值
		 */
		getFormValues: function($form) {
			var formData = {};
			$form.find(':input:not(.ignore):not(:disabled)').each(function(index, formItem) {
				var formType = formItem.type;
				var formName = $(formItem).attr('name');
				var formValue = '';
				if(formName != undefined){
					if(formType == "text" || formType == "password" || formType == "select-one" || formType == "textarea" || formType == "hidden") {
						formValue = $(formItem).val().trim();
						formData[formName] = formValue;
					} else if(formType == "checkbox") {
						if($(formItem).is(':checked')) {
							if(typeof formData[formName] == 'undefined') {
								formData[formName] = new Array();
							}
							formData[formName].push($(formItem).val());
						}
					} else if(formType == "radio") {
						if($(formItem).is(':checked')) {
							formValue = $(formItem).val();
							formData[formName] = formValue;
						}
					}
				}
			})
			return formData;
//		    $form.find("[data-isNumber='true']").each(function(index, item) {
//				var key = $(this).attr("name");
//				o[key] = Number(o[key]);
//			});
		},
		/**
		 * 生成时间戳
		 */
		timestamp: function(){
			var getTimestamp=new Date().getTime();
			getTimestamp = "&t="+getTimestamp;
		    return getTimestamp;
		},
		/**
		 * 下载文件（接收下载地址）
		 */
		download_file: function(url) {
			if(typeof(download_file.iframe) == "undefined") {
				var iframe = document.createElement("iframe");
				download_file.iframe = iframe;
				document.body.appendChild(download_file.iframe);
			}
			download_file.iframe.src = url;
			download_file.iframe.style.display = "none";
		},
		/*
		 * 修改对象的key值
		 * para为对象，obj为要替换值的对象
		 * para{"原有的key","新key"}
		 */
		changeObjKey: function(para,obj){
			for(var key in para){
				if(obj.key == null){
					obj[para[key]] = "";
				}else{
					obj[para[key]] = obj.key;
				}
				delete obj[key];
			};
			return obj;
		},
		/*
		 * datatable初始化
		 * el : table ID
		 * btn : 搜索按钮 ID
		 * options : 初始化事件
		 */
		initDataTables: function(el, btn, options,successCallback) {
			if(!$().dataTable) {
				return;
			};
			var pagelengthMenu = top.globalConfig.curConfigs.configPagelengthMenu.split(",")
			if(typeof arguments[1] != "string"){
				options = arguments[1];
				btn = "";
			};
			options = $.extend(true, {
				"serverSide": true,					//开启服务器请求模式
				"searching":false,
				"scrollX": true,
				"scrollCollapse": false,
				"sScrollX": "100%",
				"sScrollXInner": "100%",
				"bAutoWidth": true,
				"ordering": false,
				//"order":  [[ 2, 'asc' ], [ 4, 'asc' ]], //为空则表示取消默认排序否则复选框一列会出现小箭头 
				"oLanguage": {
					"sProcessing": "正在加载数据，请稍候...",
					"sLengthMenu": "&nbsp;&nbsp;&nbsp;&nbsp;每页显示  _MENU_ 条记录",
					"sZeroRecords": "查询不到数据",
					"sInfo": "当前为第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条记录",
					"sInfoEmpty": "当前为第 0 至 0 条记录，共 0 项",
					"sInfoFiltered": "(由 _MAX_ 条记录结果过滤)",
					"sInfoPostFix": "",
					"sSearch": "",
					"sSearchPlaceholder": "输入关键字筛选表格",
					"sUrl": "",
					"sDecimal": "",
					"sThousands": ",",
					"sEmptyTable": "表中数据为空",
					"sLoadingRecords": "载入中...",
					"sInfoThousands": ",",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "上页",
						"sNext": "下页",
						"sLast": "末页"
					},
					"oAria": {
						"sSortAscending": ": 以升序排列此列",
						"sSortDescending": ": 以降序排列此列"
					},
					"buttons": {
						"copy": "<i title='复制到剪切板' class='fa fa-copy'></i>",
						"excel": "<i title='导出表格' class='fa fa-table'></i>",
						"pdf": "<i title='导出PDF' class='fa fa-file-pdf-o'></i>",
						"colvis": "<i title='选择列' class='glyphicon glyphicon-th'></i>",
						"copyTitle": "复制到剪切板",
						"copySuccess": {
							1: "已经复制当前记录到剪贴板",
							_: "已经复制 %d 条记录到剪切板"
						}
					}
				},
				"dom": '<"clearfix"<"table_toolbars pull-left"><"pull-right"B>>t<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>', //生成样式
				"paginationType": "full_numbers",
				"processing": true,
				"paging": true,
				"lengthMenu": pagelengthMenu,
				"pageLength": 10,
				"language": {
					"emptyTable": "没有关联的需求信息!",
					"thousands": ","
				},
				"columnDefs": [{
					"targets": "_all",
					"defaultContent": ''
				}],
	            //"fixedColumns": {
	            //    'leftColumns': 2
	            //},
				"buttons": [], //'pdf','copy', 'excel', 'colvis'
				"drawCallback": function() {
					//若有气泡提示气泡
					//$("[data-toggle='tooltip']").tooltip();
					if(options.drawCallbackFn != undefined){
						options.drawCallbackFn();
					}
				},
				"ajax":{
					beforSend:App.startLoading(btn)
				}
			}, options);
			var oTable = $(el).dataTable(options).on('preXhr.dt', function ( e, settings, data ) {
	        	App.startLoading(btn);
		   	}).on('xhr.dt', function ( e, settings, json, xhr ) {
	        	App.stopLoading(btn);
		        if(xhr.status == 200){
		        	if(xhr.responseJSON.status != 1){
		        		layer.alert(xhr.responseJSON.message,{icon:2,title:"错误"});
		        	}
		        }else{
		        	loadEnd();
		        	layer.msg("接口错误");
		        }
		    });
			$.fn.dataTable.ext.errMode = 'throw';
			return oTable;
		},
		/*
		 * setFormValues 为查看页面自动赋值不包含checkbox的赋值
		 * @param {String} el 表单容器选择器
		 * @param {JSON} formData 表单项的值
		 * @param {object} valueCallback 需要做重定义的项
		 * valueCallback Demo:{'status':function(value){return value == "0" ? "禁用" : "启用"}}
		 */
		setFormValues:function(el, formData, valueCallback){
            if(formData != undefined && formData != null){
                var obj = null,
                    sel = null,
                    objType = null;
				$(el).find(".form-control[name]").val('');	//将有name的.form-control设置为空
				if(valueCallback != undefined && valueCallback != null) {
					for(var b in valueCallback) {
						var value = formData[b];
						var tvalue = valueCallback[b](value);
						formData[b] = tvalue;
					}
				}
                for(var a in formData){
                    sel = ":input[name='" + a + "']";
                    obj = $(el).find(sel);
                    if(obj.length > 0){
                        objType = obj[0].type;
                        if(objType == "text" || objType == "password" || objType == "select-one" || objType == "textarea" || objType == "hidden"){
                            obj.val(formData[a]);
                            if(objType == "select-one" && obj.hasClass('select2me')){
                                obj.trigger('change');
                            }
                        }else if(objType == "radio" || objType == "checkbox"){
                            App.setChecked(a,formData[a]);
                        }
                    }else if('object' == typeof formData[a]){
                        App.setFormValues(el,formData[a]);
                    }
                }
            }
        },
        /*
         * 设置checkbox或者radio选中
         */
        setChecked: function(name, value) {
			var cks = document.getElementsByName(name);
			var arr = value.toString().split(',');
			for(var i = 0; i < cks.length; i++) {	
				if(isInArray(arr, cks[i].value)) {			//判断是否在数组内
					cks[i].checked = true;
				}
			}
		},
		/**
		 * setFindValue 为查看页面自动赋值不包含checkbox的赋值
		 * @param {String} el 表单容器选择器
		 * @param {JSON} formData 表单项的值
		 * @param {object} valueCallback 需要做重定义的项
		 * valueCallback Demo:{'status':function(value){return value == "0" ? "禁用" : "启用"}}
		 * */
		setFindValue: function(el, formData, valueCallback) {
			if(formData != undefined && formData != null) {
				var obj = null,
					sel = null;
				//将有name的.form-control-static设置为空
				$(el).find(".form-control-static[name]").text('');
				if(valueCallback != undefined && valueCallback != null) {
					for(var b in valueCallback) {
						var value = formData[b];
						var tvalue = valueCallback[b](value);
						formData[b] = tvalue;
					}
				}
				$(el).find(".form-control-static[name]").each(function(index, item) {
					var key = $(item).attr('name');
					var valueObj = formData[key];
					if(valueObj) {
						$(item).text(valueObj);
					} else {
						//如果没有值用空格填充，解决为空导致的高度错乱问题
						$(item).html('&nbsp;');
					}
				})
			}
		},
		/*
		 * 时间戳转时间
		 * type 不传默认返回 yyyy-MM-dd HH:mm:ss
		 * 传yyyy-MM-dd返回 yyyy-MM-dd;
		 */
		formatDateTime: function(inputTime,type) {
			if(inputTime){
				var date = new Date(inputTime);
			}else{
				return "";
			}
		    var y = date.getFullYear();
		    var m = date.getMonth() + 1;
		    m = m < 10 ? ('0' + m) : m;
		    var d = date.getDate();
		    d = d < 10 ? ('0' + d) : d;
		    if(type == "yyyy-MM-dd" || type == "yyyy-mm-dd"){
		    	return y + '-' + m + '-' + d;
		    }else{
		    	var h = date.getHours();
		    	h = h < 10 ? ('0' + h) : h;
		    	var minute = date.getMinutes();
			    var second = date.getSeconds();
			    minute = minute < 10 ? ('0' + minute) : minute;
			    second = second < 10 ? ('0' + second) : second;
		    	return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
		    } 
		},
		/*
		 * 重置form表单
		 */
		resetForm:function(obj){
            var form = $(obj).closest('form');
            form[0].reset();
            form.find('input[type=text]').data("id","")
            form.find('input[type=text]').data("exactSearch","");
            form.find('.select2me').trigger("change");
            form.find('input[data-initData]').each(function(){
                var initEl = $(this);
                var initVal = initEl.attr('data-initData');
                if('undefined' !== typeof initVal )initEl.attr("value",initVal);
            })
        },
		/*
		 * 表单内静态select2内容的初始化
		 * dom 表单的dom元素
		 */
		initFormSelect2 : function(dom){
        	if($().select2){
	            $.fn.select2.defaults.set("theme","bootstrap");
	            $(dom).find(".select2me").each(function(){
	                var allowClearFlag = $(this).attr('data-allowClear');
	                var allowSearch = $(this).attr('data-allowSearch');
	                if(allowClearFlag != false){
	                	allowClearFlag = true;
	                }
	                options = {
	                    placeholder:"请选择",
	                    language:'zh-CN',
	                    width:'100%',
	                    allowClear:allowClearFlag
	                };
	                if(allowSearch == undefined){
	                	options.minimumResultsForSearch = 1;
	                }
	                $(this).select2(options);
	            })
	        }
	    },
	    /*
		 * ajaxselect2内容的初始化
		 * dom 初始化的dom元素
		 * ajaxObj ajax查询参数   必传，参数和formAjaxJson一致
		 * select2填充的key值获取对象
		 * select2填充的value值获取对象
		 * select2填充的空值（默认值）获取对象
		 */
		initAjaxSelect2 : function(dom,ajaxObj,key,value,promptInfo){
    		if($().select2){
	            $.fn.select2.defaults.set("theme","bootstrap");
	            var options = {
                    placeholder:"请选择",
                    language:'zh-CN',
                    width:'100%'
                };
                var allowClearFlag = $(dom).attr('data-allowClear');
                var allowSearch = $(dom).attr('data-allowSearch');
                if(allowClearFlag != false){
                	options.allowClear = true;
                }
                if(allowSearch == undefined){
                	options.minimumResultsForSearch = 1;
                }
                if(promptInfo){
                	options.placeholder=promptInfo;
                }
                $(dom).append('<option value="">请选择</option>');
                $(dom).select2(options);
                //绑定Ajax的内容
			    if(ajaxObj.type == "post"){
			    	var postData = JSON.stringify(ajaxObj.data);	
			    }else{
			    	var postData = ajaxObj.data;
			    }
			    App.formAjaxJson(ajaxObj.url,ajaxObj.type,postData,succssCallback,null,null,null,ajaxObj.async);

			    function succssCallback(result){
			    	var data = result.data;
			        $.each(data, function (i, item) {
			            $(dom).append("<option value='" + item[key] + "'>" + item[value] + "</option>");
			        });
			    }
	      	} 
	    },
	    /*
		 * 全选全不选
		 */
		checkAllFn:function(mainCheckbox,itemCheckbox){
			var $checkItem = $('input[name="' + itemCheckbox + '"]');
			$("" + mainCheckbox + "").prop('checked',false);
			$("" + mainCheckbox + "").off('change').on('change', function(event){
				if(this.checked){
				  	$('input[name="' + itemCheckbox + '"]').prop('checked',true);
				}else{
					$('input[name="' + itemCheckbox + '"]').prop('checked',false);
				}
			});
			$checkItem.off('change').on('change',function(){
				if($checkItem.length == $('input[name="' + itemCheckbox + '"]:checked').length){
					$("" + mainCheckbox + "").prop('checked',true);
				}else{
					$("" + mainCheckbox + "").prop('checked',false);
				}
			})
		},
		/*
		 * 全选全不选
		 */
		getDictInfo:function(code,callbackFn){
			var postData = {"dictId": code};
			App.formAjaxJson(serverPath + "dicts/listChildrenByDicttId", "post", JSON.stringify(postData), successCallback, null, null, null, false);
			function successCallback(result) {
				var data = result.data;
				var resturnData = {};
				for(var i = 0; i < data.length; i++){
					resturnData[data[i].dictValue] = data[i].dictLabel
				};
				callbackFn(resturnData);
			}
		},
		/**
         * datatable render 文本信息 btnArray 内容：
         */
        
         getDataTableBtn:function(btnArray){
         	var btnModel = '    \
				{{#each btnArray}}\
    			<button type="button" class="btn primary btn-outline btn-xs {{this.type}}" onclick="{{this.fn}}">{{this.name}}</button>\
    			{{/each}}';
            var template = Handlebars.compile(btnModel);
            return template({
                btnArray:btnArray
            });
        },
        getDataTableLink:function(btnArray){
             var btnModel = '    \
                {{#each btnArray}}\
                <button type="button" title="{{this.name}}" {{#if this.placement}} data-placement="{{this.placement}}" {{else}}data-placement="right"{{/if}} {{#if this.disabled}} disabled="{{this.disabled}}" {{/if}} class="btn btn-link btn-xs" data-delay="100" data-trigger="hover" data-toggle="tooltip"  onclick="{{this.fn}}"><i class="{{this.icon}}"></i></button>\
                {{/each}}';
            var template = Handlebars.compile(btnModel);
            return template({
                btnArray:btnArray
            });
        },
        getDataTableCheckbox:function(itemObj){
            var content = '<label class="ui-checkbox">';
            content += '<input type="checkbox" data-id="' + itemObj.id + '"  data-name="' + itemObj.name + '" value="' + itemObj.id + '" name="td-checkbox">';
            content += '<span></span></label>';
            return content;
        },
        /*
         * 获取当前ifreamutl参数
         */
        getPresentParm : function(isUrl){
        	var persentUrl = window.location.href;
        	if(persentUrl[persentUrl.length-1] == "#"){
        		persentUrl = persentUrl.substring(0,persentUrl.length - 1);
        	};
        	if(isUrl){
        		return persentUrl;
        	}else{
				var theRequest = new Object();   
				if (persentUrl.indexOf("?") != -1) {   
					var subStrLength = persentUrl.indexOf("?") + 1;
				    var str = persentUrl.substr(subStrLength);   
				    strs = str.split("&");   
				    for(var i = 0; i < strs.length; i ++) {   
				        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);   
				    }   
				}   
				return theRequest;   
        	}
        },
        getQueryString : function(name){
        	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
		    var r = window.location.search.substr(1).match(reg); 
		    if (r != null) return unescape(r[2]); 
		    return null; 
        },
        /*
         * 改变当前ifream切换url
         */
        changePresentUrl : function(url){
        	window.location.href = url;
        },
        /*
         * 详情页固定操作按钮
         * 1.操作按钮父级ID值
         * 2.滚动固定的高度
         */
        fixToolBars : function(dom,dixScrollTop){
        	$(".page-content").scroll(function(){
				var topScroll = $(".page-content").scrollTop();
				var toolbarBtn  = document.getElementById(dom);
				if(topScroll > dixScrollTop){
					$("#"+dom).css({"position":"fixed","top":"0","z-index":"1000","background":"rgba(255,255,255,0.9)"});
				}else{
					toolbarBtn.style.position = 'static';
				}
			})
        },
        /*
         * 加载公共modal框
         * 页面中需加入一个id为commomModal的div,即:
         * '<div class="commom fade" id="commomModal" role="dialog" aria-hidden="true" data-backdrop="static"></div>'
         * type:加载modal的类型
         * dom:设值的input框dom元素  如:"#contractType",
         * value:框内显示内容对象返回数据的key值,
         * setkey: 设定的data值(只针对modal内容为树时生效),可为空,可为一个也可为数组,例传入 "id" dom元素设值data-id = "**"
         * ajaxData:ajax传递的参数,若无传空或null
         */
        getCommonModal : function(type, dom, value, setkey, ajaxData){
        	if(type == "contractType"){
        		$("#commomModal").load("/static/data/_contractType.html?" + App.timestamp(),function(){
					initContractTree(dom, value, setkey, ajaxData);
				})
        	}else if(type == "contractDataSearch"){
        		$("#commomModal").load("/static/data/_contractDataSearch.html?" + App.timestamp(),function(){
					initContractDataSearch(dom, value, setkey, ajaxData);
				})
            } else if (type == "staff") {
                $("#commomModal").load("/static/data/_staff.html?" + App.timestamp(), function() {
                    initStaffTree(dom, value, setkey, ajaxData);
                })
        	}else if(type == "agentStaff"){
        		$("#commomModal").load("/static/data/_agentStaff.html?" + App.timestamp(),function(){
					initAgentStaffTree(dom, value, setkey, ajaxData);
				})
        	}else if(type == "agentDepartment"){
        		$("#commomModal").load("/static/data/_agentDepartment.html?" + App.timestamp(),function(){
					initAgentDepartmentTree(dom, value, setkey, ajaxData);
				})
        	}else if(type == "ourSubject"){
        		$("#commomModal").load("/static/data/_ourSubject.html?" + App.timestamp(),function(){
					initOurSubject(dom, value, setkey, ajaxData);
				})
        	}else if(type == "otherSubject"){
        		$("#commomModal").load("/static/data/_otherSubject.html?" + App.timestamp(),function(){
					initOtherSubject(dom, value, setkey, ajaxData);
				})
        	}
		},
		/*
		 * 加载文件上传公共模态框
		 * 页面中需加入一个id为commomModal的div,即:
         * '<div class="commom fade" id="commomModal" role="dialog" aria-hidden="true" data-backdrop="static"></div>'
         * setting:配置参数
         * queryCallback:点击确定执行的方法
		 */
		getFileUploadModal : function(setting,queryCallback){
			$("#commomModal").load("/static/data/_fileUpload.html?" + App.timestamp(),function(){
				setParm(setting,queryCallback);
			})
		},
		/*
		 * 添加验证
		 */
		addValidatorField:function(dom,name,validators){
			$(dom).bootstrapValidator("addField", name, {  
				container: 'popover',
				trigger: 'live focus blur keyup change',
		       	validators: validators
		   	});
		},
		// init main components
        initComponents:function(){
            this.initAjax();
        },
        
        // public function to remember last opened popover that needs to be
        // closed on click
        setLastPopedPopover:function(el){
            lastPopedPopover = el;
        },
        
        // public function to add callback a function which will be called on
        // window resize
        addResizeHandler:function(func){
            resizeHandlers.push(func);
        },
        
        // public functon to call _runresizeHandlers
        runResizeHandlers:function(){
            _runResizeHandlers();
        },
        
        // wrApper function to scroll(focus) to an element
        scrollTo:function(el,offeset){
            var pos = (el && el.length > 0) ? el.offset().top : 0;
            
            if(el){
                if($('body').hasClass('page-header-fixed')){
                    pos = pos - $('.page-header').height();
                }else if($('body').hasClass('page-header-top-fixed')){
                    pos = pos - $('.page-header-top').height();
                }else if($('body').hasClass('page-header-menu-fixed')){
                    pos = pos - $('.page-header-menu').height();
                }
                pos = pos + (offeset ? offeset : -1 * el.height());
            }
            
            $('html,body').animate({
                scrollTop:pos
            },'slow');
        },
        
        initSlimScroll:function(el){
            if( !$().slimScroll){
                return;
            }
            
            $(el).each(function(){
                if($(this).attr("data-initialized")){
                    return; // exit
                }
                
                var height;
                
                if($(this).attr("data-height")){
                    height = $(this).attr("data-height");
                }else{
                    height = $(this).css('height');
                }
                
                $(this).slimScroll({
                    allowPageScroll:true, // allow page scroll when the
                    // element scroll is ended
                    size:'7px',
                    color:($(this).attr("data-handle-color") ? $(this).attr("data-handle-color") : '#bbb'),
                    wrapperClass:($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
                    railColor:($(this).attr("data-rail-color") ? $(this).attr("data-rail-color") : '#eaeaea'),
                    position:isRTL ? 'left' : 'right',
                    height:height,
                    alwaysVisible:($(this).attr("data-always-visible") == "1" ? true : false),
                    railVisible:($(this).attr("data-rail-visible") == "1" ? true : false),
                    disableFadeOut:true
                });
                
                $(this).attr("data-initialized","1");
            });
        },
        
        destroySlimScroll:function(el){
            if( !$().slimScroll){
                return;
            }
            
            $(el).each(function(){
                if($(this).attr("data-initialized") === "1"){ // destroy
                    // existing
                    // instance
                    // before
                    // updating the
                    // height
                    $(this).removeAttr("data-initialized");
                    $(this).removeAttr("style");
                    
                    var attrList = {};
                    
                    // store the custom attribures so later we will reassign.
                    if($(this).attr("data-handle-color")){
                        attrList["data-handle-color"] = $(this).attr("data-handle-color");
                    }
                    if($(this).attr("data-wrapper-class")){
                        attrList["data-wrapper-class"] = $(this).attr("data-wrapper-class");
                    }
                    if($(this).attr("data-rail-color")){
                        attrList["data-rail-color"] = $(this).attr("data-rail-color");
                    }
                    if($(this).attr("data-always-visible")){
                        attrList["data-always-visible"] = $(this).attr("data-always-visible");
                    }
                    if($(this).attr("data-rail-visible")){
                        attrList["data-rail-visible"] = $(this).attr("data-rail-visible");
                    }
                    
                    $(this).slimScroll({
                        wrapperClass:($(this).attr("data-wrapper-class") ? $(this).attr("data-wrapper-class") : 'slimScrollDiv'),
                        destroy:true
                    });
                    
                    var the = $(this);
                    
                    // reassign custom attributes
                    $.each(attrList,function(key,value){
                        the.attr(key,value);
                    });
                    
                }
            });
        },
        
        // function to scroll to the top
        scrollTop:function(){
            App.scrollTo();
        },
        
        // wrApper function to block element(indicate loading)
        blockUI:function(options){
            options = $.extend(true,{},options);
            var html = '';
            if(options.animate){
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' +
                    '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            }else if(options.iconOnly){
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            }else if(options.textOnly){
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }else{
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() +
                    'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }
            
            if(options.target){ // element blocking
                var el = $(options.target);
                if(el.height() <= ($(window).height())){
                    options.cenrerY = true;
                }
                el.block({
                    message:html,
                    baseZ:options.zIndex ? options.zIndex : 9000000000,
                    centerY:options.cenrerY !== undefined ? options.cenrerY : false,
                    css:{
                        top:'10%',
                        border:'0',
                        padding:'0',
                        backgroundColor:'none'
                    },
                    overlayCSS:{
                        backgroundColor:options.overlayColor ? options.overlayColor : '#555',
                        opacity:options.boxed ? 0.05 : 0.1,
                        cursor:'wait'
                    }
                });
            }else{ // page blocking
                $.blockUI({
                    message:html,
                    baseZ:options.zIndex ? options.zIndex : 9000000000,
                    css:{
                        border:'0',
                        padding:'0',
                        backgroundColor:'none'
                    },
                    overlayCSS:{
                        backgroundColor:options.overlayColor ? options.overlayColor : '#555',
                        opacity:options.boxed ? 0.05 : 0.1,
                        cursor:'wait'
                    }
                });
            }
        },
        
        // wrApper function to un-block element(finish loading)
        unblockUI:function(target){
            if(target){
                $(target).unblock({
                    onUnblock:function(){
                        $(target).css('position','');
                        $(target).css('zoom','');
                    }
                });
            }else{
                $.unblockUI();
            }
        },
        
        startPageLoading:function(options){
            if(options && options.animate){
                $('.page-spinner-bar').remove();
                $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            }else{
                $('.page-loading').remove();
                $('body').append(
                    '<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...') +
                    '</span></div>');
            }
        },
        
        stopPageLoading:function(){
            $('.page-loading, .page-spinner-bar').remove();
        },
        
        alert:function(options){
            
            options = $.extend(true,{
                container:"", // alerts parent container(by default placed
                // after the page breadcrumbs)
                place:"append", // "append" or "prepend" in container
                type:'success', // alert's type
                message:"", // alert's message
                close:true, // make alert closable
                reset:true, // close all previouse alerts first
                focus:true, // auto scroll to the alert after shown
                closeInSeconds:0, // auto close after defined seconds
                icon:"" // put icon before the message
            },options);
            
            var id = App.getUniqueID("App_alert");
            
            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' +
                (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') +
                (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';
            
            if(options.reset){
                $('.custom-alerts').remove();
            }
            
            if( !options.container){
                if($('.page-fixed-main-content').length === 1){
                    $('.page-fixed-main-content').prepend(html);
                }else if(($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').length === 0){
                    $('.page-title').after(html);
                }else{
                    if($('.page-bar').length > 0){
                        $('.page-bar').after(html);
                    }else{
                        $('.page-breadcrumb, .breadcrumbs').after(html);
                    }
                }
            }else{
                if(options.place == "append"){
                    $(options.container).append(html);
                }else{
                    $(options.container).prepend(html);
                }
            }
            
            if(options.focus){
                App.scrollTo($('#' + id));
            }
            
            if(options.closeInSeconds > 0){
                setTimeout(function(){
                    $('#' + id).remove();
                },options.closeInSeconds * 1000);
            }
            
            return id;
        },
        
        // public function to initialize the fancybox plugin
        initFancybox:function(){
            handleFancybox();
        },
        
        // public helper function to get actual input value(used in IE9 and IE8
        // due to placeholder attribute not supported)
        getActualVal:function(el){
            el = $(el);
            if(el.val() === el.attr("placeholder")){
                return "";
            }
            return el.val();
        },
        
        // public function to get a paremeter by name from URL
        getURLParameter:function(paramName){
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");
            
            for(i = 0;i < params.length;i++){
                val = params[i].split("=");
                if(val[0] == paramName){
                    return unescape(val[1]);
                }
            }
            return null;
        },
        
        // check for device touch support
        isTouchDevice:function(){
            try{
                document.createEvent("TouchEvent");
                return true;
            }catch(e){
                return false;
            }
        },
        
        // To get the correct viewport width based on
        // http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
        getViewPort:function(){
            var e = window,
                a = 'inner';
            if( !('innerWidth' in window)){
                a = 'client';
                e = document.documentElement || document.body;
            }
            
            return {
                width:e[a + 'Width'],
                height:e[a + 'Height']
            };
        },
        
        getUniqueID:function(prefix){
            return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime());
        },
        
        // check IE8 mode
        isIE8:function(){
            return isIE8;
        },
        
        // check IE9 mode
        isIE9:function(){
            return isIE9;
        },
        
        // check RTL mode
        isRTL:function(){
            return isRTL;
        },
        
        // check IE8 mode
        isAngularJsApp:function(){
            return ( typeof angular == 'undefined') ? false : true;
        },
        
        getAssetsPath:function(){
            return assetsPath;
        },
        
        setAssetsPath:function(path){
            assetsPath = path;
        },
        
        setGlobalImgPath:function(path){
            globalImgPath = path;
        },
        
        getGlobalImgPath:function(){
            return assetsPath + globalImgPath;
        },
        
        setGlobalPluginsPath:function(path){
            globalPluginsPath = path;
        },
        
        getGlobalPluginsPath:function(){
            return assetsPath + globalPluginsPath;
        },
        
        getGlobalCssPath:function(){
            return assetsPath + globalCssPath;
        },
        
        getResponsiveBreakpoint:function(size){
            return _getResponsiveBreakpoint(size);
        },
        initDefaultEditDataTables: function(el, options) {
			if(!$().dataTable) {
				return;
			}
			var drawCallback = function() {};
			if(options.drawCallback) {
				drawCallback = options.drawCallback
			};
			options = $.extend(true, {
				"ordering": false,
				"scrollX": true,
				"scrollCollapse": true,
				"sScrollX": "100%",
				"sScrollXInner": "100%",
				"bAutoWidth": true,
				"oLanguage": {
					"sProcessing": "正在加载数据，请稍候...",
					"sLengthMenu": "&nbsp;&nbsp;&nbsp;&nbsp;每页显示  _MENU_ 条记录",
					"sZeroRecords": "没有匹配结果",
					"sInfo": "当前为第 _START_ 至 _END_ 条记录，共 _TOTAL_ 条记录",
					"sInfoEmpty": "当前为第 0 至 0 条记录，共 0 项",
					"sInfoFiltered": "(由 _MAX_ 条记录结果过滤)",
					"sInfoPostFix": "",
					"sSearch": "",
					"sSearchPlaceholder": "输入关键字筛选表格",
					"sUrl": "",
					"sDecimal": "",
					"sThousands": ",",
					"sEmptyTable": "暂无数据",
					"sLoadingRecords": "载入中...",
					"sInfoThousands": ",",
					"oPaginate": {
						"sFirst": "首页",
						"sPrevious": "上页",
						"sNext": "下页",
						"sLast": "末页"
					}
				},
				"dom": '<"clearfix"<"table_toolbars pull-left"><"pull-right"B>>t',
				"processing": false,
				"paging": false,
				"language": {
					"emptyTable": "没有关联的需求信息!",
					"thousands": ","
				},
				"columnDefs": [{
					"targets": "_all",
					"defaultContent": ''
				}],
				"buttons": [],
				"drawCallback": function() {
					$(":checkbox[name='td-checkbox']").prop('checked', false);
				}
			}, options);
			options.drawCallback = function() {
				if(options.toolbars) {
					$(el + '_wrapper').find('.table_toolbars').html('').append($(options.toolbars).html());
					$(options.toolbars).remove();
				}
				drawCallback();
			}
			var oTable = $(el).dataTable(options);
			return oTable;
		},
		/**
         * initEditableDatatables 基于initDataTables 实现表格的可编辑 options 新增 addRowBtn
         * String 触发新增按钮的id或calss选择器 options.columns 新增 isEditable Booleans
         * 标识当前列是否可编辑 options 新增fnDeleteEditRow Function 为删除一行之后的回调函数 options
         * 新增fnValidEditRow Function 为保存时校验内容是否符合规范，返回boolean options
         * 新增fnSaveEditRow Function 为保存一行数据的回调函数
         * 
         * 注意：此方法声明的dataTable,调用普通API时，需使用.api()访问
         */
        initEditableDatatables:function(el,options){
            var nEditing = null;
            var nNew = false;
            
            // 添加操作列
            options.columns.splice(0,0,{
                "data":null,
                "title":"操作",
                "width":'10%',
                "className":'text-center',
                "render":function(data,type,row,meta){
                    var html = '<button class="btn btn-link btn-xs dt-edit" title="编辑">编辑</button>'
                    html += '<button class="btn btn-link btn-xs dt-delete" title="删除">删除</button>';
                    return html;
                }
            });
            
            $(options.addRowBtn).unbind('click').bind('click',function(event){
                event.preventDefault();
                if(nEditing){
                    layer.alert('尚有编辑行未保存，请您先进行保持或取消！',{
                        icon:0,
                        skin:'layer-ext-moon'
                    })
                }else{
                    addEmptyRow();
                }
            });
            
            // options.drawCallback
            var drawCallback = function() {};
            if(options.drawCallback){
                drawCallback = options.drawCallback
            };
            
            options.drawCallback = function(){
                drawCallback();
            }

            options.serverSide = false;
            var oTable = this.initDefaultEditDataTables(el,options,true);
            var table = $(el);
            
            /* 删除一行 */
            table.off('click','.dt-delete');
            table.on('click','.dt-delete',function(e){
                e.preventDefault();
                var _btn = this;
                layer.confirm('您确定要删除此记录吗?',{
                    icon:3,
                    title:'提示'
                },function(layerObj){
                    $(this).parents('tr').removeClass('clicked');
                    var nRow = $(_btn).parents('tr')[0];
                    var aData = oTable.fnGetData(nRow); // 当前行的数据
                    oTable.fnDeleteRow(nRow);
                    layer.close(layerObj);
                    // 删除成功，进行ajax数据同步
                    if( typeof options.fnDeleteEditRow == 'function')
                        options.fnDeleteEditRow(aData);
                });
                
            });
            
            /* 删除编辑行 */
            table.off('click','.dt-cancel');
            table.on('click','.dt-cancel',function(e){
                e.preventDefault();
                $(this).parents('tr').removeClass('clicked');
                if(nNew){
                    oTable.fnDeleteRow(nEditing);
                    nEditing = null;
                    nNew = false;
                }else{
                    restoreRow(oTable,nEditing);
                    nEditing = null;
                }
            });
            
            /* 编辑当前行 */
            table.off('click','.dt-edit');
            table.on('click','.dt-edit',function(e){
                e.preventDefault();
                var nRow = $(this).parents('tr')[0];
                if(nEditing !== null && nEditing != nRow){
                    layer.alert('尚有编辑行未保存，请您先进行保持或取消！',{
                        icon:0,
                        skin:'layer-ext-moon'
                    });
                }else if(nEditing == nRow && $(this).attr('title') == "保存"){
                    if( !validRow(oTable,nEditing))
                        return false;
                    $(this).parents('tr').removeClass('clicked');
                    saveRow(oTable,nEditing);
                    nEditing = null;
                }else{
                    $(this).parents('tr').addClass('clicked');
                    editRow(oTable,nRow);
                    nEditing = nRow;
                }
            });
            
            function addEmptyRow(){
                var newRow = {};
                for(var i = 0;i < options.columns.length;i++){
                    var c = options.columns[i];
                    if(c.data != null && c.data != ''){
                        newRow[c.data] = '';
                    }
                }
                var aiNew = oTable.fnAddData(newRow);
                var nRow = oTable.fnGetNodes(aiNew[0]);
                editRow(oTable,nRow);
                nEditing = nRow;
                nNew = true;
            }
            
            /* 复原行 */
            function restoreRow(oTable,nRow){
                var oTdEdit = $(nRow).find('td:eq(0)');
                var oTdEditHtml = '<button class="btn btn-link btn-xs dt-edit" title="编辑">编辑</button>';
                oTdEditHtml += '<button class="btn btn-link btn-xs dt-delete" title="删除">删除</button>';
                oTdEdit.html(oTdEditHtml);
                var aData = oTable.fnGetData(nRow);
                var jqTds = $('>td',nRow);
                var iLen = jqTds.length;
                for(var i = 1;i < iLen;i++){
                    var field = $(jqTds[i]).find('select').attr('name');
                    if( !field){
                        field = $(jqTds[i]).find('input').attr('name');
                    }
                    if(field)
                        oTable.fnUpdate(aData[field],nRow,i,false);
                }
                oTable.fnDraw();
            }
            
            /* 编辑行 */
            function editRow(oTable,nRow){
                var oTdEdit = $(nRow).find('td:eq(0)');
                var oTdEditHtml = '<button class="btn btn-link btn-xs dt-edit" title="保存">保存</button>';
                oTdEditHtml += '<button class="btn btn-link btn-xs dt-cancel" title="取消">取消</button>';
                oTdEdit.html(oTdEditHtml);
                var aData = oTable.fnGetData(nRow);
                var clength = $('>td',nRow).length;
                for(var i = 1;i < clength;i++){
                    var c = options.columns[i];
                    var oTd = $('>td:eq(' + i + ')',nRow);
                    var value = aData[c.data];
                    if(c.render){
                        var func = c.render;
                        value = func(value);
                    }
                    var style = "text-align: left;"
                    if(c.className){
                        if(c.className == 'text-center'){
                            style = "text-align: center;"
                        }else if(c.className == 'text-right'){
                            style = "text-align: right;"
                        }
                    }
                    if(c.isEditable){
                        var targetId = c.data + i;
                        if(c.isSelectData){
                            var selectHtml = '<select name="' + c.data + '" class="form-control select2me" data-placeholder="'+c.selectPlaceholder+'" id="' + targetId + '" value="' + aData[c.data]
                            + '" style="width:100%;" ';
                            if(c.isDisabled){
                                selectHtml += 'disabled ';
                            }
                            selectHtml += '>';
                            selectHtml += '<option value=""></option>';
                            var selectListObj = c.isSelectData;
                            for( var obj in selectListObj){
                                if(obj == aData[c.data]){
                                    selectHtml += '<option value="' + obj + '" selected>' + selectListObj[obj] + '</option>';
                                }else{
                                    selectHtml += '<option value="' + obj + '">' + selectListObj[obj] + '</option>';
                                }
                            }
                            oTd.html(selectHtml);
                            App.initFormSelect2(oTd);
                        }else{
                            var tdHtml = '<input type="text" class="form-control" id="' + targetId + '" name="' + c.data + '" value="' + value + '" style="width:100%;' + style + '" ';
                            if(c.onclickHandler){
                                var clickHanlder = c.onclickHandler + "(" + targetId + ")";
                                tdHtml += 'onclick="' + clickHanlder + '" placeholder="请选择" ';
                            }else{
                                tdHtml += 'placeholder="' + c.title + '" ';
                            }
                            if(c.isReadonly){
                                tdHtml += 'readonly ';
                            }
                            tdHtml += '>';
                            oTd.html(tdHtml);
                        }
                    }else{
                        oTd.html(value);
                    }
                    oTable.fnDraw();
                }
            }
            
            function validRow(oTable,nRow){
                var aData = oTable.fnGetData(nRow);
                var preAData = aData;
                $('input,select',nRow).each(function(index,item){
                    var name = $(this).attr('name');
                    var value = $(this).val();
                    preAData[name] = value;
                })
                var flag = true;
                if( typeof options.fnValidEditRow == 'function'){
                    flag = options.fnValidEditRow(preAData);
                }
                return flag;
            }
            /* 保存行 */
            function saveRow(oTable,nRow){
                var aData = oTable.fnGetData(nRow);
                $('input,select',nRow).each(function(index,item){
                    var tdIndex = $(this).parent('td').index();
                    var value = $(this).val();
                    oTable.fnUpdate(value,nRow,tdIndex,false);
                });
                var oTdEditHtml = '<button class="btn btn-link btn-xs dt-edit" title="编辑">编辑</button>';
                oTdEditHtml += '<button class="btn btn-link btn-xs dt-cancel" title="删除">删除</button>';
                oTable.fnUpdate(oTdEditHtml,nRow,0,false);
                oTable.fnDraw();
                if(nNew){
                    nNew = false;
                }
                // 保存数据，进行ajax数据同步等操作
                if( typeof options.fnSaveEditRow == 'function'){
                    options.fnSaveEditRow(aData);
                }
            }
            return oTable;
        },
        delTableItem:function(el,callback,text){// el 为table的id ；itemName为名称的字段名 ;text为未选中删除记录时,点击删除的提示语
            var checkedItem = $(el + '_wrapper').find('input[type=checkbox][name=td-checkbox]:checked');
            if(text == null){
            	text='请先在表格中勾选您要删除的项目'
            }
            if(checkedItem.length == 0){
                layer.alert(text,{
                    icon:0,
                    skin:'layer-ext-moon'
                })
                return false;
            }else{
                var delStr = [];
                $.each(checkedItem,function(index,item){
                    delStr.push(" <span class='text-warning'>" + $(item).attr('data-name') + "</span> ");
                })
                layer.confirm('您选择了【' + delStr.join(',') + '】共' + checkedItem.length + '条记录，确定要将其删除吗？',{
                    btn:[
                        '删除','取消'
                    ],
                    icon:0,
                    skin:'layer-ext-moon'
                },function(){
                    callback(checkedItem);
                })
            }
        },        		
        
        getDateTimeStamp:function(dateStr){
            return Date.parse(dateStr.replace(/-/gi,"/"));
        },
        //依赖js/Date.extend.js
        formatStringDate:function(dateStr,formatStr){
            return new Date(App.getDateTimeStamp(dateStr)).Format(formatStr)
        },
        getDateDiff :function(dateTimeStamp){
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if(diffValue < 0){return;}
            var monthC =diffValue/month;
            var weekC =diffValue/(7*day);
            var dayC =diffValue/day;
            var hourC =diffValue/hour;
            var minC =diffValue/minute;
            if(monthC>=1){
                result="" + parseInt(monthC) + "月前";
            } else if (weekC >= 1) {
                result="" + parseInt(weekC) + "周前";
            } else if (dayC >= 1) {
                result=""+ parseInt(dayC) +"天前";
            } else if (hourC >= 1) {
                result=""+ parseInt(hourC) +"小时前";
            } else if (minC >= 1) {
                result=""+ parseInt(minC) +"分钟前";
            }else
            result="刚刚";
            return result;
        },
        
        /**
         * 配置全选 全选checkbox 配置 data-checkAll="chkFlag",chkFlag可以是全选checkbox的value
         * data-fullChecked 默认配置上即认为需要子checkbox全部选中以后触发全选，也可以配置成true or false
         * true为全部选中时选中，false为只要有一个选中即选中 子checkbox 配置 data-checkItem="chkFlag"
         * 值为全选的data-checkAll的值
         */
        initCheckAll:function(){
            $.each($('[data-checkAll]'),function(index,checkAllObj){
                var _chkAll = $(this);
                var _chkAll_val = _chkAll.attr('value');
                var _chkCascading = _chkAll.attr('data-fullChecked');
                if(_chkCascading == '' || _chkCascading == 'true' || _chkCascading == true){
                    _chkCascading = true
                }else{
                    _chkCascading = false
                }
                var _chkItems = $('[data-checkItem=' + _chkAll_val + ']');
                var _chkItems_length = _chkItems.length;
                // 根据子复选框判断对应全选的选中状态
                if($('[data-checkItem=' + _chkAll_val + ']:checked').length == _chkItems_length){
                    _chkAll.prop('checked',true);
                }
                _chkAll.on('click',function(){
                    _chkItems.prop('checked',_chkAll.is(':checked'));
                })
                _chkItems.on('click',function(){
                    if($(this).is(':checked') && !_chkAll.is(':checked')){
                        _chkAll.prop('checked',_chkCascading ? ($('[data-checkItem=' + _chkAll_val + ']:checked').length == _chkItems_length ? true : false) : true);
                    }else{
                        _chkAll.prop('checked',_chkCascading ? false : ($('[data-checkItem=' + _chkAll_val + ']:checked').length > 0 ? true : false));
                    }
                })
            })
        },
        /**
         * 打开框架页面标签页
         * @param url 打开标签页的路径
         * @param title 标签页显示的标题
         * */
        openPageTab:function(url,title){
            window.top.showSubpageTab(url,title);
        },
        /**
         * 打开框架页面标签页
         * @param url 打开标签页的路径
         * @param title 标签页显示的标题
         * */
        closePageTab:function(url){
            window.top.closeSubpageTab(url);
        },
        /**
         * options.alertType 1:成功,2:失败,:警告
         * options.title 提示的标题，不建议自定义；
         * options.content 提示的内容
         * options.onSuccess 点击确认后的回调
         * options.time 自动关闭所需毫秒，默认为0，注意单位是毫秒
         * */
        boxAlert:function(options){
            options = options?options:{};
            options = $.extend(true,{
                title:'提示',
                content:'您已成功操作了您的业务',
                icon:1,
                closeBtn:0
            },options);
            if('undefinded' != typeof options.alertType){
                options.icon = options.alertType;
            }
            if('function' == typeof options.onSuccess){
                options.yes = function(crnLayer){
                    options.onSuccess();
                    layer.close(crnLayer);
                }
            }
            layer.open(options)
        },
        /**
         * options.title 提示的标题，默认‘提示’；
         * options.content 提示的内容
         * options.onSuccess 点击确认后的回调
         * options.onCancel 点击取消后的回调
         * 
         * */
        boxConfirm:function(options){
            options = options?options:{};
            layer.confirm(options.content?options.content:'您确定要执行此操作吗?', {
                icon: 3, 
                title:options.title?options.title:'提示'
            }, function(layerIndex){
              //do something
              if('function' == typeof options.onSuccess) options.onSuccess();
              layer.close(layerIndex);
            },function(layerIndex){
                if('function' == typeof options.onCancel) options.onCancel();
                layer.close(layerIndex);
            });
        },
        getFlowParam:function(serverPath,businessId,handleType,pathSelect){
        	var flowparam=null;
        	if(businessId.length==0){
        		layer.msg("业务主键不可为空！");
        	}else{
        		$.ajax({
        			type: 'get',
        			url: serverPath+'workflowrest/getFlowParam?businessId='+businessId+'&handleType='+handleType+'&pathSelect='+pathSelect,
        			//data: null,
        			dataType: 'json',
        			async: false,
        			contentType: "application/json",
        			success: function(result){
        				var result = result;
        				if (result.success == 1) {
        					flowparam=result.flowdata;
        				} else {
        					layer.msg("获取流程参数异常！");
        				};
        			},
        			error: function(result) {
        				layer.alert("接口错误", {icon: 2,title:"错误"});
        			}
        		});
        	}
        	return flowparam;
        },
        applyCandidateTask:function(serverPath,flowParam){
    		$.ajax({
    			type: 'get',
    			url: serverPath+"workflowrest/applyCandidateTask",
    			data: flowParam,
    			dataType: 'json',
    			async: false,
    			contentType: "application/json",
    			success: function(result){
    				var data = result;
    				if (data.success == 1){
    					layer.msg(data.sign);
    				}else {
    					layer.msg(data.sign);
    					return;
    				} 
    			},
    			error: function(result) {
    				layer.alert("流程参数异常，请联系管理员！", {icon: 2,title:"错误"});
    			}
    		});
        }
        
        
        
	};
}();


jQuery(document).ready(function() {
	App.init();
});

function isInArray(arr,val) { 
	var testStr="," + arr.join(",") + ","; 
	return testStr.indexOf("," + val + ",") != -1; 
} 
/*
 * datatable事件  以后不用
 * code如果返回的值不是默认为data时的参数
 */
function resolveResult(result,code){
	if(result.status == 1){
		if(code){
			return result.code;
		}else{
			return result.data;
		}
	}else{
		return [];
	}
}
/*
 * ztree异步加载失败事件
 */
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	layer.msg("接口错误", {
		icon: 2
	});
}
/*
 * 全局ajax事件
 */
function loadStart(){
//	NProgress.start();
	layerIndex = layer.msg('数据处理中,请稍后...', {icon: 16,shade: 0.01,time:false});
}

function loadEnd(){
	layer.close(layerIndex);
}
$(document).ajaxStart(function(){
	loadStart();
})
$(document).ajaxStop(function(){
    loadEnd();
});
$(document).ajaxError(function(){
    loadEnd();
});
$(document).ajaxSend(function(event, jqxhr, settings) {
	if(settings.type == "GET"){
//		if(settings.url.indexOf("?") === -1){
//			settings.url = settings.url + "?testData=testData";
//		}else{
//			settings.url = settings.url + "&testData=testData";
//		}
	}else{
//		var parameter = JSON.parse(settings.data);
//		parameter.testdata = "testdata";
//		settings.data = JSON.stringify(parameter);
		
	}	
});
/*
 * .trim()兼容IE8
 */
String.prototype.trim = function() {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}