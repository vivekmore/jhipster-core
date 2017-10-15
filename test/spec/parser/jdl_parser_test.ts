import { expect } from 'chai';
import { ApplicationTypes } from '../../../lib/core/jhipster/application_types';
import { JdlReader } from '../../../lib/reader/jdl_reader';
import { JdlParser } from '../../../lib/parser/jdl_parser';
import { JDLValidation } from '../../../lib/core/jdl_validation';
import { JDLUnaryOption } from '../../../lib/core/jdl_unary_option';
import { JDLBinaryOption } from '../../../lib/core/jdl_binary_option';
import { JDLField } from '../../../lib/core/jdl_field';
import { JDLEntity } from '../../../lib/core/jdl_entity';
import { JDLEnum } from '../../../lib/core/jdl_enum';
import { BinaryOptions } from '../../../lib/core/jhipster/binary_options';
import { UnaryOptions } from '../../../lib/core/jhipster/unary_options';
import { DatabaseTypes } from '../../../lib/core/jhipster/database_types';
import { FieldTypes } from '../../../lib/core/jhipster/field_types';
import { Validations } from '../../../lib/core/jhipster/validations';

/* eslint-disable no-new, no-unused-expressions */

const fail = expect.fail;
const parseFromFiles = JdlReader.parseFromFiles;
const DbTypes = DatabaseTypes.Types;
const SQL_TYPES = FieldTypes.SQL_TYPES;
const VALIDATIONS = Validations.VALIDATIONS;
const UNARY_OPTIONS = UnaryOptions.UNARY_OPTIONS;
const BINARY_OPTIONS = BinaryOptions.BINARY_OPTIONS;
const BINARY_OPTION_VALUES = BinaryOptions.BINARY_OPTION_VALUES;

