/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247346513")

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3127723468",
    "max": 9,
    "min": 5,
    "name": "cfid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3247346513")

  // remove field
  collection.fields.removeById("text3127723468")

  return app.save(collection)
})
