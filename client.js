const spawn = require('child_process').spawn;
const http = require('http');

// -o 'ExitOnForwardFailure=yes' -o 'ServerAliveInterval=30' -o 'ServerAliveCountMax=2' root@192.168.0.10
function connect ({ username, hostname }) {
  process.on('SIGINT', () => {
    console.log('Caught SIGINT.');

    cmd.kill();

    setTimeout(() => {
      process.exit('SIGINT');
    }, 1000);
  });

  const args = [
    '-f',
    // '-M', '0',
    '-N',
    '-o', 'ExitOnForwardFailure=yes',
    '-o', 'ServerAliveInterval=30',
    '-o', 'ServerAliveCountMax=2',
    '-o', 'StrictHostKeyChecking=no',
    '-A',
    `${username}@${hostname}`,
    '-R', '3001:localhost:3000',
  ];

  console.log(args);

  const cmd = spawn('ssh', args);
  // const cmd = spawn('ssh', args, { stdio: 'inherit' });

  cmd.stdout.on('data', chunk => {
    console.log(chunk.toString().trim());
  });

  cmd.stderr.on('data', chunk => {
    console.error(chunk.toString().trim());
  });

  cmd.on('close', () => {
    console.log('exit');
  });

  // const test = () => {
  //   console.log('ls -la');
  //   cmd.stdin.write('ls -la\n');
  //
  //   setTimeout(test, 3000);
  // };
  //
  // setTimeout(test, 3000)
}

function create () {
  return new Promise((resolve, reject) => {
    const server = http.Server((req, res) => {
      console.log(req.method, req.url);

      res.end('Hello world\n');
    });

    server.listen(3000, resolve);
  });
}

create().then(() => {
  connect({
    username: 'root',
    hostname: '192.168.0.10',
  });
})