describe('JDLParser', () => {
  describe('::parse', () => {
    describe('when passing invalid args', () => {
      describe('because there is no document', () => {
        it('fails', () => {
          try {
            JdlParser.parse(null, 'sql');
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
      describe('because there is no database type', () => {
        it('fails', () => {
          try {
            JdlParser.parse({
              notNull: 42
            }, null);
            fail();
          } catch (error) {
            expect(error.name).to.eq('NullPointerException');
          }
        });
      });
      describe('because the database type doesn\'t exist', () => {
        it('fails', () => {
          try {
            JdlParser.parse({
              notNull: 42
            }, 'WRONG');
            fail();
          } catch (error) {
            expect(error.name).to.eq('IllegalArgumentException');
          }
        });
      });
    });
    describe('when passing valid args', () => {
      describe('with no error', () => {
        const input = parseFromFiles(['./test/test_files/complex_jdl.jdl']);
        const content = JdlParser.parse(input, 'mysql');
        xit('builds a JDLObject', () => {
          expect(content).not.to.be.null;
          expect(content.entities.Department).to.deep.equal(new JDLEntity({
            name: 'Department',
            tableName: 'Department',
            fields: {
              departmentId: new JDLField({
                name: 'departmentId',
                type: SQL_TYPES.LONG
              }),
              departmentName: new JDLField({
                name: 'departmentName',
                type: SQL_TYPES.STRING,
                validations: { required: new JDLValidation({ name: VALIDATIONS.REQUIRED }) }
              })
            }
          }));
          expect(content.entities.JobHistory).to.deep.eq(new JDLEntity({
            name: 'JobHistory',
            tableName: 'JobHistory',
            fields: {
              startDate: new JDLField({
                name: 'startDate',
                type: SQL_TYPES.ZONED_DATE_TIME
              }),
              endDate: new JDLField({
                name: 'endDate',
                type: SQL_TYPES.ZONED_DATE_TIME
              }),
              language: new JDLField({ name: 'language', type: 'Language' })
            },
            comment: 'JobHistory comment.'
          }));
          expect(content.enums.JobType).to.deep.eq(new JDLEnum({
            name: 'JobType',
            values: ['TYPE1', 'TYPE2']
          }));
          expect(content.entities.Job).to.deep.eq(new JDLEntity({
            name: 'Job',
            tableName: 'Job',
            fields: {
              jobId: new JDLField({ name: 'jobId', type: SQL_TYPES.LONG }),
              jobTitle: new JDLField({
                name: 'jobTitle',
                type: SQL_TYPES.STRING,
                validations: {
                  minlength: new JDLValidation({
                    name: VALIDATIONS.MINLENGTH,
                    value: 5
                  }),
                  maxlength: new JDLValidation({
                    name: VALIDATIONS.MAXLENGTH,
                    value: 25
                  })
                }
              }),
              jobType: new JDLField({ name: 'jobType', type: 'JobType' }),
              minSalary: new JDLField({
                name: 'minSalary',
                type: SQL_TYPES.LONG
              }),
              maxSalary: new JDLField({
                name: 'maxSalary',
                type: SQL_TYPES.LONG
              })
            }
          }));
          expect(content.getOptions()).to.deep.eq([
            new JDLUnaryOption({
              name: UNARY_OPTIONS.SKIP_SERVER,
              entityNames: ['Country']
            }),
            new JDLBinaryOption({
              name: BINARY_OPTIONS.DTO,
              entityNames: ['Employee'],
              value: BINARY_OPTION_VALUES.dto.MAPSTRUCT
            }),
            new JDLBinaryOption({
              name: BINARY_OPTIONS.SERVICE,
              entityNames: ['Employee'],
              value: BINARY_OPTION_VALUES.service.SERVICE_CLASS
            }),
            new JDLBinaryOption({
              name: BINARY_OPTIONS.PAGINATION,
              entityNames: ['JobHistory', 'Employee'],
              value: BINARY_OPTION_VALUES.pagination['INFINITE-SCROLL']
            }),
            new JDLBinaryOption({
              name: BINARY_OPTIONS.PAGINATION,
              entityNames: ['Job'],
              value: BINARY_OPTION_VALUES.pagination.PAGINATION
            }),
            new JDLBinaryOption({
              name: BINARY_OPTIONS.MICROSERVICE,
              entityNames: ['*'],
              value: 'mymicroservice'
            }),
            new JDLBinaryOption({
              name: BINARY_OPTIONS.SEARCH_ENGINE,
              entityNames: ['Employee'],
              value: BINARY_OPTION_VALUES.searchEngine.ELASTIC_SEARCH
            })
          ]);
        });
      });
      describe('with an application type', () => {
        const input = parseFromFiles(['./test/test_files/invalid_field_type.jdl']);
        it('doesn\'t check for field types', () => {
          JdlParser.parse(input, 'sql', 'gateway');
        });
      });
      describe('with a required relationship', () => {
        const input = parseFromFiles(['./test/test_files/required_relationships.jdl']);
        const content = JdlParser.parse(input, 'sql');
        it('adds it', () => {
          expect(content.relationships.relationships.OneToOne['OneToOne_A{b}_B{a}'].isInjectedFieldInFromRequired).to.be.true;
          expect(content.relationships.relationships.OneToOne['OneToOne_A{b}_B{a}'].isInjectedFieldInToRequired).to.be.false;
        });
      });
      describe('with a field name \'id\'', () => {
        const input = parseFromFiles(['./test/test_files/id_field.jdl']);
        const content = JdlParser.parse(input, 'sql');
        xit('doesn\'t add it', () => {
          expect(content.entities.A).to.deep.eq(new JDLEntity({
            name: 'A',
            tableName: 'A',
            fields: {
              email: new JDLField({ name: 'email', type: SQL_TYPES.STRING })
            }
          }));
        });
      });
      describe('with an invalid field type', () => {
        const input = parseFromFiles(['./test/test_files/invalid_field_type.jdl']);
        it('fails', () => {
          try {
            JdlParser.parse(input, 'sql');
            fail();
          } catch (error) {
            expect(error.name).to.eq('WrongTypeException');
          }
        });
      });
      describe('with an unexistent validation for a field type', () => {
        const input = parseFromFiles(['./test/test_files/non_existent_validation.jdl']);
        it('fails', () => {
          try {
            JdlParser.parse(input, 'sql');
            fail();
          } catch (error) {
            expect(error.name).to.eq('WrongValidationException');
          }
        });
      });
      describe('with entities that do not exist for a relationship', () => {
        const input = parseFromFiles(['./test/test_files/unexistent_entities_for_relationship.jdl']);
        it('fails', () => {
          try {
            JdlParser.parse(input, 'sql');
            fail();
          } catch (error) {
            expect(error.name).to.eq('UndeclaredEntityException');
          }
        });
      });
      describe('with User entity as from for a relationship', () => {
        const input = parseFromFiles(['./test/test_files/user_entity_from_relationship.jdl']);
        it('fails', () => {
          try {
            JdlParser.parse(input, 'sql');
            fail();
          } catch (error) {
            expect(error.name).to.eq('IllegalAssociationException');
          }
        });
      });
      describe('with User entity as to for a relationship', () => {
        const input = parseFromFiles(['./test/test_files/user_entity_to_relationship.jdl']);
        const content = JdlParser.parse(input, 'sql');
        it('is processed', () => {
          expect(content.relationships.relationships.ManyToOne['ManyToOne_A{user}_User{a}'].to.name).to.eq('User');
          expect(content.relationships.relationships.OneToOne['OneToOne_B{user}_User'].to.name).to.eq('User');
        });
      });
      describe('with an invalid option', () => {
        const input = parseFromFiles(['./test/test_files/invalid_option.jdl']);
        it('fails', () => {
          try {
            JdlParser.parse(input, 'sql');
            fail();
          } catch (error) {
            expect(error.name).to.eq('IllegalArgumentException');
          }
        });
      });
      describe('with a required enum', () => {
        const input = parseFromFiles(['./test/test_files/enum.jdl']);
        const content = JdlParser.parse(input, 'sql');
        const enumField = new JDLField({
          name: 'sourceType',
          type: 'MyEnum'
        });
        enumField.addValidation(new JDLValidation({
          name: VALIDATIONS.REQUIRED
        }));
        it('adds it', () => {
          expect(content.enums.MyEnum).to.deep.eq(new JDLEnum({
            name: 'MyEnum',
            values: ['AAA', 'BBB', 'CCC']
          }));
          expect(content.entities.MyEntity.fields.sourceType).to.deep.eq(enumField);
        });
      });
      describe('when using the noFluentMethods option', () => {
        let input = parseFromFiles(['./test/test_files/fluent_methods.jdl']);
        let content = JdlParser.parse(input, 'sql');
        it('adds it correctly', () => {
          expect(content.getOptions()).to.deep.eq([
            new JDLUnaryOption({
              name: UNARY_OPTIONS.NO_FLUENT_METHOD,
              entityNames: ['A']
            })
          ]);
          input = parseFromFiles(['./test/test_files/fluent_methods2.jdl']);
          content = JdlParser.parse(input, 'sql');
          expect(content.getOptions()).to.deep.eq([
            new JDLUnaryOption({
              name: UNARY_OPTIONS.NO_FLUENT_METHOD,
              entityNames: ['*'],
              excludedNames: ['A']
            })
          ]);
        });
      });
      describe('when having following comments', () => {
        const input = parseFromFiles(['./test/test_files/following_comments.jdl']);
        const content = JdlParser.parse(input, 'sql');
        it('accepts them', () => {
          expect(content.entities.A.fields.name.comment).to.eq('abc');
          expect(content.entities.A.fields.thing.comment).to.eq('def');
          expect(content.entities.A.fields.another.comment).to.eq('ghi');
        });
        describe('when having both forms of comments', () => {
          it('only accepts the one defined first', () => {
            expect(content.entities.B.fields.name.comment).to.eq('xyz');
          });
        });
        describe('when using commas', () => {
          it('assigns the comment to the next field', () => {
            expect(content.entities.C.fields.name.comment).to.be.undefined;
            expect(content.entities.C.fields.thing.comment).to.eq('abc');
          });
        });
      });
      describe('when parsing another complex JDL file', () => {
        const input = parseFromFiles(['./test/test_files/complex_jdl_2.jdl']);
        const content = JdlParser.parse(input, 'sql');
        xit('parses it', () => {
          expect(content.entities.A).to.deep.eq({
            name: 'A',
            tableName: 'A',
            fields: {},
            comment: undefined
          });
          expect(content.entities.B).to.deep.eq({
            name: 'B',
            tableName: 'B',
            fields: {},
            comment: undefined
          });
          expect(content.entities.C).to.deep.eq({
            name: 'C',
            tableName: 'C',
            fields: {
              name: {
                comment: undefined,
                name: 'name',
                type: 'String',
                validations: {
                  required: {
                    name: 'required',
                    value: ''
                  }
                }
              }
            },
            comment: undefined
          });
          expect(content.entities.D).to.deep.eq({
            name: 'D',
            tableName: 'D',
            fields: {
              name: {
                comment: undefined,
                name: 'name',
                type: 'String',
                validations: {
                  required: {
                    name: 'required',
                    value: ''
                  },
                  minlength: {
                    name: 'minlength',
                    value: 1
                  },
                  maxlength: {
                    name: 'maxlength',
                    value: 42
                  }
                }
              },
              count: {
                comment: undefined,
                name: 'count',
                type: 'Integer',
                validations: {}
              }
            },
            comment: undefined
          });
          expect(content.entities.E).to.deep.eq({
            name: 'E',
            tableName: 'E',
            fields: {},
            comment: undefined
          });
          expect(content.entities.F).to.deep.eq({
            name: 'F',
            tableName: 'F',
            fields: {
              name: {
                comment: 'My comment for name of F.',
                name: 'name',
                type: 'String',
                validations: {}
              },
              count: {
                comment: undefined,
                name: 'count',
                type: 'Integer',
                validations: {}
              },
              flag: {
                comment: 'My comment for flag of F.',
                name: 'flag',
                type: 'Boolean',
                validations: {
                  required: {
                    name: 'required',
                    value: ''
                  }
                }
              }
            },
            comment: 'My comment for F.'
          });
          expect(content.entities.G).to.deep.eq({
            name: 'G',
            tableName: 'G',
            fields: {
              name: {
                comment: 'xyz',
                name: 'name',
                type: 'String',
                validations: {
                  required: {
                    name: 'required',
                    value: ''
                  }
                }
              },
              count: {
                comment: 'def',
                name: 'count',
                type: 'Integer',
                validations: {}
              }
            },
            comment: undefined
          });
          const options = content.getOptions();
          expect(options.length).to.eq(7);
          expect(options[0].name).to.eq('skipClient');
          expect(options[0].entityNames.toString()).to.eq('[G]');
          expect(options[0].excludedNames.toString()).to.eq('[]');
          expect(options[1].name).to.eq('skipServer');
          expect(options[1].entityNames.toString()).to.eq('[B,D]');
          expect(options[1].excludedNames.toString()).to.eq('[D]');
          expect(options[2].name).to.eq('dto');
          expect(options[2].value).to.eq('mapstruct');
          expect(options[2].entityNames.toString()).to.eq('[*]');
          expect(options[2].excludedNames.toString()).to.eq('[G]');
          expect(options[3].name).to.eq('service');
          expect(options[3].entityNames.toString()).to.eq('[G]');
          expect(options[3].excludedNames.toString()).to.eq('[]');
          expect(options[3].value).to.eq('serviceImpl');
          expect(options[4].name).to.eq('service');
          expect(options[4].entityNames.toString()).to.eq('[A,C,D]');
          expect(options[4].excludedNames.toString()).to.eq('[]');
          expect(options[4].value).to.eq('serviceClass');
          expect(options[5].name).to.eq('pagination');
          expect(options[5].entityNames.toString()).to.eq('[*]');
          expect(options[5].excludedNames.toString()).to.eq('[G]');
          expect(options[5].value).to.eq('pager');
          expect(options[6].name).to.eq('pagination');
          expect(options[6].entityNames.toString()).to.eq('[G]');
          expect(options[6].excludedNames.toString()).to.eq('[]');
          expect(options[6].value).to.eq('pagination');
        });
      });
      describe('when having two consecutive comments for fields', () => {
        const input = parseFromFiles(['./test/test_files/field_comments.jdl']);
        const content = JdlParser.parse(input, 'sql');
        xit('assigns them correctly', () => {
          expect(content.entities.TestEntity.fields).to.deep.eq({
            first: {
              name: 'first',
              comment: 'first comment',
              type: 'String',
              validations: {}
            },
            second: {
              name: 'second',
              comment: 'second comment',
              type: 'String',
              validations: {}
            },
            third: {
              name: 'third',
              comment: undefined,
              type: 'Integer',
              validations: {}
            },
            fourth: {
              name: 'fourth',
              comment: 'another',
              type: 'String',
              validations: {}
            }
          });
          expect(content.entities.TestEntity2.fields).to.deep.eq({
            first: {
              name: 'first',
              comment: 'first comment',
              type: 'String',
              validations: {
                required: {
                  name: 'required',
                  value: ''
                }
              }
            },
            second: {
              name: 'second',
              comment: 'second comment',
              type: 'String',
              validations: {}
            }
          });
        });
      });
      describe('when having constants', () => {
        const input = parseFromFiles(['./test/test_files/constants.jdl']);
        const content = JdlParser.parse(input, 'sql');
        xit('assigns the constants\' value when needed', () => {
          expect(content.entities.A.fields).to.deep.eq({
            name: {
              name: 'name',
              comment: undefined,
              type: 'String',
              validations: {
                minlength: {
                  name: 'minlength',
                  value: 1
                },
                maxlength: {
                  name: 'maxlength',
                  value: 42
                }
              }
            },
            content: {
              name: 'content',
              comment: undefined,
              type: 'TextBlob',
              validations: {
                minbytes: {
                  name: 'minbytes',
                  value: 20
                },
                maxbytes: {
                  name: 'maxbytes',
                  value: 40
                }
              }
            },
            count: {
              name: 'count',
              comment: undefined,
              type: 'Integer',
              validations: {
                min: {
                  name: 'min',
                  value: 0
                },
                max: {
                  name: 'max',
                  value: 41
                }
              }
            }
          });
        });
      });
      describe('when having a cassandra app with paginated entities', () => {
        const input = parseFromFiles(['./test/test_files/cassandra_jdl.jdl']);
        it('fails', () => {
          try {
            JdlParser.parse(input, 'cassandra');
          } catch (error) {
            expect(error.name).to.eq('IllegalOptionException');
          }
        });
      });
      describe('when parsing filtered entities', () => {
        const input = parseFromFiles(['./test/test_files/filtering.jdl']);
        const content = JdlParser.parse(input, 'sql');
        it('works', () => {
          expect(content.options.options.filter.entityNames.has('*')).to.be.true;
          expect(content.options.options.filter.excludedNames.has('B')).to.be.true;
        });
      });
      describe('when parsing a JDL inside a microservice app', () => {
        describe('without the microservice option in the JDL', () => {
          let input = null;
          let content = null;

          beforeEach(() => {
            input = parseFromFiles(['./test/test_files/no_microservice.jdl']);
            content = JdlParser.parse(input, DbTypes.sql, ApplicationTypes.MICROSERVICE, 'toto');
          });

          it('adds it to every entity', () => {
            expect(Object.keys(content.options.options).length).to.equal(1);
            expect(content.options.options.microservice_toto.entityNames.toString()).to.deep.equal('[*]');
          });
        });
      });
    });
  });
});
