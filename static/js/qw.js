/**
 * Core script to handle the entire theme and core functions
 */
var App = function(){
    
    // IE mode
    var isRTL = false;
    var isIE8 = false;
    var isIE9 = false;
    var isIE10 = false;
    
    var resizeHandlers = [];
    
    var assetsPath = 'undefined' == typeof prcs ? '../../../':prcs;
    
    var globalImgPath = '/static/img/';
    
    var globalPluginsPath = '/static/plugins/';
    
    var globalCssPath = '/static/css/';
    
    var _getResponsiveBreakpoint = function(size){
        // bootstrap responsive breakpoints
        var sizes = {
            'xs':480, // extra small
            'sm':768, // small
            'md':992, // medium
            'lg':1200
        // large
        };
        
        return sizes[size] ? sizes[size] : 0;
    };
    
    var resBreakpointMd = _getResponsiveBreakpoint('md');
    
    
    
    // initializes main settings
    var handleInit = function(){
        
        if($('body').css('direction') === 'rtl'){
            isRTL = true;
        }
        
        isIE8 = ! !navigator.userAgent.match(/MSIE 8.0/);
        isIE9 = ! !navigator.userAgent.match(/MSIE 9.0/);
        isIE10 = ! !navigator.userAgent.match(/MSIE 10.0/);
        
        if(isIE10){
            $('html').addClass('ie10'); // detect IE10 version
        }
        
        if(isIE10 || isIE9 || isIE8){
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
                
                height = height - target.children('.portlet-title').outerHeight(true) - parseInt(target.children('.portlet-body').css('padding-top'))
                - parseInt(target.children('.portlet-body').css('padding-bottom')) - 5;
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
    var handlePortletTools = function(){
        // handle portlet remove
        $('body').on('click','.portlet > .portlet-title > .tools > a.remove',function(e){
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            
            if($('body').hasClass('page-portlet-fullscreen')){
                $('body').removeClass('page-portlet-fullscreen');
            }
            
            portlet.find('.portlet-title .fullscreen').tooltip('destroy');
            portlet.find('.portlet-title .reload').tooltip('destroy');
            portlet.find('.portlet-title .remove').tooltip('destroy');
            portlet.find('.portlet-title .config').tooltip('destroy');
            portlet.find('.portlet-title .more').tooltip('destroy');
            portlet.find('.portlet-title .collapse, .portlet > .portlet-title .expand').tooltip('destroy');
            
            portlet.remove();
        });
        
        // handle portlet fullscreen
        $('body').on(
        'click',
        '.portlet > .portlet-title .fullscreen',
        function(e){
            e.preventDefault();
            var portlet = $(this).closest(".portlet");
            if(portlet.hasClass('portlet-fullscreen')){
                $(this).removeClass('on');
                portlet.removeClass('portlet-fullscreen');
                $('body').removeClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height','auto');
            }else{
                var height = App.getViewPort().height - portlet.children('.portlet-title').outerHeight() - parseInt(portlet.children('.portlet-body').css('padding-top'))
                - parseInt(portlet.children('.portlet-body').css('padding-bottom'));
                
                $(this).addClass('on');
                portlet.addClass('portlet-fullscreen');
                $('body').addClass('page-portlet-fullscreen');
                portlet.children('.portlet-body').css('height',height);
            }
        });
        
        $('body').on('click','.portlet > .portlet-title > .tools > a.reload',function(e){
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            var url = $(this).attr("data-url");
            var error = $(this).attr("data-error-display");
            if(url){
                App.blockUI({
                    target:el,
                    animate:true,
                    overlayColor:'none'
                });
                $.ajax({
                    type:"GET",
                    cache:false,
                    url:url,
                    dataType:"html",
                    success:function(res){
                        App.unblockUI(el);
                        el.html(res);
                        App.initAjax() // reinitialize elements & plugins for
                        // newly loaded content
                    },
                    error:function(xhr,ajaxOptions,thrownError){
                        App.unblockUI(el);
                        var msg = 'Error on reloading the content. Please check your connection and try again.';
                        if(error == "toastr" && toastr){
                            toastr.error(msg);
                        }else if(error == "notific8" && $.notific8){
                            $.notific8('zindex',11500);
                            $.notific8(msg,{
                                theme:'ruby',
                                life:3000
                            });
                        }else{
                            alert(msg);
                        }
                    }
                });
            }else{
                // for demo purpose
                App.blockUI({
                    target:el,
                    animate:true,
                    overlayColor:'none'
                });
                window.setTimeout(function(){
                    App.unblockUI(el);
                },1000);
            }
        });
        
        // load ajax data on page init
        $('.portlet .portlet-title a.reload[data-load="true"]').click();
        
        $('body').on('click','.portlet > .portlet-title > .tools > .collapse, .portlet .portlet-title > .tools > .expand',function(e){
            e.preventDefault();
            var el = $(this).closest(".portlet").children(".portlet-body");
            if($(this).hasClass("collapse")){
                $(this).removeClass("collapse").addClass("expand");
                el.slideUp(200);
            }else{
                $(this).removeClass("expand").addClass("collapse");
                el.slideDown(200);
            }
        });
    };
    
    // Handles custom checkboxes & radios using jQuery iCheck plugin
    var handleiCheck = function(){
        if( !$().iCheck){
            return;
        }
        
        $('.icheck').each(function(){
            var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey';
            var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey';
            
            if(checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1){
                $(this).iCheck({
                    checkboxClass:checkboxClass,
                    radioClass:radioClass,
                    insert:'<div class="icheck_line-icon"></div>' + $(this).attr("data-label")
                });
            }else{
                $(this).iCheck({
                    checkboxClass:checkboxClass,
                    radioClass:radioClass
                });
            }
        });
    };
    
    // Handles Bootstrap switches
    var handleBootstrapSwitch = function(){
        if( !$().bootstrapSwitch){
            return;
        }
        $('.make-switch').bootstrapSwitch();
    };
    
    // Handles Bootstrap confirmations
    var handleBootstrapConfirmation = function(){
        if( !$().confirmation){
            return;
        }
        $('[data-toggle=confirmation]').confirmation({
            btnOkClass:'btn btn-sm btn-success',
            btnCancelClass:'btn btn-sm btn-danger'
        });
    }

    // Handles Bootstrap Accordions.
    var handleAccordions = function(){
        $('body').on('shown.bs.collapse','.accordion.scrollable',function(e){
            App.scrollTo($(e.target || e.srcElement));
        });
    };
    
    // Handles Bootstrap Tabs.
    var handleTabs = function(){
        // activate tab if tab id provided in the URL
        if(encodeURI(location.hash)){
            var tabid = encodeURI(location.hash.substr(1));
            $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function(){
                var tabid = $(this).attr("id");
                $('a[href="#' + tabid + '"]').click();
            });
            $('a[href="#' + tabid + '"]').click();
        }
        
        if($().tabdrop){
            $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
                text:'<i class="fa fa-ellipsis-v"></i>&nbsp;<i class="fa fa-angle-down"></i>'
            });
        }
    };
    
    // Handles Bootstrap Modals.
    var handleModals = function(){
        // fix stackable modal issue: when 2 or more modals opened, closing one
        // of modal will remove .modal-open class.
        $('body').on('hide.bs.modal',function(){
            if($('.modal:visible').length > 1 && $('html').hasClass('modal-open') === false){
                $('html').addClass('modal-open');
            }else if($('.modal:visible').length <= 1){
                $('html').removeClass('modal-open');
            }
        });
        
        // fix page scrollbars issue
        $('body').on('show.bs.modal','.modal',function(){
            if($(this).hasClass("modal-scroll")){
                $('body').addClass("modal-open-noscroll");
            }
        });
        
        // fix page scrollbars issue
        $('body').on('hidden.bs.modal','.modal',function(){
            $('body').removeClass("modal-open-noscroll");
        });
        
        // remove ajax content and remove cache on modal closed
        $('body').on('hidden.bs.modal','.modal:not(.modal-cached)',function(){
            $(this).removeData('bs.modal');
        });
    };
    
    // Handles Bootstrap Tooltips.
    var handleTooltips = function(){
        // global tooltips
        $('.tooltips').tooltip();
        
        // portlet tooltips
        $('.portlet > .portlet-title .fullscreen').tooltip({
            trigger:'hover',
            container:'body',
            placement:'bottom',
            title:'全屏浏览'
        });
        $('.portlet > .portlet-title .reload').tooltip({
            trigger:'hover',
            container:'body',
            placement:'bottom',
            title:'刷新'
        });
        $('.portlet > .portlet-title .remove').tooltip({
            trigger:'hover',
            container:'body',
            placement:'bottom',
            title:'移除'
        });
        $('.portlet > .portlet-title .config').tooltip({
            trigger:'hover',
            container:'body',
            placement:'bottom',
            title:'设置'
        });
        $('.portlet > .portlet-title .more').tooltip({
            trigger:'hover',
            container:'body',
            placement:'bottom',
            title:'查看更多'
        });
        $('.portlet > .portlet-title .collapse, .portlet > .portlet-title .expand').tooltip({
            trigger:'hover',
            container:'body',
            placement:'bottom',
            title:'折叠/展开'
        });
    };
    
    // Handles Bootstrap Dropdowns
    var handleDropdowns = function(){
        /*
         * Hold dropdown on click
         */
        $('body').on('click','.dropdown-menu.hold-on-click',function(e){
            e.stopPropagation();
        });
    };
    
    var handleAlerts = function(){
        $('body').on('click','[data-close="alert"]',function(e){
            $(this).parent('.alert').hide();
            $(this).closest('.note').hide();
            e.preventDefault();
        });
        
        $('body').on('click','[data-close="note"]',function(e){
            $(this).closest('.note').hide();
            e.preventDefault();
        });
        
        $('body').on('click','[data-remove="note"]',function(e){
            $(this).closest('.note').remove();
            e.preventDefault();
        });
    };
    
    // Handle textarea autosize
    var handleTextareaAutosize = function(){
        if( typeof (autosize) == "function"){
            autosize(document.querySelector('textarea.autosizeme'));
        }
    }

    // Handles Bootstrap Popovers
    
    // last popep popover
    var lastPopedPopover;
    
    var handlePopovers = function(){
        $('.popovers').popover();
        
        // close last displayed popover
        
        $(document).on('click.bs.popover.data-api',function(e){
            if(lastPopedPopover){
                lastPopedPopover.popover('hide');
            }
        });
    };
    
    // Handles scrollable contents using jQuery SlimScroll plugin.
    var handleScrollers = function(){
        App.initSlimScroll('.scroller');
    };
    
    // Handles Image Preview using jQuery Fancybox plugin
    var handleFancybox = function(){
        if( !jQuery.fancybox){
            return;
        }
        
        if($(".fancybox-button").length > 0){
            $(".fancybox-button").fancybox({
                groupAttr:'data-rel',
                prevEffect:'none',
                nextEffect:'none',
                closeBtn:true,
                helpers:{
                    title:{
                        type:'inside'
                    }
                }
            });
        }
    };
    
    // Handles counterup plugin wrapper
    var handleCounterup = function(){
        if( !$().counterUp){
            return;
        }
        
        $("[data-counter='counterup']").counterUp({
            delay:10,
            time:1000
        });
    };
    
    // Fix input placeholder issue for IE8 and IE9
    var handleFixInputPlaceholderForIE = function(){
        // fix html5 placeholder attribute for ie7 & ie8
        if(isIE8 || isIE9){ // ie8 & ie9
            // this is html5 placeholder fix for inputs, inputs with
            // placeholder-no-fix class will be skipped(e.g: we need this for
            // password fields)
            $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function(){
                var input = $(this);
                
                if(input.val() === '' && input.attr("placeholder") !== ''){
                    input.addClass("placeholder").val(input.attr('placeholder'));
                }
                
                input.focus(function(){
                    if(input.val() == input.attr('placeholder')){
                        input.val('');
                    }
                });
                
                input.blur(function(){
                    if(input.val() === '' || input.val() == input.attr('placeholder')){
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
                options = {
                    placeholder:"请选择",
                    language:'zh-CN',
                    width:'100%',
                    allowClear:allowClearFlag ? true : false
                };
                if(allowSearch == undefined)
                    options.minimumResultsForSearch = -1;
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
            $('.datetime-picker').datepicker({
                format:"yyyy-mm-dd hh:ii:ss"
            });
        }
    };
    
    var panelAction = function(el,parentEl,bodyEl,icon1,icon2,times){
        $(el).off('click').on('click',function(){
            var me = $(this);
            var pnode = me.closest(parentEl);
            var pbody = pnode.nextAll(bodyEl).first();
            var meicon = me.find('.fa');
            if(times != 0){
                times = times ? times : 200;
            }
            pbody.slideToggle(times);
            meicon.toggleClass(icon1).toggleClass(icon2);
            if(el == '.page-search-more a'){
                var panelSearch = me.closest('.page-search');
                var resetBtn = panelSearch.find('.page-search-action').find('button[type=reset]');
                resetBtn.toggleClass('hidden');
            }
        })
    }

    var handlePagesearch = function(){
        if($('.page-search-more').length){
            panelAction('.page-search-more a','.page-search-more','.page-search-moreBody','fa-angle-double-right','fa-angle-double-up',0);
        }
    }

    var handleFileInput = function(){
//        $('.form-group-file .input-group').unbind('click').bind('click',function(){
//            var pnode = $(this).closest('.form-group-file');
//            var fileNode = pnode.find('input[type=file]');
//            fileNode.trigger('click');
//        });
        $('.form-group-file input[type=file]').change(function(){
            var pnode = $(this).parent('.form-group-file');
            var fileNode = pnode.find('.input-group input[type=text]');
            fileNode.val($(this).val());
        })
    }
    // Handle formFieldset
    var handleFormFieldset = function(){
        if($('.form-fieldset .form-collapse').length){
            panelAction('.form-fieldset .form-collapse','.form-fieldset-title','.form-fieldset-body','fa-angle-up','fa-angle-down');
        }
    }

    // handle group element heights
    var handleHeight = function(){
        $('[data-auto-height]').each(function(){
            var parent = $(this);
            var items = $('[data-height]',parent);
            var height = 0;
            var mode = parent.attr('data-mode');
            var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0);
            
            items.each(function(){
                if($(this).attr('data-height') == "height"){
                    $(this).css('height','');
                }else{
                    $(this).css('min-height','');
                }
                
                var height_ = (mode == 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true));
                if(height_ > height){
                    height = height_;
                }
            });
            
            height = height + offset;
            
            items.each(function(){
                if($(this).attr('data-height') == "height"){
                    $(this).css('height',height);
                }else{
                    $(this).css('min-height',height);
                }
            });
            
            if(parent.attr('data-related')){
                $(parent.attr('data-related')).css('height',parent.height());
            }
        });
    }

    // * END:CORE HANDLERS *//
    
    return {
        
        // main function to initiate the theme
        init:function(){
            // IMPORTANT!!!: Do not modify the core handlers call order.
        	handelCheckbox();
        	handelRadio();
            // Core handlers
            handleInit(); // initialize core variables
            handleSubpageTab();// 子页面打开tab页控制
            handleOnResize(); // set and handle responsive
            
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
            // Handle group element heights
            // this.addResizeHandler(handleHeight); // handle auto calculating
            // height on window resize
            
            // Hacks
            // handleFixInputPlaceholderForIE(); //IE8 & IE9 input placeholder
            // issue fix
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
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">'
                + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>';
            }else if(options.iconOnly){
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>';
            }else if(options.textOnly){
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
            }else{
                html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath()
                + 'loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;' + (options.message ? options.message : 'LOADING...') + '</span></div>';
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
                '<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp;&nbsp;<span>' + (options && options.message ? options.message : 'Loading...')
                + '</span></div>');
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
            
            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">'
            + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '')
            + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';
            
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
            var searchString = window.location.search.substring(1),i,val,params = searchString.split("&");
            
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
            var e = window,a = 'inner';
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
        /**
         * 初始化datatable表格
         * 
         * @params el string 表格的id
         * @params options JSON 表格设置
         * @params isOldDT boolean
         * 非必填，是否使用老数据表构造，为true时，可以使用fnfilter,fndeleteRow等方法，但使用默认api方法时，需使用.api()方法调用
         * 如：dataTable().api().row(0).remove 关于toolbars的设置请注意：
         * 加入toolbars是为了自定义按钮能够与右侧的操作按钮同行显示，如果设置options.buttons为空（右侧没有工具按钮显示），则可不必通过toolbars的形式显示按钮
         * 加入toolbars后，toolbars内的按钮不能通过id的方式设定事件（因为此时页面上会有两个相同id的按钮）
         * 
         * 不分页的表格，增加设置
         * "paging":false,
         * "dom":'<"clearfix">t<"clearfix">'
         * 
         */
        initDataTables:function(el,options,isNewDT){
            // 添加遮罩
            App.blockUI({
                message:'<div class="spinner"></div>'
            });
            if( !$().dataTable){
                return;
            }
            var drawCallback = function(){
            };
            if(options.drawCallback){
                drawCallback = options.drawCallback
            };
            var tdom = '<"clearfix"<"table_toolbars pull-left"><"pull-right"B>>t<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>';
            if('undefined' == typeof options.toolbars && 'undefined' == typeof options.buttons){
                tdom = 't<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>';
            }
            options = $.extend(true,{
                "ordering":false,
                "scrollX":true,
                "scrollCollapse":true,
                "sScrollX":true,
                "sScrollXInner":"100%",
                "sScrollY":"100%",//解决ie9下新增空行的问题; 设定数值，可以固定表格的高度
                "bScrollCollapse":false,//解决ie9下新增空行的问题
                "bAutoWidth":true,
                "serverSide":true,
                "ajax":{
                    "type":"POST",
                    "contentType":"application/x-www-form-urlencoded; charset=UTF-8",
                    "dataType":"json",
                    "complete":function(){
                        // 结束遮罩
                        App.unblockUI();
                    },
                    "error":function (XMLHttpRequest, textStatus, errorThrown) {
                       ajaxErrorDeal(XMLHttpRequest, textStatus, errorThrown)
                    }
                },
                "order":[], // 默认排序查询,为空则表示取消默认排序否则复选框一列会出现小箭头
                "oLanguage":{
                    "sProcessing":"正在加载数据，请稍候...",
                    "sLengthMenu":"&emsp;每页显示  _MENU_ 项",
                    "sZeroRecords":"没有匹配结果",
                    "sInfo":"第 _START_至 _END_项，共 _TOTAL_项",
                    "sInfoEmpty":"第 0至0项，共0项",
                    "sInfoFiltered":"(由 _MAX_项结果过滤)",
                    "sInfoPostFix":"",
                    "sSearch":"",
                    "sSearchPlaceholder":"输入关键字筛选表格",
                    "sUrl":"",
                    "sDecimal":"",
                    "sThousands":",",
                    "sEmptyTable":"没有匹配结果",
                    "sLoadingRecords":"载入中...",
                    "sInfoThousands":",",
                    "oPaginate":{
                        "sFirst":"首页",
                        "sPrevious":"上页",
                        "sNext":"下页",
                        "sLast":"末页"
                    },
                    "oAria":{
                        "sSortAscending":": 以升序排列此列",
                        "sSortDescending":": 以降序排列此列"
                    },
                    "buttons":{
                        "copy":"<i title='复制到剪切板' class='fa fa-copy'></i>",
                        "excel":"<i title='导出表格' class='fa fa-table'></i>",
                        "pdf":"<i title='导出PDF' class='fa fa-file-pdf-o'></i>",
                        "colvis":"<i title='选择列' class='glyphicon glyphicon-th'></i>",
                        "copyTitle":"复制到剪切板",
                        "copySuccess":{
                            1:"已经复制当前记录到剪贴板",
                            _:"已经复制 %d 条记录到剪切板"
                        }
                    }
                },
                "dom":'<"clearfix"<"table_toolbars pull-left"><"pull-right"B>>t<"clearfix dt-footer-wrapper" <"pull-left" <"inline-block" i><"inline-block"l>><"pull-right" p>>', // 生成样式
                "processing":false,
                // "bProcessing":true,
                "paging":true,
                "lengthMenu":[
                    [
                        5,10,15,20, 50,100
                    ],[
                        5,10,15,20,50,100
                    ]
                ],
                "pageLength":10,
                "language":{
                    "emptyTable":"没有数据!",
                    "thousands":","
                },
                // "fixedColumns": {
                // 'leftColumns': 2
                // },
                "columnDefs":[
                    { // 所有列默认值
                        "targets":"_all",
                        "defaultContent":''
                    }
                ],
                "buttons":[], // 'pdf','copy', 'excel', 'colvis'
                
                drawCallback:function(){
                    
                }
            },options);
            options.drawCallback = function(){
                // 加载工具栏
                if(options.toolbars){
                    $(el + '_wrapper').find('.table_toolbars').html('').append($(options.toolbars).html());
                    // $(options.toolbars).remove();
                }
                // 取消全选
                // $(":checkbox[name='td-checkbox']").prop('checked', false);
                App.initAjax();
                // 加载自定义drawCallback();
                drawCallback();
                
            }
            if(isNewDT)
                $table = $(el).dataTable(options);
            else
                $table = $(el).DataTable(options);
            return $table;
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
                    var html = '<button class="btn btn-link btn-xs dt-edit" title="编辑"><i class="iconfont icon-bianji"></i></button>'
                    html += '<button class="btn btn-link btn-xs dt-delete" title="删除"><i class="iconfont icon-shanchu"></i></button>';
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
            var drawCallback = function(){
            };
            if(options.drawCallback){
                drawCallback = options.drawCallback
            }
            ;
            
            options.drawCallback = function(){
                drawCallback();
            }

            options.serverSide = false;
            var oTable = this.initDataTables(el,options,true);
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
                var oTdEditHtml = '<button class="btn btn-link btn-xs dt-edit" title="编辑"><i class="iconfont icon-bianji"></i></button>';
                oTdEditHtml += '<button class="btn btn-link btn-xs dt-delete" title="删除"><i class="iconfont icon-shanchu"></i></button>';
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
                var oTdEditHtml = '<button class="btn btn-link btn-xs dt-edit" title="保存"><i class="iconfont icon-baocun"></i></button>';
                oTdEditHtml += '<button class="btn btn-link btn-xs dt-cancel" title="取消"><i class="iconfont icon-quxiao"></i></button>';
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
                            var selectHtml = '<select name="' + c.data + '" data-allowClear="true" class="form-control select2me" id="' + targetId + '" name="' + c.data + '" value="' + aData[c.data]
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
                var oTdEditHtml = '<button class="btn btn-link btn-xs dt-edit" title="编辑"><i class="iconfont icon-bianji"></i></button>';
                oTdEditHtml += '<button class="btn btn-link btn-xs dt-cancel" title="删除"><i class="iconfont icon-shanchu"></i></button>';
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
        isInArray:function(arr,value){
            for(var i = 0;i < arr.length;i++){
                if(arr[i] == value){
                    return true;
                }
            }
            return false;
        },
        setChecked:function(name,value){
            var cks = document.getElementsByName(name);
            var arr = value.split(',');
            
            for(var i = 0;i < cks.length;i++){
                if(App.isInArray(arr,cks[i].value)){
                    cks[i].checked = true;
                }
            }
        },
        
        /**
         * setFormValues 为表单自动赋值
         * 
         * @params {String} formId 表单id
         * @params {JSON} formData 表单值
         */
        setFormValues:function(formId,formData){
            if(formData != undefined && formData != null){
                var obj = null,sel = null,objType = null;
                for( var a in formData){
                    sel = ":input[name='" + a + "']";
                    obj = $(formId).find(sel);
                    if(obj.length > 0){
                        objType = obj[0].type;
                        if(objType == "text" || objType == "select-one" || objType == "textarea" || objType == "hidden"){
                            obj.val(formData[a]);
                            if(objType == "select-one" && obj.hasClass('select2me')){
                                obj.trigger('change');
                            }
                        }else if(objType == "radio" || objType == "checkbox"){
                            App.setChecked(a,formData[a]);
                        }
                    }else if('object' == typeof formData[a]){
                        App.setFormValues(formId,formData[a]);
                    }
                }
            }
        },
        
        /**
         * setFindValue 为查看页面自动赋值
         * 
         * @param {String} el 表单容器选择器
         * @param {JSON} formData 表单项的值
         * @param {Array} valueCallback 需要做重定义的项
         */
        setFindValue:function(el,formData,valueCallback){
            if(formData != undefined && formData != null){
                var obj = null,sel = null;
                // 将有name的.form-control-static设置为空
                $(el).find(".form-control-static[name]").text('');
                if(valueCallback != undefined && valueCallback != null){
                    for( var b in valueCallback){
                        var value = formData[b];
                        var tvalue = valueCallback[b](value);
                        formData[b] = tvalue;
                    }
                }
                $(el).find(".form-control-static[name]").each(function(index,item){
                    var key = $(item).attr('name');
                    var valueObj = formData[key];
                    if(valueObj){
                        if(valueObj.callback){
                            $(item).html(valueObj.callback(valueObj.value));
                        }else{
                            $(item).html(valueObj);
                        }
                    }else{
                        // 如果没有值用空格填充，解决为空导致的高度错乱问题
                        $(item).html('&nbsp;');
                    }
                })
            }
        },
        /* 获取表格操作列的DOM */
        getDataTableBtn:function(btnArray){
            var btnModel = '    \
                {{#each btnArray}}\
                <button type="button" title="{{this.name}}" {{#if this.placement}} data-placement="{{this.placement}}" {{else}}data-placement="right"{{/if}} {{#if this.disabled}} disabled="{{this.disabled}}" {{/if}} class="btn btn-link btn-xs tooltips" data-delay="100" data-trigger="hover"  onclick="{{this.fn}}"><i class="{{this.icon}}"></i></button>\
                {{/each}}';
            var template = Handlebars.compile(btnModel);
            return template({
                btnArray:btnArray
            });
        },
        /**
         * datatable render 文本信息 btnArray 内容：
         * 
         * @param name string 显示的名称
         * @param function fn 点击链接要进行的事件
         */
        getDataTableLink:function(btnArray){
            var btnModel = '    \
                {{#each btnArray}}\
                <button type="button" {{#if this.disabled}} disabled="{{this.disabled}}" {{/if}}  class="btn btn-link btn-xs"  onclick="{{this.fn}}">{{this.name}}</button>\
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
        getDateTimeStamp:function(dateStr){
            return Date.parse(dateStr.replace(/-/gi,"/"));
        },
        //依赖js/Date.extend.js
        formatStringDate:function(dateStr,formatStr){
            return new Date(App.getDateTimeStamp(dateStr)).Format(formatStr)
        },
        getDateDiff:function(dateTimeStamp){
            var minute = 1000 * 60;
            var hour = minute * 60;
            var day = hour * 24;
            var halfamonth = day * 15;
            var month = day * 30;
            var now = new Date().getTime();
            var diffValue = now - dateTimeStamp;
            if(diffValue < 0){
                return;
            }
            var monthC = diffValue / month;
            var weekC = diffValue / (7 * day);
            var dayC = diffValue / day;
            var hourC = diffValue / hour;
            var minC = diffValue / minute;
            if(monthC >= 1){
                result = "" + parseInt(monthC) + "月前";
            }else if(weekC >= 1){
                result = "" + parseInt(weekC) + "周前";
            }else if(dayC >= 1){
                result = "" + parseInt(dayC) + "天前";
            }else if(hourC >= 1){
                result = "" + parseInt(hourC) + "小时前";
            }else if(minC >= 1){
                result = "" + parseInt(minC) + "分钟前";
            }else
                result = "刚刚";
            return result;
        },
        resetForm:function(obj){
            var form = $(obj).closest('form');
            form[0].reset();
            form.find('.select2me').trigger('change');
            form.find('input[data-initData]').each(function(){
                var initEl = $(this);
                var initVal = initEl.attr('data-initData');
                if('undefined' !== typeof initVal )initEl.attr("value",initVal);
            })
        },
        getFormToken:function(tokenId){
            $.ajax({
                type:"POST",
                url:prc + "/commonController/getToken?T=" + new Date().getTime(),
                async:false,
                cache:false,
                dataType:"json",
                success:function(result){
                    if(result){
                        // 给token赋值
                        $(tokenId).val(result.token);
                    }
                }
            });
        },
        getUUID:function(primaryKeyId){
            $.ajax({
                type:"POST",
                url:prc + "/commonController/getUUID?T=" + new Date().getTime(),
                async:false,
                cache:false,
                dataType:"json",
                success:function(result){
                    if(result){
                        // 给token赋值
                        $(primaryKeyId).val(result.uuid);
                    }
                }
            });
        },
        setWorkFlowTab:function(businessKey,processInstanceId,taskDefinitionKey,taskId,startLink,endLink,taskflag){
            var paras = "?businessKey="+businessKey+"&processInstanceId="+processInstanceId+"&taskDefinitionKey="+taskDefinitionKey+
                        "&taskId="+taskId+"&startLink="+startLink+"&endLink="+endLink+"&taskflag="+taskflag;
            $.ajax({
                type:"POST",
                url:prc + "/commonController/getWorkFlowTab?T=" + new Date().getTime(),
                data:{businessKey:businessKey,
                    taskDefinitionKey:taskDefinitionKey,
                    taskflag:taskflag},
                async:false,
                cache:false,
                dataType:"json",
                success:function(result){
                    if(result){
                        $.each(result, function(i, item) {
                            addCustomTab({"title":item.TAB_NAME,"url":item.TAB_URL+paras});
                        });
                    }
                }
            });
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
         * 评价星星
         * options.el string  显示星星的容器
         * options.counts number 星星的数量 ,须为正整数
         * options.onChange(target) 当评价修改时执行的回调
         * 
         * 初始化赋值，为el添加data-value属性，其职为0~counts的值，默认0~5
         * 
         * 方法：
         * getValue,调用方式App.evalStar(el,'getValue');
         * */
        evalStar:function(options,methodName){
            //判断是调用方法还是初始化
            if('string' == typeof options){
                if(methodName == 'getValue'){
                    return getValue(options);
                }
            }
            var el = options.el;
            //初始化星星的数量
            if('undefined' == typeof options.counts || 'number' != typeof options.counts){
                options.counts = 5;
            }else if(options.counts < 0){
                options.counts = 5;
            }
            
            if(el == undefined) return false;
            //初始化星星
            var $ul = $('<ul class="evalStar-list list-inline list-unstyled"></ul>');
            for (var i=0;i<options.counts;i++) {
                $ul.append('<li class="font-default" title="'+(i+1)+'星"><i class="iconfont icon-xing"></i></li>');
            };
            var hiddenClass= el.substr(1)+'Value';
            $(el).each(function(index,elObj){
                $(elObj).append($ul.clone());
                var $hiddenText = $('<input type="hidden" name="evalStarValue'+index+'" value="0" class="'+hiddenClass+'">');
                $(elObj).append($hiddenText);
                var initValue = $(elObj).data('value');
                if('undefined' != typeof initValue){
                    initValue = parseInt(initValue);
                    if(initValue >= 0 && initValue <= options.counts){
                        $(elObj).find('li:not(:gt('+(initValue-1)+'))').removeClass('font-default').addClass('font-yellow');
                        $(elObj).find('input').val(initValue);
                    }
                }
            });
            $(el).off('click','.icon-xing').on('click','.icon-xing',function(){
                var iconObj = $(this).parent('li');
                var iconIndex = iconObj.index();
                var plist = $(this).closest('.evalStar-list');
                var pwrapper = $(this).closest(el);
                plist.find('li:not(:gt('+iconIndex+'))').removeClass('font-default').addClass('font-yellow');
                plist.find('li:gt('+iconIndex+')').removeClass('font-yellow').addClass('font-default');
                pwrapper.find('.'+hiddenClass).val(iconIndex+1);
                //执行改变回调
                if('function' == typeof options.onChange){
                    options.onChange(iconIndex,iconObj);
                }
            })
            
            function getValue(el){
                var getValue;
                if($(el).length > 1){
                    getValue = new Array();
                    $(el).each(function(){
                        getValue.push($(this).find(el+'Value').val());
                    })
                }else{
                    getValue = $(el).find(el+'Value').val()
                }
                return getValue;
            }
        },
        focusInvalidForm:function(e){
            var validator = $(e.target || e.srcElement).data('bootstrapValidator');
            var inValidForms = validator.getInvalidFields();
            if(inValidForms.length > 0){
                var firstForm = inValidForms[0];
                var firstForm_top = $(firstForm).offset().top;
                var scrollLength = 40 - firstForm_top;
                var fieldsetWrapper = $(firstForm).closest('.form-fieldset');
                var domWrapper = $(firstForm).closest('.modal');
                var pageContentWrapper = $(firstForm).closest('.page-content');
                var fieldSetFlag = false;
                if(fieldsetWrapper.length > 0){
                    var $parFieldsetBody = fieldsetWrapper.find('.form-fieldset-body');
                    if($parFieldsetBody.is(':hidden')){
                        fieldSetFlag = true;
                        fieldsetWrapper.find('.form-collapse').trigger('click');
                    }
                }
                //如果有表单面板的折叠，需要延迟200ms，当面板展开以后处理滚动
                setTimeout(function(){
                    if(domWrapper.length > 0){
                        domWrapper.scrollTop(scrollLength);
                    }else if(pageContentWrapper.length > 0){
                        pageContentWrapper.scrollTop(scrollLength);
                    }else{
                        $(body).scrollTop(scrollLength);
                    }
                    $(firstForm).focus();
                },fieldSetFlag?200:0);
            }
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
        }
    };
    
}();

jQuery(document).ready(function(){
    $.fn.modal.Constructor.prototype.enforceFocus = function () {};
    //监听input框的enter键，禁止默认的提交表单
    $('body').on('keypress',':text',function(e){
        if(e.keyCode == 13){
            e.stopPropagation();
            e.preventDefault();
            return false;
        }
    })
    App.init();
});
