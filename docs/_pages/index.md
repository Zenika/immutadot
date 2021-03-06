---
layout: default
avatar: true
permalink: /
---
# immutadot
A JavaScript library to deal with nested immutable structures.

```js
set({ english: { greeting: 'Hi' } }, 'english.greeting', 'Hello')
// → { english: { greeting: 'Hello' } }

push({ i18n: { languages: ['English', 'French'] } }, 'i18n.languages', 'German', 'Spanish')
// → { i18n: { languages: ['English', 'French', 'German', 'Spanish'] } }
```
immutadot gives you a short and meaningful syntax to apply operations on immutable structures.

## Installation
immutadot is available on [npm repository](https://www.npmjs.com/package/immutadot).

using yarn:

```shell
$ yarn add immutadot
```

using npm:

```shell
$ npm install immutadot
```

## Usage
ES modules:

```js
import { set } from 'immutadot'
```

CommonJS:  

```js
const { set } = require('immutadot')
```

## Try it
<div id="repl">
const { set } = require('immutadot')

const animals = {
    weasels: {
      lutraLutra: {
        commonNames: ['eurasian otter'],
      },
    },
}

const newAnimals = set(animals, 'weasels.lutraLutra.name', 'Lutrinae')
</div>

## Getting started

A fast overview of immutadot's features is available in the [Getting started](/GETTING_STARTED.html) guide.
