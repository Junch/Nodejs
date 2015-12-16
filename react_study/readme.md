The demo is from page [Setting up React for ES6 with Webpack and Babel](https://www.twilio.com/blog/2015/08/setting-up-react-for-es6-with-webpack-and-babel-2.html)

Need install the webpack and webpack-dev-server globally

```
npm install webpack, webpack-dev-server -g
```

> The webpack-dev-server depends on webpack. (PEER DEPENDENCY)


Install BABEL modules as below

```
npm i --save-dev babel-loader
npm i --save-dev babel-core
npm i --save-dev babel-preset-es2015
npm i --save-dev babel-preset-react
npm i --save-dev webpack
```

> The babel-loader also depends on webpack. (PEER DEPENDENCY)

Install the React as below

```
npm i --save react, react-dom
```

Finally fireup the Webpack dev server

```
webpack-dev-server --progress --colors
```

You can navigate to [http://localhost:8080/webpack-dev-server/](http://localhost:8080/webpack-dev-server/).

According to the [Using ES6 and ES7 in the Browser, with Babel 6 and Webpack](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/), the babel-polyfill is also installed.

```
npm install babel-polyfill --save
```

> Babel can’t support all of ES6 with compilation alone — it also requires some runtime support. In particular, the new ES6 built-ins like Set, Map and Promise must be polyfilled, and Babel’s generator implementation also uses a number of runtime helpers. Given your app doesn’t have to share a JavaScript environment with other apps, you’ll be ok to use babel-polyfill to handle this:
