class Base {
  constructor (row) {
    Object.assign(this, row);
  }

  set (key, value) {
    if (key.startsWith('$')) {
      Object.defineProperty(this, key, {
        enumerable: false,
        writable: true,
        configurable: true,
        value,
      });
    } else {
      this[key] = value;
    }

    return this;
  }
}

export default Base;
