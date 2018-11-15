$(function() {
	$(".J_menuItem").each(function(k) {
		if(!$(this).attr("data-index")) {
			$(this).attr("data-index", k)
		}
	});
	$('#actionUl').on('click','.J_menuItem',conTabC);
	$(".J_menuTabs").on("click", ".J_menuTab i", conTabH);
	$(".J_menuTabs").on("click", ".J_menuTab", conTabE);
	$(".J_menuTabs").bind("contextmenu", function(){
	    return false;
	})
//	$(".J_menuTabs").on("dblclick", ".J_menuTab", conTabD);
	$(".J_tabLeft").on("click", conTabA);
	$(".J_tabRight").on("click", conTabB);
	$(".J_tabCloseAll").on("click", function() {
		$(".page-tabs-content").children("[data-id]").not(":first").each(function() {
			$('.J_iframe[data-id="' + $(this).data("id") + '"]').remove();
			$(this).remove()
		});
		$(".page-tabs-content").children("[data-id]:first").each(function() {
			$('.J_iframe[data-id="' + $(this).data("id") + '"]').show();
			$(this).addClass("active")
		});
		$(".page-tabs-content").css("margin-left", "0")
	});
	$('.J_tabRefresh').click(function() {
		var $targetFrame = $('.J_iframe:visible');
		$targetFrame.attr('src', $targetFrame.attr('src'))
	})
	$(".J_tabCloseOther").on("click", conTabI);
//	$(".J_tabShowActive").on("click", conTabJ);
});

function getItemWidth(l) {
	var k = 0;
	$(l).each(function() {
		k += $(this).outerWidth(true)
	});
	return k
}

function animateTab(n) {
	var o = getItemWidth($(n).prevAll()),
		q = getItemWidth($(n).nextAll());
	var l = getItemWidth($(".content-tabs").children().not(".J_menuTabs"));
	var k = $(".content-tabs").outerWidth(true) - l;
	var p = 0;
	if($(".page-tabs-content").outerWidth() < k) {
		p = 0
	} else {
		if(q <= (k - $(n).outerWidth(true) - $(n).next().outerWidth(true))) {
			if((k - $(n).next().outerWidth(true)) > q) {
				p = o;
				var m = n;
				while((p - $(m).outerWidth()) > ($(".page-tabs-content").outerWidth() - k)) {
					p -= $(m).prev().outerWidth();
					m = $(m).prev()
				}
			}
		} else {
			if(o > (k - $(n).outerWidth(true) - $(n).prev().outerWidth(true))) {
				p = o - $(n).prev().outerWidth(true)
			}
		}
	}
	$(".page-tabs-content").animate({
		marginLeft: 0 - p + "px"
	}, "fast")
}

function conTabA() {
	var o = Math.abs(parseInt($(".page-tabs-content").css("margin-left")));
	var l = getItemWidth($(".content-tabs").children().not(".J_menuTabs"));
	var k = $(".content-tabs").outerWidth(true) - l;
	var p = 0;
	if($(".page-tabs-content").width() < k) {
		return false
	} else {
		var m = $(".J_menuTab:first");
		var n = 0;
		while((n + $(m).outerWidth(true)) <= o) {
			n += $(m).outerWidth(true);
			m = $(m).next()
		}
		n = 0;
		if(getItemWidth($(m).prevAll()) > k) {
			while((n + $(m).outerWidth(true)) < (k) && m.length > 0) {
				n += $(m).outerWidth(true);
				m = $(m).prev()
			}
			p = getItemWidth($(m).prevAll())
		}
	}
	$(".page-tabs-content").animate({
		marginLeft: 0 - p + "px"
	}, "fast")
}

function conTabB() {
	var o = Math.abs(parseInt($(".page-tabs-content").css("margin-left")));
	var l = getItemWidth($(".content-tabs").children().not(".J_menuTabs"));
	var k = $(".content-tabs").outerWidth(true) - l;
	var p = 0;
	if($(".page-tabs-content").width() < k) {
		return false
	} else {
		var m = $(".J_menuTab:first");
		var n = 0;
		while((n + $(m).outerWidth(true)) <= o) {
			n += $(m).outerWidth(true);
			m = $(m).next()
		}
		n = 0;
		while((n + $(m).outerWidth(true)) < (k) && m.length > 0) {
			n += $(m).outerWidth(true);
			m = $(m).next()
		}
		p = getItemWidth($(m).prevAll());
		if(p > 0) {
			$(".page-tabs-content").animate({
				marginLeft: 0 - p + "px"
			}, "fast")
		}
	}
}
/*
 * 取得角色数量
 */
function checkArrLen(roleArr,permArr){
	var len = 0;
	$.each(roleArr, function(k,v) {
		if(isInArray(permArr,v)){
			len ++;
		}
	});
	return len;
}
/*
 * 点击触发的事件
 */
