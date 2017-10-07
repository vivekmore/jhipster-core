/* eslint-disable key-spacing, no-unused-expressions */
const expect = require('chai').expect;
const parse = require('../../../lib/dsl/poc/api').parse;
const buildAst = require('../../../lib/dsl/poc/ast_builder').buildAst;

describe('ASTBuilder', () => {
  describe('when parsing a simple entity JDL', () => {
    const input = 'entity Person { name string }';
    const parseResult = parse(input);
    const ast = buildAst(parseResult.cst);

    it('converts it to an object', () => {
      expect(ast).to.deep.equal({
        applications: [],
        constants: [],
        entities: [
          {
            fields: [
              {
                name: 'name',
                type: 'string',
                validations: []
              }
            ],
            name: 'Person',
            tableName: undefined
          }
        ]
      });
    });

    it('does not generate any error', () => {
      expect(parseResult.lexErrors).to.be.empty;
      expect(parseResult.parseErrors).to.be.empty;
    });
  });
  describe('when parsing entities and a constant', () => {
    const input = `
    max_age = 120
    
    entity Person (HRXD1) { 
      name string, 
      age number max(max_age)
    }
    
    entity Job { 
      address string required
    }  
      `;
    const parseResult = parse(input);
    const ast = buildAst(parseResult.cst);

    it('converts it to an object', () => {
      expect(ast).to.deep.equal({
        applications: [],
        entities: [
          {
            name: 'Person',
            tableName: 'HRXD1',
            fields: [
              {
                name: 'name',
                type: 'string',
                validations: []
              },
              {
                name: 'age',
                type:  'number',
                validations: [{ limit: 'max_age', validationType: 'max' }]
              }
            ]
          },
          {
            name: 'Job',
            tableName: undefined,
            fields: [
              {
                name: 'address',
                type: 'string',
                validations: [{ validationType: 'required' }]
              }
            ]
          }
        ],
        constants: [
          {
            name: 'max_age',
            value: 120
          }
        ]
      });
    });
    it('does not generate any error', () => {
      expect(parseResult.lexErrors).to.be.empty;
      expect(parseResult.parseErrors).to.be.empty;
    });
  });
  describe('when parsing applications', () => {
    const input = 'application { config { baseName toto } }';
    const parseResult = parse(input);
    const ast = buildAst(parseResult.cst);
    it('converts it to an object', () => {
      expect(ast).to.deep.equal({
        applications: [{ config: { baseName: 'toto' } }],
        entities: [],
        constants: []
      });
    });
    it('does not generate any error', () => {
      expect(parseResult.lexErrors).to.be.empty;
      expect(parseResult.parseErrors).to.be.empty;
    });
  });
});
