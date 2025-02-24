/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247346513")

  // remove field
  collection.fields.removeById("text2103224315")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247346513")

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2103224315",
    "max": 0,
    "min": 0,
    "name": "pan",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
