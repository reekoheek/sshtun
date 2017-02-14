const NormBundle = require('node-bono-norm/bundle');

class TunnelBundle extends NormBundle {
  constructor () {
    super({ schema: 'tunnel' });

    this.get('/{id}/start', this.start.bind(this));
    this.get('/{id}/stop', this.stop.bind(this));
  }

  async index (ctx) {
    let result = await super.index(ctx);

    await Promise.all(result.entries.map(entry => entry.includeStatus()));

    return result;
  }

  async read (ctx) {
    let result = await super.read(ctx);

    if (result.entry) {
      await result.entry.includeStatus();
    }

    return result;
  }

  async start (ctx) {
    let { entry } = await this.read(ctx);

    await entry.start();

    entry.autostart = true;
    await ctx.norm.factory('tunnel', entry.id).set(entry).save();

    return { entry };
  }

  async stop (ctx) {
    let { entry } = await this.read(ctx);

    await entry.stop();

    entry.autostart = false;
    await ctx.norm.factory('tunnel', entry.id).set(entry).save();

    return { entry };
  }
}

module.exports = TunnelBundle;
