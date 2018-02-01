'use strict'
const gulp= require('gulp');


const gulp_dev=require('./build/gulpfile-dev');
gulp.task('dev',gulp_dev.serve);