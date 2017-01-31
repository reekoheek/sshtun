const spawn = require('child_process').spawn;
const exec = require('child_process').exec;

class Registry {
  constructor (manager) {
    this.cache = {};
    this.manager = manager;
  }

  async get (id) {
    if (this.cache[id]) {
      return this.cache[id];
    }
    let row = await this.manager.find('tunnel', id).single();

    this.cache[id] = new Tunnel(this, row);

    return this.cache[id];
  }
}

class Tunnel {
  static get Registry () {
    return Registry;
  }

  constructor (registry, row) {
    this.define('registry', registry);

    Object.assign(this, row);
  }

  get manager () {
    return this.registry.manager;
  }

  define (key, value) {
    Object.defineProperty(this, key, {
      enumerable: false,
      configurable: true,
      writable: true,
      value: value,
    });
  }

  async getServer () {
    if (!this.serverObject) {
      this.define('serverObject', await this.manager.find('server', this.server).single());
    }

    return this.serverObject;
  }

  async start () {
    let server = await this.getServer();

    const args = [
      '-f',
      '-M', '0',
      '-N',
      '-o', 'ExitOnForwardFailure=yes',
      '-o', 'ServerAliveInterval=30',
      '-o', 'ServerAliveCountMax=2',
      '-o', 'StrictHostKeyChecking=no',
      `-p ${server.port}`,
      '-A',
      `${server.username}@${server.hostname}`,
      '-R', `${this.port}:${this.bind}`,
    ];

    spawn('autossh', args);

    if (await this.getStatus() === false) {
      throw new Error('Cannot start tunnel');
    }

    return true;
  }

  async getPidsByIdentifier (identifier) {
    return await new Promise((resolve, reject) => {
      exec(`pgrep -f "autossh.*${identifier}"`, (err, data) => {
        if (err) {
          return resolve([]);
        }

        resolve(data.trim().split('\n').map(n => parseInt(n)));
      });
    });
  }

  async getStatus () {
    const pids = await this.getPidsByIdentifier(`${this.port}:${this.bind}`);

    return pids.length > 0;
  }

  async stop () {
    let pids = await this.getPidsByIdentifier(`${this.port}:${this.bind}`);

    pids.forEach(pid => {
      process.kill(pid, 'SIGTERM');
    });

    if (await this.getStatus() === true) {
      throw new Error('Cannot stop tunnel');
    }

    return false;
  }
}

module.exports = Tunnel;
