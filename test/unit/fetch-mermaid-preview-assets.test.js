const crypto = require('crypto')
const {
  MAXIMUM_ASSET_BYTES,
  verifyAsset
} = require('../../scripts/fetch-mermaid-preview-assets')

const assetFor = data => ({
  name: 'Test asset',
  sha256: crypto.createHash('sha256').update(data).digest('hex')
})

describe('Mermaid preview asset verification', () => {
  it('accepts an asset with the pinned checksum', () => {
    const data = Buffer.from('verified asset')

    expect(() => verifyAsset(assetFor(data), data)).not.toThrow()
  })

  it('rejects an asset that does not match the pinned checksum', () => {
    const expectedData = Buffer.from('expected asset')
    const receivedData = Buffer.from('different asset')

    expect(() => verifyAsset(assetFor(expectedData), receivedData)).toThrow('checksum mismatch')
  })

  it('rejects an unexpectedly large asset', () => {
    const data = Buffer.alloc(MAXIMUM_ASSET_BYTES + 1)

    expect(() => verifyAsset(assetFor(data), data)).toThrow('exceeds the')
  })
})
