/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1708117938")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_tHCDoeLNgX` ON `email_verification` (`email`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1708117938")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
