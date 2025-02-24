/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1885662682")

  // update collection data
  unmarshal({
    "name": "roles"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1885662682")

  // update collection data
  unmarshal({
    "name": "role"
  }, collection)

  return app.save(collection)
})
