/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(21, new Field({
    "hidden": false,
    "id": "file1524498737",
    "maxSelect": 5,
    "maxSize": 10024,
    "mimeTypes": [
      "text/plain"
    ],
    "name": "EJ",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(21, new Field({
    "hidden": false,
    "id": "file1524498737",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "EJ",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
