const express = require("express");
const Item = require("./models/Item");
const router = express.Router();
const path = require("path");
//const cors = require("cors");

// Serve static files from the frontend app
//router.use(express.static(path.join(__dirname, "./dist/public")));

// router.use(
//   cors({
//     origin: "http://127.0.0.1:5000/",
//   })
// );

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
    amount: req.body.amount,
    active: req.body.active,
  });
  try {
    await Item.create(req.body);
    res.send(item);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//get item by id
router.get("/item/:id", async (req: any, res: any) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });
    res.send(item);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
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
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//delete item
router.delete("/item/:id", async (req: any, res: any) => {
  try {
    await Item.deleteOne({ _id: req.params.id });
    res.status(204).send("Item deleted");
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

module.exports = router;
