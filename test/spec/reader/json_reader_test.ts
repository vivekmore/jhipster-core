import { expect } from 'chai';
import { JsonReader } from '../../../lib/reader/json_reader';
import { UnaryOptions } from '../../../lib/core/jhipster/unary_options';

/* eslint-disable no-new, no-unused-expressions */

const fail = expect.fail;
const UNARY_OPTIONS = UnaryOptions.UNARY_OPTIONS;

describe('::parseFromDir', () => {
  describe('when passing invalid parameters', () => {
    describe('such as nil', () => {
      it('throws an error', () => {
        try {
          JsonReader.parseFromDir(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('IllegalArgumentException');
        }
      });
    });
    describe('such as a file', () => {
      it('throws an error', () => {
        try {
          JsonReader.parseFromDir('../../test_files/invalid_file.txt');
          fail();
        } catch (error) {
          expect(error.name).to.eq('WrongDirException');
        }
      });
    });
    describe('such as a dir that does not exist', () => {
      it('throws an error', () => {
        try {
          JsonReader.parseFromDir('nodir');
          fail();
        } catch (error) {
          expect(error.name).to.eq('WrongDirException');
        }
      });
    });
  });
  describe('when passing valid arguments', () => {
    describe('when reading a jhipster app dir', () => {
      const content = JsonReader.parseFromDir('./test/test_files/jhipster_app');
      it('reads it', () => {
        expect(content.entities.Country).not.to.be.undefined;
        expect(content.entities.Department).not.to.be.undefined;
        expect(content.entities.Employee).not.to.be.undefined;
        expect(content.entities.Job).not.to.be.undefined;
        expect(content.entities.JobHistory).not.to.be.undefined;
        expect(content.entities.Region).not.to.be.undefined;
        expect(content.entities.Task).not.to.be.undefined;
        expect(content.entities.NoEntity).to.be.undefined;
        expect(content.entities.BadEntity).to.be.undefined;
        expect(content.getOptions().filter(o => o.name === UNARY_OPTIONS.SKIP_CLIENT).length).eq(1);
        expect(content.getOptions().filter(o => o.name === UNARY_OPTIONS.SKIP_SERVER).length).eq(1);
      });
    });
  });
});
