/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_866841005")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[0-9]{9}",
    "hidden": false,
    "id": "text3208210256",
    "max": 9,
    "min": 3,
    "name": "id",
    "pattern": "^[a-z0-9]+$",
    "presentable": true,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_866841005")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3208210256",
    "max": 9,
    "min": 3,
    "name": "id",
    "pattern": "^[a-z0-9]+$",
    "presentable": true,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

  return app.save(collection)
})
