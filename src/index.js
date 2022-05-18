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
document.addEventListener("DOMContentLoaded", () => {
    var _a, _b, _c;
    //switch to add item view
    const addItem = () => {
        var _a, _b, _c, _d, _e, _f;
        //hide
        (_a = document.getElementById("item-div")) === null || _a === void 0 ? void 0 : _a.classList.add("hide");
        (_b = document.getElementById("clear-completed-btn")) === null || _b === void 0 ? void 0 : _b.classList.add("hide");
        (_c = document.getElementById("add-item-btn")) === null || _c === void 0 ? void 0 : _c.classList.add("hide");
        //show
        (_d = document.getElementById("add-item-div")) === null || _d === void 0 ? void 0 : _d.classList.remove("hide");
        (_e = document.getElementById("back-btn")) === null || _e === void 0 ? void 0 : _e.classList.remove("hide");
        (_f = document.getElementById("insert-item-btn")) === null || _f === void 0 ? void 0 : _f.classList.remove("hide");
    };
    //move back
    const moveBack = () => {
        var _a, _b, _c, _d, _e, _f;
        //show
        (_a = document.getElementById("item-div")) === null || _a === void 0 ? void 0 : _a.classList.remove("hide");
        (_b = document.getElementById("clear-completed-btn")) === null || _b === void 0 ? void 0 : _b.classList.remove("hide");
        (_c = document.getElementById("add-item-btn")) === null || _c === void 0 ? void 0 : _c.classList.remove("hide");
        //hide
        (_d = document.getElementById("add-item-div")) === null || _d === void 0 ? void 0 : _d.classList.add("hide");
        (_e = document.getElementById("back-btn")) === null || _e === void 0 ? void 0 : _e.classList.add("hide");
        (_f = document.getElementById("insert-item-btn")) === null || _f === void 0 ? void 0 : _f.classList.add("hide");
    };
    //clearCompleted items from list
    function clearCompleted() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let containers = document.getElementsByClassName("false");
            for (var i = 0; i < containers.length; i++) {
                const deleteId = (_a = containers
                    .item(i)) === null || _a === void 0 ? void 0 : _a.getAttribute("id").split("-")[1];
                deleteItem(deleteId);
                //console.log("just deleted: ", deleteId);
            }
            //clear items list
            clearItems();
            //relaod items
            getItems();
        });
    }
    //insert item into db
    function insertItem() {
        return __awaiter(this, void 0, void 0, function* () {
            //collect info
            const item = document.getElementById("input-item");
            const amount = document.getElementById("input-amount");
            const body = {
                name: item.value,
                amount: amount.value,
                active: true,
            };
            //clear inputs
            item.value = "";
            amount.value = "";
            //fetch create item
            console.log("str body to be sent: ", JSON.stringify({ body }));
            try {
                if (body.name) {
                    let res = yield fetch(`http://localhost:5000/api/item/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body),
                    });
                }
            }
            catch (error) {
                console.log("Error", error);
            }
            //change view
            moveBack();
            //clear items list
            clearItems();
            //relaod items
            getItems();
            //console.log("relaoded items after add");
        });
    }
    //delete one
    function deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield fetch(`http://localhost:5000/api/item/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
            }
            catch (error) {
                console.log("Error", error);
            }
        });
    }
    //mark as done in db
    function toggleItemState(activeUpdate, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield fetch(`http://localhost:5000/api/item/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ active: activeUpdate.toString() }),
                });
            }
            catch (error) {
                console.log("Error", error);
            }
        });
    }
    //fetch items
    function getItems() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield fetch("http://localhost:5000/api/item", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                let data = yield res.json();
                //console.log("data: ", data);
                //console.log("typeof data: ", typeof data);
                data.forEach((element) => {
                    var _a;
                    const itemDiv = document.createElement("div");
                    itemDiv.classList.add("item-container");
                    itemDiv.innerHTML = `
          <span class="${element.active}" id="name-${element._id}">${element.name}</span>
          <span class="amount-span">${element.amount}</span>
          <button class="delete-btn button" id="${element._id}">
          <img src="./img/delete.svg" alt="delete" height="24" width="24" />
          </button>
          `;
                    (_a = document.getElementById("list-item-div")) === null || _a === void 0 ? void 0 : _a.appendChild(itemDiv);
                    //add listener to x btn
                    const deleteBtn = document.getElementById(element._id);
                    deleteBtn === null || deleteBtn === void 0 ? void 0 : deleteBtn.addEventListener("click", () => {
                        //remove node
                        deleteBtn.parentElement.remove();
                        //fetch delete from db
                        deleteItem(element._id);
                    });
                    //add listener to item name for strikethrough
                    const nameBtn = document.getElementById(`name-${element._id}`);
                    nameBtn === null || nameBtn === void 0 ? void 0 : nameBtn.addEventListener("click", () => {
                        //toggle true/false - cant use classlist.toggle because of double entry
                        let activeUpdate;
                        if (nameBtn === null || nameBtn === void 0 ? void 0 : nameBtn.classList.contains("true")) {
                            nameBtn === null || nameBtn === void 0 ? void 0 : nameBtn.classList.replace("true", "false");
                            activeUpdate = false;
                        }
                        else {
                            nameBtn === null || nameBtn === void 0 ? void 0 : nameBtn.classList.replace("false", "true");
                            activeUpdate = true;
                        }
                        //goto database and fetch active: true/false by id
                        toggleItemState(activeUpdate, element._id);
                    });
                });
            }
            catch (error) {
                console.log("Error", error);
            }
        });
    }
    //load inital items list
    (() => __awaiter(void 0, void 0, void 0, function* () {
        clearItems();
        yield getItems();
        //console.log("relaoded items at start");
    }))();
    //clear items list
    function clearItems() {
        const listItemDiv = document.getElementById("list-item-div");
        listItemDiv.innerHTML = "";
    }
    //add listener to add item btn
    const addBtn = document.getElementById("add-item-btn");
    addBtn === null || addBtn === void 0 ? void 0 : addBtn.addEventListener("click", addItem);
    //add listener to clear-completed-btn
    const clearBtn = document.getElementById("clear-completed-btn");
    clearBtn === null || clearBtn === void 0 ? void 0 : clearBtn.addEventListener("click", clearCompleted);
    //add listener to insert item btn
    const insertBtn = document.getElementById("insert-item-btn");
    insertBtn === null || insertBtn === void 0 ? void 0 : insertBtn.addEventListener("click", insertItem);
    //add listener to back btn
    const backBtn = document.getElementById("back-btn");
    backBtn === null || backBtn === void 0 ? void 0 : backBtn.addEventListener("click", moveBack);
    //hide add item view
    (_a = document.getElementById("add-item-div")) === null || _a === void 0 ? void 0 : _a.classList.add("hide");
    (_b = document.getElementById("back-btn")) === null || _b === void 0 ? void 0 : _b.classList.add("hide");
    (_c = document.getElementById("insert-item-btn")) === null || _c === void 0 ? void 0 : _c.classList.add("hide");
});
