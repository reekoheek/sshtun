import ContextError from './context-error';

class Server {
  static async all () {
    const response = await window.pool.fetch(`/server`);
    if (!response.ok) {
      throw new ContextError('Error response from server');
    }

    const result = await response.json();
    return result.entries.map(server => new Server(server));
  }

  static async get (id) {
    const response = await window.pool.fetch(`/server/${id}`);
    if (!response.ok) {
      throw new ContextError('Error response from server');
    }

    const result = await response.json();
    return new Server(result.entry);
  }

  constructor (row) {
    Object.assign(this, row);
  }

  validate () {
    let { name, username, hostname } = this;

    if (!name) {
      throw new ContextError('Name is required', 'name');
    }

    if (!username) {
      throw new ContextError('Username is required', 'username');
    }

    if (!hostname) {
      throw new ContextError('Hostname is required', 'hostname');
    }

    this.port = this.port || 22;
  }

  async save () {
    await this.validate();

    let body = JSON.stringify(this);
    let url = '/server';
    let method = 'POST';

    if (this.id) {
      url = `/server/${this.id}`;
      method = 'PUT';
    }

    const response = await window.pool.fetch(url, { method, body });
    if (!response.ok) {
      throw new ContextError('Error saving');
    }
  }

  async delete () {
    const response = await window.pool.fetch(`/server/${this.id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new ContextError('Error deleting');
    }
  }

  async test () {
    const response = await window.pool.fetch(`/server/${this.id}/test`, { method: 'GET' });
    let { test } = await response.json();
    return test;
  }
}

export default Server;
