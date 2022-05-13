document.addEventListener("DOMContentLoaded", () => {
  //load inital items list
  (async () => {
    try {
      let res = await fetch("http://localhost:5000/api/item", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let data = await res.json();
      console.log("data: ", data);
      data.forEach((element: any) => {
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
        document.getElementById("middle")!.appendChild(div);
      });
    } catch (error) {
      console.log("Error", error);
    }
  })();
});
