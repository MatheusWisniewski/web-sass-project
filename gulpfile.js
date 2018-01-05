var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync");
var reload = browserSync.reload;

var SOURCE_PATHS = {
    sassSource: 'src/scss/*.scss'
}
var APP_PATHS = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js'
}

gulp.task('sass', function() {
    return gulp.src(SOURCE_PATHS.sassSource)
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest(APP_PATHS.css))
});

gulp.task('serve', ['sass'], function() {
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

gulp.task('watch', ['serve'], function() {
    gulp.watch(
        [
            SOURCE_PATHS.sassSource
        ],
        [
            'sass'
        ]
    );
})

gulp.task('default', ['watch']);