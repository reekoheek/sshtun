import Base from './base';

class Tunnel extends Base {
  static async get (id) {
    const response = await window.pool.fetch(`/tunnel/${id}`);
    if (!response.ok) {
      throw new Error('Response from server is not ok');
    }

    const result = await response.json();
    return new Tunnel(result.entry);
  }

  static async all () {
    const response = await window.pool.fetch('/tunnel');
    if (!response.ok) {
      throw new Error('Response from server is not ok');
    }

    const data = await response.json();
    return data.entries.map(row => new Tunnel(row));
  }

  async start () {
    const response = await window.pool.fetch(`/tunnel/${this.id}/start`);
    if (!response.ok) {
      throw new Error('Error on starting tunnel');
    }

    this.status = true;
  }

  async stop () {
    const response = await window.pool.fetch(`/tunnel/${this.id}/stop`);
    if (!response.ok) {
      throw new Error('Error on stopping tunnel');
    }

    this.status = false;
  }

  async delete () {
    if (this.status) {
      throw new Error('Cannot delete running tunnel');
    }

    const response = await window.pool.fetch(`/tunnel/${this.id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Error on deleting tunnel');
    }
  }
}

export default Tunnel;
