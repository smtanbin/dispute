/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "duid[0-9]{7}",
    "hidden": false,
    "id": "text3208210256",
    "max": 13,
    "min": 11,
    "name": "id",
    "pattern": "^duid[0-9]+$",
    "presentable": true,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "duid[0-9]{7}",
    "hidden": false,
    "id": "text3208210256",
    "max": 15,
    "min": 1,
    "name": "id",
    "pattern": "^duid[0-9]+$",
    "presentable": true,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

  return app.save(collection)
})
