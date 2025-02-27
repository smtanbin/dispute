/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_866841005")

  // update collection data
  unmarshal({
    "createRule": "",
    "indexes": [
      "CREATE INDEX `idx_M6JH6eqZ7l` ON `channel` (`name`)"
    ],
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_866841005")

  // update collection data
  unmarshal({
    "createRule": null,
    "indexes": [],
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
