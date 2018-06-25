var gulp = require('gulp');
// const nodemon = require('nodemon');
var nodemon = require('gulp-nodemon');
const wait = require('gulp-wait');
const ts = require('gulp-typescript');
var tsProject = ts.createProject("tsconfig.json");

gulp.task("compile", function() {
  var project = tsProject;
  return gulp.src("./src/**/*.ts")
      .pipe(project())
      .pipe(gulp.dest("./dist/"))
});

gulp.task("default", ["compile"], function() {
  return nodemon({
      script: './dist/index.js',
      ext: "ts",
      tasks: ["compile"],
      env: { 'NODE_ENV': 'development' }
  });
});
