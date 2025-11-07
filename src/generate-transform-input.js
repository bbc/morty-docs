const fs = require('fs')
const path = require('path')

const generateTransformInput = (dir, root = dir) => {
  // Normalise once
  dir = path.resolve(dir)
  root = path.resolve(root)

  let list = []

  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const dirent of files) {
    const fullPath = path.join(dir, dirent.name)

    if (dirent.isDirectory()) {
      // recurse into real directories
      list = list.concat(generateTransformInput(fullPath, root))
      continue
    }

    if (dirent.isFile()) {
      list.push(makeInputObject(fullPath, root))
      continue
    }

    if (dirent.isSymbolicLink()) {            // 👈 using `isSymbolicLink()`
      if (!fs.existsSync(fullPath)) {
        console.log(`Broken symlink at: ${fullPath}`)
        continue
      }

      const stats = fs.statSync(fullPath)
      if (stats.isFile()) {
        list.push(makeInputObject(fullPath, root))
      } else if (stats.isDirectory()) {
        list = list.concat(generateTransformInput(fullPath, root))
      }

      continue
    }
  }

  return list
}

const makeInputObject = (fullPath, rootPath) => {
  const root = path.resolve(rootPath)
  const rel = path.relative(root, fullPath)

  return {
    relativePath: rel,
    raw: fs.readFileSync(fullPath)
  }
}

module.exports = generateTransformInput
