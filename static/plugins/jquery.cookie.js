!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(e){function n(e){return t.raw?e:decodeURIComponent(e.replace(i," "))}function o(e){0===e.indexOf('"')&&(e=e.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,"\\")),e=n(e);try{return t.json?JSON.parse(e):e}catch(o){}}var i=/\+/g,t=e.cookie=function(i,r,a){if(void 0!==r){if(a=e.extend({},t.defaults,a),"number"==typeof a.expires){var c=a.expires,d=a.expires=new Date;d.setDate(d.getDate()+c)}return r=t.json?JSON.stringify(r):String(r),document.cookie=[t.raw?i:encodeURIComponent(i),"=",t.raw?r:encodeURIComponent(r),a.expires?"; expires="+a.expires.toUTCString():"",a.path?"; path="+a.path:"",a.domain?"; domain="+a.domain:"",a.secure?"; secure":""].join("")}for(var f=document.cookie.split("; "),p=i?void 0:{},u=0,s=f.length;s>u;u++){var m=f[u].split("="),x=n(m.shift()),l=m.join("=");if(i&&i===x){p=o(l);break}i||(p[x]=o(l))}return p};t.defaults={},e.removeCookie=function(n,o){return void 0!==e.cookie(n)?(e.cookie(n,"",e.extend({},o,{expires:-1})),!0):!1}});