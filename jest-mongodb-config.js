module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'test'
    },
    binary: {
      version: 'latest',
      skipMD5: true
    },
    autoStart: false
  }
}
