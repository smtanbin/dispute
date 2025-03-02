/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // update field
  collection.fields.addAt(7, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor3485334036",
    "maxSize": 0,
    "name": "message",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // update field
  collection.fields.addAt(7, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor3485334036",
    "maxSize": 0,
    "name": "note",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
})
