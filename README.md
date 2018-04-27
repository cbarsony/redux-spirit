Redux Spirit
=============

Statechart [middleware](http://redux.js.org/docs/advanced/Middleware.html) for Redux using [SCION-CORE](https://github.com/jbeard4/SCION-CORE)

## Why?
Redux is great for `data state` management, however managing `application state` is still the developer's responsibility. Redux Spirit uses the approach presented in David Harel's paper [Statecharts: a visual formalism for complex systems](https://www.sciencedirect.com/science/article/pii/0167642387900359).

## Installation

```js
npm i --save redux-spirit
```

Redux Spirit is used as a Redux [middleware](https://redux.js.org/advanced/middleware):

```js
import {createStore, applyMiddleware} from 'redux'
import {reduxSpirit} from 'redux-spirit'

import {reducer} from './reducer'

// Minimal statechart
const statechart = {
  id: 'MAIN',
}

const store = createStore(
  reducer,
  applyMiddleware(reduxSpirit(statechart)),
)
```
## API

**reduxSpirit(\<Object|Array\> statechart, \<Object\> options): null**

`statechart` (required)

Object or Array of Objects declaring SCION-CORE's [Statecharts Model Schema](https://github.com/jbeard4/SCION-CORE#statecharts-model-schema)

`options` (not required)

|name          |type  |default|description                                                                                                             |
|--------------|------|-------|------------------------------------------------------------------------------------------------------------------------|                                           
|`log`         |bool  |`false`|Logs state changes and transactions                                                                                     |
|`verbose`     |bool  |`false`|More verbose logging of following SCION-CORE events: `onBigStepBegin` `onBigStepEnd` `onSmallStepBegin` `onSmallStepEnd`|

**onEntry(\<String\> stateId): \<String\> actionType**

Action type dispatched after entering state with `stateId`

**onExit(\<String\> stateId): \<String\> actionType**

Action type dispatched after exiting state with `stateId`

**onTransition(\<String\> eventId): \<String\> actionType**

Action type dispatched on transition with `eventId`

`onEntry()`, `onExit()`, and `onTransition()` are helper methods for generating action types. Can be used in reducer or by handling Api calls.

Example with Redux's reducer:

```
import {onEntry, onExit, onTransition} from 'redux-spirit'

const states = {
  INIT: 'INIT',
  LOADING: 'LOADING',
}

const events = {
  FETCH: 'FETCH',
}

const reducer = (state, action) => {
  switch(action.type) {
    case onEntry(states.LOADING):
      // action.type: 'a:entry:LOADING'
      return {/* new state */}
      
    case onExit(states.INIT):
      // action.type: 'a:exit:INIT'
      return {/* new state */}
      
    case onTransition(events.FETCH):
      // action.type: 'a:transition:FETCH'
      return {/* new state */}
      
    default:
      return state
  }
}
```
