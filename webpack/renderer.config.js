const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const svgoConfig = Object.assign({}, yaml.safeLoad(fs.readFileSync(process.cwd() + '/.svgorc.yml', 'utf8')));

module.exports = function (config) {
  config.module.rules.push({
    test: /\.postcss$/,
    use: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        options: { importLoaders: 1 }
      },
      'postcss-loader'
    ]
  },
  {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        options: { importLoaders: 1 }
      },
      'postcss-loader'
    ]
  });

  // config.resolve.alias['node-devterm'] = path.resolve(__dirname, '../node_modules/node-devterm/src');
  config.resolve.alias['node-devterm'] = path.resolve(__dirname, '../node_modules/node-devterm/src');
  config.resolve.alias['@'] = path.resolve(__dirname, '../src');

  const babelLoader = config.module.rules.find(rule => {
    return rule.use.loader === 'babel-loader';
  });
  babelLoader.exclude = {
    and: [/node_modules/],
    not: [/node-devterm/, /serialport/, /@serialport/]
  };

  // svg
  config.module.rules = config.module.rules.map((rule) => {
    if (rule.test && rule.test.toString().includes('svg')) {
      const source = rule.test.source.replace(/svg\|?/, '');
      return { ...rule, test: new RegExp(source, rule.test.flags) };
    } else {
      return rule;
    }
  });

  config.module.rules.push({
    test: /\.svg$/,
    oneOf: [
      {
        resourceQuery: /vue-template/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          },
          {
            loader: 'vue-svg-loader',
            options: { svgo: svgoConfig }
          }
        ]
      },
      {
        use: [
          {
            loader: 'file-loader',
            options: {

            }
          }
        ]
      }
    ]
  });

  return config;
};
