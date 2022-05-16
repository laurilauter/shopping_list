const express = require("express");
const cors = require("cors");
const Item = require("./models/Item");
const router = express.Router();

//use cors
router.use(cors());

//item routes
//get all items
router.get("/item", async (req: any, res: any) => {
  const items = await Item.find();
  res.send(items);
});

//create new item
router.post("/item", async (req: any, res: any) => {
  const item = new Item({
    name: req.body.name,
    amount: req.body.amount,
    active: req.body.active,
  });
  await Item.create(req.body);
  res.send(item);
});

//get item by id
router.get("/item/:id", async (req: any, res: any) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    res.send(item);
  } catch {
    res.status(404);
    res.send({ error: "Item doesn't exist!" });
  }
});

//edit item
router.put("/item/:id", async (req: any, res: any) => {
  console.log("req.body.active: ", req.body.active);
  console.log("req.body.name: ", req.body.name);
  try {
    const item = await Item.findOne({ _id: req.params.id });

    if (req.body.name) {
      item.name = req.body.name;
    }

    if (req.body.amount) {
      item.amount = req.body.amount;
    }

    if (req.body.active) {
      item.active = req.body.active;
    }

    await item.save();

    console.log("saved item: ", item);
    await res.send(item);
  } catch {
    res.status(404);
    res.send({ error: "Item doesn't exist!" });
  }
});

//delete item
router.delete("/item/:id", async (req: any, res: any) => {
  try {
    await Item.deleteOne({ _id: req.params.id });
    res.status(204).send("Item deleted");
  } catch {
    res.status(404);
    res.send({ error: "Item doesn't exist!" });
  }
});

module.exports = router;
