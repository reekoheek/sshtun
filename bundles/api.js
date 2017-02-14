const Bundle = require('bono/bundle');
const TunnelBundle = require('./tunnel');
const ServerBundle = require('./server');
const SSHKeyBundle = require('./ssh-key');
const Manager = require('node-norm/manager');
const jwt = require('koa-jwt');
const cors = require('kcors');

class Api extends Bundle {
  constructor ({ secret, connections = [] }) {
    super();

    let manager = this.manager = new Manager({ connections });

    this.use(require('bono/middlewares/logger')());
    this.use(cors());
    this.use(pingMw());
    this.use(jwt({ secret }));
    this.use(require('bono/middlewares/json')());
    this.use(require('node-bono-norm')({ manager }));

    this.bundle('/server', new ServerBundle());
    this.bundle('/tunnel', new TunnelBundle());
    this.bundle('/ssh-key', new SSHKeyBundle());

    this.initialize();
  }

  async initialize () {
    const tunnels = await this.manager.factory('tunnel', { autostart: true }).all();
    await Promise.all(tunnels.map(async tunnel => {
      try {
        await tunnel.stop();
      } catch (err) {
        console.error(err);
      }
      await tunnel.start();
    }));
  }
}

function pingMw () {
  return async (ctx, next) => {
    if (ctx.method !== 'GET' || ctx.url !== '/ping') {
      await next();
      return;
    }

    ctx.body = { time: new Date() };
  };
}

module.exports = Api;
