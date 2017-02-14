const Model = require('node-norm/model');
const Client = require('ssh2').Client;
const fs = require('fs-promise');
const path = require('path');
const os = require('os');

class Server extends Model {
  async test () {
    return await new Promise((resolve, reject) => {
      let keyFile = path.join(os.homedir(), '.ssh/id_rsa');
      let conn = new Client();

      conn.on('ready', () => {
        conn.end();
        resolve(true);
      });

      conn.on('error', () => {
        // console.error(err.message);
        resolve(false);
      });

      conn.connect({
        host: this.hostname,
        port: this.port,
        username: this.username,
        privateKey: fs.readFileSync(keyFile),
      });
    });
  }
}

module.exports = Server;
