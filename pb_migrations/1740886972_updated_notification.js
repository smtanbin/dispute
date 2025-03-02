/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // remove field
  collection.fields.removeById("text2599078931")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select2599078931",
    "maxSelect": 1,
    "name": "level",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "'INFO'",
      "'URGENT'",
      "'UPDATE'"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3905696460")

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2599078931",
    "max": 0,
    "min": 0,
    "name": "level",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("select2599078931")

  return app.save(collection)
})
