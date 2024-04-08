const path = require('path');
// react-app-rewiredでエイリアスのpathを読み込ませるための設定
module.exports = (config) => {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      // エイリアスにするパスをココに書く
      '@src': path.resolve(__dirname, './src/'),
    },
  };

  return config;
};