const gulp = require('gulp');
const shell = require('gulp-shell');
const watch = require('gulp-watch');

const src = [
  './14_auth.js',
  './0_todo.js',
  './15_test_todo.js',
  './12_db.js',
  './10_hapi_server.js',
];

gulp.task('test:dev', () => {
  watch(src, () => gulp.run('test'));
});

gulp.task('test', shell.task('npm test'));
