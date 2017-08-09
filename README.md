# Moon SSR

Server Side Rendering for Moon

#### What?

Since some clients (such as those with IE9 and below) don't have support for Moon, so you can send prerendered html over, and Moon will automatically rerender on the client if possible.

#### Installation

```sh
npm install moon-ssr
```

#### Usage

```js
const MoonSSR = require('moon-ssr');
MoonSSR.renderToString(instance);
```

#### Full Example

First, install some dependencies with:

```sh
npm install moonjs moon-ssr express
```

Next, let's create a simple Moon app.

Create an `index.html` file

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Moon SSR</title>
  </head>
  <body>
    <!-- Where our app is mounted -->
    <div id="app"></div>

    <!-- Require Moon -->
    <script src="/js/moon.js"></script>
    <!-- Require our Moon App -->
    <script src="./js/scripts.js"></script>
    <!-- We mount it only on the client -->
    <script>app.mount("#app");</script>
  </body>
</html>
```

Next, add the Moon application code in `js/scripts.js`

```js
(function(root) {
  'use strict'

  // Function that returns a Moon Instance
  var init = function() {
    return new Moon({
      template: '<div id="app">{{msg}}</div>',
      data: {
        msg: "Hello Moon!"
      }
    });
  }

  // If in node, export it,
  // if in the browser, create a global variable
  // with the instance
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = init;
  } else {
    root.app = init();
  }
})(this);
```

Finally, lets create the server in `server.js`

```js
// Require dependencies for Moon
global.Moon = require('moonjs');
const MoonSSR = require('moon-ssr');

// Some dependencies for I/O
const fs = require('fs');
const path = require('path');

// Our HTML layout file
const layout = fs.readFileSync('./index.html', 'utf8');

// Here we are using express, but you can use whatever
// you'd like
const express = require('express');
const server = express();

// Start a static server serving our javascript assets
server.use('/js', express.static(path.join(__dirname, 'js')));

// Get the '/' route and send over the server rendered content
server.get('/', (req, res) => {
  // Create a new instance of our Moon App
  const app = require('./js/scripts.js')();

  // Render our App to HTML
  const html = MoonSSR.renderToString(app);

  // Send it over to the client
  res.send(layout.replace('<div id="app"></div>', html));
});

// Start the Server on http://localhost:3000
server.listen(3000);
```

#### License

Licensed under the [MIT License](https://kbrsh.github.io/license) by [Kabir Shah](https://kabir.ml)
