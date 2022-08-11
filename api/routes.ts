import express from "express";
import { Item } from "./models/itemModel";

const router = express.Router();

//API routes
//get all items
router.get("/item", async (req: express.Request, res: express.Response) => {
  try {
    const getItems = await Item.find();
    res.status(200).send(getItems);
  } catch {
    res.status(404).send({ error: "Items not found" });
  }
});

//create new item
router.post("/item", async (req: express.Request, res: express.Response) => {
  const createItem = new Item({
    name: req.body.name,
    active: req.body.active,
  });
  try {
    await Item.create(req.body);
    res.status(200).send(createItem);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//get item by id
router.get("/item/:id", async (req: express.Request, res: express.Response) => {
  try {
    const getItem = await Item.findOne({ _id: req.params.id });
    res.status(200).send(getItem);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//edit item
router.put("/item/:id", async (req: express.Request, res: express.Response) => {
  console.log("req body ", req.body);
  try {
    const editItem = await Item.findOne({ _id: req.params.id });
    if (req.body.name) {
      editItem!.name = req.body.name;
    }
    if (req.body.active) {
      editItem!.active = req.body.active;
    }
    const savedItem = await editItem!.save();
    console.log("saved item in DB ", savedItem);
    res.status(200).send(savedItem);
  } catch {
    res.status(404).send({ error: "Item doesn't exist!" });
  }
});

//delete item
router.delete(
  "/item/:id",
  async (req: express.Request, res: express.Response) => {
    try {
      await Item.findOneAndRemove({ _id: req.params.id });
      res.status(200).send("item removed");
    } catch {
      res.status(404).send({ error: "Item doesn't exist!" });
    }
  }
);

module.exports = router;
