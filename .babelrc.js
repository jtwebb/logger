module.exports = {
  env: {
    esmUnbundled: {},
    esmBundled: {
      presets: [['@babel/env', { targets: '> 0.25%, not dead' }]]
    },
    cjs: {
      presets: [['@babel/env', { modules: 'commonjs' }]]
    }
  }
};
