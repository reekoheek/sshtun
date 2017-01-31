const http = require('http');
const AppBundle = require('./app');

const PORT = process.env.PORT || 3000;

const app = new AppBundle();

const server = http.Server(app.callback());

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
