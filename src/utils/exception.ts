export default class Exception extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
  }

  static New(message: string, statusCode: number) {
    return new Exception(message, statusCode);
  }
}
