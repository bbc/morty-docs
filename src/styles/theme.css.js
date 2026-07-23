// moved styling away from components to reduce bloat so now css exported as js
// exported as js string for injection into static convention
module.exports = `:root {
    /* defined colours */
    --white: #FFFFFFFF;
    --black: #000000FF;
    --grey-dark: #333;
    --grey-1: #F5F5F5FF;
    --grey-2: #EBEBEBFF;
    --grey-3: #DDDDDDFF;
    --grey-4: #CCCCCCFF;
    --grey-5: #949494FF;
    --grey-6: #666666FF;
    --blue: #337ab7;
    --light-blue: lightblue;
    --red: #C7254EFF;
    --pink: #F9F2F4FF;

    --dark-1: #1A1A1AFF;
    --dark-2: #2D2D2DFF;
    --dark-3: #111111FF;
    --dark-4: #2D1F24FF;
    --dark-grey-1: #E0E0E0FF;
    --dark-grey-2: #B0B0B0FF;
    --dark-grey-3: #666666FF;
    --dark-grey-4: #555555FF;
    --dark-grey-5: #444444FF;
    --blue-bright: #6CB6FFFF;
    --pink-bright: #FF6B9DFF;

    /* light theming */
    --bg-primary: var(--white);
    --bg-secondary: var(--grey-1);
    --text-primary: var(--grey-dark);
    --text-secondary: var(--grey-6);
    --text-link: var(--blue);
    --text-code: var(--red);
    --bg-code: var(--pink);
    --bg-code-block: var(--grey-1);
    --border-colour: var(--grey-4);
    --border-colour-light: var(--grey-3);
    --border-colour-hr: var(--grey-5);
    --bg-header: var(--black);
    --text-header: var(--light-blue);
    --separator-colour: var(--grey-2);
    --blockquote-border: var(--grey-2);
}

:root[data-theme="dark"] {
    /* dark theming */
    --bg-primary: var(--dark-1);
    --bg-secondary: var(--dark-2);
    --text-primary: var(--dark-grey-1);
    --text-secondary: var(--dark-grey-2);
    --text-link: var(--blue-bright);
    --text-code: var(--pink-bright);
    --bg-code: var(--dark-4);
    --bg-code-block: var(--dark-2);
    --border-colour: var(--dark-grey-5);
    --border-colour-light: var(--dark-grey-4);
    --border-colour-hr: var(--dark-grey-3);
    --bg-header: var(--dark-3);
    --text-header: var(--blue-bright);
    --separator-colour: var(--dark-grey-4);
    --blockquote-border: var(--dark-grey-5);
}
`
