"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const cors = require("cors");
const Item = require("./models/Item");
const User = require("./models/User");
const router = express.Router();
router.use(cors({
    origin: "http://127.0.0.1:5500",
}));
//user routes
//get all users
router.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find();
    res.status(200);
    res.send(users);
}));
//get user by id
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ _id: req.params.id });
        res.send(user);
    }
    catch (_a) {
        res.status(404);
        res.send({ error: "User doesn't exist!" });
    }
}));
//create new user
router.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User({
        name: req.body.name,
    });
    yield User.create(req.body);
    res.status(200);
    res.send(user);
}));
//edit user
router.patch("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findOne({ _id: req.params.id });
        if (req.body.name) {
            user.name = req.body.name;
        }
        yield user.save();
        console.log("saved user: ", user);
        res.status(200);
        res.send(user);
    }
    catch (_b) {
        res.status(404);
        res.send({ error: "User doesn't exist!" });
    }
}));
//delete user
router.delete("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield User.deleteOne({ _id: req.params.id });
        res.status(204).send("User deleted");
    }
    catch (_c) {
        res.status(404);
        res.send({ error: "User doesn't exist!" });
    }
}));
//item routes
//get all items
router.get("/item", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const items = yield Item.find();
    res.send(items);
}));
//create new item
router.post("/item", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = new Item({
        name: req.body.name,
        amount: req.body.amount,
        author: req.body.author,
        active: req.body.active,
    });
    yield Item.create(req.body);
    res.send(item);
}));
//get item by id
router.get("/item/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield Item.findOne({ _id: req.params.id });
        res.send(item);
    }
    catch (_d) {
        res.status(404);
        res.send({ error: "Item doesn't exist!" });
    }
}));
//edit item
router.patch("/item/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield Item.findOne({ _id: req.params.id });
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
        yield item.save();
        console.log("saved item: ", item);
        res.send(item);
    }
    catch (_e) {
        res.status(404);
        res.send({ error: "Items doesn't exist!" });
    }
}));
//delete item
router.delete("/item/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Item.deleteOne({ _id: req.params.id });
        res.status(204).send("Item deleted");
    }
    catch (_f) {
        res.status(404);
        res.send({ error: "Item doesn't exist!" });
    }
}));
module.exports = router;
