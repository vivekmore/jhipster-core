import { expect } from 'chai';
import { JhipsterStringUtils } from '../../../lib/utils/string_utils';

describe('JhipsterStringUtils.', () => {
  describe('::camelCase', () => {
    describe('when passing a valid string', () => {
      it('camel-cases it', () => {
        expect(JhipsterStringUtils.camelCase('e')).to.eq('e');
        expect(JhipsterStringUtils.camelCase('entity')).to.eq('entity');
        expect(JhipsterStringUtils.camelCase('Entity')).to.eq('entity');
        expect(JhipsterStringUtils.camelCase('EntityA')).to.eq('entityA');
        expect(JhipsterStringUtils.camelCase('EntityAN')).to.eq('entityAN');
        expect(JhipsterStringUtils.camelCase('Entity_AN')).to.eq('entityAN');
        expect(JhipsterStringUtils.camelCase('_entity_AN')).to.eq('entityAN');
        expect(JhipsterStringUtils.camelCase('_entit--y_AN---')).to.eq('entityAN');
        expect(JhipsterStringUtils.camelCase('En tity_AN ')).to.eq('entityAN');
      });
    });
    describe('when passing an invalid parameter', () => {
      describe('as it is empty', () => {
        it('returns it', () => {
          expect(JhipsterStringUtils.camelCase('')).to.eq('');
        });
      });
    });
  });
  describe('::isNilOrEmpty', () => {
    describe('when passing a nil object', () => {
      it('returns true', () => {
        expect(JhipsterStringUtils.isNilOrEmpty(null)).to.be.true;
      });
    });
    describe('when passing an undefined object', () => {
      it('returns true', () => {
        expect(JhipsterStringUtils.isNilOrEmpty(undefined)).to.be.true;
      });
    });
    describe('when passing an empty string', () => {
      it('returns true', () => {
        expect(JhipsterStringUtils.isNilOrEmpty('')).to.be.true;
      });
    });
    describe('when passing a valid string', () => {
      it('returns false', () => {
        expect(JhipsterStringUtils.isNilOrEmpty('ABC')).to.be.false;
      });
    });
  });
});
