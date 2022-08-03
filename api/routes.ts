const express = require("express");
const Item = require("./models/Item");
const router = express.Router();
const path = require("path");

//item routes
//get all items
router.get("/item", async (req: any, res: any) => {
  try {
    const items = await Item.find();
    res.send(items);
  } catch {
    res.status(404).send({ error: "Nothing found" });
  }
});

//create new item
router.post("/item", async (req: any, res: any) => {
  const item = new Item({
    name: req.body.name,
    active: req.body.active,
  });
  try {
    await Item.create(req.body);
    res.status(200).send(item);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//get item by id
router.get("/item/:id", async (req: any, res: any) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    res.status(200).send(item);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//edit item
router.put("/item/:id", async (req: any, res: any) => {
  // console.log("req.body.active: ", req.body.active);
  // console.log("req.body.name: ", req.body.name);
  try {
    const item = await Item.findOne({ _id: req.params.id });
    //TODO: change this to findOneAndUpdate(filter, update);

    if (req.body.name) {
      item.name = req.body.name;
    }

    if (req.body.active) {
      item.active = req.body.active;
    }

    const savedItem = await Item.save();

    //console.log("saved item: ", item);
    await res.status(200).send("Saved item:", savedItem);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//delete item
router.delete("/item/:id", async (req: any, res: any) => {
  try {
    await Item.findOneAndRemove({ _id: req.params.id });
    //console.log("res ", res);
    res.status(200).send("item removed");
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

module.exports = router;
