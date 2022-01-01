const path = require('path');

module.exports = function (config) {
  config.resolve.alias['@'] = path.resolve(__dirname, '../src');

  config.externals.push('serialport');

  const babelLoader = config.module.rules.find(rule => {
    return rule.use.loader === 'babel-loader';
  });
  babelLoader.exclude = {
    and: [/node_modules/],
    not: [/node-devterm/, /serialport/, /@serialport/]
  };

  return config;
};
