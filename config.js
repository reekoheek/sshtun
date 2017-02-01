const NString = require('node-norm/schema/nstring');
const NReference = require('node-norm/schema/nreference');
const NInteger = require('node-norm/schema/ninteger');
const NBoolean = require('node-norm/schema/nboolean');

const conf = {
  development: {
    secret: 'please replace this',
    connections: [
      {
        name: 'default',
        adapter: 'disk',
        file: process.env.SSHTUN_DB,
        schemas: [
          {
            name: 'tunnel',
            fields: {
              name: new NString('name').filter('required'),
              server: new NReference('server').to('server').filter('required'),
              port: new NInteger('port'),
              bind: new NString('bind'),
              autostart: new NBoolean('autostart'),
            },
            // observers: [
            //   {
            //     type: 'save',
            //     use: async (ctx, next) => {
            //       console.log('before');
            //       await next();
            //       console.log('after');
            //     },
            //   },
            // ],
          },
          {
            name: 'server',
            fields: {
              name: new NString('name').filter('required'),
              username: new NString('username').filter('required'),
              hostname: new NString('hostname').filter('required'),
              port: new NInteger('port'),
            },
          },
        ],
      },
    ],
  },
};

module.exports = function () {
  return conf[process.env.BONO_ENV || 'development'];
};
