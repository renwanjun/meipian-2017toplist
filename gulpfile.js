'use strict'
const gulp= require('gulp');

const gulp_build=require('./build/gulpfile-build');
const gulp_dev=require('./build/gulpfile-dev');
gulp.task('dev',gulp_dev.serve);
gulp.task('build',gulp_build.serve)