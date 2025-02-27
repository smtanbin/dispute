/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(17, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3247346513",
    "hidden": false,
    "id": "relation2168032777",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "customer",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(18, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_851219816",
    "hidden": false,
    "id": "relation1149256272",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tran",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(17, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3247346513",
    "hidden": false,
    "id": "relation2168032777",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "customer",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // update field
  collection.fields.addAt(18, new Field({
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

  return app.save(collection)
})