function conTabC() {
	$("#workItemDom").find("p").removeClass("red");
	var o = $(this).attr("href"),
		m = $(this).data("index"),
		l = $.trim($(this).text()),
		k = true;
	if(o == undefined || $.trim(o).length == 0) {
		return false;
	}
	if(o == "html/incomeWorktable/index/index.html"){
		var roleArr = globalConfig.curRole;
		var roleExistLen = checkArrLen(roleArr,[91216,91217,91218,91219]);
		if(roleExistLen != 1){
			layer.alert("当前岗位配置了 <span style='color:red'>"+roleExistLen+"</span> 个收入类租线业务合同履行工作台查看角色，请联系系统管理员处理。",{icon:2});
			return false;
		}else if(isInArray(roleArr, 91218)){
			if(globalConfig.dataPermission == 0 || globalConfig.dataPermission == 1 || globalConfig.dataPermission == 4){
				layer.alert("当前稽核管理角色权限范围不足，请联系系统管理员处理。",{icon:2});
				return false;
			}
		}
	};
	if(o == "html/expenseWorktable/index/index.html"){
		var roleArr = globalConfig.curRole;
		var roleExistLen = checkArrLen(roleArr,[91220,91221,91222]);
		if(roleExistLen != 1){
			layer.alert("当前岗位配置了 <span style='color:red'>"+roleExistLen+"</span> 个支出类采购业务合同履行工作台查看角色，请联系系统管理员处理。",{icon:2});
			return false;
		};
	};
	$(".J_menuTab").each(function() {
		if($(this).data("id") == o) {
			if(!$(this).hasClass("active")) {
				$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
				animateTab(this);
				$(".J_mainContent .J_iframe").each(function() {
					if($(this).data("id") == o) {
						$(this).show().siblings(".J_iframe").hide();
						var dataTablesDom = $(this).contents().find(".dataTables_scrollHeadInner")[0];
						if(dataTablesDom){
							var dataTablesDomParent = $(dataTablesDom).parent();
							if($(dataTablesDom).css("width") != dataTablesDomParent.css("width")){
								var parentName = $(this)[0].id;
								var tableId = $(dataTablesDom).parents(".dataTables_wrapper")[0].id.split("_")[0];
								$("#"+parentName+"")[0].contentWindow.$('#'+tableId+'').DataTable().draw();
							}
						};
						return false
					}
				})
			}
			k = false;
			return false;
		}
	});
	if(k) {
		var p = '<a href="javascript:;" class="active J_menuTab" data-id="' + o + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
		$(".J_menuTab").removeClass("active");
		var n = '<iframe scrolling="no" class="J_iframe" id="iframe' + m + '" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + o + '" seamless></iframe>';
		$(".J_mainContent").find("iframe.J_iframe").hide();
		$(".J_mainContent").append(n);
		$(".J_menuTabs .page-tabs-content").append(p);
		animateTab($(".J_menuTab.active"))
	}
	return false;
}
/*
 * 系统打开新tab页
 * link：页面地址，可在？后加参数
 * title：tab页标题
 * isParam：是否包含参数匹配，默认为false。true时将配置全部路径包括？后的参数
 * isRefresh：若页面存在是否要刷新页面，默认为true
 * isFixed：若页面存在打开页面时在tab页之后显示（默认在tab页最后显示）还是定位到原来的位置
 */
