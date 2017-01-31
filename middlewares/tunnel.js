const Tunnel = require('../lib/tunnel');

module.exports = function (manager) {
  const tunnels = new Tunnel.Registry(manager);
  return async (ctx, next) => {
    ctx.tunnels = tunnels;

    await next();
  };
};
