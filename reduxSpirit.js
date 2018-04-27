import {Statechart} from 'scion-core'

const actionPrefix = 'a:'

export const reduxSpirit = (states, opts) => {
  let sc
  const options = opts || {}

  function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
  }

  function initStatechart(store) {
    setTimeout(function() {
      if(Array.isArray(states)) {
        sc = new Statechart({states})
      }
      else if(isObject) {
        sc = new Statechart(states)
      }
      else {
        throw new Error('Invalid statechart schema')
      }

      let lastEvent

      if(options.log && options.verbose) {
        sc.on('onBigStepBegin', () => console.log('big step begin'))
        sc.on('onBigStepEnd', () => console.log('big step end'))
        sc.on('onSmallStepBegin', e => console.log('small step begin', e))
        sc.on('onSmallStepEnd', () => console.log('small step end'))
      }

      sc.on('onSmallStepBegin', e => lastEvent = e ? e.data : undefined)

      sc.on('onEntry', state => {
        const action = {...lastEvent}
      action.type = `${actionPrefix}entry:${state}`
      options.log && console.log('entry', state, action)
      store.dispatch(action)
    })

      sc.on('onExit', state => {
        const action = {...lastEvent}
      action.type = `${actionPrefix}exit:${state}`
      options.log && console.log('exit', state, action)
      store.dispatch(action)
    })

      sc.on('onTransition', () => {
        if(lastEvent && lastEvent.type) {
        const action = {...lastEvent}
        action.type = `${actionPrefix}transition:${lastEvent.type}`
        options.log && console.log('transition', action)
        store.dispatch(action)
      }
    })

      sc.start()
    }, 0)
  }

  return store => {
    !sc && initStatechart(store)

    return next => action => {
      if(!action.type.startsWith(actionPrefix)) {
        if(options.log) console.log('event', action)
        sc.gen({
          name: action.type,
          data: action,
        })
      }
      else {
        if(options.log) console.log('action', action)
        next(action)
      }
    }
  }
}

export const onEntry = state => `${actionPrefix}entry:` + state

export const onExit = state => `${actionPrefix}exit:` + state

export const onTransition = event => `${actionPrefix}transition:` + event
