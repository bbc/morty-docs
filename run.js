const fsExtra = require('fs-extra')
const { transform, generateTransformInput } = require('./build')

const path = require('path')

const directoryToConvert = process.env.mortyPath|| 'default-md-files'
const resolvedPath = path.resolve(directoryToConvert)

const mortyDocs = async () => {
  const basePath = 'morty-docs/some-repo'
  const inputObjs = await generateTransformInput(resolvedPath)

  const files = transform(inputObjs, { contentTitle: 'some-repo', basePath })

  files.forEach(file => {
    let filePath = `www/${basePath}/${file.relativePath}`
    fsExtra.ensureFileSync(filePath)
    fsExtra.writeFileSync(filePath, file.raw)
  })

  return 'Creating html files in www directory'
}

mortyDocs().then(data => console.log(data)).catch(err => console.log('error', err))
