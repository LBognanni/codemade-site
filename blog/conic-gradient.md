---
title: How to draw a conic gradient with System.Drawing in gdiPlus
author: _data/authors/loris-bognanni.yaml
excerpt: >-
  Here is how to replicate the CSS `conic-gradient()` function in C# with System.Drawing
date: '2021-05-24'
thumb_image: images/conic-gradient-thumb.jpg
image: images/conic-gradient.jpg
layout: post
---

Recently, I have been working on adding support for conic gradient (or conical gradients, as some say) to [Clock](/clock). Now, Clock uses GdiPlus, or the `System.Drawing` namespace in C# to do all of its drawing. My aim was to replicate the `conic-gradient()` [CSS function](https://developer.mozilla.org/en-US/docs/Web/CSS/conic-gradient()).

Imagine my surprise when searching online for "gdiplus conic gradient" yielded few and very old results. Ok, maybe you're not very surprised because all the cool kids are now writing Electron apps and mid-2000s `System.Drawing` has been relegated to history 😄

Like any other methods of filling a shape, we're going to need a type of `Brush` to do it. The one we're going to use for conic gradients is the `PathGradientBrush`.

What's interesting about `PathGradientBrush` is that it can be used in many ways. [This article from C# Corner](https://www.c-sharpcorner.com/uploadfile/puranindia/783/) goes over a few, but crucially the one that's missing is a proper conic gradient. 
After a lot of searching, I finally stumbled on [this article](https://web.archive.org/web/20140906083853/http://bobpowell.net/pgb.aspx)(the original website is now offline!) and noticed this image and code snippet:

!["Many vertices, few colors"](https://web.archive.org/web/20140906083853im_/http://bobpowell.net/images/pgb.ht2.jpg)

```csharp
  GraphicsPath pth=new GraphicsPath();
  pth.AddEllipse(this.ClientRectangle);
  
  PathGradientBrush pgb=new PathGradientBrush(pth);
  pgb.SurroundColors=new Color[]{
                    Color.Red,
                    Color.Orange,
                    Color.Yellow,
                    Color.Green,
                    Color.Blue,
                    Color.Indigo,
                    Color.Violet };

  pgb.CenterColor=Color.Gray;

  e.Graphics.FillRectangle(pgb,this.ClientRectangle);
```

It's not a "real" conic gradient, but close. What's interesting in that example is that it's setting a `SurroundColors` property, but, because a circle in gdi+ has many vertices, only a tiny portion of the whole is occupied by a gradient. Of course the next step to try was using a polygon with the same number of vertices as the number of colors and check the result:

```csharp
using var pth = new GraphicsPath();
var colors = new Color[]{
  Color.Red,
  Color.Orange,
  Color.Yellow,
  Color.Green,
  Color.Blue,
  Color.Indigo,
  Color.Violet }

var rect = new Rectangle(0,0, sz, sz);

var polyPoints = new List<Point>();
for (double i = 0; i <= colors.Length; i++)
{
  polyPoints.Add(new Point(
    (sz / 2) + (int)(Math.Cos((Math.PI * 2) * (i / (double)pts)) * (double)(sz/2)), 
    (sz / 2) + (int)(Math.Sin((Math.PI * 2) * (i / (double)pts)) * (double)(sz/2))
  ));
}
pth.AddPolygon(polyPoints.ToArray());

PathGradientBrush pgb = new PathGradientBrush(pth);

pgb.SurroundColors = colors;

g.FillRectangle(pgb, rect);

```

![close but no dice](/images/poly-gradient-white.png)

It's close, but where does the white come from? Well if you look closely at the circle example from the article above, there's a `CenterColor` property that is set to Gray there. When you don't specify it, instead of there being no center color, a white shade is used instead. Setting CenterColor to transparent renders the filling itself transparent so that's no good either.

But! `PathGradientBrush` has a `Blend` property that allows us to control the `CenterColor`'s opacity from the center to the border of the shape. We can just set it to fully opaque at both ends to get our gradient:

```csharp
pgb.Blend = new Blend {
  Factors = new float[] { 1, 1 },
  Positions = new float[] { 0, 1f }
};
```

![success!](/images/poly-gradient-ok.png)

Isn't that something! Now to make it really look like the kind of conic gradient we get in css, we have to make it so the last and the first color don't blend into each other. We can do this by creating a polygon that has one less vertex, where the last Point is repeated. We also need to specify the `CenterPoint` property, otherwise Gdi+ will auto-calculate it as being slightly off-center:

![fully conic](/images/poly-gradient-conic.png)

One last thing! You might have noticed that, while we're using `FillRectangle` to paint our gradient, we're not really filling _all of it_, but we're drawing a polygon. This is easily fixed by using a suitably large radius for our polygon.

If you're interested to see what I ended up with, the [full source code](https://github.com/LBognanni/CodeMadeClock/blob/master/src/CodeMade.ScriptedGraphics/ConicGradient.cs) is open source as part of Clock 😊