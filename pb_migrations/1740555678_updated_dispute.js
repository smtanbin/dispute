/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // add field
  collection.fields.addAt(19, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "email1964512551",
    "name": "issue_email",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "email"
  }))

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "bool3953571332",
    "name": "persial",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // remove field
  collection.fields.removeById("email1964512551")

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "bool3953571332",
    "name": "partial",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
