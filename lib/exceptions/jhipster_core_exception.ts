export class JhipsterCoreException extends Error {

  constructor(name?: string, message?: string) {
    super(message || '');
    this.name = name ? `${name}Exception` : 'Exception';
  }

}
