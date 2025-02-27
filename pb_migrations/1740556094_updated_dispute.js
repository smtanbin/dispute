/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_866841005",
    "hidden": false,
    "id": "relation2734263879",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "channel",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(11, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_866841005",
    "hidden": false,
    "id": "relation2734263879",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "channel",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
