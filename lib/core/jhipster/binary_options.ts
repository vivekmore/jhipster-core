import { JhipsterObjectUtils } from '../../utils/object_utils';

export class BinaryOptions {

  public static readonly BINARY_OPTIONS = {
    DTO: 'dto',
    SERVICE: 'service',
    PAGINATION: 'pagination',
    MICROSERVICE: 'microservice',
    SEARCH_ENGINE: 'searchEngine',
    ANGULAR_SUFFIX: 'angularSuffix'
  };

  public static readonly BINARY_OPTION_VALUES = {
    dto: { MAPSTRUCT: 'mapstruct' },
    service: { SERVICE_CLASS: 'serviceClass', SERVICE_IMPL: 'serviceImpl' },
    pagination: {
      PAGER: 'pager',
      PAGINATION: 'pagination',
      'INFINITE-SCROLL': 'infinite-scroll'
    },
    searchEngine: { ELASTIC_SEARCH: 'elasticsearch' }
  };

  public static exists(passedOption, passedValue?) {
    const options = Object.keys(BinaryOptions.BINARY_OPTIONS).map(key => BinaryOptions.BINARY_OPTIONS[key]);
    return options.some((option) => {
      if (passedOption === option
        && (passedOption === BinaryOptions.BINARY_OPTIONS.MICROSERVICE || passedOption === BinaryOptions.BINARY_OPTIONS.ANGULAR_SUFFIX
          || JhipsterObjectUtils.values(BinaryOptions.BINARY_OPTION_VALUES[option]).indexOf(passedValue) !== -1)) {
        return true;
      }
      return false;
    });
  }
}
