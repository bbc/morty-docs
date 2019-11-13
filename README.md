# Morty Docs

[![Build Status](https://travis-ci.com/bbc/morty-docs.svg?branch=master)](https://travis-ci.com/bbc/morty-docs)
[![Maintainability](https://api.codeclimate.com/v1/badges/99927fb03004d8d44134/maintainability)](https://codeclimate.com/github/bbc/morty-docs/maintainability)

## Overview

Morty Docs is a library to enable documentation to be generated as a static
website, to allow users to consume the content in an easily accessible format.
It takes an array of markdown files and creates a static website.

Morty is specifically aimed at requiring little to no change in the markdown files.

In the BBC we have a large amount of git respositories which often have markdown documentation within them, they dont follow a consistent structure and their content structure can also be wildly different. We wanted a way to publish these with the minimal amount of effort from teams, Morty Docs is what we use to solve this problem.

## Example Site Made with Morty-Docs

The documentation located [here](https://github.com/bbc/lrud) has been converted to a site using morty-docs, the converted docs can be viewed [here](https://bbc.github.io/morty-docs/).

## Why use Morty Docs over other static site generation?

Use Morty Docs when you already have some markdown files in a directory structure which you want to publish.

Morty Docs was specifically created to publish already existing markdown files without having to change the contents of those files.
It does not use specific directory structures or meta data about the markdown files.
Morty infers the navigation by the directory structure of the files and can be used with no configuration at all.
Plain simple markdown files go in, a html site comes out.

If you do want to be able to have more control over the website which is published and are happy to change your markdown files and structure you might want to pick a more complex static site generator.

## Use as a library

### Install

`npm install --save morty-docs`

### Require

```javascript
const { generateTransformInput, transform } = require('@bbc/morty-docs')
```

### Typical use

```javascript
const inputObjs = await generateTransformInput('a/folder/with/markdown-files')

const outputObjs = transform(inputObjs,{ contentTitle: 'My Docs' })
```

- `transform()` can be used alone, but if your markdown files are in a local
directory the `generateTransformInput()` function is a convenience
- the 2nd argument to transform() can *optionally* be used to provide a Title
that is displayed on the generated index pages.

- `outputObjs` will be an array of objects like this:

``` javascript
[
  {
    relativePath: 'path/to/file',
    raw: <string> | <Buffer>
  },
  ...
]
```

where value for raw is either generated HTML **or** input that was passed
through because it is not markdown e.g. images

## Example Architecture

Below is an example architecture diagram showing how you could integrate morty-docs with GitHub and AWS S3 to generate static websites for all of an organisation's repositories

![Example Architecture Diagram for integrating Morty-Docs with GitHub](docs/morty-architecture-diagram.png)

## Known issues

We are currently unaware of any issues with morty-docs - if you find an issue
please raise it using our Contribution Guide.

## Why Call it Morty Docs?

Morty Docs originated from an internal project specifically created to publish
our Post Mortem documents which we were writting in Markdown storing in GitHub.
This project was called PostMortemer. We then realised this would be useful for
_any_ Markdown documents! So we made it more generic and called it Morty Docs!

## Contributing

Thanks for wanting to improve the project!

Before contributing back, please familiarise yourself with a few things
we mention below.

## Can I contribute?

Yes.  Contributions are accepted based on the merit of the contribution,
not on the basis of who they are from.

We welcome contributions from everyone.

Please respect each other.

## What is a contribution?

The obvious answer is code.  Be it a one line typo change, a bug fix,
feature improvement, new minor feature, major feature or complete rehaul.

However, documentation, examples, videos, blogs, vlogs, podcasts, active
examples, media, hosted versions, and testimonials of usage are all
useful contributions.

## Adding an issue

If you spot an issue or just want to raise one please use the issue template.

## Contact us!

It's always great to hear from people who are interested and
using morty-docs.

The best way to do this is to open an issue.  Please note, that where a
feature is requested, but we can't add *right now*, will result in us
adding a TODO label to it. We'll come back to it when we can or someone
out there might implement it.

## Incorporating Contributions

We will always accept contributions. We endeavour to ensure that they
fit with the existing code base.

If we alter the contribution we will let you know clearly why. We're
actually more likely to also let you know what we think would be
necessary changes in order to accept your contribution.

Either way, that doesn't stop you using your change nor stop you releasing
your version.  It just means it doesn't fit with the project as we see it
at this time.

## Proposing Changes

Please open an issue.  Then fork the project.  Make your changes in your
clone fork, and create a pull request, referencing the issue. We'll then
discuss the pull request in the issue.

We would expect code quality to be at least as good if not better than
the code quality of the project at the time you make your contribution.
After all, we all hope to leave things better than we find them!

© BBC 2019
