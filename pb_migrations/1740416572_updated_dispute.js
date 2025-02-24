/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3733459102",
    "max": 25,
    "min": 0,
    "name": "issue_by",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("text3733459102")

  return app.save(collection)
})
