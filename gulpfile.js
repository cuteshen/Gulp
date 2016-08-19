// 引入 gulp及组件
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    less = require('gulp-less'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    spritesmith = require('gulp.spritesmith');
option = {
    buildPath: "",//构建目录
    jsItem: []
};
//定义编译less文件的任务
gulp.task('lessback', function () {
    return gulp.src(option.buildPath + '/less/*.less')//指定操作目录
        .pipe(less())           //执行编译
        .pipe(minifycss())   //执行压缩
        .pipe(concat('mainLess.css')) //合并
        .pipe(gulp.dest(option.buildPath + '/cssmin/'));//输出文件夹
});
//压缩普通css
gulp.task('minifycss', function () {
    return gulp.src(option.buildPath + '/css/*.css')    //需要操作的文件
        .pipe(rename({suffix: '.min'}))   //rename压缩后的文件名
        .pipe(minifycss())                //执行压缩
        .pipe(concat('main.css'))           //合并
        .pipe(gulp.dest(option.buildPath + '/cssmin/'));   //输出文件夹
});
//js语法检查
gulp.task('jshint', function () {
    return gulp.src(option.buildPath + '/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
//压缩,合并 js
gulp.task('minifyjs', function () {
    return gulp.src(option.jsItem)       //需要操作的文件
        .pipe(concat('all.js'))             //合并所有js到all.js
        .pipe(gulp.dest(option.buildPath + '/jsmin/')) //输出到文件夹
        .pipe(rename({suffix: '.min'}))      //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(option.buildPath + '/jsmin/'));  //输出
});
gulp.task('sprite', function () {
    console.log(option.buildPath +'/images/');
    return gulp.src(option.buildPath +'/images/*.png')//需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'sprite/images/sprite.png',//保存合并后图片的地址
            cssName: 'sprite/css/sprite.css',//保存合并后对于css样式的地址
            padding: 5,//合并时两个图片的间距
            algorithm: 'binary-tree',//注释1
            cssTemplate:option.buildPath+"/images/sprite/model/handlebarsStr.css"//注释2
        }))
        .pipe(gulp.dest(option.buildPath+'/images/'));
});
//默认命令,在cmd中输入gulp后,执行的就是这个任务(压缩js需要在检查js之后操作)
gulp.task('default', function () {
    option.buildPath = "project/src";
    option.jsItem = [option.buildPath + "/js/script.js", option.buildPath + "/js/script2.js"];
    //gulp.start('lessback', 'jshint', 'minifycss', 'minifyjs');
    gulp.start('sprite');
});
//也可以通过 gulp 方法名 来执行任务