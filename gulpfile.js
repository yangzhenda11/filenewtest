var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var connect = require('gulp-connect');

//本地服务启动任务
gulp.task('localhost', function() {
  connect.server();
});

gulp.task('localhost-live', function() {
  connect.server({
    livereload: true
  });
});

//sass编译
gulp.task('sass', function () {
	
	gulp.src('./sass/bootstrap.scss')
	.pipe(sass())
	.pipe(gulp.dest('./static/plugins/bootstrap/css'));
	
	gulp.src('./sass/adminui.scss')
	.pipe(sass())
	.pipe(gulp.dest('./static/css'));
	
	//地铁项目应用
	gulp.src('./sass/theme1/adminui.scss')
	.pipe(sass())
	.pipe(gulp.dest('./static/css/theme1/'));
	
});

gulp.task('minify', function () {
		// css minify 
    gulp.src(['./static/plugins/bootstrap/css/*.css','!./static/plugins/bootstrap/css/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/bootstrap/css'));
    
    gulp.src(['./static/css/*.css','!./static/css/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/css'));
    
    gulp.src(['./static/css/theme1/*.css','!./static/css/theme1/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/css/theme1'));
    
    gulp.src(['./static/plugins/ace/css/*.css','!./static/plugins/ace/css/*.min.css'])
    .pipe(minifyCss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/ace/css'));
    
    //js minify
    gulp.src(['./static/js/*.js','!./static/js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/js'));
    
     gulp.src(['./static/plugins/ace/js/*.js','!./static/plugins/ace/js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/ace/js'));
    
    gulp.src(['./static/plugins/layer/*.js','!./static/plugins/layer/*.min.js'])
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./static/plugins/layer'));
    
});

gulp.task('sass:watch', function () {
	//gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default',['sass','minify'], function() {
  // 将你的默认的任务代码放在这
});