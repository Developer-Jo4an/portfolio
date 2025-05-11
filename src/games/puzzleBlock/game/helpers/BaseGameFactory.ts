import {upperFirst} from "../../../../utils/text/format.ts";

export default class BaseGameFactory {

  library = {};

  reusedLibrary = {};

  constructor(data) {
    for (const key in data)
      this[key] = data[key];

    this.baseItemData = {...data};
  }

  //create
  createItem(type, data = {}) {
    const modifiedData = {...this.baseItemData, ...data};

    const createCallback = this[`create${upperFirst(type)}`];

    if (typeof createCallback !== "function")
      throw new Error("Type not found");

    const {props, Constructor} = createCallback(modifiedData, type);

    const {isFindReused, item} = this.returnReusedItem(props, type);

    if (isFindReused)
      return item;

    const newEntity = new Constructor(props, type);

    this.setItemByType(type, newEntity);

    return newEntity;
  }

  returnReusedItem(data, type) {
    const reusedCollection = this.getReusedCollectionByType(type) ?? [];

    const reusedItem = reusedCollection.pop();

    if (!reusedItem)
      return {isFindReused: false};

    reusedItem.isDestroyed = false;

    reusedItem.reset(data);

    this.setItemByType(type, reusedItem);

    return {isFindReused: true, item: reusedItem};
  }


  //getters
  getItemById(type, id) {
    if (!this.library[type])
      throw new Error("This entity type not found");

    const entity = this.library[type].find(({id: itemId}) => itemId === id);

    if (!entity)
      throw new Error("This entity not found");

    return entity;
  }

  getReusedCollectionByType(type) {
    return this.reusedLibrary[type];
  }

  getCollectionByType(type) {
    return this.library[type];
  }

  getLibrary() {
    return this.library;
  }


  //setters
  setItemByType(type, entity) {
    if (!this.library[type])
      this.library[type] = [];

    if (this.library[type].includes(entity))
      throw new Error("This entity already exist");

    this.library[type].push(entity);
  }

  setCollectionByType(type, collection) {
    this.library[type] = collection;
  }


  //clear
  clearItemByEntity(type, entity) {
    this.library[type] = this.library[type].filter(item => item !== entity);

    const reusedItems = this.reusedLibrary[type] ?? (this.reusedLibrary[type] = []);

    if (reusedItems.includes(entity))
      throw new Error("This entity already exist");

    entity.isDestroyed = true;

    reusedItems.push(entity);
  }

  clear() {
    this.library = {};
    this.reusedLibrary = {};
  }
}

