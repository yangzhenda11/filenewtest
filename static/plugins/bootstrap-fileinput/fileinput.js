/*!
 * @copyright Copyright &copy; Kartik Visweswaran, Krajee.com, 2014 - 2015
 * @version 4.1.8
 *
 * File input styled for Bootstrap 3.0 that utilizes HTML5 File Input's advanced 
 * features including the FileReader API. 
 * 
 * The plugin drastically enhances the HTML file input to preview multiple files on the client before
 * upload. In addition it provides the ability to preview content of images, text, videos, audio, html, 
 * flash and other objects. It also offers the ability to upload and delete files using AJAX, and add 
 * files in batches (i.e. preview, append, or remove before upload).
 * 
 * Author: Kartik Visweswaran
 * Copyright: 2015, Kartik Visweswaran, Krajee.com
 * For more JQuery plugins visit http://plugins.krajee.com
 * For more Yii related demos visit http://demos.krajee.com
 */
! function(e) {
	String.prototype.repl = function(e, i) {
		return this.split(e).join(i)
	};
	var i = function(e) {
			var i, t = document.createElement("div");
			return t.innerHTML = "<!--[if IE " + e + "]><i></i><![endif]-->", i = 1 === t.getElementsByTagName("i").length, document.body.appendChild(t), t.parentNode.removeChild(t), i
		},
		t = {
			data: {},
			init: function(e) {
				var i = e.initialPreview,
					a = e.id;
				i.length > 0 && !B(i) && (i = i.split(e.initialPreviewDelimiter)), t.data[a] = {
					content: i,
					config: e.initialPreviewConfig,
					tags: e.initialPreviewThumbTags,
					delimiter: e.initialPreviewDelimiter,
					template: e.previewGenericTemplate,
					msg: e.msgSelected,
					initId: e.previewInitId,
					footer: e.getLayoutTemplate("footer"),
					isDelete: e.initialPreviewShowDelete,
					caption: e.initialCaption,
					actions: function(i, t, a, r, n, l) {
						return e.renderFileActions(i, t, a, r, n, l)
					}
				}
			},
			fetch: function(e) {
				return t.data[e].content.filter(function(e) {
					return void 0 !== e
				})
			},
			count: function(e) {
				return t.data[e] && t.data[e].content ? t.fetch(e).length : 0
			},
			get: function(e, i, a) {
				var r, n = "init_" + i,
					l = t.data[e],
					o = l.initId + "-" + n;
				return a = void 0 === a ? !0 : a, void 0 === l.content[i] ? "" : (r = l.template.repl("{previewId}", o).repl("{frameClass}", " file-preview-initial").repl("{fileindex}", n).repl("{content}", l.content[i]).repl("{footer}", t.footer(e, i, a)), l.tags.length && l.tags[i] && (r = q(r, l.tags[i])), r)
			},
			add: function(i, a, r, n) {
				var l, o = e.extend(!0, {}, t.data[i]);
				return B(a) || (a = a.split(o.delimiter)), n ? (l = o.content.push(a) - 1, o.config[l] = r) : (l = a.length, o.content = a, o.config = r), t.data[i] = o, l
			},
			set: function(i, a, r, n, l) {
				var o, s = e.extend(!0, {}, t.data[i]);
				if(B(a) || (a = a.split(s.delimiter)), l) {
					for(o = 0; o < a.length; o++) s.content.push(a[o]);
					for(o = 0; o < r.length; o++) s.config.push(r[o]);
					for(o = 0; o < n.length; o++) s.tags.push(n[o])
				} else s.content = a, s.config = r, s.tags = n;
				t.data[i] = s
			},
			unset: function(e, i) {
				var a = t.count(e);
				if(a) {
					if(1 === a) return t.data[e].content = [], void(t.data[e].config = []);
					t.data[e].content[i] = void 0, t.data[e].config[i] = void 0
				}
			},
			out: function(e) {
				var i, a = "",
					r = t.data[e],
					n = t.count(e);
				if(0 === n) return {
					content: "",
					caption: ""
				};
				for(var l = 0; n > l; l++) a += t.get(e, l);
				return i = r.msg.repl("{n}", n), {
					content: a,
					caption: i
				}
			},
			footer: function(e, i, a) {
				var r = t.data[e];
				if(a = void 0 === a ? !0 : a, 0 === r.config.length || z(r.config[i])) return "";
				var n = r.config[i],
					l = N("caption", n) ? n.caption : "",
					o = N("width", n) ? n.width : "auto",
					s = N("url", n) ? n.url : !1,
					d = N("key", n) ? n.key : null,
					p = s === !1 && a,
					c = r.isDelete ? r.actions(!1, !0, p, s, d, i) : "",
					f = r.footer.repl("{actions}", c);
				return f.repl("{caption}", l).repl("{width}", o).repl("{indicator}", "").repl("{indicatorTitle}", "")
			}
		},
		a = ".file-preview-frame:not(.file-preview-initial)",
		r = function(e, i) {
			return i = i || 0, "number" == typeof e ? e : ("string" == typeof e && (e = parseFloat(e)), isNaN(e) ? i : e)
		},
		n = function() {
			return window.File && window.FileReader
		},
		l = function() {
			var e = document.createElement("div");
			return !i(9) && (void 0 !== e.draggable || void 0 !== e.ondragstart && void 0 !== e.ondrop)
		},
		o = function() {
			return n && window.FormData
		},
		s = function(e, i) {
			e.removeClass(i).addClass(i)
		},
		d = 'style="width:{width};height:{height};"',
		p = '      <param name="controller" value="true" />\n      <param name="allowFullScreen" value="true" />\n      <param name="allowScriptAccess" value="always" />\n      <param name="autoPlay" value="false" />\n      <param name="autoStart" value="false" />\n      <param name="quality" value="high" />\n',
		c = '<div class="file-preview-other">\n       {previewFileIcon}\n   </div>',
		f = {
			removeIcon: '<i class="glyphicon glyphicon-trash text-danger"></i>',
			removeClass: "btn btn-xs btn-default",
			removeTitle: "删除该文件",
			uploadIcon: '<i class="glyphicon glyphicon-upload text-info"></i>',
			uploadClass: "btn btn-xs btn-default",
			uploadTitle: "Upload file",
			indicatorNew: '',
			indicatorSuccess: '<i class="glyphicon glyphicon-ok-sign file-icon-large text-success"></i>',
			indicatorError: '<i class="glyphicon glyphicon-exclamation-sign text-danger"></i>',
			indicatorLoading: '<i class="glyphicon glyphicon-hand-up text-muted"></i>',
			indicatorNewTitle: "Not uploaded yet",
			indicatorSuccessTitle: "Uploaded",
			indicatorErrorTitle: "Upload Error",
			indicatorLoadingTitle: "Uploading ..."
		},
		u = '{preview}\n<div class="kv-upload-progress hide"></div>\n<div class="input-group {class}">\n   {caption}\n   <div class="input-group-btn">\n       {remove}\n       {cancel}\n       {upload}\n       {browse}\n   </div>\n</div>',
		v = '{preview}\n<div class="kv-upload-progress hide"></div>\n{remove}\n{cancel}\n{upload}\n{browse}\n',
		h = '<div class="file-preview {class}">\n    <div class="close fileinput-remove">&times;</div>\n    <div class="{dropClass}">\n    <div class="file-preview-thumbnails">\n    </div>\n    <div class="clearfix"></div>    <div class="file-preview-status text-center text-success"></div>\n    <div class="kv-fileinput-error"></div>\n    </div>\n</div>',
		m = '<span class="glyphicon glyphicon-file kv-caption-icon"></span>',
		g = '<div tabindex="-1" class="form-control file-caption {class}">\n   <span class="file-caption-ellipsis">&hellip;</span>\n   <div class="file-caption-name"></div>\n</div>',
		w = '<div id="{id}" class="modal fade">\n  <div class="modal-dialog modal-lg">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\n        <h3 class="modal-title">Detailed Preview <small>{title}</small></h3>\n      </div>\n      <div class="modal-body">\n        <textarea class="form-control" style="font-family:Monaco,Consolas,monospace; height: {height}px;" readonly>{body}</textarea>\n      </div>\n    </div>\n  </div>\n</div>',
		b = '<div class="progress">\n    <div class="{class}" role="progressbar" aria-valuenow="{percent}" aria-valuemin="0" aria-valuemax="100" style="width:{percent}%;">\n        {percent}%\n     </div>\n</div>',
		x = '<div class="file-thumbnail-footer">\n    <div class="file-caption-name">{caption}</div>\n    {actions}\n</div>',
		//zander  不显示底部按钮
		C = '<div class="file-actions">\n    <div class="file-footer-buttons">\n        {delete}{other}    </div>\n    <div class="file-upload-indicator" tabindex="-1" title="{indicatorTitle}">{indicator}</div>\n    <div class="clearfix"></div>\n</div>',
		y = '<button type="button" class="kv-file-remove {removeClass}" title="{removeTitle}"{dataUrl}{dataKey}>{removeIcon}</button>\n',
		E = '<button type="button" class="kv-file-upload {uploadClass}" title="{uploadTitle}">   {uploadIcon}\n</button>\n',
		$ = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n   {content}\n   {footer}\n</div>\n',
		T = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n    <object data="{data}" type="{type}" width="{width}" height="{height}">\n       ' + c + "\n    </object>\n   {footer}\n</div>",
		F = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n   <img src="{data}" class="file-preview-image" title="{caption}" alt="{caption}" ' + d + ">\n   {footer}\n</div>\n",
		k = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}">\n   <div class="file-preview-text" title="{caption}" ' + d + ">\n       {data}\n   </div>\n   {footer}\n</div>",
		D = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + d + '>\n   <video width="{width}" height="{height}" controls>\n       <source src="{data}" type="{type}">\n       ' + c + "\n   </video>\n   {footer}\n</div>\n",
		I = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + d + '>\n   <audio controls>\n       <source src="{data}" type="{type}">\n       ' + c + "\n   </audio>\n   {footer}\n</div>",
		P = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + d + '>\n   <object type="application/x-shockwave-flash" width="{width}" height="{height}" data="{data}">\n' + p + "       " + c + "\n   </object>\n   {footer}\n</div>\n",
		S = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + d + '>\n   <object data="{data}" type="{type}" width="{width}" height="{height}">\n       <param name="movie" value="{caption}" />\n' + p + "         " + c + "\n   </object>\n   {footer}\n</div>",
		U = '<div class="file-preview-frame{frameClass}" id="{previewId}" data-fileindex="{fileindex}" title="{caption}" ' + d + ">\n   " + c + "\n   {footer}\n</div>",
		j = {
			main1: u,
			main2: v,
			preview: h,
			icon: m,
			caption: g,
			modal: w,
			progress: b,
			footer: x,
			actions: C,
			actionDelete: y,
			actionUpload: E
		},
		A = {
			generic: $,
			html: T,
			image: F,
			text: k,
			video: D,
			audio: I,
			flash: P,
			object: S,
			other: U
		},
		//zander 去除html,text,image预览
		L = ["video", "audio", "flash"],
		O = {
			image: {
				width: "auto",
				height: "80px"
			},
			html: {
				width: "213px",
				height: "80px"
			},
			text: {
				width: "160px",
				height: "80px"
			},
			video: {
				width: "213px",
				height: "80px"
			},
			audio: {
				width: "213px",
				height: "80px"
			},
			flash: {
				width: "213px",
				height: "160px"
			},
			object: {
				width: "160px",
				height: "80px"
			},
			other: {
				width: "160px",
				height: "80px"
			}
		},
		R = {
			image: function(e, i) {
				return void 0 !== e ? e.match("image.*") : i.match(/\.(gif|png|jpe?g)$/i)
			},
			html: function(e, i) {
				return void 0 !== e ? "text/html" === e : i.match(/\.(htm|html)$/i)
			},
			text: function(e, i) {
				return void 0 !== e && e.match("text.*") || i.match(/\.(txt|md|csv|nfo|php|ini)$/i)
			},
			video: function(e, i) {
				return void 0 !== e && e.match(/\.video\/(ogg|mp4|webm)$/i) || i.match(/\.(og?|mp4|webm)$/i)
			},
			audio: function(e, i) {
				return void 0 !== e && e.match(/\.audio\/(ogg|mp3|wav)$/i) || i.match(/\.(ogg|mp3|wav)$/i)
			},
			flash: function(e, i) {
				return void 0 !== e && "application/x-shockwave-flash" === e || i.match(/\.(swf)$/i)
			},
			object: function() {
				return !0
			},
			other: function() {
				return !0
			}
		},
		z = function(i, t) {
			return null === i || void 0 === i || 0 === i.length || t && "" === e.trim(i)
		},
		B = function(e) {
			return Array.isArray(e) || "[object Array]" === Object.prototype.toString.call(e)
		},
		N = function(e, i) {
			return "object" == typeof i && e in i
		},
		M = function(i, t, a) {
			return z(i) || z(i[t]) ? a : e(i[t])
		},
		Z = function() {
			return Math.round((new Date).getTime() + 100 * Math.random())
		},
		_ = function(e) {
			return String(e).repl("&", "&amp;").repl('"', "&quot;").repl("'", "&#39;").repl("<", "&lt;").repl(">", "&gt;")
		},
		q = function(i, t) {
			var a = i;
			return t = t || {}, e.each(t, function(e, i) {
				"function" == typeof i && (i = i()), a = a.repl(e, i)
			}), a
		},
		H = window.URL || window.webkitURL,
		V = function(t, a) {
			this.$element = e(t), n() || i(9) ? (this.init(a), this.listen()) : this.$element.removeClass("file-loading")
		};
	V.prototype = {
		constructor: V,
		init: function(a) {
			var n, d = this,
				p = d.$element;
			e.each(a, function(e, i) {
				("maxFileCount" === e || "maxFileSize" === e) && (d[e] = r(i)), d[e] = i
			}), d.fileInputCleared = !1, d.fileBatchCompleted = !0, z(d.allowedPreviewTypes) && (d.allowedPreviewTypes = L), d.uploadFileAttr = z(p.attr("name")) ? "file_data" : p.attr("name"), d.reader = null, d.formdata = {}, d.isIE9 = i(9), d.isIE10 = i(10), d.filestack = [], d.ajaxRequests = [], d.isError = !1, d.uploadAborted = !1, d.dropZoneEnabled = l() && d.dropZoneEnabled, d.isDisabled = d.$element.attr("disabled") || d.$element.attr("readonly"), d.isUploadable = o && !z(d.uploadUrl), d.slug = "function" == typeof a.slugCallback ? a.slugCallback : d.slugDefault, d.mainTemplate = d.getLayoutTemplate(d.showCaption ? "main1" : "main2"), d.captionTemplate = d.getLayoutTemplate("caption"), d.previewGenericTemplate = d.getPreviewTemplate("generic"), z(d.$element.attr("id")) && d.$element.attr("id", Z()), void 0 === d.$container ? d.$container = d.createContainer() : d.refreshContainer(), d.$progress = d.$container.find(".kv-upload-progress"), d.$btnUpload = d.$container.find(".kv-fileinput-upload"), d.$captionContainer = M(a, "elCaptionContainer", d.$container.find(".file-caption")), d.$caption = M(a, "elCaptionText", d.$container.find(".file-caption-name")), d.$previewContainer = M(a, "elPreviewContainer", d.$container.find(".file-preview")), d.$preview = M(a, "elPreviewImage", d.$container.find(".file-preview-thumbnails")), d.$previewStatus = M(a, "elPreviewStatus", d.$container.find(".file-preview-status")), d.$errorContainer = M(a, "elErrorContainer", d.$previewContainer.find(".kv-fileinput-error")), z(d.msgErrorClass) || s(d.$errorContainer, d.msgErrorClass), d.$errorContainer.hide(), d.fileActionSettings = e.extend(f, a.fileActionSettings), d.previewInitId = "preview-" + Z(), d.id = d.$element.attr("id"), t.init(d), d.initPreview(!0), d.initPreviewDeletes(), d.options = a, d.setFileDropZoneTitle(), d.uploadCount = 0, d.uploadPercent = 0, d.$element.removeClass("file-loading"), n = d.getLayoutTemplate("progress"), d.progressTemplate = n.replace("{class}", d.progressClass), d.progressCompleteTemplate = n.replace("{class}", d.progressCompleteClass), d.setEllipsis()
		},
		parseError: function(i, t, a) {
			var r = this,
				n = e.trim(t + ""),
				l = "." === n.slice(-1) ? "" : ".",
				o = e(i.responseText).text();
			return r.showAjaxErrorDetails ? (o = e.trim(o.replace(/\n\s*\n/g, "\n")), o = o.length > 0 ? "<pre>" + o + "</pre>" : "", n += l + o) : n += l, a ? "<b>" + a + ": </b>" + i : n
		},
		raise: function(i, t) {
			var a, r = this,
				n = e.Event(i);
			if(void 0 !== t ? r.$element.trigger(n, t) : r.$element.trigger(n), a = n.result || !1) switch(i) {
				case "filebatchuploadcomplete":
				case "filebatchuploadsuccess":
				case "fileuploaded":
				case "fileclear":
				case "filecleared":
				case "filereset":
				case "fileerror":
				case "filefoldererror":
				case "fileuploaderror":
				case "filebatchuploaderror":
				case "filedeleteerror":
				case "filecustomerror":
					break;
				default:
					r.uploadAborted = a
			}
		},
		getLayoutTemplate: function(e) {
			var i = this,
				t = N(e, i.layoutTemplates) ? i.layoutTemplates[e] : j[e];
			return z(i.customLayoutTags) ? t : q(t, i.customLayoutTags)
		},
		getPreviewTemplate: function(e) {
			var i = this,
				t = N(e, i.previewTemplates) ? i.previewTemplates[e] : A[e];
			return t = t.repl("{previewFileIcon}", i.previewFileIcon), z(i.customPreviewTags) ? t : q(t, i.customPreviewTags)
		},
		getOutData: function(e, i, t) {
			var a = this;
			return e = e || {}, i = i || {}, t = t || a.filestack.slice(0) || {}, {
				form: a.formdata,
				files: t,
				extra: a.getExtraData(),
				response: i,
				reader: a.reader,
				jqXHR: e
			}
		},
		setEllipsis: function() {
			var e = this,
				i = e.$captionContainer,
				t = e.$caption,
				a = t.clone().css("height", "auto").hide();
			i.parent().before(a), i.removeClass("kv-has-ellipsis"), a.outerWidth() > t.outerWidth() && i.addClass("kv-has-ellipsis"), a.remove()
		},
		listen: function() {
			var i = this,
				t = i.$element,
				a = i.$captionContainer,
				r = i.$btnFile,
				n = t.closest("form");
			t.on("change", e.proxy(i.change, i)), e(window).on("resize", function() {
				i.setEllipsis()
			}), r.off("click").on("click", function() {
				i.raise("filebrowse"), i.isError && !i.isUploadable && i.clear(), a.focus()
			}), n.off("reset").on("reset", e.proxy(i.reset, i)), i.$container.off("click").on("click", ".fileinput-remove:not([disabled])", e.proxy(i.clear, i)).on("click", ".fileinput-cancel", e.proxy(i.cancel, i)), i.isUploadable && i.dropZoneEnabled && i.showPreview && i.initDragDrop(), i.isUploadable || n.on("submit", e.proxy(i.submitForm, i)), i.$container.find(".kv-fileinput-upload").off("click").on("click", function(t) {
				i.isUploadable && (t.preventDefault(), !e(this).hasClass("disabled") && z(e(this).attr("disabled")) && i.upload())
			})
		},
		submitForm: function() {
			var e = this,
				i = e.$element,
				t = i.get(0).files;
			return t && t.length < e.minFileCount && e.minFileCount > 0 ? (e.noFilesError({}), !1) : !e.abort({})
		},
		abort: function(i) {
			var t, a = this;
			return a.uploadAborted && "object" == typeof a.uploadAborted && void 0 !== a.uploadAborted.message ? (t = void 0 !== a.uploadAborted.data ? a.getOutData({}, a.uploadAborted.data) : a.getOutData(), t = e.extend(t, i), a.showUploadError(a.uploadAborted.message, t, "filecustomerror"), !0) : !1
		},
		noFilesError: function(e) {
			var i = this,
				t = i.minFileCount > 1 ? i.filePlural : i.fileSingle,
				a = i.msgFilesTooLess.repl("{n}", i.minFileCount).repl("{files}", t),
				r = i.$errorContainer;
			r.html(a), i.isError = !0, i.updateFileDetails(0), r.fadeIn(800), i.raise("fileerror", [e]), i.clearFileInput(), s(i.$container, "has-error")
		},
		setProgress: function(e) {
			var i = this,
				t = Math.min(e, 100),
				a = 100 > t ? i.progressTemplate : i.progressCompleteTemplate;
			i.$progress.html(a.repl("{percent}", t))
		},
		upload: function() {
			if(this.uploadBeforFn){
				var status =  uploadBeforFn(this);
				if(status == false){
					return;
				}
			}
			var i, t, a, r = this,
				n = r.getFileStack().length,
				l = {},
				o = !e.isEmptyObject(r.getExtraData());
			if(n < r.minFileCount && r.minFileCount > 0) return void r.noFilesError(l);
			if(r.isUploadable && !r.isDisabled && (0 !== n || o)) {
				if(r.resetUpload(), r.$progress.removeClass("hide"), r.uploadCount = 0, r.uploadPercent = 0, r.lock(), r.setProgress(0), 0 === n && o) return void r.uploadExtraOnly();
				if(a = r.filestack.length, r.hasInitData = !1, r.uploadAsync && r.showPreview)
					for(t = r.getOutData(), r.raise("filebatchpreupload", [t]), r.fileBatchCompleted = !1, r.uploadCache = {
							content: [],
							config: [],
							tags: [],
							append: !0
						}, i = 0; a > i; i += 1) void 0 !== r.filestack[i] && r.uploadSingle(i, r.filestack, !0);
				else r.uploadBatch()
			}
		},
		lock: function() {
			var e = this;
			e.resetErrors(), e.disable(), e.showRemove && s(e.$container.find(".fileinput-remove"), "hide"), e.showCancel && e.$container.find(".fileinput-cancel").removeClass("hide"), e.raise("filelock", [e.filestack, e.getExtraData()])
		},
		unlock: function(e) {
			var i = this;
			void 0 === e && (e = !0), i.enable(), i.showCancel && s(i.$container.find(".fileinput-cancel"), "hide"), i.showRemove && i.$container.find(".fileinput-remove").removeClass("hide"), e && i.resetFileStack(), i.raise("fileunlock", [i.filestack, i.getExtraData()])
		},
		resetFileStack: function() {
			var i = this,
				t = 0,
				r = [];
			i.$preview.find(a).each(function() {
				var a = e(this),
					n = a.attr("data-fileindex"),
					l = i.filestack[n]; - 1 !== n && (void 0 !== l ? (r[t] = l, a.attr({
					id: i.previewInitId + "-" + t,
					"data-fileindex": t
				}), t += 1) : a.attr({
					id: "uploaded-" + Z(),
					"data-fileindex": "-1"
				}))
			}), i.filestack = r
		},
		refresh: function(i) {
			var t, a = this,
				r = a.$element,
				n = arguments.length ? e.extend(a.options, i) : a.options;
			r.off(), a.init(n), t = a.$container.find(".file-drop-zone"), t.off("dragenter dragover drop"), e(document).off("dragenter dragover drop"), a.listen(), a.setFileDropZoneTitle()
		},
		initDragDrop: function() {
			var i = this,
				t = i.$container.find(".file-drop-zone");
			t.off("dragenter dragover drop"), e(document).off("dragenter dragover drop"), t.on("dragenter dragover", function(t) {
				t.stopPropagation(), t.preventDefault(), i.isDisabled || s(e(this), "highlighted")
			}), t.on("dragleave", function(t) {
				t.stopPropagation(), t.preventDefault(), i.isDisabled || e(this).removeClass("highlighted")
			}), t.on("drop", function(t) {
				t.preventDefault(), i.isDisabled || (i.change(t, "dragdrop"), e(this).removeClass("highlighted"))
			}), e(document).on("dragenter dragover drop", function(e) {
				e.stopPropagation(), e.preventDefault()
			})
		},
		setFileDropZoneTitle: function() {
			var e = this,
				i = e.$container.find(".file-drop-zone");
			i.find("." + e.dropZoneTitleClass).remove(), e.isUploadable && e.showPreview && 0 !== i.length && !(e.getFileStack().length > 0) && e.dropZoneEnabled && (0 === i.find(".file-preview-frame").length && i.prepend('<div class="' + e.dropZoneTitleClass + '">' + e.dropZoneTitle + "</div>"), e.$container.removeClass("file-input-new"), s(e.$container, "file-input-ajax-new"))
		},
		initFileActions: function() {
			var i = this;
			i.$preview.find(".kv-file-remove").each(function() {
				var a, r, n = e(this),
					l = n.closest(".file-preview-frame"),
					o = l.attr("data-fileindex");
				n.off("click").on("click", function() {
					l.fadeOut("slow", function() {
						i.filestack[o] = void 0, i.clearObjects(l), l.remove();
						var e = i.getFileStack(),
							n = e.length,
							s = t.count(i.id);
						i.clearFileInput(), 0 === n && 0 === s ? i.reset() : (a = s + n, r = a > 1 ? i.msgSelected.repl("{n}", a) : e[0].name, i.setCaption(r))
					})
				})
			}), i.$preview.find(".kv-file-upload").each(function() {
				var t = e(this);
				t.off("click").on("click", function() {
					var e = t.closest(".file-preview-frame"),
						a = e.attr("data-fileindex");
					i.uploadSingle(a, i.filestack, !1)
				})
			})
		},
		renderFileFooter: function(e, i) {
			var t, a, r = this,
				n = r.fileActionSettings,
				l = r.getLayoutTemplate("footer");
			return r.isUploadable ? (t = l.repl("{actions}", r.renderFileActions(!0, !0, !1, !1, !1, !1)), a = t.repl("{caption}", e).repl("{width}", i).repl("{indicator}", n.indicatorNew).repl("{indicatorTitle}", n.indicatorNewTitle)) : a = l.repl("{actions}", "").repl("{caption}", e).repl("{width}", i).repl("{indicator}", "").repl("{indicatorTitle}", ""), a = q(a, r.previewThumbTags)
		},
		renderFileActions: function(e, i, t, a, r) {
			if(!e && !i) return "";
			var n = this,
				l = a === !1 ? "" : ' data-url="' + a + '"',
				o = r === !1 ? "" : ' data-key="' + r + '"',
				s = n.getLayoutTemplate("actionDelete"),
				d = "",
				p = n.getLayoutTemplate("actions"),
				c = n.otherActionButtons.repl("{dataKey}", o),
				f = n.fileActionSettings,
				u = t ? f.removeClass + " disabled" : f.removeClass;
			return s = s.repl("{removeClass}", u).repl("{removeIcon}", f.removeIcon).repl("{removeTitle}", f.removeTitle).repl("{dataUrl}", l).repl("{dataKey}", o), e && (d = n.getLayoutTemplate("actionUpload").repl("{uploadClass}", f.uploadClass).repl("{uploadIcon}", f.uploadIcon).repl("{uploadTitle}", f.uploadTitle)), p.repl("{delete}", s).repl("{upload}", d).repl("{other}", c)
		},
		initPreview: function(e) {
			var i, a, r = this;
			return t.count(r.id) ? (a = t.out(r.id), i = e && r.initialCaption ? r.initialCaption : a.caption, r.$preview.html(a.content), r.setCaption(i), void(z(a.content) || r.$container.removeClass("file-input-new"))) : (r.$preview.html(""), void r.setCaption(""))
		},
		initPreviewDeletes: function() {
			var i = this,
				a = i.deleteExtraData || {},
				r = function() {
					0 === i.$preview.find(".kv-file-remove").length && i.reset()
				};
			i.$preview.find(".kv-file-remove").each(function() {
				var n, l, o, d, p = e(this),
					c = p.closest(".file-preview-frame"),
					f = t.data[i.id],
					u = p.data("url") || i.deleteUrl,
					v = p.data("key"),
					h = {
						id: p.attr("id"),
						key: v,
						extra: o
					};
				"function" == typeof o && (o = o()), void 0 !== u && void 0 !== v && (d = e.extend({
					url: u,
					type: "DELETE",
					dataType: "json",
					data: e.extend({
						key: v
					}, o),
					beforeSend: function(e) {
						s(c, "file-uploading"), s(p, "disabled"), i.raise("filepredelete", [v, e, o])
					},
					success: function(e, s, d) {
						return n = parseInt(c.data("fileindex").replace("init_", "")), l = z(f.config) && z(f.config[n]) ? null : f.config[n], o = z(l) || z(l.extra) ? a : l.extra, void 0 !== e && void 0 !== e.error ? (h.jqXHR = d, h.response = e, i.showError(e.error, h, "filedeleteerror"), c.removeClass("file-uploading"), p.removeClass("disabled"), void r()) : (t.unset(i.id, n), i.raise("filedeleted", [v, d, o]), c.removeClass("file-uploading").addClass("file-deleted"), void c.fadeOut("slow", function() {
							i.clearObjects(c), c.remove(), r(), t.count(i.id) || i.reset()
						}))
					},
					error: function(e, t, a) {
						var n = i.parseError(e, a);
						h.jqXHR = e, h.response = {}, i.showError(n, h, "filedeleteerror"), c.removeClass("file-uploading"), r()
					}
				}, i.ajaxDeleteSettings), p.off("click").on("click", function() {
					e.ajax(d)
				}))
			})
		},
		clearObjects: function(i) {
			i.find("video audio").each(function() {
				this.pause(), e(this).remove()
			}), i.find("img object div").each(function() {
				e(this).remove()
			})
		},
		clearFileInput: function() {
			var i, t, a, r = this,
				n = r.$element;
			z(n.val()) || (r.isIE9 || r.isIE10 ? (i = n.closest("form"), t = e(document.createElement("form")), a = e(document.createElement("div")), n.before(a), i.length ? i.after(t) : a.after(t), t.append(n).trigger("reset"), a.before(n).remove(), t.remove()) : n.val(""), r.fileInputCleared = !0)
		},
		resetUpload: function() {
			var e = this;
			e.uploadCache = {
				content: [],
				config: [],
				tags: [],
				append: !0
			}, e.uploadCount = 0, e.uploadPercent = 0, e.$btnUpload.removeAttr("disabled"), e.setProgress(0), s(e.$progress, "hide"), e.resetErrors(!1), e.uploadAborted = !1, e.ajaxRequests = []
		},
		cancel: function() {
			var i, t = this,
				r = t.ajaxRequests,
				n = r.length;
			if(n > 0)
				for(i = 0; n > i; i += 1) r[i].abort();
			t.$preview.find(a).each(function() {
				var i = e(this),
					a = i.attr("data-fileindex");
				i.removeClass("file-uploading"), void 0 !== t.filestack[a] && (i.find(".kv-file-upload").removeClass("disabled").removeAttr("disabled"), i.find(".kv-file-remove").removeClass("disabled").removeAttr("disabled")), t.unlock()
			})
		},
		clear: function() {
			var i, r = this;
			r.$btnUpload.removeAttr("disabled"), r.resetUpload(), r.filestack = [], r.clearFileInput(), r.resetErrors(!0), r.raise("fileclear"), !r.overwriteInitial && t.count(r.id) ? (r.showFileIcon(), r.resetPreview(), r.setEllipsis(), r.initPreviewDeletes(), r.$container.removeClass("file-input-new")) : (r.$preview.find(a).each(function() {
				r.clearObjects(e(this))
			}), r.$preview.html(""), i = !r.overwriteInitial && r.initialCaption.length > 0 ? r.initialCaption : "", r.$caption.html(i), r.setEllipsis(), r.$caption.attr("title", ""), s(r.$container, "file-input-new")), 0 === r.$container.find(".file-preview-frame").length && (r.initialCaption = "", r.$caption.html(""), r.setEllipsis(), r.$captionContainer.find(".kv-caption-icon").hide()), r.hideFileIcon(), r.raise("filecleared"), r.$captionContainer.focus(), r.setFileDropZoneTitle()
		},
		resetPreview: function() {
			var e, i = this;
			t.count(i.id) ? (e = t.out(i.id), i.$preview.html(e.content), i.setCaption(e.caption)) : (i.$preview.html(""), i.$caption.html(""))
		},
		reset: function() {
			var e = this;
			e.clear(), e.resetPreview(), e.setEllipsis(), e.$container.find(".fileinput-filename").text(""), e.raise("filereset"), e.initialPreview.length > 0 && e.$container.removeClass("file-input-new"), e.setFileDropZoneTitle(), e.filestack = [], e.formdata = {}
		},
		disable: function() {
			var e = this;
			e.isDisabled = !0, e.raise("filedisabled"), e.$element.attr("disabled", "disabled"), e.$container.find(".kv-fileinput-caption").addClass("file-caption-disabled"), e.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").attr("disabled", !0), e.initDragDrop()
		},
		enable: function() {
			var e = this;
			e.isDisabled = !1, e.raise("fileenabled"), e.$element.removeAttr("disabled"), e.$container.find(".kv-fileinput-caption").removeClass("file-caption-disabled"), e.$container.find(".btn-file, .fileinput-remove, .kv-fileinput-upload").removeAttr("disabled"), e.initDragDrop()
		},
		getExtraData: function() {
			var e = this,
				i = e.uploadExtraData;
			return "function" == typeof e.uploadExtraData && (i = e.uploadExtraData()), i
		},
		uploadExtra: function() {
			var i = this,
				t = i.getExtraData();
			0 !== t.length && e.each(t, function(e, t) {
				i.formdata.append(e, t)
			})
		},
		initXhr: function(e, i) {
			var t = this;
			return e.upload && e.upload.addEventListener("progress", function(e) {
				var a = 0,
					r = e.loaded || e.position,
					n = e.total;
				e.lengthComputable && (a = Math.ceil(r / n * i)), t.uploadPercent = Math.max(a, t.uploadPercent), t.setProgress(t.uploadPercent)
			}, !1), e
		},
		ajaxSubmit: function(i, t, a, r) {
			var n, l = this;
			
			l.uploadExtra(), n = e.extend({
				xhr: function() {
					var i = e.ajaxSettings.xhr();
					return l.initXhr(i, 98)
				},
				url: l.uploadUrl,
				type: "POST",
				dataType: "json",
				data: l.formdata,
				cache: !1,
				processData: !1,
				contentType: !1,
				beforeSend: i,
				success: t,
				complete: a,
				error: r
			}, l.ajaxSettings), l.ajaxRequests.push(e.ajax(n))
		},
		initUploadSuccess: function(i, a, r) {
			var n, l, o, s, d, p, c, f = this;
			"object" != typeof i || e.isEmptyObject(i) || void 0 !== i.initialPreview && i.initialPreview.length > 0 && (f.hasInitData = !0, d = i.initialPreview || [], p = i.initialPreviewConfig || [], c = i.initialPreviewThumbTags || [], n = void 0 === i.append || i.append ? !0 : !1, f.overwriteInitial = !1, void 0 !== a && r ? (o = t.add(f.id, d, p[0], c[0], n), l = t.get(f.id, o, !1), s = e(l).hide(), a.after(s).fadeOut("slow", function() {
				s.fadeIn("slow").css("display:inline-block"), f.initPreviewDeletes()
			})) : r ? (f.uploadCache.content.push(d[0]), f.uploadCache.config.push(p[0]), f.uploadCache.tags.push(c[0]), f.uploadCache.append = n) : (t.set(f.id, d, p, c, n), f.initPreview(), f.initPreviewDeletes()))
		},
		uploadSingle: function(i, r, n) {
			var l, o, d, p, c, f, u, v, h, m, g = this,
				w = g.getFileStack().length,
				b = new FormData,
				x = g.previewInitId + "-" + i,
				C = e("#" + x + ":not(.file-preview-initial)"),
				y = C.find(".kv-file-upload"),
				E = C.find(".kv-file-remove"),
				$ = C.find(".file-upload-indicator"),
				T = g.fileActionSettings,
				F = g.filestack.length > 0 || !e.isEmptyObject(g.uploadExtraData),
				k = {
					id: x,
					index: i
				};
			g.formdata = b, 0 === w || !F || y.hasClass("disabled") || g.abort(k) || (d = function() {
				var e = g.$preview.find(a + ".file-uploading");
				e.length > 0 && g.fileBatchCompleted || (t.set(g.id, g.uploadCache.content, g.uploadCache.config, g.uploadCache.tags, g.uploadCache.append), g.hasInitData && (g.initPreview(), g.initPreviewDeletes()), g.setProgress(100), g.unlock(), g.clearFileInput(), g.raise("filebatchuploadcomplete", [g.filestack, g.getExtraData()]), g.fileBatchCompleted = !0)
			}, p = function(e, i) {
				$.html(T[e]), $.attr("title", T[i])
			}, c = function() {
				!n || 0 === w || g.uploadPercent >= 100 || (g.uploadCount += 1, o = 80 + Math.ceil(20 * g.uploadCount / w), g.uploadPercent = Math.max(o, g.uploadPercent), g.setProgress(g.uploadPercent), g.initPreviewDeletes())
			}, f = function() {
				y.removeAttr("disabled"), E.removeAttr("disabled"), C.removeClass("file-uploading")
			}, u = function(t) {
				l = g.getOutData(t), p("indicatorLoading", "indicatorLoadingTitle"), s(C, "file-uploading"), y.attr("disabled", !0), E.attr("disabled", !0), n || g.lock(), g.raise("filepreupload", [l, x, i]), k = e.extend(k, l), g.abort(k) && (t.abort(), g.setProgress(100))
			}, v = function(t, a, r) {
				l = g.getOutData(r, t), k = e.extend(k, l), setTimeout(function() {
					void 0 === t.error ? (p("indicatorSuccess", "indicatorSuccessTitle"), y.hide(), E.hide(), g.filestack[i] = void 0, g.raise("fileuploaded", [l, x, i]), g.initUploadSuccess(t, C, n), n || g.resetFileStack()) : (p("indicatorError", "indicatorErrorTitle"), g.showUploadError(t.error, k))
				}, 100)
			}, h = function() {
				setTimeout(function() {
					c(), f(), n ? setTimeout(function() {
						d()
					}, 500) : g.unlock(!1)
				}, 100)
			}, m = function(t, a, l) {
				var o = g.parseError(t, l, n ? r[i].name : null);
				p("indicatorError", "indicatorErrorTitle"), k = e.extend(k, g.getOutData(t)), g.showUploadError(o, k)
			}, b.append(g.uploadFileAttr, r[i]), g.ajaxSubmit(u, v, h, m))
		},
		uploadBatch: function() {
			var i, t, r, n, l, o, d, p, c = this,
				f = c.filestack,
				u = f.length,
				v = c.filestack.length > 0 || !e.isEmptyObject(c.uploadExtraData),
				h = {};
			c.formdata = new FormData, 0 !== u && v && !c.abort(h) && (i = c.fileActionSettings, t = function(t, a, r) {
				var n = e("#" + c.previewInitId + "-" + t).find(".file-upload-indicator");
				n.html(i[a]), n.attr("title", i[r])
			}, n = function(i) {
				var t = e("#" + c.previewInitId + "-" + i + ":not(.file-preview-initial)"),
					a = t.find(".kv-file-upload"),
					r = t.find(".kv-file-delete");
				t.removeClass("file-uploading"), a.removeAttr("disabled"), r.removeAttr("disabled")
			}, r = function() {
				e.each(f, function(e) {
					c.filestack[e] = void 0
				}), c.clearFileInput()
			}, l = function(i) {
				c.lock();
				var t = c.getOutData(i);
				c.showPreview && c.$preview.find(a).each(function() {
					var i = e(this),
						t = i.find(".kv-file-upload"),
						a = i.find(".kv-file-remove");
					s(i, "file-uploading"), t.attr("disabled", !0), a.attr("disabled", !0)
				}), c.raise("filebatchpreupload", [t]), c.abort(t) && i.abort()
			}, o = function(i, l, o) {
				var s = c.getOutData(o, i),
					d = z(i.errorkeys) ? [] : i.errorkeys;
				void 0 === i.error || z(i.error) ? (c.raise("filebatchuploadsuccess", [s]), r(), c.showPreview ? (c.$preview.find(".kv-file-upload").hide(), c.$preview.find(".kv-file-remove").hide(), c.$preview.find(a).each(function() {
					var i = e(this),
						a = i.attr("data-fileindex");
					t(a, "indicatorSuccess", "indicatorSuccessTitle"), n(a)
				}), c.initUploadSuccess(i)) : c.reset()) : (c.showPreview && (c.$preview.find(a).each(function() {
					var i = e(this),
						a = parseInt(i.attr("data-fileindex"), 10);
					return n(a), 0 === d.length ? void t(a, "indicatorError", "indicatorErrorTitle") : void(-1 !== e.inArray(a, d) ? t(a, "indicatorError", "indicatorErrorTitle") : (i.find(".kv-file-upload").hide(), i.find(".kv-file-remove").hide(), t(a, "indicatorSuccess", "indicatorSuccessTitle"), c.filestack[a] = void 0))
				}), c.initUploadSuccess(i)), c.showUploadError(i.error, s, "filebatchuploaderror"))
			}, d = function() {
				c.setProgress(100), c.unlock(), c.raise("filebatchuploadcomplete", [c.filestack, c.getExtraData()]), c.clearFileInput()
			}, p = function(i, r, n) {
				var l = c.getOutData(i),
					o = c.parseError(i, n);
				c.showUploadError(o, l, "filebatchuploaderror"), c.uploadFileCount = u - 1, c.showPreview && (c.$preview.find(a).each(function() {
					var i = e(this),
						a = i.attr("data-fileindex");
					i.removeClass("file-uploading"), void 0 !== c.filestack[a] && t(a, "indicatorError", "indicatorErrorTitle")
				}), c.$preview.find(a).removeClass("file-uploading"), c.$preview.find(a + " .kv-file-upload").removeAttr("disabled"), c.$preview.find(a + " .kv-file-delete").removeAttr("disabled"))
			}, e.each(f, function(e, i) {
				z(f[e]) || c.formdata.append(c.uploadFileAttr, i)
			}), c.ajaxSubmit(l, o, d, p))
		},
		uploadExtraOnly: function() {
			var e, i, t, a, r = this,
				n = {};
			r.formdata = new FormData, r.abort(n) || (e = function(e) {
				r.lock();
				var i = r.getOutData(e);
				r.raise("filebatchpreupload", [i]), r.setProgress(50), n.data = i, n.xhr = e, r.abort(n) && (e.abort(), r.setProgress(100))
			}, i = function(e, i, t) {
				var a = r.getOutData(t, e);
				void 0 === e.error || z(e.error) ? (r.raise("filebatchuploadsuccess", [a]), r.clearFileInput(), r.initUploadSuccess(e)) : r.showUploadError(e.error, a, "filebatchuploaderror")
			}, t = function() {
				r.setProgress(100), r.unlock(), r.raise("filebatchuploadcomplete", [r.filestack, r.getExtraData()]), r.clearFileInput()
			}, a = function(e, i, t) {
				var a = r.getOutData(e),
					l = r.parseError(e, t);
				n.data = a, r.showUploadError(l, a, "filebatchuploaderror")
			}, r.ajaxSubmit(e, i, t, a))
		},
		hideFileIcon: function() {
			this.overwriteInitial && this.$captionContainer.find(".kv-caption-icon").hide()
		},
		showFileIcon: function() {
			this.$captionContainer.find(".kv-caption-icon").show()
		},
		resetErrors: function(e) {
			var i = this,
				t = i.$errorContainer;
			i.isError = !1, i.$container.removeClass("has-error"), t.html(""), e ? t.fadeOut("slow") : t.hide()
		},
		showFolderError: function(e) {
			var i = this,
				t = i.$errorContainer;
			e && (t.html(i.msgFoldersNotAllowed.repl("{n}", e)), t.fadeIn(800), s(i.$container, "has-error"), i.raise("filefoldererror", [e]))
		},
		showUploadError: function(e, i, t) {
			var a = this,
				r = a.$errorContainer,
				n = t || "fileuploaderror";
			return 0 === r.find("ul").length ? r.html("<ul><li>" + e + "</li></ul>") : r.find("ul").append("<li>" + e + "</li>"), r.fadeIn(800), a.raise(n, [i]), s(a.$container, "has-error"), !0
		},
		showError: function(e, i, t) {
			var a = this,
				r = a.$errorContainer,
				n = t || "fileerror";
			return i = i || {}, i.reader = a.reader, r.html(e), r.fadeIn(800), a.raise(n, [i]), a.isUploadable || a.clearFileInput(), s(a.$container, "has-error"), a.$btnUpload.attr("disabled", !0), !0
		},
		errorHandler: function(e, i) {
			var t = this,
				a = e.target.error;
			switch(a.code) {
				case a.NOT_FOUND_ERR:
					t.showError(t.msgFileNotFound.repl("{name}", i));
					break;
				case a.SECURITY_ERR:
					t.showError(t.msgFileSecured.repl("{name}", i));
					break;
				case a.NOT_READABLE_ERR:
					t.showError(t.msgFileNotReadable.repl("{name}", i));
					break;
				case a.ABORT_ERR:
					t.showError(t.msgFilePreviewAborted.repl("{name}", i));
					break;
				default:
					t.showError(t.msgFilePreviewError.repl("{name}", i))
			}
		},
		parseFileType: function(e) {
			var i, t, a, r, n = this;
			for(r = 0; r < L.length; r += 1)
				if(a = L[r], i = N(a, n.fileTypeSettings) ? n.fileTypeSettings[a] : R[a], t = i(e.type, e.name) ? a : "", !z(t)) return t;
			return "other"
		},
		previewDefault: function(i, t, a) {
			if(this.showPreview) {
				var r = this,
					n = H.createObjectURL(i),
					l = e("#" + t),
					o = r.previewSettings.other,
					s = r.renderFileFooter(i.name, o.width),
					d = r.getPreviewTemplate("other"),
					p = t.slice(t.lastIndexOf("-") + 1),
					c = "";
				a === !0 && (c = " btn disabled", s += '<div class="file-other-error text-danger"><i class="glyphicon glyphicon-exclamation-sign"></i></div>'), r.$preview.append("\n" + d.repl("{previewId}", t).repl("{frameClass}", c).repl("{fileindex}", p).repl("{caption}", r.slug(i.name)).repl("{width}", o.width).repl("{height}", o.height).repl("{type}", i.type).repl("{data}", n).repl("{footer}", s)), l.on("load", function() {
					H.revokeObjectURL(l.attr("data"))
				})
			}
		},
		previewFile: function(e, i, t, a) {
			if(this.showPreview) {
				var r, n, l, o, s = this,
					d = s.parseFileType(e),
					p = s.slug(e.name),
					c = s.allowedPreviewTypes,
					f = s.allowedPreviewMimeTypes,
					u = s.getPreviewTemplate(d),
					v = N(d, s.previewSettings) ? s.previewSettings[d] : O[d],
					h = parseInt(s.wrapTextLength, 10),
					m = s.wrapIndicator,
					g = c.indexOf(d) >= 0,
					w = z(f) || !z(f) && N(e.type, f),
					b = s.renderFileFooter(p, v.width),
					x = "",
					C = t.slice(t.lastIndexOf("-") + 1);
				g && w ? ("text" === d ? (n = _(i.target.result), H.revokeObjectURL(a), n.length > h && (l = "text-" + Z(), o = .75 * window.innerHeight, x = s.getLayoutTemplate("modal").repl("{id}", l).repl("{title}", p).repl("{height}", o).repl("{body}", n), m = m.repl("{title}", p).repl("{dialog}", "$('#" + l + "').modal('show')"), n = n.substring(0, h - 1) + m), r = u.repl("{previewId}", t).repl("{caption}", p).repl("{frameClass}", "").repl("{type}", e.type).repl("{width}", v.width).repl("{height}", v.height).repl("{data}", n).repl("{footer}", b).repl("{fileindex}", C) + x) : r = u.repl("{previewId}", t).repl("{caption}", p).repl("{frameClass}", "").repl("{type}", e.type).repl("{data}", a).repl("{width}", v.width).repl("{height}", v.height).repl("{footer}", b).repl("{fileindex}", C), s.$preview.append("\n" + r), s.autoSizeImage(t)) : s.previewDefault(e, t)
			}
		},
		slugDefault: function(e) {
			return z(e) ? "" : e.split(/(\\|\/)/g).pop().replace(/[^\w\-.\\\/ ]+/g, "")
		},
		getFileStack: function() {
			var e = this;
			return e.filestack.filter(function(e) {
				return void 0 !== e
			})
		},
		readFiles: function(i) {
			
			function t(e) {
				if(z(r.attr("multiple")) && (f = 1), e >= f) return a.isUploadable && a.filestack.length > 0 ? a.raise("filebatchselected", [a.getFileStack()]) : a.raise("filebatchselected", [i]), o.removeClass("loading"), void s.html("");
				var m, g, w, b, x, C, y = v + e,
					E = c + "-" + y,
					$ = i[e],
					T = a.slug($.name),
					F = ($.size || 0) / 1e3,
					k = "",
					D = H.createObjectURL($),
					I = 0,
					P = a.allowedFileTypes,
					S = z(P) ? "" : P.join(", "),
					U = a.allowedFileExtensions,
					j = z(U) ? "" : U.join(", ");
					NL = a.notallowedFilenameExtensions;	//新增校验名称
				if(NL){
					var cr = T.match(NL);
					if(cr){
						var NLarr = NL.split("|");
						var b = "文件名称中包括";
						for(var keys = 0; keys < NLarr.length; keys++){
							b += '"'+ NLarr[keys] + '",';
						}
						b += "特殊字符，请删除后重新选择上传。";
						return void(a.isError = h(b, $, E, e));
					}
				}
				if(z(U) || (k = new RegExp("\\.(" + U.join("|") + ")$", "i")), F = F.toFixed(2), a.maxFileSize > 0 && F > a.maxFileSize) return b = a.msgSizeTooLarge.repl("{name}", T).repl("{size}", F).repl("{maxSize}", a.maxFileSize), void(a.isError = h(b, $, E, e));
				if(!z(P) && B(P)) {
					for(w = 0; w < P.length; w += 1) x = P[w], g = u[x], C = void 0 !== g && g($.type, T), I += z(C) ? 0 : C.length;
					if(0 === I) return b = a.msgInvalidFileType.repl("{name}", T).repl("{types}", S), void(a.isError = h(b, $, E, e))
				}
				return 0 !== I || z(U) || !B(U) || z(k) || (C = T.match(k), I += z(C) ? 0 : C.length, 0 !== I) ? a.showPreview ? (n.length > 0 && void 0 !== FileReader ? (s.html(d.repl("{index}", e + 1).repl("{files}", f)), o.addClass("loading"), l.onerror = function(e) {
					a.errorHandler(e, T)
				}, l.onload = function(e) {
					a.previewFile($, e, E, D), a.initFileActions()
				}, l.onloadend = function() {
					b = p.repl("{index}", e + 1).repl("{files}", f).repl("{percent}", 50).repl("{name}", T), setTimeout(function() {
						s.html(b), H.revokeObjectURL(D)
					}, 100), setTimeout(function() {
						t(e + 1), a.updateFileDetails(f)
					}, 100), a.raise("fileloaded", [$, E, e, l])
				}, l.onprogress = function(i) {
					if(i.lengthComputable) {
						var t = i.loaded / i.total * 100,
							a = Math.ceil(t);
						b = p.repl("{index}", e + 1).repl("{files}", f).repl("{percent}", a).repl("{name}", T), setTimeout(function() {
							s.html(b)
						}, 100)
					}
				}, m = N("text", u) ? u.text : R.text, m($.type, T) ? l.readAsText($, a.textEncoding) : l.readAsArrayBuffer($)) : (a.previewDefault($, E), setTimeout(function() {
					t(e + 1), a.updateFileDetails(f)
				}, 100), a.raise("fileloaded", [$, E, e, l])), void a.filestack.push($)) : (a.filestack.push($), setTimeout(t(e + 1), 100), void a.raise("fileloaded", [$, E, e, l])) : (b = a.msgInvalidFileExtension.repl("{name}", T).repl("{extensions}", j), void(a.isError = h(b, $, E, e)))
			}
			this.reader = new FileReader;
			var a = this,
				r = a.$element,
				n = a.$preview,
				l = a.reader,
				o = a.$previewContainer,
				s = a.$previewStatus,
				d = a.msgLoading,
				p = a.msgProgress,
				c = a.previewInitId,
				f = i.length,
				u = a.fileTypeSettings,
				v = a.filestack.length,
				h = function(t, r, n, l) {
					var o = e.extend(a.getOutData({}, {}, i), {
							id: n,
							index: l
						}),
						s = {
							id: n,
							index: l,
							file: r,
							files: i
						};
					return a.previewDefault(r, n, !0), a.isUploadable ? a.showUploadError(t, o) : a.showError(t, s)
				};
			t(0), a.updateFileDetails(f, !1);
		},
		updateFileDetails: function(e) {
			var i = this,
				a = i.msgSelected,
				r = i.$element,
				n = i.getFileStack(),
				l = r.val() || n.length && n[0].name || "",
				o = i.slug(l),
				s = i.isUploadable ? n.length : e,
				d = t.count(i.id) + s,
				p = s > 1 ? a.repl("{n}", d) : o;
			i.isError ? (i.$previewContainer.removeClass("loading"), i.$previewStatus.html(""), i.$captionContainer.find(".kv-caption-icon").hide()) : i.showFileIcon(), i.setCaption(p, i.isError), i.$container.removeClass("file-input-new file-input-ajax-new"), 1 === arguments.length && i.raise("fileselect", [e, o]), t.count(i.id) && i.initPreviewDeletes()
		},
		change: function(i) {
			var a = this,
				r = a.$element;
			if(!a.isUploadable && z(r.val()) && a.fileInputCleared) return void(a.fileInputCleared = !1);
			a.fileInputCleared = !1;
			var n, l, o, s, d = a.$preview,
				p = arguments.length > 1,
				c = p ? i.originalEvent.dataTransfer.files : r.get(0).files,
				f = z(r.attr("multiple")),
				u = 0,
				v = 0,
				h = a.filestack.length,
				m = a.isUploadable,
				g = function(i, t, r, n) {
					var l = e.extend(a.getOutData({}, {}, c), {
							id: r,
							index: n
						}),
						o = {
							id: r,
							index: n,
							file: t,
							files: c
						};
					return a.isUploadable ? a.showUploadError(i, l) : a.showError(i, o)
				};
			if(a.reader = null, a.resetUpload(), a.hideFileIcon(), a.isUploadable && a.$container.find(".file-drop-zone ." + a.dropZoneTitleClass).remove(), p)
				for(n = []; c[u];) s = c[u], s.type || s.size % 4096 !== 0 ? n.push(s) : v++, u++;
			else n = void 0 === i.target.files ? i.target && i.target.value ? [{
				name: i.target.value.replace(/^.+\\/, "")
			}] : [] : i.target.files;
			if(z(n) || 0 === n.length) return m || a.clear(), a.showFolderError(v), void a.raise("fileselectnone");
			if(a.resetErrors(), !m || f && h > 0) {
				if(!a.overwriteInitial && t.count(a.id)) {
					var w = t.out(a.id);
					d.html(w.content), a.setCaption(w.caption), a.initPreviewDeletes()
				} else d.html("");
				f && h > 0 && (a.filestack = [])
			}
			return o = a.isUploadable ? a.getFileStack().length + n.length : n.length, a.maxFileCount > 0 && o > a.maxFileCount ? (l = a.msgFilesTooMany.repl("{m}", a.maxFileCount).repl("{n}", o), a.isError = g(l, null, null, null), a.$captionContainer.find(".kv-caption-icon").hide(), a.$caption.html(a.msgValidationError), a.setEllipsis(), void a.$container.removeClass("file-input-new file-input-ajax-new")) : (a.isIE9 ? a.updateFileDetails(1) : a.readFiles(n), void a.showFolderError(v))
		},
		autoSizeImage: function(e) {
			var i, t, a, r = this,
				n = r.$preview,
				l = n.find("#" + e),
				o = l.find("img");
			o.length && o.on("load", function() {
				i = l.width(), t = n.width(), i > t && (o.css("width", "100%"), l.css("width", "97%")), a = o.closest(".file-preview-frame").find(".file-caption-name"), a.length && (a.width(o.width()), a.attr("title", a.text())), r.raise("fileimageloaded", e)
			})
		},
		setCaption: function(i, t) {
			var a, r, n = this,
				l = t || !1;
			z(i) || 0 === n.$caption.length || (l ? (a = e("<div>" + n.msgValidationError + "</div>").text(), r = '<span class="' + n.msgValidationErrorClass + '">' + n.msgValidationErrorIcon + a + "</span>") : (a = e("<div>" + i + "</div>").text(), r = a + n.getLayoutTemplate("icon")), n.$caption.html(r), n.$caption.attr("title", a), n.$captionContainer.find(".file-caption-ellipsis").attr("title", a), n.setEllipsis())
		},
		initBrowse: function(e) {
			var i = this;
			i.$btnFile = e.find(".btn-file"), i.$btnFile.append(i.$element)
		},
		createContainer: function() {
			var i = this,
				t = e(document.createElement("span")).attr({
					"class": "file-input file-input-new"
				}).html(i.renderMain());
			return i.$element.before(t), i.initBrowse(t), t
		},
		refreshContainer: function() {
			var e = this,
				i = e.$container;
			i.before(e.$element), i.html(e.renderMain()), e.initBrowse(i)
		},
		renderMain: function() {
			var e = this,
				i = e.isUploadable && e.dropZoneEnabled ? " file-drop-zone" : "",
				t = e.showPreview ? e.getLayoutTemplate("preview").repl("{class}", e.previewClass).repl("{dropClass}", i) : "",
				a = e.isDisabled ? e.captionClass + " file-caption-disabled" : e.captionClass,
				r = e.captionTemplate.repl("{class}", a + " kv-fileinput-caption");
			return e.mainTemplate.repl("{class}", e.mainClass).repl("{preview}", t).repl("{caption}", r).repl("{upload}", e.renderUpload()).repl("{remove}", e.renderRemove()).repl("{cancel}", e.renderCancel()).repl("{browse}", e.renderBrowse())
		},
		renderBrowse: function() {
			var e = this,
				i = e.browseClass + " btn-file",
				t = "";
			return e.isDisabled && (t = " disabled "), '<div class="' + i + '"' + t + "> " + e.browseIcon + e.browseLabel + " </div>"
		},
		renderRemove: function() {
			var e = this,
				i = e.removeClass + " fileinput-remove fileinput-remove-button",
				t = "";
			return e.showRemove ? (e.isDisabled && (t = " disabled "), '<button type="button" title="' + e.removeTitle + '" class="' + i + '"' + t + ">" + e.removeIcon + e.removeLabel + "</button>") : ""
		},
		renderCancel: function() {
			var e = this,
				i = e.cancelClass + " fileinput-cancel fileinput-cancel-button";
			return e.showCancel ? '<button type="button" title="' + e.cancelTitle + '" class="hide ' + i + '">' + e.cancelIcon + e.cancelLabel + "</button>" : ""
		},
		renderUpload: function() {
			var e = this,
				i = e.uploadClass + " kv-fileinput-upload fileinput-upload-button",
				t = "",
				a = "";
			return e.showUpload ? (e.isDisabled && (a = " disabled "), t = !e.isUploadable || e.isDisabled ? '<button type="submit" title="' + e.uploadTitle + '"class="' + i + '"' + a + ">" + e.uploadIcon + e.uploadLabel + "</button>" : '<a href="' + e.uploadUrl + '" title="' + e.uploadTitle + '" class="' + i + '"' + a + ">" + e.uploadIcon + e.uploadLabel + "</a>") : ""
		}
	}, e.fn.fileinput = function(t) {
		if(n() || i(9)) {
			var a = Array.apply(null, arguments);
			return a.shift(), this.each(function() {
				var i = e(this),
					r = i.data("fileinput"),
					n = "object" == typeof t && t;
				r || (r = new V(this, e.extend({}, e.fn.fileinput.defaults, n, e(this).data())), i.data("fileinput", r)), "string" == typeof t && r[t].apply(r, a)
			})
		}
	}, e.fn.fileinput.defaults = {
		showCaption: !0,
		showPreview: !0,
		showRemove: !0,
		showUpload: !0,
		showCancel: !0,
		mainClass: "",
		previewClass: "",
		captionClass: "",
		mainTemplate: null,
		notallowedFilenameExtensions:null,//新增校验名称
		initialCaption: "",
		initialPreview: [],
		initialPreviewDelimiter: "*$$*",
		initialPreviewConfig: [],
		initialPreviewThumbTags: [],
		previewThumbTags: {},
		initialPreviewShowDelete: !0,
		deleteUrl: "",
		deleteExtraData: {},
		overwriteInitial: !0,
		layoutTemplates: j,
		previewTemplates: A,
		allowedPreviewTypes: L,
		allowedPreviewMimeTypes: null,
		allowedFileTypes: null,
		allowedFileExtensions: null,
		customLayoutTags: {},
		customPreviewTags: {},
		previewSettings: O,
		fileTypeSettings: R,
		previewFileIcon: '<i class="glyphicon glyphicon-file"></i>',
		browseIcon: '<i class="glyphicon glyphicon-folder-open"></i> &nbsp;',
		browseClass: "btn btn-primary",
		removeIcon: '<i class="glyphicon glyphicon-trash"></i> ',
		removeClass: "btn btn-default",
		cancelIcon: '<i class="glyphicon glyphicon-ban-circle"></i> ',
		cancelClass: "btn btn-default",
		uploadIcon: '<i class="glyphicon glyphicon-upload"></i> ',
		uploadClass: "btn btn-default",
		uploadUrl: null,
		uploadAsync: !0,
		uploadExtraData: {},
		maxFileSize: 0,
		minFileCount: 0,
		maxFileCount: 0,
		msgValidationErrorClass: "text-danger",
		msgValidationErrorIcon: '<i class="glyphicon glyphicon-exclamation-sign"></i> ',
		msgErrorClass: "file-error-message",
		progressClass: "progress-bar progress-bar-success progress-bar-striped active",
		progressCompleteClass: "progress-bar progress-bar-success",
		previewFileType: "image",
		wrapTextLength: 250,
		wrapIndicator: ' <span class="wrap-indicator" title="{title}" onclick="{dialog}">[&hellip;]</span>',
		elCaptionContainer: null,
		elCaptionText: null,
		elPreviewContainer: null,
		elPreviewImage: null,
		elPreviewStatus: null,
		elErrorContainer: null,
		slugCallback: null,
		dropZoneEnabled: !0,
		dropZoneTitleClass: "file-drop-zone-title",
		fileActionSettings: {},
		otherActionButtons: "",
		textEncoding: "UTF-8",
		ajaxSettings: {},
		ajaxDeleteSettings: {},
		showAjaxErrorDetails: !0
	}, e.fn.fileinput.locales = {}, e.fn.fileinput.locales.en = {
		fileSingle: '单个文件',
        filePlural: '多个文件',
        browseLabel: '选择文件 &hellip;',
        removeLabel: '删除文件',
        removeTitle: '删除选中文件',
        cancelLabel: '取消',
        cancelTitle: '取消上传',
        uploadLabel: '上传',
        uploadTitle: '上传选中文件',
        msgSizeTooLarge: '文件 "{name}" (<b>{size} KB</b>) 超过了文件大小 <b>{maxSize} KB</b>的限制,请重新上传!',
        msgFilesTooLess: '文件数量必须大于 <b>{n}</b> {files} ，请重新上传！',
        msgFilesTooMany: '仅支持传输 <b>({n})</b> exceeds maximum allowed limit of <b>{m}</b>. 请重试您的上传!',
        msgFilesTooMany: '仅能上传<b>{m}</b>个文件，请确认后上传!',
        msgFileNotFound: '文件 "{name}" 未找到!',
        msgFileSecured: 'Security restrictions prevent reading the file "{name}".',
        msgFileNotReadable: 'File "{name}" is not readable.',
        msgFilePreviewAborted: 'File preview aborted for "{name}".',
        msgFilePreviewError: 'An error occurred while reading the file "{name}".',
        msgInvalidFileType: 'Invalid type for file "{name}". Only "{types}" files are supported.',
        msgInvalidFileExtension: '"{name}"不符合文件传输要求，仅支持后缀为".{extensions}"格式的文件。',
        msgValidationError: '处理失败',
        msgLoading: 'Loading file {index} of {files} &hellip;',
        msgProgress: 'Loading file {index} of {files} - {name} - {percent}% completed.',
        msgSelected: '选中{n}个文件',
        msgFoldersNotAllowed: 'Drag & drop files only! {n} folder(s) dropped were skipped.',
        dropZoneTitle: '请先选择文件或将文件拖入框内，然后点击<span id="sbb">上传</span>按钮上传'
	}, e.extend(e.fn.fileinput.defaults, e.fn.fileinput.locales.en), e.fn.fileinput.Constructor = V, e(document).ready(function() {
		var i = e("input.file[type=file]"),
			t = i.attr("type") ? i.length : 0;
		t > 0 && i.fileinput()
	})
}(window.jQuery);
