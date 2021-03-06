var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;
var autoprefixer = require("gulp-autoprefixer");
var clean = require("gulp-clean");
var concat = require("gulp-concat");
var browserify = require("gulp-browserify");
var merge = require("merge-stream");
var newer = require("gulp-newer");
var imagemin = require("gulp-imagemin");
var injectPartials = require("gulp-inject-partials");
var minify = require("gulp-minify");
var rename = require("gulp-rename");
var cssmin = require("gulp-cssmin");
var htmlmin = require("gulp-htmlmin");

var SOURCE_PATHS = {
    htmlSource: 'src/*.html',
    htmlPartialSource: 'src/partial/*.html',
    sassSource: 'src/scss/*.scss',
    jsSource: 'src/js/*.js',
    imgSource: 'src/img/**'
}
var APP_PATHS = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',
    fonts: 'app/fonts',
    img: 'app/img'
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

    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');

    var sassFiles = gulp.src(SOURCE_PATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError));

    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(APP_PATHS.css));
});



gulp.task('images', function() {
    return gulp.src(SOURCE_PATHS.imgSource)
        .pipe(newer(APP_PATHS.img))
        .pipe(imagemin())
        .pipe(gulp.dest(APP_PATHS.img));
})

gulp.task('move-fonts', function() {
    return gulp.src('./node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest(APP_PATHS.fonts))
})

gulp.task('scripts', ['clean-scripts'],  function() {
    return gulp.src(SOURCE_PATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(gulp.dest(APP_PATHS.js))
})

/* PROD ONLY */

gulp.task('compress-html', function() {
    return gulp.src(SOURCE_PATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(APP_PATHS.root))
})

gulp.task('compress-css', function() {

    var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
    var sassFiles;

    sassFiles = gulp.src(SOURCE_PATHS.sassSource)
        .pipe(autoprefixer())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError));

    return merge(bootstrapCSS, sassFiles)
        .pipe(concat('app.css'))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(APP_PATHS.css));
});

gulp.task('compress-js',  function() {
    return gulp.src(SOURCE_PATHS.jsSource)
        .pipe(concat('main.js'))
        .pipe(browserify())
        .pipe(minify({
            noSource: true
        }))
        .pipe(gulp.dest(APP_PATHS.js))
})

/* END OF PROD ONLY */

gulp.task('html', ['clean-html'], function() {
    return gulp.src(SOURCE_PATHS.htmlSource)
        .pipe(injectPartials())
        .pipe(gulp.dest(APP_PATHS.root))
})

gulp.task('serve', ['html', 'sass', 'scripts'], function() {
    browserSync.init(
        [
            APP_PATHS.root + '/*.html', 
            APP_PATHS.css + '/*.css',
            APP_PATHS.js + '/*.js'
        ], 
        {
            server: {
                baseDir: APP_PATHS.root
            },
            open: false
        }
    )
})

gulp.task('watch', ['serve', 'move-fonts', 'images'], function() {
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
            SOURCE_PATHS.htmlSource,
            SOURCE_PATHS.htmlPartialSource
        ],
        [
            'html'
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
    gulp.watch(
        [
            SOURCE_PATHS.imgSource
        ],
        [
            'images'
        ]
    );
})

gulp.task('default', ['watch']);

gulp.task('production', ['compress-html', 'compress-css', 'compress-js']);