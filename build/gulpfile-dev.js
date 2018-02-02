'use strict'
const gulp = require('gulp'),
    concat = require('gulp-concat'),//- 多个文件合并为一个；  
    cleanCSS = require('gulp-clean-css'),//- 压缩CSS为一行；  
    ugLify = require('gulp-uglify'),//压缩js  
    imageMin = require('gulp-imagemin'),//压缩图片  
    pngquant = require('imagemin-pngquant'), // 深度压缩  
    htmlMin = require('gulp-htmlmin'),//压缩html  
    changed = require('gulp-changed'),//检查改变状态,过滤未被修改过的文件 
    sass = require('gulp-sass'),//压缩合并sass  
    px2rem = require('gulp-px2rem-plugin'),// 将px转换成rem
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require("browser-sync").create();//浏览器实时刷新  

// var config=require("./src/config.json");

const SRC = './src';
const DEST = './dist';

// 编译sass文件
gulp.task('scss', function () {
    gulp.src(['./src/scss/*.scss']) //多个文件以数组形式传入  
        .pipe(changed('dist/css', { hasChanged: changed.compareSha1Digest }))    // 过滤修改过的文件
        .pipe(sass({
            outputStyle: 'expand'
        }))//编译scss文件       .pipe(px2rem())
        .pipe(autoprefixer({
            browsers: ['last 5 versions', '>1%']
        }))
        .pipe(concat('main.css'))//合并之后生成main.css  
        // .pipe(cleanCSS())//压缩新生成的css  
        .pipe(gulp.dest('dist/css'))//将会在css下生成main.css  
        .pipe(browserSync.reload({ stream: true }));
})

//删除dist下的所有文件  
gulp.task('delete', function (cb) {
    return del(['dist/*', '!dist/assets/images'], cb);
})

//压缩html  
gulp.task('html', function () {
    var options = {
        removeComments: true,//清除HTML注释  
        collapseWhitespace: true,//压缩HTML  
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"  
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"  
        minifyJS: true,//压缩页面JS  
        minifyCSS: true//压缩页面CSS  
    };
    gulp.src(['src/index.html', 'src/index.php'])
        .pipe(changed('dist', { hasChanged: changed.compareSha1Digest }))
        .pipe(htmlMin(options))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({ stream: true }));
});

//实时编译less  
gulp.task('less', function () {
    gulp.src(['./src/less/*.less']) //多个文件以数组形式传入  
        .pipe(changed('dist/css', { hasChanged: changed.compareSha1Digest }))
        .pipe(less())//编译less文件  
        .pipe(concat('main.css'))//合并之后生成main.css  
        .pipe(cleanCSS())//压缩新生成的css  
        .pipe(gulp.dest('dist/css'))//将会在css下生成main.css  
        .pipe(browserSync.reload({ stream: true }));
});

//压缩js  
gulp.task("script", function () {
    gulp.src(['src/js/*.js'])  //'src/js/jquery-3.3.1.min.js', 
        .pipe(changed('dist/js', { hasChanged: changed.compareSha1Digest }))
        .pipe(concat('index.js'))
        .pipe(ugLify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.reload({ stream: true }));
});

// 压缩图片  
gulp.task('images', function () {
    gulp.src('./src/assets/images/*.*')
        .pipe(changed('dist/assets/images', { hasChanged: changed.compareSha1Digest }))
        .pipe(imageMin({
            progressive: true,// 无损压缩JPG图片  
            svgoPlugins: [{ removeViewBox: false }], // 不移除svg的viewbox属性  
            use: [pngquant()] // 使用pngquant插件进行深度压缩  
        }))
        .pipe(gulp.dest('dist/assets/images'))
        .pipe(browserSync.reload({ stream: true }));
});


// 为js,html,css,jpg|png|gif|jpeg文件引用添加版本号
gulp.task('version', function () {
    gulp.src('./src/assets/lib/jquery.3.3.1.min.js')
        .pipe(gulp.dest('dist/assets/lib'))
})

// gulp.task('rename',function(){
//     gulp.src('./src/assets/lib/jquery.3.3.1.min.js')
//     .pipe(rename(function(path){
//         path.basename='jquery.min';
//         path.extname="js";
//     }))
//     .pipe(gulp.dest('./build/assets/lib'))
// })

//启动热更新  
gulp.task('serve', function () {
    gulp.start('script', 'scss', 'html');
    browserSync.init({
        port: 2017,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('src/js/*.js', ['script']);         //监控文件变化，自动更新  
    gulp.watch('src/scss/*.scss', ['scss']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/images/*.*', ['images']);
});

gulp.task('default', ['serve']);

function serve() {
    gulp.start('script', 'scss', 'html');
    browserSync.init({
        port: 2017,
        server: {
            baseDir: ['dist']
        }
    });
    gulp.watch('src/js/*.js', ['script']);         //监控文件变化，自动更新  
    gulp.watch('src/scss/*.scss', ['scss']);
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/images/*.*', ['images']);
};

module.exports = {
    serve: serve
} 