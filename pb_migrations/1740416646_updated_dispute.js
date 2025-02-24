/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
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
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("email2332435811")

  return app.save(collection)
})
