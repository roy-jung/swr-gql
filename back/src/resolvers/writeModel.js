const fs = require('fs')
const { resolve } = require('path')

const filenames = {
  user: resolve(__dirname, '../models/user.js'),
  message: resolve(__dirname, '../models/message.js'),
}

module.exports = (target, data) => {
  try {
    return fs.writeFileSync(filenames[target], `module.exports = ${JSON.stringify(data)}`)
  } catch (err) {
    console.error(err)
  }
}
