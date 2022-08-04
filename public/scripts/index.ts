document.addEventListener("DOMContentLoaded", () => {
  //interface for API response object
  interface Data {
    _id: string;
    name: string;
    active: boolean;
  }

  interface inputData {
    name: string;
    active: boolean;
  }

  //clearCompleted items from list
  // async function deleteCompleted() {
  //   let containers = document.getElementsByClassName(
  //     "false"
  //   ) as HTMLCollectionOf<Element>;
  //   for (var i = 0; i < containers.length; i++) {
  //     const deleteId: string = containers
  //       .item(i)
  //       ?.getAttribute("id")!
  //       .split("-")[1]!;
  //     deleteItem(deleteId);
  //     //console.log("just deleted: ", deleteId);
  //   }
  //   //clear items list
  //   clearItems();
  //   //relaod items
  //   getItems();
  // }

  //hideCompleted items from list
  function toggleCompletedItems() {
    console.log("toggleCompletedItems enterd");
    //get elements, that have "active-false"
    const hiddenItems = document.querySelectorAll(".active-false");
    console.log("hiddenItems ", hiddenItems);

    //completed items add/remove class hidden depending on the button state
    //
    //get toggle button state
    const getToggleButtonState = (): boolean => {
      //get the toggle button
      const toggleButton = document.getElementById(
        "hide-completed-btn"
      ) as HTMLInputElement;

      //set state to true and flip if required
      let state: boolean = true;
      if (toggleButton.classList.contains("completed-visible")) {
        toggleButton.classList.remove("completed-visible");
        toggleButton.classList.add("completed-hidden");
        toggleButton.innerHTML = "SHOW";

        state = false;
      } else {
        toggleButton.classList.remove("completed-hidden");
        toggleButton.classList.add("completed-visible");
        toggleButton.innerHTML = "HIDE";
      }
      //should the button label be flipped here?
      //if(){};
      console.log("state ", state);
      return state;
    };

    const buttonState = getToggleButtonState();

    //toggle gidden class on items depending on button state
    for (let i = 0; i < hiddenItems.length; i++) {
      hiddenItems[i].parentElement?.classList.remove("hide");
      if (buttonState === false) {
        hiddenItems[i].parentElement?.classList.add("hide");
      }
    }
  }

  //insert item into db
  async function insertItem() {
    //collect info from input
    const itemToBeInsserted = document.getElementById(
      "input-item"
    ) as HTMLInputElement;

    const body: inputData = {
      name: itemToBeInsserted.value,
      active: true,
    };

    //clear input
    itemToBeInsserted.value = "";

    //create new item
    try {
      if (body.name) {
        let res = await fetch(`/api/item/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        let data: any = await res.json();
        console.log("response from BE ", data);
        //add list item
        addListItem(data);
      }
    } catch (error) {
      console.log("Error", error);
    }
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

  //edit item in db
  async function editItem(itemUpdate: string, id: string) {
    console.log("itemUpdate ", itemUpdate, "id ", id);
    try {
      let res = await fetch(`/api/item/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: itemUpdate,
          //active: active,
        }),
      });
      let data: any = await res.json();
      console.log("edited Data from DB", data);
    } catch (error) {
      console.log("Error", error);
    }

    //TODO: THE REDRAW SHOULD BE LIMITED TO ONE ITEM
    //Here the parent div of the input box, then
    //creat a child for it with addListItem(element: Data)
    clearItems();
    getItems();
  }

  function startItemEdit(button: HTMLElement, oldValue: string, id: string) {
    //get new value
    button.parentElement!.innerHTML = `
    <input id="edit-item" type="text" value="${oldValue}" /><br />
    <button class="" id="edit-item-${id}">EDIT</button>
    `;
    const insertEditedItemBtn = document.getElementById(
      `edit-item-${id}`
    ) as HTMLElement;

    const newItemValue = document.getElementById(
      "edit-item"
    ) as HTMLInputElement;
    console.log("newItemValue ", newItemValue, "id ", id);

    insertEditedItemBtn.addEventListener("click", () => {
      editItem(newItemValue.value, id);
    });

    // listen to Enter on edit item
    newItemValue.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        insertEditedItemBtn.click();
      }
    });
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
        addListItem(element);
      });
    } catch (error) {
      console.log("Error", error);
    }
  }

  function addListItem(element: Data) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-container");
    itemDiv.innerHTML = `
          <span class="active-${element.active} cursor-pointer" id="name-${element._id}">${element.name}</span>
          <button class="" id="edit-${element._id}">EDIT</button>
          <button class="delete-btn button" id="delete-${element._id}">DELETE</button>
          `;
    document.getElementById("list-item-div")?.appendChild(itemDiv);
    //add listener to item name for strikethrough
    const nameBtn = document.getElementById(`name-${element._id}`);
    nameBtn?.addEventListener("click", () => {
      //toggle true/false - cant use classlist.toggle because of double entry
      let activeUpdate: boolean;
      if (nameBtn?.classList.contains("active-true")) {
        nameBtn?.classList.replace("active-true", "active-false");
        activeUpdate = false;
      } else {
        nameBtn?.classList.replace("active-false", "active-true");
        activeUpdate = true;
      }
      //goto database and fetch active: true/false by id
      toggleItemState(activeUpdate, element._id);
    });

    //add listener to edit btn
    const editBtn = document.getElementById(
      `edit-${element._id}`
    ) as HTMLInputElement;
    editBtn?.addEventListener("click", () => {
      startItemEdit(editBtn, element.name, element._id);
    });

    //add listener to delete btn
    const deleteBtn = document.getElementById(
      `delete-${element._id}`
    ) as HTMLInputElement;
    deleteBtn?.addEventListener("click", () => {
      //remove node
      deleteBtn.parentElement!.remove();
      //fetch delete from db
      deleteItem(element._id);
    });
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

  //add listener to hide-completed-btn
  const hideBtn = document.getElementById(
    "hide-completed-btn"
  ) as HTMLInputElement;
  hideBtn?.addEventListener("click", toggleCompletedItems);

  //add listener to clear-completed-btn
  // const clearBtn = document.getElementById(
  //   "clear-completed-btn"
  // ) as HTMLInputElement;
  // clearBtn?.addEventListener("click", clearCompleted);

  //add listener to insert item btn
  const insertBtn = document.getElementById(
    "insert-item-btn"
  ) as HTMLInputElement;
  insertBtn?.addEventListener("click", insertItem);

  // Listen to Enter at insert new item
  const itemToBeInsserted = document.getElementById(
    "input-item"
  ) as HTMLInputElement;
  itemToBeInsserted.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      insertBtn.click();
    }
  });
});
