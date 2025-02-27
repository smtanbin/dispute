/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("text3959154033")

  // remove field
  collection.fields.removeById("text4050814458")

  // remove field
  collection.fields.removeById("text1338857509")

  // remove field
  collection.fields.removeById("date877005545")

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1371867123",
    "max": 0,
    "min": 0,
    "name": "doc_no",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_851219816",
    "hidden": false,
    "id": "relation1149256272",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tran",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "bool3953571332",
    "name": "persial",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3959154033",
    "max": 18,
    "min": 15,
    "name": "PAN",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4050814458",
    "max": 0,
    "min": 0,
    "name": "doc_no",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1338857509",
    "max": 0,
    "min": 0,
    "name": "tr_amount",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "date877005545",
    "max": "",
    "min": "",
    "name": "transaction_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("text1371867123")

  // remove field
  collection.fields.removeById("relation1149256272")

  // update field
  collection.fields.addAt(17, new Field({
    "hidden": false,
    "id": "bool3953571332",
    "name": "psl",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
