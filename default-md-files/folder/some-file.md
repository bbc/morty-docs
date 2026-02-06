## This is a file in a folder

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