const Bundle = require('bono/bundle');
const ApiBundle = require('./bundles/api');
const config = require('./config')();

class AppBundle extends Bundle {
  constructor () {
    super();

    this.bundle('/api', new ApiBundle(config));

    this.get('/', ctx => ctx.redirect('/ui/'));
  }
}

module.exports = AppBundle;
