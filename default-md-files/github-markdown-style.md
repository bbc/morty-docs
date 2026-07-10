# GitHub Markdown style

This page exercises the opt-in GitHub presentation mode while keeping the
source as ordinary Markdown.

## Heading permalinks

Hover over this heading or move keyboard focus to its permalink.

### Nested heading

Heading links remain available at every supported level.

## Alerts

> [!NOTE]
> Reference information that is useful when scanning a document.

> [!TIP]
> A practical suggestion that can make a task easier.

> [!IMPORTANT]
> Information required to complete the task successfully.

> [!WARNING]
> A condition that may cause an unexpected result.

> [!CAUTION]
> An action with potentially destructive consequences.

## Syntax highlighting

```javascript
const documents = ['guide.md', 'runbook.md']

const publishedDocuments = documents.map(document => ({
  source: document,
  output: document.replace(/\.md$/, '.html')
}))

console.log(publishedDocuments)
```

```yaml
site:
  title: Morty Docs
  markdownStyle: github
  publish: true
```

Inline code remains compact and readable: `markdownStyle: 'github'`.

## Diff highlighting

A standard diff highlights added and removed lines:

```diff
-const markdownStyle = 'original'
+const markdownStyle = 'github'
 const outputDirectory = 'www'
```

A typed diff combines line highlighting with the underlying language:

```diff yaml
 site:
-  markdownStyle: original
+  markdownStyle: github
   publish: true
```

## Responsive code blocks

The following deliberately long line scrolls horizontally instead of wrapping or changing the page width:

```javascript
const generatedPage = transform(inputObjects, { contentTitle: 'Morty Docs local showcase', basePath: '/morty-docs/some-repo', markdownStyle: 'github' })
```
