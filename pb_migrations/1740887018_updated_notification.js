/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // remove field
  collection.fields.removeById("text4274335913")

  // update field
  collection.fields.addAt(5, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor3485334036",
    "maxSize": 0,
    "name": "message",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "editor"
  }))

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool1260321794",
    "name": "active",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4274335913",
    "max": 0,
    "min": 0,
    "name": "content",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(6, new Field({
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

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool1260321794",
    "name": "active",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
