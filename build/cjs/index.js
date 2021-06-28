"use strict";

/* eslint-disable no-console */
var util = require('util');

var modifiers = require('./styles.js');

var logLevels = {
  off: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5
};
var logLevel = process.env.NODE_LOG_LEVEL || 5;
var windowSize = {
  width: process.stdout.columns || 0,
  height: process.stdout.rows || 0
};
var logMeta = {
  assert: {
    labelStyle: 'bgRedBright.white',
    textStyle: 'bgRedBright',
    logLevel: logLevels.trace,
    label: 'Assert'
  },
  clear: {},
  count: {
    logLevel: logLevels.info
  },
  countReset: {
    logLevel: logLevels.info
  },
  debug: {
    labelStyle: 'bgBlue.white',
    textStyle: 'blue',
    logLevel: logLevels.debug,
    label: 'Debug'
  },
  dir: {
    logLevel: logLevels.debug
  },
  dirxml: {
    logLevel: logLevels.debug
  },
  error: {
    labelStyle: 'white.bgRed',
    textStyle: 'red',
    logLevel: logLevels.error,
    label: 'Error'
  },
  group: {
    logLevel: logLevels.info
  },
  groupCollapsed: {
    logLevel: logLevels.info
  },
  groupEnd: {
    logLevel: logLevels.info
  },
  info: {
    labelStyle: 'black.bgCyan',
    textStyle: 'cyan',
    logLevel: logLevels.info,
    label: 'Info'
  },
  log: {
    labelStyle: 'black.bgWhite',
    textStyle: 'white',
    logLevel: logLevels.info,
    label: 'Log'
  },
  profile: {
    logLevel: logLevels.info
  },
  profileEnd: {
    logLevel: logLevels.info
  },
  table: {
    logLevel: logLevels.info
  },
  time: {
    logLevel: logLevels.debug
  },
  timeEnd: {
    logLevel: logLevels.debug
  },
  timeLog: {
    logLevel: logLevels.debug
  },
  timeStamp: {
    logLevel: logLevels.debug
  },
  trace: {
    logLevel: logLevels.trace
  },
  warn: {
    labelStyle: 'black.bgYellow',
    textStyle: 'yellow',
    logLevel: logLevels.warn,
    label: 'Warn'
  }
};

var wrap = function wrap(style) {
  var styles = style.split('.');
  var styling = styles.reduce(function (acc, current) {
    for (var _i = 0, _Object$keys = Object.keys(modifiers); _i < _Object$keys.length; _i++) {
      var modifierType = _Object$keys[_i];

      if (modifiers[modifierType][current]) {
        acc.push(modifiers[modifierType][current]);
        break;
      }
    }

    return acc;
  }, []);
  return function () {
    var wrapper = styling.reduce(function (acc, current) {
      acc = "\x1B[".concat(current[0], "m").concat(acc, "\x1B[").concat(current[1], "m");
      return acc;
    }, '%s');
    return util.format(wrapper, util.format.apply(util, arguments));
  };
};

var addLog = function addLog(current) {
  var meta = logMeta[current];

  if (logLevel >= meta.logLevel) {
    return function () {
      if (!meta.label) {
        if (meta.labelStyle) {
          console[current](wrap(meta.labelStyle)(" ".concat(util.format.apply(util, arguments), " ")));
        } else {
          var _console;

          (_console = console)[current].apply(_console, arguments);
        }
      } else {
        console[current]("".concat(wrap(meta.labelStyle)(" ".concat(meta.label, ": ")), "  ").concat(wrap(meta.textStyle).apply(void 0, arguments)));
      }
    };
  }

  return function () {};
};

var logs = {};
logs.assert = addLog('assert');
logs.clear = addLog('clear');
logs.count = addLog('count');
logs.countReset = addLog('countReset');
logs.debug = addLog('debug');
logs.dir = addLog('dir');
logs.dirxml = addLog('dirxml');
logs.error = addLog('error');
logs.group = addLog('group');
logs.groupCollapsed = addLog('groupCollapsed');
logs.groupEnd = addLog('groupEnd');
logs.info = addLog('info');
logs.log = addLog('log');
logs.profile = addLog('profile');
logs.profileEnd = addLog('profileEnd');
logs.table = addLog('table');
logs.time = addLog('time');
logs.timeEnd = addLog('timeEnd');
logs.timeLog = addLog('timeLog');
logs.timeStamp = addLog('timeStamp');
logs.trace = addLog('trace');
logs.warn = addLog('warn');

logs.beep = function () {
  return console.log('\x07');
};

logs.assert = function (assertion) {
  if (!assertion) {
    var _logMeta$assert = logMeta.assert,
        labelStyle = _logMeta$assert.labelStyle,
        label = _logMeta$assert.label,
        textStyle = _logMeta$assert.textStyle;

    for (var _len = arguments.length, msg = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      msg[_key - 1] = arguments[_key];
    }

    if (typeof (msg === null || msg === void 0 ? void 0 : msg[0]) === 'string') {
      console.log("".concat(wrap(labelStyle)(" ".concat(label, " ")), "  ").concat(wrap(textStyle).apply(void 0, msg)));
    } else {
      console.error("".concat(wrap(labelStyle)(" ".concat(label, " "))));
      msg.forEach(function (obj) {
        console.dir(obj, {
          showHidden: true,
          depth: 2,
          colors: true
        });
      });
    }
  }
};

logs.headerChars = function () {
  var char = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '=';

  for (var _len2 = arguments.length, msg = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    msg[_key2 - 1] = arguments[_key2];
  }

  var message = util.format.apply(util, msg);
  var maxLength = Math.max(message.length + 3, windowSize.width - 3);
  console.log("# ".concat("".concat(char).repeat(maxLength)));
  console.log("# - ".concat(message));
  console.log("# ".concat("".concat(char).repeat(maxLength)));
};

module.exports = logs;
//# sourceMappingURL=index.js.map