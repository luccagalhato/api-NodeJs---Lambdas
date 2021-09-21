import AppException from './app.exception';
export default class NotFoundException extends AppException {
  constructor(message: string, code = 404) {
    super(message, code);
  }
}
