/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247346513")

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1652299377",
    "hidden": false,
    "id": "relation1542800728",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "dispute",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247346513")

  // update field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1652299377",
    "hidden": false,
    "id": "relation1542800728",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "field",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
