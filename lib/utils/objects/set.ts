import { JhipsterCoreException } from '../../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../../exceptions/jhipster_core_exception_type';

/**
 * Custom implementation of a Set.
 */
class Set {
  constructor(array) {
    this.container = array ? convertToMap(array) : {};
  }

  has(element) {
    return element != null && element in this.container;
  }

  add(element) {
    if (!element) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'Can\'t add a nil element to the set.');
    }
    if (element in this.container) {
      return false;
    }
    this.container[element] = null;
    return true;
  }

  addArrayElements(array) {
    if (!array) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'Can\'t add elements from a nil object.');
    }
    let atLeastOneAdded = false;
    for (let i = 0; i < array.length; i++) {
      if (!this.has(array[i])) {
        this.container[array[i]] = null;
        atLeastOneAdded = true;
      }
    }
    return atLeastOneAdded;
  }

  addSetElements(otherSet) {
    if (!otherSet) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'Can\'t add elements from a nil object.');
    }
    let atLeastOneAdded = false;
    Object.keys(otherSet.container).forEach((element) => {
      const added = this.add(element);
      if (added) {
        atLeastOneAdded = true;
      }
    });
    return atLeastOneAdded;
  }

  remove(element) {
    if (!this.has(element)) {
      return false;
    }
    delete this.container[element];
    return true;
  }

  clear() {
    this.container = {};
  }

  size() {
    return Object.keys(this.container).length;
  }

  forEach(passedFunction, thisArg) {
    if (!passedFunction) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The function must not be nil.');
    }
    Object.keys(this.container).forEach((element) => {
      passedFunction.call(thisArg, element);
    });
  }

  map(passedFunction, thisArg) {
    if (!passedFunction) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The function must not be nil.');
    }
    const newContainer = {};
    Object.keys(this.container).forEach((element) => {
      newContainer[passedFunction.call(thisArg, element)] = null;
    });
    this.container = newContainer;
    return this;
  }

  filter(passedFunction, thisArg) {
    if (!passedFunction) {
      throw new JhipsterCoreException(JhipsterCoreExceptionType.NullPointer, 'The function must not be nil.');
    }
    const newContainer = {};
    Object.keys(this.container).forEach((element) => {
      if (passedFunction.call(thisArg, element)) {
        newContainer[element] = null;
      }
    });
    this.container = newContainer;
    return this;
  }

  join(delimiter) {
    return Object.keys(this.container).join((!delimiter) ? ',' : delimiter);
  }

  toString() {
    return `[${Object.keys(this.container).toString()}]`;
  }
}

export = Set;

function convertToMap(array) {
  const map = {};
  for (let i = 0; i < array.length; i++) {
    map[array[i]] = null;
  }
  return map;
}
