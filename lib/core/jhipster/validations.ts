export class Validations {

  public static readonly VALIDATIONS = {
    REQUIRED: 'required',
    MIN: 'min',
    MAX: 'max',
    MINLENGTH: 'minlength',
    MAXLENGTH: 'maxlength',
    PATTERN: 'pattern',
    MINBYTES: 'minbytes',
    MAXBYTES: 'maxbytes'
  };

  private static readonly VALUES = {
    required: false,
    min: true,
    max: true,
    minlength: true,
    maxlength: true,
    pattern: true,
    minbytes: true,
    maxbytes: true
  };

  public static exists(validation: any): boolean {
    return Object.keys(Validations.VALIDATIONS).map(key => Validations.VALIDATIONS[key]).indexOf(validation) > -1;
  }

  public static needsValue(validation) {
    return Validations.VALUES[validation];
  }
}
