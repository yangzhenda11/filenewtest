!function(t){"use strict";t.extend(t.fn.bootstrapTable.defaults,{autoRefresh:!1,autoRefreshInterval:60,autoRefreshSilent:!0,autoRefreshStatus:!0,autoRefreshFunction:null}),t.extend(t.fn.bootstrapTable.defaults.icons,{autoRefresh:"glyphicon-time icon-time"}),t.extend(t.fn.bootstrapTable.locales,{formatAutoRefresh:function(){return"Auto Refresh"}}),t.extend(t.fn.bootstrapTable.defaults,t.fn.bootstrapTable.locales);var o=t.fn.bootstrapTable.Constructor,e=o.prototype.init,s=o.prototype.initToolbar,n=t.fn.bootstrapTable.utils.sprintf;o.prototype.init=function(){if(e.apply(this,Array.prototype.slice.apply(arguments)),this.options.autoRefresh&&this.options.autoRefreshStatus){var t=this;this.options.autoRefreshFunction=setInterval(function(){t.refresh({silent:t.options.autoRefreshSilent})},1e3*this.options.autoRefreshInterval)}},o.prototype.initToolbar=function(){if(s.apply(this,Array.prototype.slice.apply(arguments)),this.options.autoRefresh){var o=this.$toolbar.find(">.btn-group"),e=o.find(".auto-refresh");e.length||(e=t([n('<button class="btn btn-default auto-refresh %s" ',this.options.autoRefreshStatus?"enabled":""),'type="button" ',n('title="%s">',this.options.formatAutoRefresh()),n('<i class="%s %s"></i>',this.options.iconsPrefix,this.options.icons.autoRefresh),"</button>"].join("")).appendTo(o),e.on("click",t.proxy(this.toggleAutoRefresh,this)))}},o.prototype.toggleAutoRefresh=function(){if(this.options.autoRefresh){if(this.options.autoRefreshStatus)clearInterval(this.options.autoRefreshFunction),this.$toolbar.find(">.btn-group").find(".auto-refresh").removeClass("enabled");else{var t=this;this.options.autoRefreshFunction=setInterval(function(){t.refresh({silent:t.options.autoRefreshSilent})},1e3*this.options.autoRefreshInterval),this.$toolbar.find(">.btn-group").find(".auto-refresh").addClass("enabled")}this.options.autoRefreshStatus=!this.options.autoRefreshStatus}}}(jQuery);