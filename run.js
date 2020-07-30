const fsExtra = require('fs-extra')
const { transform, generateTransformInput } = require('./build/src')

const path = require('path')

const directoryToConvert = JSON.parse(process.env.npm_config_argv).remain[0] || 'default-md-files'
const resolvedPath = path.resolve(directoryToConvert)

const mortyDocs = async () => {
  const inputObjs = await generateTransformInput(resolvedPath)

  const files = transform(inputObjs, { contentTitle: 'some-repo', basePath: 'morty-docs/some-repo' })

  files.forEach(file => {
    let filePath = `www/${file.relativePath}`
    fsExtra.ensureFileSync(filePath)
    fsExtra.writeFileSync(filePath, file.raw)
  })

  return 'Creating html files in www directory'
}

mortyDocs().then(data => console.log(data)).catch(err => console.log('error', err))
