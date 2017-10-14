import { expect } from 'chai';
import { JhipsterCoreException } from '../../../lib/exceptions/jhipster_core_exception';

describe('JhipsterCoreException', () => {
  describe('::constructor', () => {
    it('adds the \'Exception\' suffix to the names', () => {
      const exception = new JhipsterCoreException('Working', null);
      expect(exception.name).to.eq('WorkingException');
    });
    it('builds throwable objects', () => {
      try {
        throw new JhipsterCoreException('Working', null);
      } catch (error) {
        expect(error.name).to.eq('WorkingException');
        expect(error.message).to.be.empty;
      }
    });
    describe('when only passing a name', () => {
      it('takes the name and adds no message', () => {
        const exception1 = new JhipsterCoreException('Working', null);
        const exception2 = new JhipsterCoreException('Working', '');
        expect(exception1.name).to.eq('WorkingException');
        expect(exception1.message).to.be.empty;
        expect(exception2.name).to.eq('WorkingException');
        expect(exception2.message).to.be.empty;
      });
    });
    describe('when only passing a message', () => {
      it('just adds the suffix and keeps the message', () => {
        const exception1 = new JhipsterCoreException(null, 'The message');
        const exception2 = new JhipsterCoreException('', 'The message');
        expect(exception1.name).to.eq('Exception');
        expect(exception1.message).to.eq('The message');
        expect(exception2.name).to.eq('Exception');
        expect(exception2.message).to.eq('The message');
      });
    });
    describe('when passing in a name and a message', () => {
      it('keeps both', () => {
        const exception = new JhipsterCoreException('Good', 'The message');
        expect(exception.name).to.eq('GoodException');
        expect(exception.message).to.eq('The message');
      });
    });
    describe('when not passing anything', () => {
      it('names the exception \'Exception\' and puts no message', () => {
        const exception = new JhipsterCoreException(null, null);
        expect(exception.name).to.eq('Exception');
        expect(exception.message).to.be.empty;
      });
    });
  });
});
