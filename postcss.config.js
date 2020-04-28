const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      'warnForDuplicates': false
    },
    'cssnano': {},
    'autoprefixer': {
      overrideBrowserslist: ['last 2 versions'],
    }
  }
}