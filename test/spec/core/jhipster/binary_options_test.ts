import { expect } from 'chai';
import { BinaryOptions } from '../../../../lib/core/jhipster/binary_options';

/* eslint-disable no-new, no-unused-expressions */
const BINARY_OPTIONS = BinaryOptions.BINARY_OPTIONS;
const BINARY_OPTION_VALUE = BinaryOptions.BINARY_OPTION_VALUES;
const exists = BinaryOptions.exists;

describe('BINARY_OPTIONS', () => {
  describe('::exists', () => {
    describe('when checking for a valid binary option', () => {
      it('returns true', () => {
        expect(exists(BINARY_OPTIONS.DTO, BINARY_OPTION_VALUE.dto.MAPSTRUCT)).to.be.true;
      });
    });
    describe('when checking for an invalid binary option', () => {
      it('returns false', () => {
        expect(exists('NOTHING')).to.be.false;
      });
    });
  });
});
