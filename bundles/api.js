const Bundle = require('bono/bundle');
const TunnelBundle = require('./tunnel');
const NormBundle = require('node-bono-norm/bundle');
const Manager = require('node-norm/manager');

class Api extends Bundle {
  constructor (options = {}) {
    super();

    this.manager = new Manager(options);

    this.use(require('node-bono-norm')(this.manager));
    this.use(require('../middlewares/tunnel')(this.manager));
    this.use(require('bono/middlewares/json')());

    this.bundle('/server', new NormBundle({ schema: 'server' }));
    this.bundle('/tunnel', new TunnelBundle());

    this.get('/ping', () => ({ time: new Date() }));

    this.initialize();
  }

  async initialize () {
    const tunnels = await this.manager.find('tunnel').all();
    console.log('tunnels', tunnels);
  }
}

module.exports = Api;
