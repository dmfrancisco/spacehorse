![spacehorse](https://gc.david.tools/spacehorse.svg)

This is a work in progress. It's something I want for myself but also a place to experiment with ES6 features, Isomorphic JavaScript, the [React library](https://facebook.github.io/react/) and [Flux](https://facebook.github.io/flux/), the [SUIT CSS naming conventions](https://github.com/suitcss/suit/blob/master/doc/naming-conventions.md) and some unconventional practices recently proposed by Facebook (like using [inline CSS styles](https://speakerdeck.com/vjeux/react-css-in-js) again).

You can install the dependencies with `npm install`. For running the server and tests, checkout the *scripts* section in the *package.json* file (for eg: `npm run watch`). I use [jsxhint](https://github.com/STRML/JSXHint/) to analyze the code.

---

There's a new note-taking app each day. Almost as many as weather apps. Each one more minimalistic than the last. On average, a 30-year-old programmer has built at least four during his professional life, [study shows](https://t.co/hiz5ePHMTi). To each his own, I suppose.

I always had the habit of taking notes. In part because I have a sucky memory, and I'm afraid of forgetting what I discover in my daily life. The way I do notes is as follows.

Though I only realized this recently, they take two forms, which result from distinct activities:

- Lots of small **loose notes** added when I stumble upon something new or have an idea
- A reasonable number of **detailed notes**, which are the outcome of taking some time to really research something and add my thoughts on the subject

In the first situation, my goal is to capture something freely and rapidly with a few words and links. It can't require much effort, otherwise I may not feel like doing it.
The second kind of notes emerge from necessity, or from the urge to learn something deeper. They become longer, with sections and subsections.

For this to work properly, the interface should reflect these two use cases.

For **loose notes**, the text editor should be a simple `textarea`. It can't be too big, otherwise I may feel that what I am adding isn't worth it. These notes could be visualized using Index Cards, where only the title (sometimes an image would work better) is displayed until I click it and a small modal pops-up. The font could be a standard 16px Helvetica.

For **detailed notes**, I would like a text editor that gives me more writing space, with some formatting options. It would also be important to be able to embed HTML with external content and custom CSS. For the visualization, a bigger serifed font would be preferable.

Additionally, I think this tool should meet the following requirements:

- High-level view of all my content
- Support multiple categorizations of the same content
- Product branding should not get in the way of user's personal tastes
- Allow customization and extensibility
- Require minimal setup for development, with the data being stored in files (maybe with the option of generating a static site for production).
- Probably include some basic authentication or encryption option (like [TiddlyWiki](http://tiddlywiki.com/static/EncryptionMechanism.html) has)

In the absence of a tool with these features, I have been using simultaneously Trello and Private Gists on GitHub (lately, I've been experimenting with TiddlyWiki instead of the later).

---

Additional ideas and mockups available [here](https://gc.david.tools/spacehorse-150b874b689d/mockups/).
