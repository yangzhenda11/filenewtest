//使用安装
//1.安装node和npm
//2.npm install [-g] fis3
//3.npm install [-g] fis3-hook-relative

//使用命令
//fis3 release {media} -d {路径}
//fis3 release -d {路径}
//fis3 release -d ../upf-contract2-static-release/upf-contract2-static
// 启用使用相对路径编译插件
fis.hook('relative');

// 让所有文件，都使用相对路径。
fis.match('**', {
  relative: true
})

//编译过滤
fis.set('project.ignore', ['static/plugins/bootstrap-fileinput/FormData.js','static/plugins/pdf/build/pdf.worker.js','static/plugins/pdf/web/debugger.js','fis-conf.js']);

//fis.match('*.{js,css}', {				// 加 md5
//	useHash: true
//});

fis.set('new date', Date.now());		//加时间戳
fis.match('*.{js,css,jpg,png}', {
  	query: '?t=' + fis.get('new date')
});

//fis.match('*.js', {
//	// fis-optimizer-uglify-js 插件进行压缩，已内置
//	optimizer: fis.plugin('uglify-js')
//});
//
//fis.match('*.css', {
//	// fis-optimizer-clean-css 插件进行压缩，已内置
//	optimizer: fis.plugin('clean-css')
//});


// css3 属性添加前缀
//fis.match('*.{css,less}', {
//	preprocessor: fis.plugin('autoprefixer', {
//  	"browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
//  	"cascade": true
//	})
//})

//// 启用 fis-spriter-csssprites 插件
//fis.match('::package', {
//	spriter: fis.plugin('csssprites')
//});

//// 对 CSS 进行图片合并
//fis.match('*.css', {
//// 给匹配到的文件分配属性 `useSprite`
//	useSprite: true
//});

//fis.match('*.png', {
//// fis-optimizer-png-compressor 插件进行压缩，已内置
//	optimizer: fis.plugin('png-compressor')
//});


