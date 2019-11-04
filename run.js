const fsExtra = require('fs-extra')
const { transform, generateTransformInput } = require('./build/src')

const directoryToConvert = JSON.parse(process.env.npm_config_argv).remain[0] || 'default-md-files'

const mortyDocs = async () => {
  const inputObjs = await generateTransformInput(directoryToConvert)

  const files = transform(inputObjs, { contentTitle: 'Content Title - located in run.js' })

  files.forEach(file => {
    let filePath = `www/${file.relativePath}`
    fsExtra.ensureFileSync(filePath)
    fsExtra.writeFileSync(filePath, file.raw)
  })

  return 'Creating html files in www directory'
}

mortyDocs().then(data => console.log(data)).catch(err => console.log('error', err))
