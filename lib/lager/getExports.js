const requireAll = require('require-all')

module.exports = dirname => {
  return requireAll({
    dirname,
    filter(file) {
      if (file !== 'index.js') {
        return file.split('.js')[0]
      }
    }
  })
}
