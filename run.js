const { transform, generateTransformInput } = require('./build')

const path = require('path')

console.log('process.env.mortyPath = ', process.env.mortyPath)

const directoryToConvert = process.env.mortyPath || 'default-md-files'
const resolvedPath = path.resolve(directoryToConvert)

const mortyDocs = async () => {
  const basePath = 'morty-docs/some-repo'
  const inputObjs = await generateTransformInput(resolvedPath)

  const files = transform(inputObjs, { contentTitle: 'some-repo', basePath })

  files.forEach(file => {
    const filePath = `www/${basePath}/${file.relativePath}`
    fs.mkdirSync(path.dirname(filePath), { recursive: true }) // Ensure parent directory exists
    fs.writeFileSync(filePath, file.raw)
  })

  return 'Creating html files in www directory'
}

mortyDocs().then(data => console.log(data)).catch(err => console.log('error', err))
