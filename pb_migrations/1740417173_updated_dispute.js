/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("text594574118")

  // remove field
  collection.fields.removeById("email2332435811")

  // remove field
  collection.fields.removeById("text606827871")

  // add field
  collection.fields.addAt(22, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3247346513",
    "hidden": false,
    "id": "relation2168032777",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "customer",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text594574118",
    "max": 0,
    "min": 0,
    "name": "title",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(23, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email2332435811",
    "name": "update_email",
    "onlyDomains": [
      "standardbankbd.com"
    ],
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  // add field
  collection.fields.addAt(24, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text606827871",
    "max": 0,
    "min": 0,
    "name": "update_phone",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("relation2168032777")

  return app.save(collection)
})
