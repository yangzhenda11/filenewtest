!function(o){"use strict";var t={sortOrder:"bs.table.sortOrder",sortName:"bs.table.sortName",pageNumber:"bs.table.pageNumber",pageList:"bs.table.pageList",columns:"bs.table.columns",searchText:"bs.table.searchText",filterControl:"bs.table.filterControl"},e=function(o){var t=o.$header;return o.options.height&&(t=o.$tableHeader),t},i=function(o){var t="select, input";return o.options.height&&(t="table select, table input"),t},r=function(){return!!navigator.cookieEnabled},s=function(o,t){for(var e=-1,i=0;i<t.length;i++)if(o.toLowerCase()===t[i].toLowerCase()){e=i;break}return e},n=function(o,t,e){if(o.options.cookie&&r()&&""!==o.options.cookieIdTable&&-1!==s(t,o.options.cookiesEnabled)){switch(t=o.options.cookieIdTable+"."+t,o.options.cookieStorage){case"cookieStorage":document.cookie=[t,"=",e,"; expires="+o.options.cookieExpire,o.options.cookiePath?"; path="+o.options.cookiePath:"",o.options.cookieDomain?"; domain="+o.options.cookieDomain:"",o.options.cookieSecure?"; secure":""].join("");break;case"localStorage":localStorage.setItem(t,e);break;case"sessionStorage":sessionStorage.setItem(t,e);break;default:return!1}return!0}},a=function(o,t,e){if(!e)return null;if(-1===s(e,o.options.cookiesEnabled))return null;switch(e=t+"."+e,o.options.cookieStorage){case"cookieStorage":return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"+encodeURIComponent(e).replace(/[\-\.\+\*]/g,"\\$&")+"\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1"))||null;case"localStorage":return localStorage.getItem(e);case"sessionStorage":return sessionStorage.getItem(e);default:return null}},p=function(o,t,e){switch(e=t+"."+e,o.options.cookieStorage){case"cookieStorage":document.cookie=[encodeURIComponent(e),"=","; expires=Thu, 01 Jan 1970 00:00:00 GMT",o.options.cookiePath?"; path="+o.options.cookiePath:"",o.options.cookieDomain?"; domain="+o.options.cookieDomain:""].join("");break;case"localStorage":localStorage.removeItem(e);break;case"sessionStorage":sessionStorage.removeItem(e)}return!0},l=function(r){setTimeout(function(){var s=JSON.parse(a(r,r.options.cookieIdTable,t.filterControl));if(!r.options.filterControlValuesLoaded&&s){r.options.filterControlValuesLoaded=!0;var n={},p=e(r),l=i(r),c=function(t,e){o(e).each(function(e,i){o(t).val(i.text),n[i.field]=i.text})};p.find(l).each(function(){var t=o(this).closest("[data-field]").data("field"),e=o.grep(s,function(o){return o.field===t});c(this,e)}),r.initColumnSearch(n)}},250)};o.extend(o.fn.bootstrapTable.defaults,{cookie:!1,cookieExpire:"2h",cookiePath:null,cookieDomain:null,cookieSecure:null,cookieIdTable:"",cookiesEnabled:["bs.table.sortOrder","bs.table.sortName","bs.table.pageNumber","bs.table.pageList","bs.table.columns","bs.table.searchText","bs.table.filterControl"],cookieStorage:"cookieStorage",filterControls:[],filterControlValuesLoaded:!1}),o.fn.bootstrapTable.methods.push("getCookies"),o.fn.bootstrapTable.methods.push("deleteCookie"),o.extend(o.fn.bootstrapTable.utils,{setCookie:n,getCookie:a});var c=o.fn.bootstrapTable.Constructor,u=c.prototype.init,h=c.prototype.initTable,b=c.prototype.initServer,g=c.prototype.onSort,f=c.prototype.onPageNumber,y=c.prototype.onPageListChange,m=c.prototype.onPageFirst,d=c.prototype.onPagePre,k=c.prototype.onPageNext,C=c.prototype.onPageLast,S=c.prototype.toggleColumn,N=c.prototype.selectPage,T=c.prototype.onSearch;c.prototype.init=function(){if(this.options.filterControls=[],this.options.filterControlValuesLoaded=!1,this.options.cookiesEnabled="string"==typeof this.options.cookiesEnabled?this.options.cookiesEnabled.replace("[","").replace("]","").replace(/ /g,"").toLowerCase().split(","):this.options.cookiesEnabled,this.options.filterControl){var o=this;this.$el.on("column-search.bs.table",function(e,i,r){for(var s=!0,a=0;a<o.options.filterControls.length;a++)if(o.options.filterControls[a].field===i){o.options.filterControls[a].text=r,s=!1;break}s&&o.options.filterControls.push({field:i,text:r}),n(o,t.filterControl,JSON.stringify(o.options.filterControls))}).on("post-body.bs.table",l(o))}u.apply(this,Array.prototype.slice.apply(arguments))},c.prototype.initServer=function(){var e=this,i=[],r=function(o){return o.filterControl&&"select"===o.filterControl},s=function(o){return o.filterData&&"column"!==o.filterData},n=function(){var o=JSON.parse(a(e,e.options.cookieIdTable,t.filterControl));return e.options.cookie&&o};i=o.grep(e.columns,function(o){return r(o)&&!s(o)}),c.prototype.initServer=b,this.options.filterControl&&n()&&0===i.length||b.apply(this,Array.prototype.slice.apply(arguments))},c.prototype.initTable=function(){h.apply(this,Array.prototype.slice.apply(arguments)),this.initCookie()},c.prototype.initCookie=function(){if(this.options.cookie){if(""===this.options.cookieIdTable||""===this.options.cookieExpire||!r())throw new Error("Configuration error. Please review the cookieIdTable, cookieExpire properties, if those properties are ok, then this browser does not support the cookies");var e=a(this,this.options.cookieIdTable,t.sortOrder),i=a(this,this.options.cookieIdTable,t.sortName),s=a(this,this.options.cookieIdTable,t.pageNumber),n=a(this,this.options.cookieIdTable,t.pageList),p=JSON.parse(a(this,this.options.cookieIdTable,t.columns)),l=a(this,this.options.cookieIdTable,t.searchText);this.options.sortOrder=e?e:this.options.sortOrder,this.options.sortName=i?i:this.options.sortName,this.options.pageNumber=s?+s:this.options.pageNumber,this.options.pageSize=n?n===this.options.formatAllRows()?n:+n:this.options.pageSize,this.options.searchText=l?l:"",p&&o.each(this.columns,function(t,e){e.visible=-1!==o.inArray(e.field,p)})}},c.prototype.onSort=function(){g.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.sortOrder,this.options.sortOrder),n(this,t.sortName,this.options.sortName)},c.prototype.onPageNumber=function(){f.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageNumber,this.options.pageNumber)},c.prototype.onPageListChange=function(){y.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageList,this.options.pageSize)},c.prototype.onPageFirst=function(){m.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageNumber,this.options.pageNumber)},c.prototype.onPagePre=function(){d.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageNumber,this.options.pageNumber)},c.prototype.onPageNext=function(){k.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageNumber,this.options.pageNumber)},c.prototype.onPageLast=function(){C.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageNumber,this.options.pageNumber)},c.prototype.toggleColumn=function(){S.apply(this,Array.prototype.slice.apply(arguments));var e=[];o.each(this.columns,function(o,t){t.visible&&e.push(t.field)}),n(this,t.columns,JSON.stringify(e))},c.prototype.selectPage=function(o){N.apply(this,Array.prototype.slice.apply(arguments)),n(this,t.pageNumber,o)},c.prototype.onSearch=function(){var e=Array.prototype.slice.apply(arguments);T.apply(this,e),o(e[0].currentTarget).parent().hasClass("search")&&n(this,t.searchText,this.searchText)},c.prototype.getCookies=function(){var e=this,i={};return o.each(t,function(o,t){i[o]=a(e,e.options.cookieIdTable,t),"columns"===o&&(i[o]=JSON.parse(i[o]))}),i},c.prototype.deleteCookie=function(o){""!==o&&r()&&p(this,this.options.cookieIdTable,t[o])}}(jQuery);