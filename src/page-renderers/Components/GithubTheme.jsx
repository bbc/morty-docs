const React = require('react')

const githubThemeStyles = `
body.theme-github {
  color-scheme: light;
  --morty-page-bg: #ffffff;
  --morty-page-fg: #1f2328;
  --morty-muted-fg: #59636e;
  --morty-link-fg: #0969da;
  --morty-border: #d1d9e0;
  --morty-surface: #f6f8fa;
  --morty-inline-code-bg: #eff1f3;
  --morty-footer-bg: #f6f8fa;
  --morty-focus: #0969da;
  --morty-alert-note-fg: #0969da;
  --morty-alert-note-bg: #ddf4ff;
  --morty-alert-tip-fg: #1a7f37;
  --morty-alert-tip-bg: #dafbe1;
  --morty-alert-important-fg: #8250df;
  --morty-alert-important-bg: #fbefff;
  --morty-alert-warning-fg: #9a6700;
  --morty-alert-warning-bg: #fff8c5;
  --morty-alert-caution-fg: #cf222e;
  --morty-alert-caution-bg: #ffebe9;
  --morty-diff-add-bg: #dafbe1;
  --morty-diff-remove-bg: #ffebe9;
  --morty-hljs-fg: #24292e;
  --morty-hljs-bg: #ffffff;
  --morty-hljs-keyword: #d73a49;
  --morty-hljs-entity: #6f42c1;
  --morty-hljs-constant: #005cc5;
  --morty-hljs-string: #032f62;
  --morty-hljs-variable: #e36209;
  --morty-hljs-comment: #6a737d;
  --morty-hljs-tag: #22863a;
  --morty-hljs-section: #005cc5;
  --morty-hljs-bullet: #735c0f;
  --morty-hljs-addition-fg: #22863a;
  --morty-hljs-addition-bg: #f0fff4;
  --morty-hljs-deletion-fg: #b31d28;
  --morty-hljs-deletion-bg: #ffeef0;
}

body.theme-github a:focus-visible {
  outline: 2px solid var(--morty-focus);
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  body.theme-github {
    color-scheme: dark;
    --morty-page-bg: #0d1117;
    --morty-page-fg: #c9d1d9;
    --morty-muted-fg: #8b949e;
    --morty-link-fg: #58a6ff;
    --morty-border: #30363d;
    --morty-surface: #161b22;
    --morty-inline-code-bg: #343942;
    --morty-footer-bg: #161b22;
    --morty-focus: #58a6ff;
    --morty-alert-note-fg: #58a6ff;
    --morty-alert-note-bg: #388bfd1a;
    --morty-alert-tip-fg: #3fb950;
    --morty-alert-tip-bg: #2ea04326;
    --morty-alert-important-fg: #a371f7;
    --morty-alert-important-bg: #a371f726;
    --morty-alert-warning-fg: #d29922;
    --morty-alert-warning-bg: #bb800926;
    --morty-alert-caution-fg: #f85149;
    --morty-alert-caution-bg: #f8514926;
    --morty-diff-add-bg: #2ea04326;
    --morty-diff-remove-bg: #f8514926;
    --morty-hljs-fg: #c9d1d9;
    --morty-hljs-bg: #0d1117;
    --morty-hljs-keyword: #ff7b72;
    --morty-hljs-entity: #d2a8ff;
    --morty-hljs-constant: #79c0ff;
    --morty-hljs-string: #a5d6ff;
    --morty-hljs-variable: #ffa657;
    --morty-hljs-comment: #8b949e;
    --morty-hljs-tag: #7ee787;
    --morty-hljs-section: #1f6feb;
    --morty-hljs-bullet: #f2cc60;
    --morty-hljs-addition-fg: #aff5b4;
    --morty-hljs-addition-bg: #033a16;
    --morty-hljs-deletion-fg: #ffdcd7;
    --morty-hljs-deletion-bg: #67060c;
  }
}
`

const GithubTheme = () => <style dangerouslySetInnerHTML={{ __html: githubThemeStyles }} />

module.exports = GithubTheme
