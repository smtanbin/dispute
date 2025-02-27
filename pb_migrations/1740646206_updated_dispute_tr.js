/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_851219816")

  // remove field
  collection.fields.removeById("text72647097")

  // add field
  collection.fields.addAt(23, new Field({
    "hidden": false,
    "id": "select72647097",
    "maxSelect": 1,
    "name": "debit_credit",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "'D'",
      "'C'"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_851219816")

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text72647097",
    "max": 0,
    "min": 0,
    "name": "debit_credit",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("select72647097")

  return app.save(collection)
})
