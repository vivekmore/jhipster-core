import { expect } from 'chai';
import { RelationshipTypes } from '../../../../lib/core/jhipster/relationship_types';

/* eslint-disable no-new, no-unused-expressions */
const RELATIONSHIP_TYPES = RelationshipTypes.RELATIONSHIP_TYPES;
const exists = RelationshipTypes.exists;

describe('RELATIONSHIP_TYPES', () => {
  describe('::exists', () => {
    describe('when checking for a valid unary relationship type', () => {
      it('returns true', () => {
        expect(exists(RELATIONSHIP_TYPES.MANY_TO_ONE)).to.be.true;
      });
    });
    describe('when checking for an invalid relationship type', () => {
      it('returns false', () => {
        expect(exists('NOTHING')).to.be.false;
      });
    });
  });
});
