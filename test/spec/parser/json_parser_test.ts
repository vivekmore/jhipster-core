import { expect } from 'chai';
import { JsonFileReader } from '../../../lib/reader/json_file_reader';
import { JsonParser } from '../../../lib/parser/json_parser';
import { BinaryOptions } from '../../../lib/core/jhipster/binary_options';
import { UnaryOptions } from '../../../lib/core/jhipster/unary_options';

/* eslint-disable no-new, no-unused-expressions */

const fail = expect.fail;
const UNARY_OPTIONS = UnaryOptions.UNARY_OPTIONS;
const BINARY_OPTIONS = BinaryOptions.BINARY_OPTIONS;
const BINARY_OPTION_VALUES = BinaryOptions.BINARY_OPTION_VALUES;

describe('JsonParser', () => {
  describe('::parse', () => {
    const entities = {
      Employee: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Employee.json'),
      Country: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Country.json'),
      Department: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Department.json'),
      JobHistory: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/JobHistory.json'),
      Location: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Location.json'),
      Region: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Region.json'),
      Job: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Job.json'),
      Task: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Task.json')
    };
    entities.Employee.relationships.filter(r => r.relationshipName === 'department')[0].javadoc = undefined;
    const content = JsonParser.parseEntities(entities);
    describe('when parsing a JSON entity to JDL', () => {
      it('parses entity javadoc', () => {
        expect(content.entities.Employee.comment).eq('The Employee entity.');
      });
      it('parses tableName', () => {
        expect(content.entities.Employee.tableName).eq('emp');
      });
      it('parses mandatory fields', () => {
        expect(content.entities.Country.fields.countryId.type).eq('Long');
        expect(content.entities.Country.fields.countryName.type).eq('String');
      });
      it('parses field javadoc', () => {
        expect(content.entities.Country.fields.countryId.comment).eq('The country Id');
        expect(content.entities.Country.fields.countryName.comment).to.be.undefined;
      });
      it('parses validations', () => {
        expect(content.entities.Department.fields.departmentName.validations.required.name).eq('required');
        expect(content.entities.Department.fields.departmentName.validations.required.value).to.be.undefined;
        expect(content.entities.Employee.fields.salary.validations.min.value).eq(10000);
        expect(content.entities.Employee.fields.salary.validations.max.value).eq(1000000);
        expect(content.entities.Employee.fields.employeeId.validations).to.be.empty;
      });
      it('parses enums', () => {
        expect(content.enums.Language.name).eq('Language');
        expect(content.enums.Language.values.has('FRENCH')).to.be.true;
        expect(content.enums.Language.values.has('ENGLISH')).to.be.true;
        expect(content.enums.Language.values.has('SPANISH')).to.be.true;
      });
      it('parses options', () => {
        expect(
          content.getOptions().filter(
            option =>
              option.name === BINARY_OPTIONS.DTO &&
              option.value === BINARY_OPTION_VALUES.dto.MAPSTRUCT &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option =>
              option.name === BINARY_OPTIONS.PAGINATION &&
              option.value === BINARY_OPTION_VALUES.pagination['INFINITE-SCROLL'] &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option =>
              option.name === BINARY_OPTIONS.SERVICE &&
              option.value === BINARY_OPTION_VALUES.service.SERVICE_CLASS &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option =>
              option.name === BINARY_OPTIONS.SEARCH_ENGINE &&
              option.value === BINARY_OPTION_VALUES.searchEngine.ELASTIC_SEARCH &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option =>
              option.name === BINARY_OPTIONS.MICROSERVICE &&
              option.value === 'mymicroservice' &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option =>
              option.name === BINARY_OPTIONS.ANGULAR_SUFFIX &&
              option.value === 'myentities' &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option =>
              option.name === UNARY_OPTIONS.NO_FLUENT_METHOD &&
              option.entityNames.has('Employee')
          ).length
        ).to.eq(1);
      });
    });

    describe('when parsing JSON entities to JDL', () => {
      it('parses unidirectional OneToOne relationships', () => {
        expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Department{location}_Location');
      });
      it('parses bidirectional OneToOne relationships', () => {
        expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Country{region}_Region{country}');
      });
      it('parses bidirectional OneToMany relationships', () => {
        expect(
          content.relationships.relationships.OneToMany
        ).has.property('OneToMany_Department{employee}_Employee{department(foo)}');
      });
      it('parses unidirectional ManyToOne relationships', () => {
        expect(content.relationships.relationships.ManyToOne).has.property('ManyToOne_Employee{manager}_Employee');
      });
      it('parses ManyToMany relationships', () => {
        expect(content.relationships.relationships.ManyToMany).has.property('ManyToMany_Job{task(title)}_Task{job}');
      });
      it('parses comments in relationships for owner', () => {
        expect(
          content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInFrom
        ).to.eq('A relationship');
        expect(
          content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInTo
        ).to.be.undefined;
      });
      it('parses comments in relationships for owned', () => {
        const entities = {
          Department: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Department.json'),
          Employee: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Employee.json')
        };
        entities.Department.relationships.filter(r => r.relationshipName === 'employee')[0].javadoc = undefined;
        const content = JsonParser.parseEntities(entities);
        expect(
          content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInFrom
        ).to.be.undefined;
        expect(
          content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].commentInTo
        ).to.eq('Another side of the same relationship');
      });
      it('parses required relationships in owner', () => {
        expect(
          content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].isInjectedFieldInFromRequired
        ).to.be.true;
        expect(
          content.relationships.relationships.OneToMany['OneToMany_Department{employee}_Employee{department(foo)}'].isInjectedFieldInToRequired
        ).to.be.undefined;
      });
      it('parses required relationships in owned', () => {
        expect(
          content.relationships.relationships.ManyToMany['ManyToMany_Job{task(title)}_Task{job}'].isInjectedFieldInToRequired
        ).to.be.true;
        expect(
          content.relationships.relationships.ManyToMany['ManyToMany_Job{task(title)}_Task{job}'].isInjectedFieldInFromRequired
        ).to.be.undefined;
      });
    });

    describe('when parsing app config file to JDL', () => {
      const yoRcJson = JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.yo-rc.json');
      const content = JsonParser.parseServerOptions(yoRcJson['generator-jhipster']);
      it('parses server options', () => {
        expect(content.getOptions().filter(
          option => option.name === UNARY_OPTIONS.SKIP_CLIENT && option.entityNames.has('*')).length
        ).to.eq(1);
        expect(
          content.getOptions().filter(
            option => option.name === UNARY_OPTIONS.SKIP_SERVER && option.entityNames.has('*')).length
        ).to.eq(1);
      });
    });

    describe('when parsing entities with relationships to User', () => {
      describe('when skipUserManagement flag is not set', () => {
        describe('when there is no User.json entity', () => {
          const entities = {
            Country: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Country.json')
          };
          const content = JsonParser.parseEntities(entities);
          it('parses relationships to the JHipster managed User entity', () => {
            expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Country{user}_User');
          });
        });
        describe('when there is a User.json entity', () => {
          it('throws an error ', () => {
            try {
              JsonParser.parseEntities({
                Country: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Country.json'),
                User: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Region.json')
              });
              fail();
            } catch (error) {
              expect(error.name).to.eq('IllegalNameException');
            }
          });
        });
      });
      describe('when skipUserManagement flag is set', () => {
        const entities = {
          Country: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Country.json'),
          User: JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.jhipster/Region.json')
        };
        entities.User.relationships[0].otherEntityRelationshipName = 'user';
        const yoRcJson = JsonFileReader.readEntityJSON('./test/test_files/jhipster_app/.yo-rc.json');
        yoRcJson['generator-jhipster'].skipUserManagement = true;
        const content = JsonParser.parseServerOptions(yoRcJson['generator-jhipster']);
        JsonParser.parseEntities(entities, content);
        it('parses the User.json entity if skipUserManagement flag is set', () => {
          expect(content.entities.Country).not.to.be.undefined;
          expect(content.entities.User).not.to.be.undefined;
          expect(content.entities.User.fields.regionId).not.to.be.undefined;
          expect(content.relationships.relationships.OneToOne).has.property('OneToOne_Country{user}_User{country}');
        });
      });
    });
  });
});
