const fs = require('fs')
const childProcess = require('child_process')
const generateMermaidContent = require('../../src/generate-mermaid-content.js')

jest.mock('fs')
jest.mock('child_process')

describe('generateMermaidContent', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fs.existsSync.mockReturnValue(false)
    fs.mkdirSync.mockImplementation(() => {})
    fs.writeFileSync.mockImplementation(() => {})
    fs.readFileSync.mockReturnValue(Buffer.from('<svg>diagram</svg>'))
    fs.unlinkSync.mockImplementation(() => {})
    childProcess.execSync.mockImplementation(() => {})
  })

  it('should replace mermaid code blocks with image links and generate images', () => {
    const inputObj = {
      raw: Buffer.from('Some text\n```mermaid\ngraph TD;\nA-->B;\n```\nMore text', 'utf8'),
      relativePath: 'docs/test.md'
    }
    const rootPath = '/project'
    const result = generateMermaidContent(inputObj, rootPath)

    expect(fs.mkdirSync).toHaveBeenCalled()
    expect(fs.writeFileSync).toHaveBeenCalled()
    expect(childProcess.execSync).toHaveBeenCalled()
    expect(fs.readFileSync).toHaveBeenCalled()
    expect(fs.unlinkSync).toHaveBeenCalled()
    expect(result.inputObj.raw).toContain('![Mermaid diagram]')
    expect(result.images.length).toBe(1)
    expect(result.images[0].raw.toString()).toBe('<svg>diagram</svg>')
    expect(result.images[0].relativePath).toMatch(/\.svg$/)
  })

  it('should not generate image if it already exists', () => {
    fs.existsSync.mockImplementation((p) => p.endsWith('.svg'))
    const inputObj = {
      raw: Buffer.from('```mermaid\ngraph TD;\nA-->B;\n```', 'utf8'),
      relativePath: 'docs/test.md'
    }
    const rootPath = '/project'
    generateMermaidContent(inputObj, rootPath)
    expect(fs.writeFileSync).not.toHaveBeenCalled()
    expect(childProcess.execSync).not.toHaveBeenCalled()
  })

  it('should handle files with no mermaid code blocks', () => {
    const inputObj = {
      raw: Buffer.from('No diagrams here', 'utf8'),
      relativePath: 'docs/test.md'
    }
    const rootPath = '/project'
    const result = generateMermaidContent(inputObj, rootPath)
    expect(result.inputObj.raw).toBe('No diagrams here')
    expect(result.images.length).toBe(0)
  })
})
