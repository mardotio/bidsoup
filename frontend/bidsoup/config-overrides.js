const { alias, configPaths } = require('react-app-rewire-alias')
// const { override, useBabelRc } = require('customize-cra')

module.exports = function override(config) {
  alias({
    ...configPaths('base-tsconfig.json')
  })(config);
  // alias({
  //   '@app': 'src/app',
  //   '@dashboard': 'src/app/dashboard',
  //   '@login': 'src/app/login',
  //   '@taskItem': 'src/app/taskItem',
  //   '@utils': 'src/app/utils'
  // })(config);

  return config;
}
