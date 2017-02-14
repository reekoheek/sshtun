import xin from 'xin';
import View from 'xin/components/view';

import Tunnel from '../lib/tunnel';
import html from './st-tunnels.html';

class StTunnels extends View {
  get template () {
    return html;
  }

  async focused () {
    super.focused();

    this.set('tunnels', await Tunnel.all());
  }

  computeTunnelUrl (id) {
    return `#!/tunnel/${id}`;
  }

  computeStatus (status) {
    return status ? 'running' : 'stopped';
  }
}

xin.define('st-tunnels', StTunnels);
