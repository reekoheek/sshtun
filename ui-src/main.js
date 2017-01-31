window.xin = {
  'customElements.version': 'v0',
  'viewLoaders': [
    { test: /^st-/, load: view => System.import('./views/' + view.name) },
  ],
};

require('xin-ui/scss/ui-reset.scss');
require('xin-ui/scss/ui-typography.scss');
require('xin-ui/scss/ui-layout.scss');
require('xin-ui/scss/ui-header.scss');
require('xin-ui/scss/ui-button.scss');
require('xin-ui/scss/ui-list.scss');

require('xin/css/layout.css');
require('material-design-icons/iconfont/material-icons.css');

require('./css/theme.css');

require('xin');
require('xin/components/pager');
require('xin/components/repeat');
require('xin-ui/ui-drawer');
require('xin-connect/connect-pool');
require('xin-connect/connect-fetch');
require('xin/middlewares/lazy-view');
require('xin/components/app');
