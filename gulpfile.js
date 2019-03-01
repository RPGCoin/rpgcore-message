'use strict';

var gulp = require('gulp');
var rpgcoreTasks = require('rpgcore-build');

rpgcoreTasks('message');

gulp.task('default', ['lint', 'coverage']);
