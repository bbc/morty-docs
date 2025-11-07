# Morty docs
If you're seeing this, you haven't supplied an argument to the npm start command.

# Header 1
## Header 2
### Header 3
#### Header 4

## Paragraphs
### Bold
**Lorem Ipsum is simply dummy text of the printing and typesetting industry.**
### Italic
_Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book._
### Strike-Through
~~It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.~~
### Code line
`It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`

## Coloured Links
lorem ipsum [this is a normal link](https://github.com/bbc) lorem ipsum<br>
[`link whose label is inline code`](https://github.com/bbc)
* link in a bullet point [`this is a link`](https://bbc-tpg.slack.com/archives/CH62XGS77) lorem ipsum

## Images
Do images still work?

![Image 1](./images/test.jpg)

## Github Alerts

> [!NOTE]  
> Highlights information that users should take into account, even when skimming.
> More text note
> Even more text note

> [!TIP]
> Optional information to help a user be more successful.
> more text tip

> [!IMPORTANT]  
> Crucial information necessary for users to succeed.

> [!WARNING]  
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

## Code blocks

```swift
// Swift Example
let width = 10
let height = 5
let area = width * height
print(area) // Output: 50
```

```fortran
C -- FORTRAN EXAMPLE --
C AREA OF A TRIANGLE - HERON'S FORMULA
501 FORMAT(3I5)
601 FORMAT(4H A= ,I5,5H B= ,I5,5H C= ,I5,8H AREA= ,F10.2,
$13H SQUARE UNITS)
602 FORMAT(10HNORMAL END)
603 FORMAT(23HINPUT ERROR, ZERO VALUE)
INTEGER A,B,C
10 READ(5,501) A,B,C
IF(A.EQ.0 .AND. B.EQ.0 .AND. C.EQ.0) GO TO 50
IF(A.EQ.0 .OR. B.EQ.0 .OR. C.EQ.0) GO TO 90
S = (A + B + C) / 2.0
AREA = SQRT( S * (S - A) * (S - B) * (S - C) )
WRITE(6,601) A,B,C,AREA
GO TO 10
50 WRITE(6,602)
STOP
90 WRITE(6,603)
STOP
END
```

## Diff code blocks

```diff
{
     name: "cats are pets",
-    description: "Cats are better than dogs.",
+    description: "Some people prefer cats more than dogs.",
     website: "cats-are-pets.com"
}
```

_In github one can combine diff and yaml at the start of a codeblock, although the resulting display just has diff formatting - I have replicated this._
```diff yaml
#Some yaml
tutorial:  #nesting level 1
  - yaml:  #nesting level 2 (2 spaces used for indentation)
      name: "YAML Ain't Markup Language" #string [literal] #nesting level 3 (4 spaces used for indentation)
      type: awesome #string [literal]
-      born: 2001 #number [literal]
+      born: 2021 #number [literal]
```

## Tables

_With the Correct Format (https://www.w3schools.io/file/markdown-table/), They will render_

| Pet Type | Are Like | 
| --- | --- | 
| ![cat](./images/cat.png) | **Cats are:** keen on food. |  
| ![dog](./images/dog.png) | **Dogs are:** excitable. | 
| ![dino](./images/dino.png) | **Dinos are Firey:** watch out for those flames. | 
