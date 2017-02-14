const spawn = require('child_process').spawn;
const Model = require('node-norm/model');

class Tunnel extends Model {
  async includeServer () {
    this.set('$server', await this.factory('server', this.server).single());
  }

  factory (...args) {
    return this.$schema.connection.factory(...args);
  }

  async includeStatus () {
    const pids = await this.getPidsByIdentifier(`${this.port}:${this.bind}`);

    this.status = Boolean(pids.length > 0);
  }

  async getPidsByIdentifier (identifier) {
    return await new Promise((resolve, reject) => {
      let cmd = spawn('pgrep', [ '-f', `autossh.*${identifier}` ]);
      let chunks = [];
      cmd.stdout.on('data', (chunk) => {
        chunks.push(chunk);
      });

      cmd.on('close', (status) => {
        if (status) {
          return resolve([]);
        }

        resolve(Buffer.concat(chunks).toString().trim().split('\n').map(n => parseInt(n.trim())));
      });
    });
  }

  async start () {
    await this.includeServer();

    let server = this.$server;

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

    await this.includeStatus();

    if (!this.status) {
      throw new Error('Cannot start tunnel');
    }
  }

  async stop () {
    let pids = await this.getPidsByIdentifier(`${this.port}:${this.bind}`);

    pids.forEach(pid => {
      // SIGTERM to make sure child process killed
      process.kill(pid, 'SIGTERM');
      // process.kill(pid, 'SIGKILL');
    });

    await this.includeStatus();

    if (this.status) {
      throw new Error('Cannot stop tunnel');
    }
  }
}

module.exports = Tunnel;
