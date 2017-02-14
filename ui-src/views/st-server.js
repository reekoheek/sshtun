import xin from 'xin';
import View from 'xin/components/view';
import html from './st-server.html';
import UISnackbar from 'xin-ui/ui-snackbar';
import Server from '../lib/server';

import 'xin-ui/ui-form';
import 'xin-ui/ui-textfield';

class StServer extends View {
  get template () {
    return html;
  }

  get props () {
    return Object.assign({}, super.props, {
      server: {
        type: Object,
      },
    });
  }

  focused () {
    super.focused();

    if (!this.parameters.id) {
      this.set('server', new Server());
      return;
    }

    (async () => {
      this.set('server', await Server.get(this.parameters.id));
    })();
  }

  computeServerUrl (id) {
    return `#!/server/${id}`;
  }

  async submitted (evt) {
    evt.preventDefault();

    try {
      await this.server.save();
      UISnackbar.show({ message: 'Record saved' });
      this.__app.navigate('/server');
    } catch (err) {
      UISnackbar.show({ message: err.message });
    }
  }

  async deleteClicked (evt) {
    evt.preventDefault();

    try {
      await this.server.delete();

      UISnackbar.show({ message: 'Record deleted' });
      this.__app.navigate('/server');
    } catch (err) {
      UISnackbar.show({ message: 'Error on deleting record' });
    }
  }

  async testClicked (evt) {
    evt.preventDefault();

    try {
      let result = await this.server.test();
      if (result) {
        window.alert('Connection ok');
      } else {
        window.alert('Connection, failed');
      }
    } catch (err) {
      console.error(err);
      window.alert('Error test server');
    }
  }
}

xin.define('st-server', StServer);
