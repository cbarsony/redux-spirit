'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onTransition = exports.onExit = exports.onEntry = exports.reduxSpirit = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _scionCore = require('scion-core');

var actionPrefix = 'a:';

var reduxSpirit = exports.reduxSpirit = function reduxSpirit(states, opts) {
  var sc = void 0;
  var options = opts || {};

  function isObject(val) {
    if (val === null) {
      return false;
    }
    return typeof val === 'function' || (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object';
  }

  function initStatechart(store) {
    setTimeout(function () {
      if (Array.isArray(states)) {
        sc = new _scionCore.Statechart({ states: states });
      } else if (isObject) {
        sc = new _scionCore.Statechart(states);
      } else {
        throw new Error('Invalid statechart schema');
      }

      var lastEvent = void 0;

      if (options.log && options.verbose) {
        sc.on('onBigStepBegin', function () {
          return console.log('big step begin');
        });
        sc.on('onBigStepEnd', function () {
          return console.log('big step end');
        });
        sc.on('onSmallStepBegin', function (e) {
          return console.log('small step begin', e);
        });
        sc.on('onSmallStepEnd', function () {
          return console.log('small step end');
        });
      }

      sc.on('onSmallStepBegin', function (e) {
        return lastEvent = e ? e.data : undefined;
      });

      sc.on('onEntry', function (state) {
        var action = _extends({}, lastEvent);
        action.type = actionPrefix + 'entry:' + state;
        options.log && console.log('entry', state, action);
        store.dispatch(action);
      });

      sc.on('onExit', function (state) {
        var action = _extends({}, lastEvent);
        action.type = actionPrefix + 'exit:' + state;
        options.log && console.log('exit', state, action);
        store.dispatch(action);
      });

      sc.on('onTransition', function () {
        if (lastEvent && lastEvent.type) {
          var action = _extends({}, lastEvent);
          action.type = actionPrefix + 'transition:' + lastEvent.type;
          options.log && console.log('transition', action);
          store.dispatch(action);
        }
      });

      sc.start();
    }, 0);
  }

  return function (store) {
    !sc && initStatechart(store);

    return function (next) {
      return function (action) {
        if (!action.type.startsWith(actionPrefix)) {
          if (options.log) console.log('event', action);
          sc.gen({
            name: action.type,
            data: action
          });
        } else {
          if (options.log) console.log('action', action);
          next(action);
        }
      };
    };
  };
};

var onEntry = exports.onEntry = function onEntry(state) {
  return actionPrefix + 'entry:' + state;
};

var onExit = exports.onExit = function onExit(state) {
  return actionPrefix + 'exit:' + state;
};

var onTransition = exports.onTransition = function onTransition(event) {
  return actionPrefix + 'transition:' + event;
};