/* eslint-disable no-new, no-unused-expressions */
const expect = require('chai').expect;
const tokens = require('../../../lib/dsl/poc/lexer').tokens;
const parse = require('../../../lib/dsl/poc/api').parse;
const getSyntacticAutoCompleteSuggestions = require('../../../lib/dsl/poc/api').getSyntacticAutoCompleteSuggestions;

describe('ChevrotainParser', () => {
  describe('when parsing', () => {
    describe('when there is no error', () => {
      describe('with a default start rule', () => {
        const input = `
          entity JobHistory {
            startDate ZonedDateTime,
            endDate ZonedDateTime,
            language Language
          }`;
        const result = parse(input);
        const cst = result.cst;

        it('does not produce any error', () => {
          expect(result.parseErrors).to.be.empty;
        });
        it('parses a valid JDL text', () => {
          expect(cst.name).to.equal('prog');
          expect(cst.children.entityDeclaration).to.have.lengthOf(1);
          expect(cst.children.entityDeclaration[0].children.NAME[0].image).to.equal('JobHistory');
          expect(
            cst.children.entityDeclaration[0].children.entityBody[0].children.fieldDeclaration
              .map(fieldDeclaration => ({
                name: fieldDeclaration.children.NAME[0].image,
                type: fieldDeclaration.children.fieldType[0].children.NAME[0].image
              }))
          ).to.deep.equal([
            { name: 'startDate', type: 'ZonedDateTime' },
            { name: 'endDate', type: 'ZonedDateTime' },
            { name: 'language', type: 'Language' }
          ]);
        });
      });
      describe('with a custom start rule', () => {
        const input = `{
          startDate ZonedDateTime,
          endDate ZonedDateTime,
          language Language
        }`;
        const result = parse(input, 'entityBody');
        const cst = result.cst;

        it('does not produce any error', () => {
          expect(result.parseErrors).to.be.empty;
        });
        it('parses a valid JDL text using a custom startRule', () => {
          expect(cst.name).to.equal('entityBody');
          expect(cst.children.fieldDeclaration[0].children.NAME[0].image).to.equal('startDate');
          expect(cst.children.fieldDeclaration[1].children.NAME[0].image).to.equal('endDate');
          expect(cst.children.fieldDeclaration[2].children.NAME[0].image).to.equal('language');
        });
      });
      describe('when parsing applications', () => {
        const input = `
        application {
          config {
            baseName toto
            packageName com.jhipster.myapp
            authenticationType jwt
            hibernateCache ehcache
          }
        }
        `;
        const result = parse(input, 'applicationDeclaration');
        const cst = result.cst;

        it('parses them', () => {
          expect(cst.name).to.equal('applicationDeclaration');
          const applicationConfig = cst.children.applicationBody[0].children.applicationConfig[0].children;
          expect(applicationConfig.applicationBaseName[0].children.NAME[0].image).to.equal('toto');
          expect(applicationConfig.applicationPackageName[0].children.NAME[0].image).to.equal('com.jhipster.myapp');
          expect(applicationConfig.applicationAuthenticationType[0].children.NAME[0].image).to.equal('jwt');
          expect(applicationConfig.applicationHibernateCache[0].children.NAME[0].image).to.equal('ehcache');
        });
        it('does not generate any error', () => {
          expect(result.parseErrors).to.be.empty;
        });
      });
    });
    describe('with an invalid JDL', () => {
      describe('with a single syntax error', () => {
        const input = `
          myConst1 = 1
          myConst2 = 3, /* comma should not be here */
          myConst3 = 9
        `;
        const result = parse(input);
        const cst = result.cst;

        it('reports it', () => {
          expect(result.parseErrors).to.have.lengthOf(1);
          expect(result.parseErrors[0].message).to.equal('Expecting token of type --> EOF <-- but found --> \',\' <--');
        });
        it('still outputs a valid CST', () => {
          expect(cst.name).to.equal('prog');
          expect(cst.children.constantDeclaration[0].children.NAME[0].image).to.equal('myConst1');
          expect(cst.children.constantDeclaration[1].children.NAME[0].image).to.equal('myConst2');
          expect(cst.children.constantDeclaration[2].children.NAME[0].image).to.equal('myConst3');

          expect(cst.children.constantDeclaration[0].children.INTEGER[0].image).to.equal('1');
          expect(cst.children.constantDeclaration[1].children.INTEGER[0].image).to.equal('3');
          expect(cst.children.constantDeclaration[2].children.INTEGER[0].image).to.equal('9');
        });
      });
      describe('with multiple syntax errors', () => {
        const input = `
          myConst1 = 1
          myConst2 = 3, /* <-- comma should not be here */
          myConst3  9
        `;
        const result = parse(input);
        const cst = result.cst;

        it('reports them', () => {
          expect(result.parseErrors).to.have.lengthOf(2);
          expect(result.parseErrors[0].message).to.equal('Expecting token of type --> EOF <-- but found --> \',\' <--');
          expect(result.parseErrors[1].message).to.equal('Expecting token of type --> EQUALS <-- but found --> \'9\' <--');
        });
        it('still outputs a valid CST', () => {
          expect(cst.name).to.equal('prog');
          expect(cst.children.constantDeclaration[0].children.NAME[0].image).to.equal('myConst1');
          expect(cst.children.constantDeclaration[1].children.NAME[0].image).to.equal('myConst2');
          expect(cst.children.constantDeclaration[2].children.NAME[0].image).to.equal('myConst3');

          expect(cst.children.constantDeclaration[0].children.INTEGER[0].image).to.equal('1');
          expect(cst.children.constantDeclaration[1].children.INTEGER[0].image).to.equal('3');
          expect(cst.children.constantDeclaration[2].children.INTEGER[0].image).to.equal('9');

          // this "=" token was inserted during error recovery, thus it will have no position information
          // and will be marked using the "isInsertedInRecovery" flag.
          expect(cst.children.constantDeclaration[2].children.EQUALS[0].isInsertedInRecovery).to.be.true;
        });
        it('partially recovers from them', () => {
          it('reports them', () => {});
          it('still outputs a valid CST', () => {});
        });
      });
    });
    describe('when wanting an auto-completion', () => {
      describe('with an empty text', () => {
        const input = '';
        const result = getSyntacticAutoCompleteSuggestions(input);
        it('provides suggestions', () => {
          expect(result).to.have.members(
            [
              tokens.APPLICATION,
              tokens.NAME,
              tokens.ENTITY,
              tokens.RELATIONSHIP,
              tokens.ENUM,
              tokens.DTO,
              tokens.SERVICE,
              tokens.SEARCH,
              tokens.MICROSERVICE,
              tokens.COMMENT,
              tokens.PAGINATE,
              tokens.SKIP_CLIENT,
              tokens.SKIP_SERVER,
              tokens.NO_FLUENT_METHOD,
              tokens.ANGULAR_SUFFIX,
              tokens.FILTER,
            ]
          );
        });
      });
      describe('with a custom start rule', () => {
        const input = 'lastName string ';
        const result = getSyntacticAutoCompleteSuggestions(input, 'fieldDeclaration');
        it('provides suggestions', () => {
          // Note that because we are using token Inheritance with the MIN_MAX_KEYWORD an auto-complete provider would have
          // to translate this to concrete tokens (MIN/MAX/MAX_BYTES/MIN_BYTES/...)
          expect(result).to.have.members([tokens.REQUIRED, tokens.MIN_MAX_KEYWORD, tokens.PATTERN]);
        });
      });
      describe('with a default start rule', () => {
        const input = `
        entity person {
          lastName string `;
        const result = getSyntacticAutoCompleteSuggestions(input);
        it('provides suggestions', () => {
          expect(result).to.have.members([
            tokens.REQUIRED,
            tokens.MIN_MAX_KEYWORD,
            tokens.PATTERN,
            // Note that this will have more suggestions than the previous spec as there is a deeper rule stack.
            tokens.COMMA,
            tokens.RCURLY]);
        });
      });
    });
  });
});
