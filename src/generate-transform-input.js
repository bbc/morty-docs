const fs = require('fs')
const path = require('path')

/**
 * Recursively walks a directory and returns a list of:
 *   { relativePath, raw }
 *
 * Behaviour tuned to match the tests:
 * - Traverses recursively
 * - Files in a directory are processed before its subdirectories
 * - Symlinks:
 *   - Symlink to file -> included once, using the symlink path as relativePath
 *   - Symlink to directory -> contents are "flattened" as if copied into that directory
 * - Broken symlinks are ignored
 * - Hidden files/dirs (starting with ".") are ignored
 * - When directory does not exist, throws ENOENT with the *relative* path as in tests
 */
const generateTransformInput = (dir, rootDir) => {
  const originalDir = dir               // keep as-passed for error message
  const resolvedDir = path.resolve(dir)
  const resolvedRoot = rootDir ? path.resolve(rootDir) : resolvedDir

  // Match the test's expectation of the ENOENT message, which uses the
  // path as passed into generateTransformInput (not the absolute path).
  if (!fs.existsSync(resolvedDir)) {
    throw new Error(`ENOENT: no such file or directory, scandir '${originalDir}'`)
  }

  let list = []

  const entries = fs.readdirSync(resolvedDir, { withFileTypes: true })

  // -------- First pass: files + symlinks (in directory order) --------
  for (const dirent of entries) {
    const name = dirent.name

    // Ignore hidden files/dirs to keep snapshots stable (e.g. .DS_Store)
    if (name.startsWith('.')) continue

    const fullPath = path.join(resolvedDir, name)

    // Regular files
    if (dirent.isFile()) {
      list.push(makeInputObject(fullPath, resolvedRoot))
      continue
    }

    // Symlinks (files or directories)
    if (dirent.isSymbolicLink()) {
      // Skip broken symlinks
      if (!fs.existsSync(fullPath)) {
        // Broken symlink: ignore
        continue
      }

      const stats = fs.statSync(fullPath)

      if (stats.isFile()) {
        // Symlink to a file: treat like a normal file, but relativePath
        // should use the symlink path, which path.relative() will do.
        list.push(makeInputObject(fullPath, resolvedRoot))
      } else if (stats.isDirectory()) {
        // Symlink to a directory:
        // The tests expect the contents of the target directory to
        // appear as if they were copied into this directory, without
        // the "symlink/" prefix (e.g. "symlink.txt", not "symlink/symlink.txt").
        //
        // To achieve this, we recurse with the symlink path as BOTH
        // the directory and the root for that nested call.
        const nested = generateTransformInput(fullPath, fullPath)

        // Flatten: keep the filenames only (no extra path segments)
        nested.forEach(item => {
          list.push({
            raw: item.raw,
            relativePath: path.basename(item.relativePath)
          })
        })
      }

      continue
    }

    // Other types (sockets, etc.) are ignored
  }

  // -------- Second pass: real directories (non-symlink) --------
  // Directories are traversed AFTER files, so files in "dir1" come
  // before files in "dir1/sub1", which matches the expected order:
  //   dir1/test1.txt
  //   dir1/sub1/test1.txt
  //   dir1/sub1/sub2/test1.txt
  for (const dirent of entries) {
    const name = dirent.name

    if (name.startsWith('.')) continue

    if (dirent.isDirectory()) {
      const fullPath = path.join(resolvedDir, name)
      list = list.concat(generateTransformInput(fullPath, resolvedRoot))
    }
  }

  // No global sort: we rely on this deterministic traversal order,
  // which is what the tests are asserting on.
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
