import { expect } from 'chai';
import { UnaryOptions } from '../../../../lib/core/jhipster/unary_options';

/* eslint-disable no-new, no-unused-expressions */
const UNARY_OPTIONS = UnaryOptions.UNARY_OPTIONS;
const exists = UnaryOptions.exists;

describe('UNARY_OPTIONS', () => {
  describe('::exists', () => {
    describe('when checking for a valid unary option', () => {
      it('returns true', () => {
        expect(exists(UNARY_OPTIONS.SKIP_CLIENT)).to.be.true;
      });
    });
    describe('when checking for an invalid unary option', () => {
      it('returns false', () => {
        expect(exists('NOTHING')).to.be.false;
      });
    });
  });
});
