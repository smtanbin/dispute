/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update collection data
  unmarshal({
    "name": "dispute"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1652299377")

  // update collection data
  unmarshal({
    "name": "Dispute"
  }, collection)

  return app.save(collection)
})
