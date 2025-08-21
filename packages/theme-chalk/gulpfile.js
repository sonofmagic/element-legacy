'use strict';

const { series, src, dest } = require('gulp');
const gulpSass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const dartSass = require('sass');
const sass = gulpSass(dartSass);
function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync(
      {
        silenceDeprecations: ['legacy-js-api', 'import', 'slash-div', 'global-builtin']
      }
    ))
    .pipe(autoprefixer({
      // browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin())
    .pipe(dest('./lib'));
}

function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'));
}

exports.build = series(compile, copyfont);
