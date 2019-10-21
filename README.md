# Morty docs

## Overview 
Morty docs is a library to enable documentation to be generated as a static website, to allow users to consume the content in an easily accessible format. It takes an array of markdown files and creates a static website. 

Morty is specifically aimed at requiring little to no change in the markdown files.

## Use as a library 
Install
`npm install morty-docs`

Require in code
`const mortyDocs = require('morty-docs')`

Use library
`const inputObjs = await mortyDocs.generateTransformInput(directoryToConvert)`

`const transformedFiles = await mortyDocs.transform(inputObjs)`

transformedFiles will have the following structure;


transformedFiles = [

    {
      relativePath: 'path/to/file1.txt',
      raw: file data as string
    },

    {
      relativePath: 'path/to/file2.png',
      raw: file data as buffer
    }
]


## Known issues 

We are currently unaware of any issues with morty-docs - if you find an issue please raise it using our Contribution Guide. 

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
