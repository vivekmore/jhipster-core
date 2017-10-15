import { expect } from 'chai';
import * as fs from 'fs';
import { JdlReader } from '../../../lib/reader/jdl_reader';
import { EntityParser } from '../../../lib/parser/entity_parser';
import { JdlParser } from '../../../lib/parser/jdl_parser';
import { JsonExporter } from '../../../lib/export/json_exporter';

/* eslint-disable no-new, no-unused-expressions */

const fail = expect.fail;
const parseFromFiles = JdlReader.parseFromFiles;

describe('JsonExporter', () => {
  describe('::exportToJSON', () => {
    describe('when passing invalid parameters', () => {
      describe('such as undefined', () => {
        it('throws an error', () => {
          try {
            JsonExporter.exportToJSON();
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
    });
    describe('when passing valid arguments', () => {
      describe('when exporting JDL to entity json for SQL type', () => {
        const input = parseFromFiles(['./test/test_files/complex_jdl.jdl']);
        const content = EntityParser.parse({
          jdlObject: JdlParser.parse(input, 'sql'),
          databaseType: 'sql'
        });
        JsonExporter.exportToJSON(content);
        const department = JSON.parse(fs.readFileSync('.jhipster/Department.json', {encoding: 'utf-8'}));
        const jobHistory = JSON.parse(fs.readFileSync('.jhipster/JobHistory.json', {encoding: 'utf-8'}));
        it('exports it', () => {
          expect(fs.statSync('.jhipster/Department.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/JobHistory.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/Job.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/Employee.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/Location.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/Task.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/Country.json').isFile()).to.be.true;
          expect(fs.statSync('.jhipster/Region.json').isFile()).to.be.true;
          expect(department.relationships).to.deep.eq([
            {
              relationshipType: 'one-to-one',
              relationshipName: 'location',
              otherEntityName: 'location',
              otherEntityField: 'id',
              ownerSide: true,
              otherEntityRelationshipName: 'department'
            },
            {
              relationshipType: 'one-to-many',
              javadoc: 'A relationship',
              relationshipName: 'employee',
              otherEntityName: 'employee',
              otherEntityRelationshipName: 'department'
            }
          ]);
          expect(department.fields).to.deep.eq([
            {
              fieldName: 'departmentId',
              fieldType: 'Long'
            },
            {
              fieldName: 'departmentName',
              fieldType: 'String',
              fieldValidateRules: ['required']
            }
          ]);
          expect(department.dto).to.eq('no');
          expect(department.service).to.eq('no');
          expect(department.pagination).to.eq('no');
          expect(jobHistory.relationships).to.deep.eq([
            {
              relationshipType: 'one-to-one',
              relationshipName: 'department',
              otherEntityName: 'department',
              otherEntityField: 'id',
              ownerSide: true,
              otherEntityRelationshipName: 'jobHistory'
            },
            {
              relationshipType: 'one-to-one',
              relationshipName: 'job',
              otherEntityName: 'job',
              otherEntityField: 'id',
              ownerSide: true,
              otherEntityRelationshipName: 'jobHistory'
            },
            {
              relationshipType: 'one-to-one',
              relationshipName: 'employee',
              otherEntityName: 'employee',
              otherEntityField: 'id',
              ownerSide: true,
              otherEntityRelationshipName: 'jobHistory'
            }
          ]);
          expect(jobHistory.fields).to.deep.eq([
            {
              fieldName: 'startDate',
              fieldType: 'ZonedDateTime'
            },
            {
              fieldName: 'endDate',
              fieldType: 'ZonedDateTime'
            },
            {
              fieldName: 'language',
              fieldType: 'Language',
              fieldValues: 'FRENCH,ENGLISH,SPANISH'
            }
          ]);
          expect(jobHistory.dto).to.eq('no');
          expect(jobHistory.service).to.eq('no');
          expect(jobHistory.pagination).to.eq('infinite-scroll');
          // clean up the mess...
          fs.unlinkSync('.jhipster/Department.json');
          fs.unlinkSync('.jhipster/JobHistory.json');
          fs.unlinkSync('.jhipster/Job.json');
          fs.unlinkSync('.jhipster/Employee.json');
          fs.unlinkSync('.jhipster/Location.json');
          fs.unlinkSync('.jhipster/Task.json');
          fs.unlinkSync('.jhipster/Country.json');
          fs.unlinkSync('.jhipster/Region.json');
          fs.rmdirSync('.jhipster');
        });
      });
      describe('when exporting JDL to entity json for an existing entity', () => {
        let input = parseFromFiles(['./test/test_files/valid_jdl.jdl']);
        let content = EntityParser.parse({
          jdlObject: JdlParser.parse(input, 'sql'),
          databaseType: 'sql'
        });
        it('exports it with same changeLogDate', (done) => {
          JsonExporter.exportToJSON(content);
          expect(fs.statSync('.jhipster/A.json').isFile()).to.be.true;
          const changeLogDate = JSON.parse(fs.readFileSync('.jhipster/A.json', {encoding: 'utf-8'})).changelogDate;
          setTimeout(() => {
            input = parseFromFiles(['./test/test_files/valid_jdl.jdl']);
            content = EntityParser.parse({
              jdlObject: JdlParser.parse(input, 'sql'),
              databaseType: 'sql'
            });
            JsonExporter.exportToJSON(content, true);
            expect(fs.statSync('.jhipster/A.json').isFile()).to.be.true;
            const newChangeLogDate = JSON.parse(fs.readFileSync('.jhipster/A.json', {encoding: 'utf-8'})).changelogDate;
            expect(newChangeLogDate).to.eq(changeLogDate);
            // clean up the mess...
            fs.unlinkSync('.jhipster/A.json');
            fs.unlinkSync('.jhipster/B.json');
            fs.unlinkSync('.jhipster/C.json');
            fs.unlinkSync('.jhipster/D.json');
            fs.rmdirSync('.jhipster');
            done();
          }, 1000);
        });
      });
    });
  });
});
