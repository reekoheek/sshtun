const Bundle = require('bono/bundle');

class UIBundle extends Bundle {
  constructor () {
    super();

    this.use(require('koa-static')('./ui'));
  }
}

module.exports = UIBundle;
