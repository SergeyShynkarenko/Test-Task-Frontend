let project_folder = "docs";
let source_folder = "development";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/images/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/**/*.{ttf,woff2,woff}",
  },
  watch: {
    html: source_folder + "/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/images/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/**/*.{ttf,woff2,woff}",
  },
  clean: "./" + project_folder + "/",
};
let { src, dest } = require("gulp"),
  gulp = require("gulp"),
  browsersync = require("browser-sync").create(),
  fileinclude = require("gulp-file-include"),
  del = require("del"),
  scss = require("gulp-sass")(require("sass")),
  autoprefixer = require("gulp-autoprefixer"),
  // group_media = require('gulp-group-css-media-queries'),
  clean_css = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify-es").default,
  imagemin = require("gulp-imagemin"),
  webp = require("gulp-webp");
// ghPages = require('gulp-gh-pages');

const browserSync = () => {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/",
    },
    port: 3000,
    notify: false,
  });
};

const html = () => {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
};

const images = () => {
  return src(path.src.img)
    .pipe(dest(path.build.img))
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
};

const css = () => {
  return (
    src(path.src.css)
      .pipe(
        scss({
          outputStyle: "expanded",
        })
      )
      // .pipe(group_media())
      .pipe(
        autoprefixer({
          overrideBrowserslist: ["last 5 versions"],
          cascade: true,
        })
      )
      .pipe(dest(path.build.css))
      .pipe(clean_css())
      .pipe(
        rename({
          extname: ".min.css",
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browsersync.stream())
  );
};

const js = () => {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
};

const fonts = () => {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browsersync.stream());
};

const watchFiles = () => {
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
};

const clean = () => {
  return del(path.clean);
};

let build = gulp.series(clean, gulp.parallel(js, css, fonts, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.fonts = fonts;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
