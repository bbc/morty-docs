const path = require('path')
const fs = require('fs')
const { execSync } = require('child_process')

const generateMermaidContent = (inputObj, rootPath) => {
  const imageDir = path.dirname(`${rootPath}/${inputObj.relativePath}`)
  const markdown = inputObj.raw.toString('utf8')
  const images = []

  if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true })
  inputObj.raw = markdown.replace(/```mermaid\s+([\s\S]*?)```/g, (match, mermaidCode, offset) => {
    const hash = require('crypto').createHash('md5').update(mermaidCode).digest('hex')
    const imgPath = path.join(imageDir, `${hash}.svg`)

    if (!fs.existsSync(imgPath)) {
      const tmpFile = path.join(imageDir, `${hash}.mmd`)
      fs.writeFileSync(tmpFile, mermaidCode)
      execSync(`npx mmdc -i "${tmpFile}" -o "${imgPath}"`)
      fs.unlinkSync(tmpFile)
      const afterLastSlash = inputObj.relativePath.match(/[^/]+$/)[0]
      images.push({
        raw: fs.readFileSync(imgPath),
        relativePath: inputObj.relativePath.replace(afterLastSlash, `${hash}.svg`)
      })
    }

    return `![Mermaid diagram](${hash}.svg)`
  })

  return { inputObj, images }
}

module.exports = generateMermaidContent
