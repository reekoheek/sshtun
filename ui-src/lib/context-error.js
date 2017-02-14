class ContextError extends Error {
  constructor (message, context) {
    super(message);

    this.context = context;
  }
}

export default ContextError;
