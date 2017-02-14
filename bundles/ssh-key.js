const Bundle = require('bono/bundle');
const fs = require('fs-promise');
const path = require('path');
const os = require('os');
const spawn = require('child_process').spawn;

class SSHKeyBundle extends Bundle {
  constructor () {
    super();

    this.get('/', this.read.bind(this));
    this.get('/generate', this.generate.bind(this));
  }

  async read (ctx) {
    let pubKeyFile = path.join(os.homedir(), '.ssh/id_rsa.pub');
    let exists = await fs.exists(pubKeyFile);

    ctx.assert(exists, 404, 'SSH Key Not Found');

    return await fs.readFile(pubKeyFile, 'utf8');
  }

  async generate (ctx) {
    let keyFile = path.join(os.homedir(), '.ssh/id_rsa');

    await fs.remove(`${keyFile}`);
    await fs.remove(`${keyFile}.pub`);

    await new Promise((resolve, reject) => {
      let cmd = spawn('ssh-keygen', [ '-b', '2048', '-t', 'rsa', '-f', keyFile, '-q', '-N', '' ], { stdio: 'inherit' });

      cmd.on('exit', status => {
        if (status) {
          return reject(new Error(`Error cmd with status ${status}`));
        }

        resolve();
      });
    });

    return await this.read(ctx);
  }
}

module.exports = SSHKeyBundle;
