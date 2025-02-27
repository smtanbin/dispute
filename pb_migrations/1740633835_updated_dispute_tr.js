/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_851219816")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_9wnzQTdHB4` ON `dispute_tr` (\n  `account`,\n  `product`,\n  `acu_branch`,\n  `timestamp`,\n  `serial`,\n  `credit`,\n  `debit`,\n  `status`,\n  `charges`,\n  `amount`,\n  `docnum`,\n  `branch`,\n  `debit_credit`,\n  `cr_code`,\n  `dr_code`,\n  `doctype`,\n  `pan`,\n  `remark`,\n  `terminal_id`,\n  `terminal_name`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_851219816")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
