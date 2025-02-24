/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "issued",
      "raised",
      "failed",
      "resolved",
      "pending"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update field
  collection.fields.addAt(18, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "issued",
      "raised",
      "failed",
      "success",
      "pending"
    ]
  }))

  return app.save(collection)
})
