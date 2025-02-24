/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

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

  // update field
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("text606827871")

  // update field
  collection.fields.addAt(23, new Field({
    "exceptDomains": [],
    "hidden": false,
    "id": "email2332435811",
    "name": "issueer_email",
    "onlyDomains": [
      "standardbankbd.com"
    ],
    "presentable": false,
    "required": true,
    "system": false,
    "type": "email"
  }))

  return app.save(collection)
})
