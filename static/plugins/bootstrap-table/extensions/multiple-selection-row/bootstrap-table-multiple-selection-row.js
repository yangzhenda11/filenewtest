!function(t){"use strict";document.onselectstart=function(){return!1};var e=function(e){return e=t(e),e.is("table")?e:e.parents().find(".table")},o=function(e){return e=t(e),e.parent().parent()},l=function(t){var o=e(t.currentTarget);window.event.ctrlKey&&n(t.currentTarget,o,!1,!1),0===window.event.button&&(window.event.ctrlKey||window.event.shiftKey||(a(o),n(t.currentTarget,o,!1,!1)),window.event.shiftKey&&i([o.bootstrapTable("getOptions").multipleSelectRowLastSelectedRow.rowIndex,t.currentTarget.rowIndex],o))},s=function(t){var l=e(t.currentTarget);a(l),n(o(t.currentTarget),l,!1,!1)},n=function(e,o,l,s){l?(e=t(e),o.bootstrapTable("getOptions").multipleSelectRowLastSelectedRow=void 0,e.removeClass(o.bootstrapTable("getOptions").multipleSelectRowCssClass),o.bootstrapTable("uncheck",e.data("index"))):(o.bootstrapTable("getOptions").multipleSelectRowLastSelectedRow=e,e=t(e),s?(e.addClass(o.bootstrapTable("getOptions").multipleSelectRowCssClass),o.bootstrapTable("check",e.data("index"))):e.hasClass(o.bootstrapTable("getOptions").multipleSelectRowCssClass)?(e.removeClass(o.bootstrapTable("getOptions").multipleSelectRowCssClass),o.bootstrapTable("uncheck",e.data("index"))):(e.addClass(o.bootstrapTable("getOptions").multipleSelectRowCssClass),o.bootstrapTable("check",e.data("index"))))},i=function(t,e){t.sort(function(t,e){return t-e});for(var o=t[0];o<=t[1];o++)n(e.bootstrapTable("getOptions").multipleSelectRowRows[o-1],e,!1,!0)},a=function(t){for(var e=0;e<t.bootstrapTable("getOptions").multipleSelectRowRows.length;e++)n(t.bootstrapTable("getOptions").multipleSelectRowRows[e],t,!0,!1)};t.extend(t.fn.bootstrapTable.defaults,{multipleSelectRow:!1,multipleSelectRowCssClass:"multiple-select-row-selected",multipleSelectRowLastSelectedRow:void 0,multipleSelectRowRows:[]});{var p=t.fn.bootstrapTable.Constructor,r=p.prototype.init;p.prototype.initBody}p.prototype.init=function(){if(this.options.multipleSelectRow){var t=this;this.options.multipleSelectRowLastSelectedRow=void 0,this.options.multipleSelectRowRows=[],this.$el.on("post-body.bs.table",function(){setTimeout(function(){t.options.multipleSelectRowRows=t.$body.children(),t.options.multipleSelectRowRows.click(l),t.options.multipleSelectRowRows.find("input[type=checkbox]").change(s)},1)})}r.apply(this,Array.prototype.slice.apply(arguments))},p.prototype.clearAllMultipleSelectionRow=function(){a(this)},t.fn.bootstrapTable.methods.push("clearAllMultipleSelectionRow")}(jQuery);