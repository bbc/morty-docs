const fs = require('fs')
const path = require('path')

const makeInputObject = (fullPath, relativePath) => ({
  relativePath,
  raw: fs.readFileSync(fullPath)
})

const walkDirectory = (directory, outputDirectory, activeDirectories) => {
  const realDirectory = fs.realpathSync(directory)
  if (activeDirectories.has(realDirectory)) return []

  activeDirectories.add(realDirectory)
  const entries = fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => !entry.name.startsWith('.'))
  let list = []

  // Keep files before real subdirectories to retain the existing output order.
  entries.forEach(entry => {
    const fullPath = path.join(directory, entry.name)
    const relativePath = path.join(outputDirectory, entry.name)

    if (entry.isFile()) {
      list.push(makeInputObject(fullPath, relativePath))
      return
    }

    if (!entry.isSymbolicLink() || !fs.existsSync(fullPath)) return

    const stats = fs.statSync(fullPath)
    if (stats.isFile()) {
      list.push(makeInputObject(fullPath, relativePath))
    } else if (stats.isDirectory()) {
      // Treat a linked directory as though its contents were copied here.
      list = list.concat(walkDirectory(fullPath, '', activeDirectories))
    }
  })

  entries.forEach(entry => {
    if (!entry.isDirectory()) return

    const fullPath = path.join(directory, entry.name)
    const relativePath = path.join(outputDirectory, entry.name)
    list = list.concat(walkDirectory(fullPath, relativePath, activeDirectories))
  })

  activeDirectories.delete(realDirectory)
  return list
}

const generateTransformInput = (directory) => {
  const normalisedDirectory = path.format(path.parse(directory))
  if (!fs.existsSync(normalisedDirectory)) {
    throw new Error(`ENOENT: no such file or directory, scandir '${directory}'`)
  }

  return walkDirectory(normalisedDirectory, '', new Set())
}

module.exports = generateTransformInput
