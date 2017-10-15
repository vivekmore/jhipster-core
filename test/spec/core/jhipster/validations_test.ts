import { expect } from 'chai';
import { Validations } from '../../../../lib/core/jhipster/validations';

/* eslint-disable no-new, no-unused-expressions */
const VALIDATIONS = Validations.VALIDATIONS;
const exists = Validations.exists;
const needsValue = Validations.needsValue;

describe('VALIDATIONS', () => {
  describe('::exists', () => {
    describe('when checking for a valid validation', () => {
      it('returns true', () => {
        expect(exists(VALIDATIONS.MAXBYTES)).to.be.true;
      });
    });
    describe('when checking for an invalid validation', () => {
      it('returns false', () => {
        expect(exists('NOTHING')).to.be.false;
      });
    });
  });
  describe('::needsValue', () => {
    describe('when checking whether a validation needs a value', () => {
      it('returns so', () => {
        expect(needsValue(VALIDATIONS.MAXLENGTH)).to.be.true;
        expect(needsValue(VALIDATIONS.REQUIRED)).to.be.false;
      });
    });
  });
});
