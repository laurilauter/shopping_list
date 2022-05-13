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
    //load inital items list
    (() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let res = yield fetch("http://localhost:5000/api/item", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            let data = yield res.json();
            console.log("data: ", data);
            data.forEach((element) => {
                const div = document.createElement("div");
                div.innerHTML = `
          <div class="item-container">
          <span class="author-span">${element.author}</span>
          <span class="${element.active}" id="${element._id}">${element.name}</span>
          <span class="amount-span">${element.amount}</span>
          <button>X</button>
          </div>
          <br>
          `;
                document.getElementById("middle").appendChild(div);
            });
        }
        catch (error) {
            console.log("Error", error);
        }
    }))();
});
