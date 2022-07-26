document.addEventListener("DOMContentLoaded", () => {
  //interface for API response object
  interface Data {
    _id: string;
    name: string;
    amount: string;
    active: boolean;
  }

  //switch to add item view
  const addItem = () => {
    //hide
    document.getElementById("item-div")?.classList.add("hide");
    document.getElementById("clear-completed-btn")?.classList.add("hide");
    document.getElementById("add-item-btn")?.classList.add("hide");
    //show
    document.getElementById("add-item-div")?.classList.remove("hide");
    document.getElementById("back-btn")?.classList.remove("hide");
    document.getElementById("insert-item-btn")?.classList.remove("hide");
  };
  //move back
  const moveBack = () => {
    //show
    document.getElementById("item-div")?.classList.remove("hide");
    document.getElementById("clear-completed-btn")?.classList.remove("hide");
    document.getElementById("add-item-btn")?.classList.remove("hide");
    //hide
    document.getElementById("add-item-div")?.classList.add("hide");
    document.getElementById("back-btn")?.classList.add("hide");
    document.getElementById("insert-item-btn")?.classList.add("hide");
  };

  //clearCompleted items from list
  async function clearCompleted() {
    let containers = document.getElementsByClassName(
      "false"
    ) as HTMLCollectionOf<Element>;
    for (var i = 0; i < containers.length; i++) {
      const deleteId: string = containers
        .item(i)
        ?.getAttribute("id")!
        .split("-")[1]!;
      deleteItem(deleteId);
      //console.log("just deleted: ", deleteId);
    }
    //clear items list
    clearItems();
    //relaod items
    getItems();
  }

  //insert item into db
  async function insertItem() {
    //collect info
    const item = document.getElementById("input-item") as HTMLInputElement;
    const amount = document.getElementById("input-amount") as HTMLInputElement;

    const body: any = {
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
        let res = await fetch(`/api/item/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
    } catch (error) {
      console.log("Error", error);
    }

    //change view
    moveBack();
    //clear items list
    clearItems();
    //relaod items
    getItems();
    //console.log("relaoded items after add");
  }

  //delete one
  async function deleteItem(id: string) {
    try {
      let res = await fetch(`/api/item/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.log("Error", error);
    }
  }

  //mark as done in db
  async function toggleItemState(activeUpdate: boolean, id: string) {
    try {
      let res = await fetch(`/api/item/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: activeUpdate.toString() }),
      });
    } catch (error) {
      console.log("Error", error);
    }
  }

  //fetch items
  async function getItems(): Promise<any> {
    try {
      let res = await fetch(`/api/item`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      let data: any = await res.json();

      //console.log("data: ", data);
      //console.log("typeof data: ", typeof data);
      data.forEach((element: Data) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item-container");
        itemDiv.innerHTML = `
          <span class="${element.active}" id="name-${element._id}">${element.name}</span>
          <span class="amount-span">${element.amount}</span>
          <button class="delete-btn button" id="${element._id}">
          <img src="./img/delete.svg" alt="delete" height="24" width="24" />
          </button>
          `;
        document.getElementById("list-item-div")?.appendChild(itemDiv);
        //add listener to x btn
        const deleteBtn = document.getElementById(
          element._id
        ) as HTMLInputElement;
        deleteBtn?.addEventListener("click", () => {
          //remove node
          deleteBtn.parentElement!.remove();
          //fetch delete from db
          deleteItem(element._id);
        });
        //add listener to item name for strikethrough
        const nameBtn = document.getElementById(`name-${element._id}`);
        nameBtn?.addEventListener("click", () => {
          //toggle true/false - cant use classlist.toggle because of double entry
          let activeUpdate: boolean;
          if (nameBtn?.classList.contains("true")) {
            nameBtn?.classList.replace("true", "false");
            activeUpdate = false;
          } else {
            nameBtn?.classList.replace("false", "true");
            activeUpdate = true;
          }
          //goto database and fetch active: true/false by id
          toggleItemState(activeUpdate, element._id);
        });
      });
    } catch (error) {
      console.log("Error", error);
    }
  }

  //load inital items list
  (async () => {
    clearItems();
    await getItems();
    //console.log("relaoded items at start");
  })();

  //clear items list
  function clearItems() {
    const listItemDiv = document.getElementById(
      "list-item-div"
    ) as HTMLInputElement;
    listItemDiv.innerHTML = "";
  }

  //add listener to add item btn
  const addBtn = document.getElementById("add-item-btn") as HTMLInputElement;
  addBtn?.addEventListener("click", addItem);

  //add listener to clear-completed-btn
  const clearBtn = document.getElementById(
    "clear-completed-btn"
  ) as HTMLInputElement;
  clearBtn?.addEventListener("click", clearCompleted);

  //add listener to insert item btn
  const insertBtn = document.getElementById(
    "insert-item-btn"
  ) as HTMLInputElement;
  insertBtn?.addEventListener("click", insertItem);

  //add listener to back btn
  const backBtn = document.getElementById("back-btn") as HTMLInputElement;
  backBtn?.addEventListener("click", moveBack);

  //hide add item view
  document.getElementById("add-item-div")?.classList.add("hide");
  document.getElementById("back-btn")?.classList.add("hide");
  document.getElementById("insert-item-btn")?.classList.add("hide");
});
