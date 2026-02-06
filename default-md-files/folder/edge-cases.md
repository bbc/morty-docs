## Edge Cases that break the build

Bug fix from bbc/web repo. Code block in a NOTE blockquote.

> [!Note] > `translucentColour` makes use of the CSS [`color()` function](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color). This is a relatively new function that became Baseline in 2023, but it might not work in older browsers. For this reason, it is important to include a fallback option in any stylesheets applying the `translucentColour` function.
>
> ```jsx
> import { translucentColour } from '@bbc/web-levers';
>
> const Content = styled.div`
>   background: none;
>
>   @supports (color: ${translucentColour()}) {
>     background: linear-gradient(
>       to bottom,
>       ${translucentColour(theme.colourPalette.midground, 0.7)} 0%,
>       ${translucentColour(theme.colourPalette.midground, 0.7)} 80%,
>       ${translucentColour(theme.colourPalette.midground, 1)} 100%
>     );
>   }
> `;
> ```


> **bold text
> Blockquotes with Unclosed Markdown Syntax. **This text is actually bold**


> Emoji shortcuts
> :warning: Be careful!


> Tables in blockquotes
> ---
> | Header | Value |
> |--------|-------|
> | a      | b     |


>
>
> Some text with blank spaces above


> Nested lists in blockquotes
> 1. Item one
     >    - Subitem
> 2. Item two