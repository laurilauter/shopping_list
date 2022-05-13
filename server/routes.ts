const express = require("express");
const cors = require("cors");
const Item = require("./models/Item");
const User = require("./models/User");
const router = express.Router();

router.use(
  cors({
    origin: "http://127.0.0.1:5500",
  })
);

//user routes
//get all users
router.get("/user", async (req: any, res: any) => {
  const users = await User.find();
  res.status(200);
  res.send(users);
});

//get user by id
router.get("/user/:id", async (req: any, res: any) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res.send(user);
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

//create new user
router.post("/user", async (req: any, res: any) => {
  const user = new User({
    name: req.body.name,
  });
  await User.create(req.body);
  res.status(200);
  res.send(user);
});

//edit user
router.patch("/user/:id", async (req: any, res: any) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (req.body.name) {
      user.name = req.body.name;
    }

    await user.save();
    console.log("saved user: ", user);
    res.status(200);
    res.send(user);
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

//delete user
router.delete("/user/:id", async (req: any, res: any) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(204).send("User deleted");
  } catch {
    res.status(404);
    res.send({ error: "User doesn't exist!" });
  }
});

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
    author: req.body.author,
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
router.patch("/item/:id", async (req: any, res: any) => {
  try {
    const item = await Item.findOne({ _id: req.params.id });

    if (req.body.name) {
      item.name = req.body.name;
    }

    if (req.body.amount) {
      item.amount = req.body.amount;
    }

    if (req.body.amount) {
      item.author = req.body.author;
    }

    if (req.body.active) {
      item.active = req.body.active;
    }

    await item.save();
    console.log("saved item: ", item);
    res.send(item);
  } catch {
    res.status(404);
    res.send({ error: "Items doesn't exist!" });
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
