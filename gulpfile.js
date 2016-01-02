var gulp = require('gulp'),
    babel = require('gulp-babel'),
    clean = require('gulp-clean'),
    sequence = require('gulp-sequence'),
    rename = require('gulp-rename'),
    serve = require('gulp-serve'),
    nodewebkit = require('gulp-node-webkit-builder');


gulp.task('clean', function() {

    return gulp.src(['dist/*', 'dist/**/*'], {read: false})
        .pipe(clean());
});

gulp.task('build', sequence(['build-js', 'build-view']));

gulp.task('assets', function() {

    return gulp.src(['assets/*', 'assets/**/*'])
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('serve', serve({
    root: 'dist',
    port: 3000
}));

gulp.task('build-js', function() {

    return gulp.src('src/app/main.js')
        .pipe(babel({presets: ['es2015']}))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-view', function() {

    return gulp.src('src/view/main.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('dist'));
});

gulp.task('node-webkit-prepare', function() {

   return  gulp.src('src/package.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('node-webkit-compile', function() {

    var packageJson = require('./src/package.json');

    return gulp.src(['dist/*', 'dist/**/*'])
        .pipe(nodewebkit({
            buildDir: 'bin',
            cacheDir: '.cache',
            version: 'v0.9.2',
            platforms: ['win32', 'osx32', 'linux32'],
            appName: packageJson.name,
            appVersion: packageJson.version
        }));
});

gulp.task('package', sequence('clean', ['build', 'assets'], 'node-webkit-prepare', 'node-webkit-compile'));

gulp.task('preview', sequence('clean', ['build', 'assets'], 'serve'));

gulp.task('default', sequence('clean', ['build', 'assets']));