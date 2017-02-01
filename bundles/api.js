const Bundle = require('bono/bundle');
const TunnelBundle = require('./tunnel');
const NormBundle = require('node-bono-norm/bundle');
const Manager = require('node-norm/manager');
const jwt = require('koa-jwt');
const cors = require('kcors');

class Api extends Bundle {
  constructor (options = {}) {
    super();

    this.manager = new Manager(options);

    const { secret } = options;

    this.use(cors());
    this.use(async (ctx, next) => {
      if (ctx.method !== 'GET' || ctx.url !== '/ping') {
        await next();
        return;
      }

      ctx.body = { time: new Date() };
    });
    this.use(jwt({ secret }));
    this.use(require('bono/middlewares/json')());
    this.use(require('node-bono-norm')(this.manager));
    this.use(require('../middlewares/tunnel')(this.manager));

    this.bundle('/server', new NormBundle({ schema: 'server' }));
    this.bundle('/tunnel', new TunnelBundle());

    this.initialize();
  }

  async initialize () {
    const tunnels = await this.manager.find('tunnel').all();
    console.log('tunnels', tunnels);
  }
}

module.exports = Api;
