/* eslint-disable no-console */

const util = require('util');
const modifiers = require('./styles.js');

const logLevels = { off: 0, error: 1, warn: 2, info: 3, debug: 4, trace: 5 };
const logLevel = process.env.NODE_LOG_LEVEL || 5;
const windowSize = { width: process.stdout.columns || 0, height: process.stdout.rows || 0 };
const logMeta = {
  assert: { labelStyle: 'bgRedBright.white', textStyle: 'bgRedBright', logLevel: logLevels.trace, label: 'Assert' },
  clear: {},
  count: { logLevel: logLevels.info },
  countReset: { logLevel: logLevels.info },
  debug: { labelStyle: 'bgBlue.white', textStyle: 'blue', logLevel: logLevels.debug, label: 'Debug' },
  dir: { logLevel: logLevels.debug },
  dirxml: { logLevel: logLevels.debug },
  error: { labelStyle: 'white.bgRed', textStyle: 'red', logLevel: logLevels.error, label: 'Error' },
  group: { logLevel: logLevels.info },
  groupCollapsed: { logLevel: logLevels.info },
  groupEnd: { logLevel: logLevels.info },
  info: { labelStyle: 'black.bgCyan', textStyle: 'cyan', logLevel: logLevels.info, label: 'Info' },
  log: { labelStyle: 'black.bgWhite', textStyle: 'white', logLevel: logLevels.info, label: 'Log' },
  profile: { logLevel: logLevels.info },
  profileEnd: { logLevel: logLevels.info },
  table: { logLevel: logLevels.info },
  time: { logLevel: logLevels.debug },
  timeEnd: { logLevel: logLevels.debug },
  timeLog: { logLevel: logLevels.debug },
  timeStamp: { logLevel: logLevels.debug },
  trace: { logLevel: logLevels.trace },
  warn: { labelStyle: 'black.bgYellow', textStyle: 'yellow', logLevel: logLevels.warn, label: 'Warn' }
};

const wrap = style => {
  const styles = style.split('.');

  const styling = styles.reduce((acc, current) => {
    for (const modifierType of Object.keys(modifiers)) {
      if (modifiers[modifierType][current]) {
        acc.push(modifiers[modifierType][current]);
        break;
      }
    }

    return acc;
  }, []);

  return (...msg) => {
    const wrapper = styling.reduce((acc, current) => {
      acc = `\u001B[${current[0]}m${acc}\u001B[${current[1]}m`;
      return acc;
    }, '%s');

    return util.format(wrapper, util.format(...msg));
  };
};

const addLog = current => {
  const meta = logMeta[current];
  if (logLevel >= meta.logLevel) {
    return (...msg) => {
      if (!meta.label) {
        if (meta.labelStyle) {
          console[current](wrap(meta.labelStyle)(` ${util.format(...msg)} `));
        } else {
          console[current](...msg);
        }
      } else {
        console[current](`${wrap(meta.labelStyle)(` ${meta.label}: `)}  ${wrap(meta.textStyle)(...msg)}`);
      }
    };
  }

  return () => {};
};

const logs = {};

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

logs.beep = () => console.log('\x07');

logs.assert = (assertion, ...msg) => {
  if (!assertion) {
    const { labelStyle, label, textStyle } = logMeta.assert;
    if (typeof msg?.[0] === 'string') {
      console.log(`${wrap(labelStyle)(` ${label} `)}  ${wrap(textStyle)(...msg)}`);
    } else {
      console.error(`${wrap(labelStyle)(` ${label} `)}`);
      msg.forEach(obj => {
        console.dir(obj, { showHidden: true, depth: 2, colors: true });
      });
    }
  }
};

logs.headerChars = (char = '=', ...msg) => {
  const message = util.format(...msg);
  const maxLength = Math.max(message.length + 3, windowSize.width - 3);

  console.log(`# ${`${char}`.repeat(maxLength)}`);
  console.log(`# - ${message}`);
  console.log(`# ${`${char}`.repeat(maxLength)}`);
};

module.exports = logs;
