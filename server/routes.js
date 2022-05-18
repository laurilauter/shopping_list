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
const router = express.Router();
//use cors
router.use(cors());
//item routes
//get all items
router.get("/item", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield Item.find();
        res.send(items);
    }
    catch (_a) {
        res.status(404).send({ error: "Nothing found" });
    }
}));
//create new item
router.post("/item", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const item = new Item({
        name: req.body.name,
        amount: req.body.amount,
        active: req.body.active,
    });
    try {
        yield Item.create(req.body);
        res.send(item);
    }
    catch (_b) {
        res.status(404).send({ error: "Item doesn't exist!" });
    }
}));
//get item by id
router.get("/item/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield Item.findOne({ _id: req.params.id });
        res.send(item);
    }
    catch (_c) {
        res.status(404).send({ error: "Item doesn't exist!" });
    }
}));
//edit item
router.put("/item/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body.active: ", req.body.active);
    console.log("req.body.name: ", req.body.name);
    try {
        const item = yield Item.findOne({ _id: req.params.id });
        if (req.body.name) {
            item.name = req.body.name;
        }
        if (req.body.amount) {
            item.amount = req.body.amount;
        }
        if (req.body.active) {
            item.active = req.body.active;
        }
        yield item.save();
        console.log("saved item: ", item);
        yield res.send(item);
    }
    catch (_d) {
        res.status(404).send({ error: "Item doesn't exist!" });
    }
}));
//delete item
router.delete("/item/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Item.deleteOne({ _id: req.params.id });
        res.status(204).send("Item deleted");
    }
    catch (_e) {
        res.status(404).send({ error: "Item doesn't exist!" });
    }
}));
module.exports = router;
