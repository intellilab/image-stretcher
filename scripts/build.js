const fs = require('fs');
const browserify = require('browserify');

browserify('src/index.js')
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  .pipe(fs.createWriteStream('dist/index.js'));

fs.createReadStream('src/index.html')
  .pipe(fs.createWriteStream('dist/index.html'));
