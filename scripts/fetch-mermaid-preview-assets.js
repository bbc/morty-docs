const crypto = require('crypto')
const fs = require('fs')
const https = require('https')
const path = require('path')

const MAXIMUM_ASSET_BYTES = 5 * 1024 * 1024
const MAXIMUM_REDIRECTS = 3
const REQUEST_TIMEOUT_MS = 30 * 1000
const MERMAID_VERSION = '11.16.0'

const assets = [
  {
    name: 'Mermaid browser bundle',
    url: `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`,
    sha256: '74d7c46dabca328c2294733910a8aa1ed0c37451776e8d5295da38a2b758fb9b',
    outputPath: 'www/morty-docs/mermaid.min.js'
  },
  {
    name: 'Mermaid licence',
    url: `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/LICENSE`,
    sha256: 'ec9fb67dcb25eccc416ed56e1aab819222c805a2a4bfe4cb19e7556bf2ffde80',
    outputPath: 'www/morty-docs/mermaid-LICENSE.txt'
  }
]

const verifyAsset = (asset, data) => {
  if (data.length > MAXIMUM_ASSET_BYTES) {
    throw new Error(`${asset.name} exceeds the ${MAXIMUM_ASSET_BYTES}-byte download limit`)
  }

  const actualHash = crypto.createHash('sha256').update(data).digest('hex')
  if (actualHash !== asset.sha256) {
    throw new Error(`${asset.name} checksum mismatch: expected ${asset.sha256}, received ${actualHash}`)
  }
}

const download = (asset, redirectCount = 0) => new Promise((resolve, reject) => {
  const request = https.get(asset.url, response => {
    if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
      response.resume()
      if (redirectCount >= MAXIMUM_REDIRECTS) {
        reject(new Error(`${asset.name} exceeded the redirect limit`))
        return
      }

      const redirectedAsset = {
        ...asset,
        url: new URL(response.headers.location, asset.url).toString()
      }
      download(redirectedAsset, redirectCount + 1).then(resolve, reject)
      return
    }

    if (response.statusCode !== 200) {
      response.resume()
      reject(new Error(`${asset.name} download failed with HTTP ${response.statusCode}`))
      return
    }

    const chunks = []
    let downloadedBytes = 0
    response.on('data', chunk => {
      downloadedBytes += chunk.length
      if (downloadedBytes > MAXIMUM_ASSET_BYTES) {
        response.destroy(new Error(`${asset.name} exceeds the ${MAXIMUM_ASSET_BYTES}-byte download limit`))
        return
      }
      chunks.push(chunk)
    })
    response.on('end', () => resolve(Buffer.concat(chunks)))
    response.on('error', reject)
  })

  request.setTimeout(REQUEST_TIMEOUT_MS, () => {
    request.destroy(new Error(`${asset.name} download timed out`))
  })
  request.on('error', reject)
})

const writeAsset = (asset, data) => {
  const outputPath = path.resolve(asset.outputPath)
  const temporaryPath = `${outputPath}.tmp`
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(temporaryPath, data)
  fs.renameSync(temporaryPath, outputPath)
}

const fetchMermaidPreviewAssets = async () => {
  const downloads = await Promise.all(assets.map(async asset => {
    const data = await download(asset)
    verifyAsset(asset, data)
    return { asset, data }
  }))

  downloads.forEach(({ asset, data }) => writeAsset(asset, data))
  console.log(`Downloaded checksum-verified Mermaid ${MERMAID_VERSION} assets for the local preview`)
}

if (require.main === module) {
  fetchMermaidPreviewAssets().catch(error => {
    console.error(`Unable to prepare Mermaid preview assets: ${error.message}`)
    process.exitCode = 1
  })
}

module.exports = {
  MAXIMUM_ASSET_BYTES,
  assets,
  verifyAsset
}
