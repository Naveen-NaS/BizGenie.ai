export class CustomError extends Error {
  type?: string;

  constructor(message: string, type?: string) {
    super(message);
    this.name = "CustomError";
    this.type = type; // Optional: Differentiate error types
  }
}