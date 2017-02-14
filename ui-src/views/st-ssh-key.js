import xin from 'xin';
import View from 'xin/components/view';
import html from './st-ssh-key.html';

class StSSHKey extends View {
  get template () {
    return html;
  }

  get props () {
    return Object.assign({}, super.props, {
      pubKey: {
        type: String,
      },
    });
  }

  async focused () {
    super.focused();

    let resp = await window.pool.fetch('/ssh-key');
    let pubKey = '';
    if (resp.ok) {
      pubKey = await resp.text();
    }

    this.set('pubKey', pubKey);
  }

  async generateClicked (evt) {
    evt.preventDefault();

    let resp = await window.pool.fetch('/ssh-key/generate');
    let pubKey = '';
    if (resp.ok) {
      pubKey = await resp.text();
    }

    this.set('pubKey', pubKey);
  }
}

xin.define('st-ssh-key', StSSHKey);
