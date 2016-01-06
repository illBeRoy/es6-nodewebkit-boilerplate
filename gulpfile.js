var gulp = require('gulp'),
    babel = require('gulp-babel'),
    webpack = require('gulp-webpack'),
    clean = require('gulp-clean'),
    insert = require('gulp-insert'),
    replace = require('gulp-replace'),
    sequence = require('gulp-sequence'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    serve = require('gulp-serve'),
    shell = require('gulp-shell'),
    nodewebkit = require('gulp-node-webkit-builder');

var packageJson = require('./src/package.json');

var platformToExecutable = {
    'win32': 'bin\\' + packageJson.name + '\\win32\\' + packageJson.name + '.exe',
    'darwin': 'open bin/' + packageJson.name + '/osx32/' + packageJson.name + '.app',
    'linux': 'bin/' + packageJson.name + '/linux32/' + packageJson.name
};


// Clean
gulp.task('clean', function() {

    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});


// Copy assets
gulp.task('assets', function() {

    return gulp.src(['assets/*', 'assets/**/*'])
        .pipe(gulp.dest('dist/assets'));
});


// Build sources
gulp.task('build', sequence('build-js-1', ['build-js-2', 'build-html', 'build-style']));

gulp.task('build-js-1', function() {

    return gulp.src(['src/app/*.js', 'src/app/**/*.js'])
        .pipe(babel({presets: ['es2015'], plugins: ['transform-runtime']}))
        .pipe(gulp.dest('.cache/js'));
});

gulp.task('build-js-2', function() {

    return gulp.src('.cache/js/main.js')
        .pipe(webpack())
        .pipe(replace('nodeRequire', 'require'))
        .pipe(rename('main.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-html', function() {

    var appStruct = require('./src/view/appStruct.json');

    var htmlString = '<html><head><meta charset="UTF-8">';
    appStruct.scripts.forEach(function(o) {

        htmlString += '<script type="text/javascript" src="' + o + '" ></script>';
    });
    appStruct.stylesheets.forEach(function(o) {

        htmlString += '<link rel="stylesheet" type="text/css" href="' + o + '" />';
    });
    htmlString += '<title>' + appStruct.title + '</title>';
    htmlString += '</head><body>';

    return gulp.src(['src/view/*.view.html', 'src/view/**/*.view.html'])
        .pipe(concat('index.html'))
        .pipe(insert.prepend(htmlString))
        .pipe(insert.append('</body></html>'))
        .pipe(gulp.dest('dist'));
});

gulp.task('build-style', function() {

    return gulp.src([
        'src/view/*.view.less',
        'src/view/**/*.view.less',
        'src/view/*.config.less',
        'src/view/**/*.config.less'
    ])
        .pipe(concat('style.css'))
        .pipe(less())
        .pipe(gulp.dest('dist'));
});


// serve over localhost
gulp.task('serve', serve({
    root: 'dist',
    port: 3000
}));


// package as a node-webkit app
gulp.task('node-webkit-prepare', function() {

   return  gulp.src('src/package.json')
        .pipe(gulp.dest('dist'));
});

gulp.task('node-webkit-compile', function() {

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

gulp.task('node-webkit-run', shell.task([platformToExecutable[process.platform]]));


gulp.task('run', sequence('package', 'node-webkit-run'));

gulp.task('package', sequence('clean', ['build', 'assets'], 'node-webkit-prepare', 'node-webkit-compile'));

gulp.task('preview', sequence('clean', ['build', 'assets'], 'serve'));

gulp.task('default', sequence('clean', ['build', 'assets']));