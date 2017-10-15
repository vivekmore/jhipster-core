import { expect } from 'chai';
import { JDLValidation } from '../../../lib/core/jdl_validation';
import { JDLUnaryOption } from '../../../lib/core/jdl_unary_option';
import { JDLBinaryOption } from '../../../lib/core/jdl_binary_option';
import { JDLRelationship } from '../../../lib/core/jdl_relationship';
import { JDLObject } from '../../../lib/core/jdl_object';
import { JDLField } from '../../../lib/core/jdl_field';
import { JDLEnum } from '../../../lib/core/jdl_enum';
import { JDLEntity } from '../../../lib/core/jdl_entity';
import { BinaryOptions } from '../../../lib/core/jhipster/binary_options';
import { UnaryOptions } from '../../../lib/core/jhipster/unary_options';
import { RelationshipTypes } from '../../../lib/core/jhipster/relationship_types';

/* eslint-disable no-new, no-unused-expressions */
const fail = expect.fail;

describe('JDLObject', () => {
  describe('#addEntity', () => {
    describe('when adding an invalid entity', () => {
      it('fails', () => {
        const object = new JDLObject();
        try {
          object.addEntity(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The entity must be valid in order to be added.\nErrors: No entity');
        }
        try {
          object.addEntity({
            name: 'Something',
            tableName: 't_something',
            fields: [{
              type: 'String',
              comment: 'comment',
              validations: []
            }]
          });
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(
            error.message
          ).to.eq('The entity must be valid in order to be added.\nErrors: For field #1: No field name');
        }
      });
    });
    describe('when adding a valid entity', () => {
      it('works', () => {
        const object = new JDLObject();
        const entity = new JDLEntity({
          name: 'Valid',
          tableName: 't_valid',
          fields: []
        });
        object.addEntity(entity);
        expect(object.entities[entity.name]).to.deep.eq(entity);
      });
    });
    describe('when adding an entity with the same name', () => {
      it('replaces the former one', () => {
        const object = new JDLObject();
        const entity = new JDLEntity({
          name: 'Valid',
          tableName: 't_valid',
          fields: []
        });
        object.addEntity(entity);
        const entity2 = new JDLEntity({
          name: 'Valid',
          tableName: 't_valid2',
          fields: []
        });
        object.addEntity(entity2);
        expect(object.entities[entity.name]).to.deep.eq(entity2);
      });
    });
  });
  describe('#addEnum', () => {
    describe('when adding an invalid enum', () => {
      it('fails', () => {
        const object = new JDLObject();
        try {
          object.addEnum(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The enum must be valid in order to be added.\nErrors: No enumeration');
        }
        try {
          object.addEnum({ values: ['A', 'B'] });
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The enum must be valid in order to be added.\nErrors: No enumeration name');
        }
      });
    });
    describe('when adding a valid enum', () => {
      it('works', () => {
        const object = new JDLObject();
        const enumObject = new JDLEnum({ name: 'Valid' });
        object.addEnum(enumObject);
        expect(object.enums[enumObject.name]).to.deep.eq(enumObject);
      });
    });
    describe('when adding an enum with the same name', () => {
      it('replaces the old one', () => {
        const object = new JDLObject();
        const enumObject = new JDLEnum({ name: 'Valid' });
        object.addEnum(enumObject);
        const enumObject2 = new JDLEnum({ name: 'Valid', values: ['A', 'B'] });
        object.addEnum(enumObject2);
        expect(object.enums[enumObject.name]).to.deep.eq(enumObject2);
      });
    });
  });
  describe('#addRelationship', () => {
    describe('when adding an invalid relationship', () => {
      it('fails', () => {
        const object = new JDLObject();
        try {
          object.addRelationship(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The relationship must be valid in order to be added.\nErrors: No relationship');
        }
        try {
          object.addRelationship({
            from: {},
            to: { name: 'Valid', tableName: 't_valid', fields: [] },
            type: RelationshipTypes.RELATIONSHIP_TYPES.MANY_TO_MANY,
            injectedFieldInFrom: 'something'
          });
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(
            error.message
          ).to.eq('The relationship must be valid in order to be added.\nErrors: Wrong source entity: No entity name, No table name, No fields object');
        }
      });
    });
    describe('when adding a valid relationship', () => {
      it('works', () => {
        const object = new JDLObject();
        const relationship = new JDLRelationship({
          from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
          to: { name: 'Valid', tableName: 't_valid', fields: [] },
          type: RelationshipTypes.RELATIONSHIP_TYPES.MANY_TO_MANY,
          injectedFieldInFrom: 'something'
        });
        object.addRelationship(relationship);
        expect(object.relationships.relationships.ManyToMany[relationship.getId()]).to.deep.eq(relationship);
      });
    });
    describe('when adding twice the same relationship', () => {
      it('doesn\'t do anything', () => {
        const object = new JDLObject();
        const relationship = new JDLRelationship({
          from: { name: 'Valid2', tableName: 't_valid2', fields: [] },
          to: { name: 'Valid', tableName: 't_valid', fields: [] },
          type: RelationshipTypes.RELATIONSHIP_TYPES.MANY_TO_MANY,
          injectedFieldInFrom: 'something'
        });
        object.addRelationship(relationship);
        object.addRelationship(relationship);
        expect(Object.keys(object.relationships.relationships.ManyToMany).length).to.eq(1);
      });
    });
  });
  describe('#addOption', () => {
    describe('when adding an invalid option', () => {
      it('fails', () => {
        const object = new JDLObject();
        try {
          object.addOption(null);
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(error.message).to.eq('The option must be valid in order to be added.\nErrors: No option');
        }
        try {
          object.addOption({});
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(
            error.message
          ).to.eq('The option must be valid in order to be added.\nErrors: No option name, No entity names, No excluded names, No type');
        }
        try {
          object.addOption({
            name: UnaryOptions.UNARY_OPTIONS.SKIP_CLIENT,
            type: 'WrongType'
          });
          fail();
        } catch (error) {
          expect(error.name).to.eq('InvalidObjectException');
          expect(
            error.message
          ).to.eq('The option must be valid in order to be added.\nErrors: No entity names, No excluded names, No type');
        }
      });
    });
    describe('when adding a valid option', () => {
      it('works', () => {
        const object = new JDLObject();
        const emptyOption = new JDLUnaryOption({ name: UnaryOptions.UNARY_OPTIONS.SKIP_CLIENT });
        object.addOption(emptyOption);
      });
    });
  });
  describe('#toString', () => {
    it('stringifies the JDL object', () => {
      const object = new JDLObject();
      const entityA = new JDLEntity({ name: 'EntityA', tableName: 't_entity_a' });
      const field = new JDLField({ name: 'myField', type: 'String' });
      field.addValidation(new JDLValidation());
      entityA.addField(field);
      object.addEntity(entityA);
      const entityB = new JDLEntity({ name: 'EntityB', tableName: 't_entity_b' });
      object.addEntity(entityB);
      const enumObject = new JDLEnum({ name: 'MyEnum', values: ['A', 'B'] });
      object.addEnum(enumObject);
      const relationship = new JDLRelationship({
        from: entityA,
        to: entityB,
        type: RelationshipTypes.RELATIONSHIP_TYPES.ONE_TO_ONE,
        injectedFieldInFrom: 'entityB',
        injectedFieldInTo: 'entityA(myField)'
      });
      object.addRelationship(relationship);
      const option = new JDLUnaryOption({ name: UnaryOptions.UNARY_OPTIONS.SKIP_CLIENT });
      option.excludeEntity(entityA);
      object.addOption(option);
      const option2 = new JDLBinaryOption({
        name: BinaryOptions.BINARY_OPTIONS.DTO,
        value: BinaryOptions.BINARY_OPTION_VALUES.dto.MAPSTRUCT
      });
      option2.addEntity(entityB);
      object.addOption(option2);
      expect(object.toString()).to.eq(
        `${entityA.toString()}
${entityB.toString()}
${enumObject.toString()}

${relationship.toString()}

${option.toString()}
${option2.toString()}
`);
    });
  });
});
