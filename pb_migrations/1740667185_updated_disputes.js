/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(24, new Field({
    "hidden": false,
    "id": "date1890220889",
    "max": "",
    "min": "",
    "name": "accept_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(24, new Field({
    "hidden": true,
    "id": "date1890220889",
    "max": "",
    "min": "",
    "name": "accept_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
})
