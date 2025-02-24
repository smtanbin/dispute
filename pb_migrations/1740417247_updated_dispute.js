/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("text951877124")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text951877124",
    "max": 0,
    "min": 0,
    "name": "account_no",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
