

var gulp = require('gulp');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync').create();


gulp.task('script', function () {
	console.log('...gulp virkar!');
});

gulp.task('serve', ['sass'], function () {
	browserSync.init({
		server:"./"
	});

	gulp.watch("./sass/**/*.scss", ['sass']);
	gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('sass', function () {
	gulp.src('./sass/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('./css'));
});

gulp.task('lint', function() {
	return gulp.src('./js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('default'));
});

gulp.task('default', ['script', 'serve', 'sass' , 'lint'])