!function(e){"use strict";var t=function(){Array.prototype.filter||(Array.prototype.filter=function(e){if(void 0===this||null===this)throw new TypeError;var t=Object(this),o=t.length>>>0;if("function"!=typeof e)throw new TypeError;for(var r=[],n=arguments.length>=2?arguments[1]:void 0,i=0;o>i;i++)if(i in t){var s=t[i];e.call(n,s,i,t)&&r.push(s)}return r})};e.extend(e.fn.bootstrapTable.defaults,{reorderableColumns:!1,maxMovingRows:10,onReorderColumn:function(){return!1},dragaccept:null}),e.extend(e.fn.bootstrapTable.Constructor.EVENTS,{"reorder-column.bs.table":"onReorderColumn"});var o=e.fn.bootstrapTable.Constructor,r=o.prototype.initHeader,n=o.prototype.toggleColumn,i=o.prototype.toggleView,s=o.prototype.resetView;o.prototype.initHeader=function(){r.apply(this,Array.prototype.slice.apply(arguments)),this.options.reorderableColumns&&this.makeRowsReorderable()},o.prototype.toggleColumn=function(){n.apply(this,Array.prototype.slice.apply(arguments)),this.options.reorderableColumns&&this.makeRowsReorderable()},o.prototype.toggleView=function(){i.apply(this,Array.prototype.slice.apply(arguments)),this.options.reorderableColumns&&(this.options.cardView||this.makeRowsReorderable())},o.prototype.resetView=function(){s.apply(this,Array.prototype.slice.apply(arguments)),this.options.reorderableColumns&&this.makeRowsReorderable()},o.prototype.makeRowsReorderable=function(){var o=this;try{e(this.$el).dragtable("destroy")}catch(r){}e(this.$el).dragtable({maxMovingRows:o.options.maxMovingRows,dragaccept:o.options.dragaccept,clickDelay:200,beforeStop:function(){var r=[],n=[],i=[],s=[],a=-1,l=[];if(o.$header.find("th").each(function(){r.push(e(this).data("field")),n.push(e(this).data("formatter"))}),r.length<o.columns.length){s=e.grep(o.columns,function(e){return!e.visible});for(var p=0;p<s.length;p++)r.push(s[p].field),n.push(s[p].formatter)}for(var p=0;p<r.length;p++)a=e.fn.bootstrapTable.utils.getFieldIndex(o.columns,r[p]),-1!==a&&(o.columns[a].fieldIndex=p,i.push(o.columns[a]),o.columns.splice(a,1));o.columns=o.columns.concat(i),t(),e.each(o.columns,function(e,t){var r=!1,n=t.field;o.options.columns[0].filter(function(e){return r||e.field!=n?!0:(l.push(e),r=!0,!1)})}),o.options.columns[0]=l,o.header.fields=r,o.header.formatters=n,o.initHeader(),o.initToolbar(),o.initBody(),o.resetView(),o.trigger("reorder-column",r)}})}}(jQuery);