function showSubpageTab(link,title,isParam,isRefresh,isFixed){
	globalConfig.ifreamLen++;
	var o = link?link:'',
		l = title?title:'',
		m = "Y" + globalConfig.ifreamLen,
		k = true;
	if(o == undefined || $.trim(o).length == 0) {
		return false
	};
	if(isParam){
		var dataId = o;
	}else{
		var dataId = o.split('?')[0];
	};
	$(".J_menuTab").each(function() {
		if($(this).data("id") == dataId) {
			if(!$(this).hasClass("active")) {
				$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
				if(isFixed){
					animateTab(this);
				}else{
					var newDom = $(this);
					$(this).remove();
					$(".J_menuTabs .page-tabs-content").append(newDom);
					animateTab($(".J_menuTab.active"))
				};
				$(".J_mainContent .J_iframe").each(function() {
					if($(this).data("id") == dataId) {
						$(this).show().siblings(".J_iframe").hide();
						if(isRefresh){
							$(this)[0].src = o;
						};
						return false
					}
				})
			}else{
				if(isRefresh){
					$(".J_mainContent .J_iframe").each(function() {
						if($(this).data("id") == dataId) {
							$(this)[0].src = o;
							return false
						}
					})
				}
			}
			k = false;
			return false
		}
	});
	if(k) {
		var p = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataId + '">' + l + ' <i class="fa fa-times-circle"></i></a>';
		$(".J_menuTab").removeClass("active");
		var n = '<iframe scrolling="no" class="J_iframe" id="iframe' + m + '" name="iframe' + m + '" width="100%" height="100%" src="' + o + '" frameborder="0" data-id="' + dataId + '" seamless></iframe>';
		$(".J_mainContent").find("iframe.J_iframe").hide();
		$(".J_mainContent").append(n);
		$(".J_menuTabs .page-tabs-content").append(p);
		animateTab($(".J_menuTab.active"))
	}
	return false
}
function conTabH() {
	var m = $(this).parents(".J_menuTab").data("id");
	var l = $(this).parents(".J_menuTab").width();
	if($(this).parents(".J_menuTab").hasClass("active")) {
		if($(this).parents(".J_menuTab").next(".J_menuTab").size()) {
			var k = $(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").data("id");
			$(this).parents(".J_menuTab").next(".J_menuTab:eq(0)").addClass("active");
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == k) {
					$(this).show().siblings(".J_iframe").hide();
					return false
				}
			});
			var n = parseInt($(".page-tabs-content").css("margin-left"));
			if(n < 0) {
				$(".page-tabs-content").animate({
					marginLeft: (n + l) + "px"
				}, "fast")
			}
			$(this).parents(".J_menuTab").remove();
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == m) {
					App.deleteCache($(this).attr("id"));
					$(this).remove();
					return false
				}
			})
		}
		if($(this).parents(".J_menuTab").prev(".J_menuTab").size()) {
			var k = $(this).parents(".J_menuTab").prev(".J_menuTab:last").data("id");
			$(this).parents(".J_menuTab").prev(".J_menuTab:last").addClass("active");
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == k) {
					$(this).show().siblings(".J_iframe").hide();
					return false
				}
			});
			$(this).parents(".J_menuTab").remove();
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == m) {
					App.deleteCache($(this).attr("id"));
					$(this).remove();
					return false
				}
			})
		}
	} else {
		$(this).parents(".J_menuTab").remove();
		$(".J_mainContent .J_iframe").each(function() {
			if($(this).data("id") == m) {
				App.deleteCache($(this).attr("id"));
				$(this).remove();
				return false
			}
		});
		animateTab($(".J_menuTab.active"))
	}
	return false
}
function conTabI() {
	$(".page-tabs-content").children("[data-id]").not(":first").not(".active").each(function() {
		$('.J_iframe[data-id="' + $(this).data("id") + '"]').remove();
		$(this).remove()
	});
	$(".page-tabs-content").css("margin-left", "0")
}

function conTabJ() {
	animateTab($(".J_menuTab.active"))
}
function closeIfreamSelf(dataId){
	var selfDom = null;
	$("#mainPageTabsContent .J_menuTab").each(function(k,v){
		if(dataId == $(v).data("id")){
			selfDom = $(v);
		}
	});
	var l = selfDom.width();
	if(selfDom.hasClass("active")) {
		if(selfDom.next(".J_menuTab").size()) {
			var k = selfDom.next(".J_menuTab:eq(0)").data("id");
			selfDom.next(".J_menuTab:eq(0)").addClass("active");
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == k) {
					$(this).show().siblings(".J_iframe").hide();
					return false
				}
			});
			var n = parseInt($(".page-tabs-content").css("margin-left"));
			if(n < 0) {
				$(".page-tabs-content").animate({
					marginLeft: (n + l) + "px"
				}, "fast")
			}
			selfDom.remove();
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == dataId) {
					App.deleteCache($(this).attr("id"));
					$(this).remove();
					return false
				}
			})
		}
		if(selfDom.prev(".J_menuTab").size()) {
			var k = selfDom.prev(".J_menuTab:last").data("id");
			selfDom.prev(".J_menuTab:last").addClass("active");
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == k) {
					$(this).show().siblings(".J_iframe").hide();
					return false
				}
			});
			selfDom.remove();
			$(".J_mainContent .J_iframe").each(function() {
				if($(this).data("id") == dataId) {
					App.deleteCache($(this).attr("id"));
					$(this).remove();
					return false
				}
			})
		}
	} else {
		selfDom.remove();
		$(".J_mainContent .J_iframe").each(function() {
			if($(this).data("id") == dataId) {
				App.deleteCache($(this).attr("id"));
				$(this).remove();
				return false
			}
		});
		animateTab($(".J_menuTab.active"))
	}
	return false
}

function conTabE() {
	if(!$(this).hasClass("active")) {
		var k = $(this).data("id");
		$(".J_mainContent .J_iframe").each(function() {
			if($(this).data("id") == k) {
				$(this).show().siblings(".J_iframe").hide();
				var dataTablesDom = $(this).contents().find(".dataTables_scrollHeadInner")[0];
				if(dataTablesDom){
					var dataTablesDomParent = $(dataTablesDom).parent();
					if($(dataTablesDom).css("width") != dataTablesDomParent.css("width")){
						var parentName = $(this)[0].id;
						var tableId = $(dataTablesDom).parents(".dataTables_wrapper")[0].id.split("_")[0];
	$("#"+parentName+"")[0].contentWindow.$('#'+tableId+'').DataTable().draw();
					}
				};
				return false
			}
		});
		$(this).addClass("active").siblings(".J_menuTab").removeClass("active");
		animateTab(this)
	}
}
//function conTabD() {
//	var l = $('.J_iframe[data-id="' + $(this).data("id") + '"]');
//	var k = l.attr("src")
//}