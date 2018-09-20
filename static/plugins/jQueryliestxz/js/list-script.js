(function($){
	$.fn.initSelectList = function(opts){
		opts = $.extend({}, opts);

		var selectTitle = $(this);

		/**
		 * 单击列表单击: 改变样式
		 */
		var itemClickHandler = function(){
			if($(this).hasClass('selected-item')){
				$(this).removeClass('selected-item');
			} else{
				$(this).addClass('selected-item');
			}
		}

		/**
		 * 左边列表项移至右边
		 */
		var leftMoveRight = function(){
			selectTitle.find('.list-body .right-box').append($(this).removeClass('selected-item'));
			initItemEvent();
		}

		/**
		 * 右边列表项移至左边
		 */
		var rightMoveLeft = function(){
			selectTitle.find('.list-body .left-box').append($(this).removeClass('selected-item'));
			initItemEvent();
		}
		
		/**
		 * 上移列表
		 */
		var rightMoveUp = function(){
			var e = $("#_selectRCon").find('.selected-item')
			if(0 == e.length){
				layer.msg("请先在右侧列表中选择要移动的内容");
			}else if(e.length > 1){
				layer.msg("只能移动一条数据");
			}else{
                var beforDom = e.prev("li");
                if (beforDom.length > 0) {
                    beforDom.before(e);
                }
			}
		}

		/**
		 * 下移列表
		 */
		var rightMoveDown = function(){
			var e = $("#_selectRCon").find('.selected-item')
			if(0 == e.length){
				layer.msg("请先在右侧列表中选择要移动的内容");
			}else if(e.length > 1){
				layer.msg("只能移动一条数据");
			}else{
				var afterDom = e.next("li");
                if (afterDom.length > 0) {
                    afterDom.after(e);
                }
			}
		}
		/**
		 * 初始化列表项选择事件
		 */
		function initItemEvent(){
			// 左边列表项单击、双击事件
			selectTitle.find('.list-body .left-box').find('.item').unbind('click');
			selectTitle.find('.list-body .left-box').find('.item').unbind('dblclick');
			selectTitle.find('.list-body .left-box').find('.item').each(function(){
				$(this).on("click", itemClickHandler);
//				if(!!opts.openDblClick){
				$(this).on('dblclick', leftMoveRight);	
//				}
			});

			// 右边列表项单击、双击事件
			selectTitle.find('.list-body .right-box').find('.item').unbind('click');
			selectTitle.find('.list-body .right-box').find('.item').unbind('dblclick');
			selectTitle.find('.list-body .right-box').find('.item').each(function(){
				$(this).on('click', itemClickHandler);
//				if(!!opts.openDblClick){
				$(this).on('dblclick', rightMoveLeft);
//				}
			});
		}

		/**
		 * 初始化添加、移除、获取值按钮事件
		 */
		function initBtnEvent(){
			var btnBox = selectTitle.find('.list-body .center-box');
			var leftBox = selectTitle.find('.list-body .left-box');
			var rightBox = selectTitle.find('.list-body .right-box');

			// 添加一项
			btnBox.find('.add-one').on('click', function(){
				rightBox.append(leftBox.find('.selected-item').removeClass('selected-item'));
			});
			// 添加所有项
			btnBox.find('.add-all').on('click', function(){
				rightBox.append(leftBox.find('.item').removeClass('selected-item'));
			});
			// 移除一项
			btnBox.find('.remove-one').on('click', function(){
				leftBox.append(rightBox.find('.selected-item').removeClass('selected-item'));
			});
			// 移除所有项
			btnBox.find('.remove-all').on('click', function(){
				leftBox.append(rightBox.find('.item').removeClass('selected-item'));
			});
			// 上移
			btnBox.find('.selectLR-up').on('click', function(){
				rightMoveUp();
			});
			// 下移
			btnBox.find('.selectLR-down').on('click', function(){
				rightMoveDown();
			});
		}

		initItemEvent();
		initBtnEvent();

//		if(!!opts.openDrag){
//			$('.item-box').sortable({
//				placeholder: 'item-placeholder',
//				connectWith: '.item-box',
//				revert: true
//			}).droppable({
//				accept: '.item',
//				hoverClass: 'item-box-hover',
//				drop: function(event, ui){
//					setTimeout(function(){
//						ui.draggable.removeClass('selected-item');
//					}, 500);
//				}
//			}).disableSelection();
//		}
	}
})($);
(function($) {
	$.initSelectLRFn = function(e) {
		e = $.extend({
			title: "选择",
			leftTitle: "可选择列",
			rightTitle: "已选择列",
			modalId: "#commomModal",
			fluctuation: true
		}, e);
		$(e.modalId).load("/static/data/_selectLR.html",function(){
			if(e.fluctuation){
				$("#selectLRContent").find(".add-all,.remove-all").remove();
			}else{
				$("#selectLRContent").find(".selectLR-up,.selectLR-down").remove();
			};
			$.each(e.data, function(k,v) {
				if(v.checked == true){
					$("#_selectRCon").append('<li class="item" data-id="'+v.id+'">'+v.data+'</li>');
				}else{
					$("#_selectLCon").append('<li class="item" data-id="'+v.id+'">'+v.data+'</li>');
				}
			});
			$('#selectLRContent').initSelectList();
			$(e.modalId).modal("show");
		});
	}
})(jQuery);

(function($) {
	$.getSelectLRData = function(d,e) {
		try{
			var rightBox = $("#selectLRContent").find('.right-box');
			var itemValues = [];
			var itemValue;

			rightBox.find('.item').each(function(){
				itemValue = {
					id: $(this).attr('data-id'),
					data: $(this).text()
				};
				itemValues.push(itemValue);
			});
			returnSelectLRData(itemValues)
		}catch(e){}
	}
})(jQuery);