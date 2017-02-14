const NormBundle = require('node-bono-norm/bundle');

class ServerBundle extends NormBundle {
  constructor () {
    super({ schema: 'server' });

    this.get('/{id}/test', this.test.bind(this));
  }

  async test (ctx) {
    let { entry } = await this.read(ctx);
    let test = await entry.test();

    return { entry, test };
  }
}

module.exports = ServerBundle;
