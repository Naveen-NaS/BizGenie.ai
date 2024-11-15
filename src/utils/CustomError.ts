export class CustomError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CustomError';
  
      // Set the prototype explicitly for better compatibility
      Object.setPrototypeOf(this, CustomError.prototype);
    }
}
  