/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
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

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "file17379278",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "supporting_doc",
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

  // remove field
  collection.fields.removeById("file1524498737")

  // remove field
  collection.fields.removeById("file17379278")

  return app.save(collection)
})
