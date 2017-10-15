import { expect } from 'chai';
import * as fs from 'fs';
import * as _ from 'lodash';
import { JsonReader } from '../../../lib/reader/json_reader';
import { JdlReader } from '../../../lib/reader/jdl_reader';
import { JsonFileReader } from '../../../lib/reader/json_file_reader';
import { EntityParser } from '../../../lib/parser/entity_parser';
import { JdlParser } from '../../../lib/parser/jdl_parser';
import { JdlExporter } from '../../../lib/export/jdl_exporter';

/* eslint-disable no-new, no-unused-expressions */

const fail = expect.fail;
const readEntityJSON = JsonFileReader.readEntityJSON;

describe('::exportToJDL', () => {
  describe('when passing invalid parameters', () => {
    describe('such as undefined', () => {
      it('throws an error', () => {
        try {
          JdlExporter.exportToJDL();
          fail();
        } catch (error) {
          expect(error.name).to.eq('NullPointerException');
        }
      });
    });
  });
  describe('when passing valid arguments', () => {
    describe('when exporting json to entity JDL', () => {
      const jdl = JsonReader.parseFromDir('./test/test_files/jhipster_app');
      JdlExporter.exportToJDL(jdl);
      const input = JdlReader.parseFromFiles(['./jhipster-jdl.jh']);
      const newEntities = EntityParser.parse({
        jdlObject: JdlParser.parse(input, 'sql'),
        databaseType: 'sql'
      });
      const previousEntities = {};
      ['Country', 'Department', 'Employee', 'Job', 'JobHistory', 'Location', 'Region', 'Task'].forEach((entityName) => {
        previousEntities[entityName] = readEntityJSON(`./test/test_files/jhipster_app/.jhipster/${entityName}.json`);
        previousEntities[entityName].changelogDate = newEntities[entityName].changelogDate;
        if (previousEntities[entityName].javadoc === undefined) {
          previousEntities[entityName].javadoc = undefined;
        }
        // Sort arrays to ease comparison
        previousEntities[entityName].fields = _.sortBy(previousEntities[entityName].fields, 'fieldName');
        newEntities[entityName].fields = _.sortBy(newEntities[entityName].fields, 'fieldName');
        previousEntities[entityName].relationships = _.sortBy(previousEntities[entityName].relationships, 'relationshipName');
        newEntities[entityName].relationships = _.sortBy(newEntities[entityName].relationships, 'relationshipName');
      });
      it('exports it', () => {
        expect(fs.statSync('./jhipster-jdl.jh').isFile()).to.be.true;
        expect(newEntities).to.deep.eq(previousEntities);
        // clean up the mess...
        fs.unlinkSync('./jhipster-jdl.jh');
      });
    });
  });
});
