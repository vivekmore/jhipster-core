export class UnaryOptions {

  public static readonly UNARY_OPTIONS = {
    SKIP_CLIENT: 'skipClient',
    SKIP_SERVER: 'skipServer',
    SKIP_USER_MANAGEMENT: 'skipUserManagement',
    NO_FLUENT_METHOD: 'noFluentMethod',
    FILTER: 'filter',
  };

  public static exists(option) {
    return Object.keys(UnaryOptions.UNARY_OPTIONS).map(key => UnaryOptions.UNARY_OPTIONS[key]).indexOf(option) > -1;
  }
}
