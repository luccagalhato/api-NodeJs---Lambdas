export default class AppException extends Error {
  private code: number;

  constructor(message: string, code = 500) {
    super(message);
    this.code = code;
  }

  getCode() {
    return this.code;
  }
}
