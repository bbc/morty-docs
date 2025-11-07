const fs = require('fs')
const path = require('path')

/**
 * Recursively walks a directory and returns a list of
 * { relativePath, raw } objects for each file.
 *
 * - Follows directories recursively
 * - Follows symlinks (files and directories)
 * - Ignores hidden files/directories (starting with '.')
 * - Returns a stable, sorted list (by relativePath)
 */
const generateTransformInput = (dir, rootDir) => {
  const resolvedDir = path.resolve(dir)
  const resolvedRoot = rootDir ? path.resolve(rootDir) : resolvedDir

  let list = []

  const entries = fs.readdirSync(resolvedDir, { withFileTypes: true })

  for (const dirent of entries) {
    const name = dirent.name

    // Ignore hidden files/directories (.DS_Store, .git, etc.)
    if (name.startsWith('.')) continue

    const fullPath = path.join(resolvedDir, name)

    if (dirent.isDirectory()) {
      // Recurse into directory
      list = list.concat(generateTransformInput(fullPath, resolvedRoot))
      continue
    }

    if (dirent.isFile()) {
      list.push(makeInputObject(fullPath, resolvedRoot))
      continue
    }

    if (dirent.isSymbolicLink()) {
      // Follow symlink if it points to something that exists
      if (!fs.existsSync(fullPath)) {
        // Broken symlink, ignore
        // console.log(`Broken symlink at: ${fullPath}`)
        continue
      }

      const stats = fs.statSync(fullPath)

      if (stats.isFile()) {
        list.push(makeInputObject(fullPath, resolvedRoot))
      } else if (stats.isDirectory()) {
        list = list.concat(generateTransformInput(fullPath, resolvedRoot))
      }

      continue
    }

    // Other Dirent types (sockets, FIFOs, etc.) are ignored
  }

  // Ensure deterministic ordering for tests & snapshots
  list.sort((a, b) => a.relativePath.localeCompare(b.relativePath))

  return list
}

const makeInputObject = (fullPath, rootPath) => {
  const resolvedRoot = path.resolve(rootPath)
  const resolvedFull = path.resolve(fullPath)

  return {
    relativePath: path.relative(resolvedRoot, resolvedFull),
    raw: fs.readFileSync(resolvedFull)
  }
}

module.exports = generateTransformInput
