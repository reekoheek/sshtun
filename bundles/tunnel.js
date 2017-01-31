const NormBundle = require('node-bono-norm/bundle');

class TunnelBundle extends NormBundle {
  constructor () {
    super({ schema: 'tunnel' });

    this.get('/{id}/status', this.status.bind(this));
    this.get('/{id}/start', this.start.bind(this));
    this.get('/{id}/stop', this.stop.bind(this));
  }

  async status (ctx) {
    const tunnel = await ctx.tunnels.get(ctx.parameters.id);
    if (!tunnel) {
      ctx.status = 404;
      return;
    }

    const status = await tunnel.getStatus();
    return { status };
  }

  async start (ctx) {
    const tunnel = await ctx.tunnels.get(ctx.parameters.id);
    if (!tunnel) {
      ctx.status = 404;
      return;
    }

    const status = await tunnel.start();
    return { status };
  }

  async stop (ctx) {
    const tunnel = await ctx.tunnels.get(ctx.parameters.id);
    if (!tunnel) {
      ctx.status = 404;
      return;
    }

    const status = await tunnel.stop();
    return { status };
  }
}

module.exports = TunnelBundle;
