import { JhipsterCoreException } from '../exceptions/jhipster_core_exception';
import { JhipsterCoreExceptionType } from '../exceptions/jhipster_core_exception_type';
import { JhipsterObjectUtils } from '../utils/object_utils';
import { JsonFileReader } from '../reader/json_file_reader';
import * as fs from 'fs';

export = {
  exportToJSON,
  createJHipsterJSONFolder,
  filterOutUnchangedEntities
};

function exportToJSON(entities, forceNoFiltering) {
  if (!entities) {
    throw new JhipsterCoreException(
      JhipsterCoreExceptionType.NullPointer,
      'Entities have to be passed to be exported.');
  }
  createJHipsterJSONFolder();
  if (!forceNoFiltering) {
    entities = filterOutUnchangedEntities(entities);
  }
  for (let i = 0, entityNames = Object.keys(entities); i < entityNames.length; i++) {
    const filePath = JsonFileReader.toFilePath(entityNames[i]);
    const entity = updateChangelogDate(filePath, entities[entityNames[i]]);
    fs.writeFileSync(filePath, JSON.stringify(entity, null, 4));
  }
  return entities;
}

function createJHipsterJSONFolder() {
  try {
    if (!fs.statSync('./.jhipster').isDirectory()) {
      fs.mkdirSync('.jhipster');
    }
  } catch (error) {
    fs.mkdirSync('.jhipster');
  }
}

function updateChangelogDate(filePath, entity) {
  if (JsonFileReader.doesfileExist(filePath)) {
    const fileOnDisk = JsonFileReader.readEntityJSON(filePath);
    if (fileOnDisk && fileOnDisk.changelogDate) {
      entity.changelogDate = fileOnDisk.changelogDate;
    }
  }
  return entity;
}

function filterOutUnchangedEntities(entities) {
  const filtered = {};
  for (let i = 0, entityNames = Object.keys(entities); i < entityNames.length; i++) {
    const entityName = entityNames[i];
    const filePath = JsonFileReader.toFilePath(entityName);
    if (!(JsonFileReader.doesfileExist(filePath) && JhipsterObjectUtils.areEntitiesEqual(JsonFileReader.readEntityJSON(filePath), entities[entityName]))) {
      filtered[entityName] = (entities[entityName]);
    }
  }
  return filtered;
}
