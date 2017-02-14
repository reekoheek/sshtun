const http = require('http');
const Bundle = require('bono/bundle');
const ApiBundle = require('./bundles/api');
const AuthBundle = require('./bundles/auth');
const UIBundle = require('./bundles/ui');
const config = require('./config')();

const PORT = process.env.PORT || 3000;

const app = new Bundle();

app.bundle('/api', new ApiBundle(config));
app.bundle('/auth', new AuthBundle(config));
app.bundle('/ui', new UIBundle());

app.get('/', ctx => ctx.redirect('/ui/'));

const server = http.Server(app.callback());

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
