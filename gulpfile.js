var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var autoprefixer = require("gulp-autoprefixer");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");

var SOURCE_PATHS = {
    htmlSource: 'src/*.html',
    sassSource: 'src/scss/*.scss',
    jsSource: 'src/js/*.js'
}
var APP_PATHS = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js'
}

gulp.task('clean-html', function() {
    return gulp.src(
            APP_PATHS.root + '*.html', 
            {
                read: false,
                force: true
            }
        )
        .pipe(clean());
})

gulp.task('clean-scripts', function() {
    return gulp.src(
            APP_PATHS.js + '/*.js', 
            {
                read: false,
                force: true
            }
        )
        .pipe(clean());
})

gulp.task('sass', function() {
    return gulp.src(SOURCE_PATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(APP_PATHS.css))
});

gulp.task('scripts', ['clean-scripts'],  function() {
    return gulp.src(SOURCE_PATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(gulp.dest(APP_PATHS.js))
})

gulp.task('copy', ['clean-html', 'clean-scripts'], function() {
    gulp.src(SOURCE_PATHS.htmlSource)
        .pipe(gulp.dest(APP_PATHS.root))
})

gulp.task('serve', ['sass', 'scripts'], function() {
    browserSync.init(
        [
            APP_PATHS.root + '/*.html', 
            APP_PATHS.css + '/*.css',
            APP_PATHS.js + '/*.js'
        ], 
        {
            server: {
                baseDir: APP_PATHS.root
            }
        }
    )
})

gulp.task('watch', ['serve', 'copy'], function() {
    gulp.watch(
        [
            SOURCE_PATHS.sassSource
        ],
        [
            'sass'
        ]
    );
    gulp.watch(
        [
            SOURCE_PATHS.htmlSource
        ],
        [
            'copy'
        ]
    );
    gulp.watch(
        [
            SOURCE_PATHS.jsSource
        ],
        [
            'scripts'
        ]
    );
})

gulp.task('default', ['watch']);