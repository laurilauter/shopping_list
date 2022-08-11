document.addEventListener("DOMContentLoaded", () => {
  //interface for API response object
  interface responseData {
    _id: string;
    name: string;
    active: boolean;
  }
  //interface for API input
  interface requestData {
    name: string;
    active: boolean;
  }

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
        toggleButton.innerHTML = "SHOW COMPLETED";

        state = false;
      } else {
        toggleButton.classList.remove("completed-hidden");
        toggleButton.classList.add("completed-visible");
        toggleButton.innerHTML = "HIDE COMPLETED";
      }
      //should the button label be flipped here?
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

  //add list item
  function addListItem(element: responseData) {
    console.log("addListItem element._id", element._id);
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item-container");
    itemDiv.innerHTML = `
          <span class="item-span active-${element.active} cursor-pointer" id="name-${element._id}">${element.name}</span>
          <button class="delete-btn btn cursor-pointer" id="delete-${element._id}">DELETE</button>
          <button class="edit-btn btn cursor-pointer" id="edit-${element._id}">EDIT</button>
          `;
    document.getElementById("list-item-div")?.appendChild(itemDiv);

    addEventListenersToItem(element);
  }

  //insert item into db
  async function insertItem() {
    //collect info from input
    const itemToBeInsserted = document.getElementById(
      "input-item"
    ) as HTMLInputElement;

    const body: requestData = {
      name: itemToBeInsserted.value,
      active: true,
    };

    //create new item
    try {
      if (body.name) {
        let res = await fetch(`/api/item/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        let data: any = await res.json();
        console.log("response from BE data.body ", data);
        //add list item
        addListItem(data);
      }
    } catch (error) {
      console.log("Error", error);
    }
    //clear input
    itemToBeInsserted.value = "";
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

  //Add event listeners to item name, edit and delete buttons after initial draw, insertion and edit
  async function addEventListenersToItem(element: responseData) {
    console.log("element.id ", element._id, element.name, element.active);
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
      console.log(
        "editBtn, element.name, element._id ",
        editBtn,
        element.name,
        element._id
      );
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

  //get single item
  async function getSingleItem(id: string) {
    try {
      let res = await fetch(`/api/item/:${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let data: any = await res.json();
      return data;
    } catch (error) {
      console.log("Error", error);
    }
  }

  //edit item in db
  async function editItem(
    itemContainer: HTMLElement,
    itemUpdate: string,
    id: string
  ) {
    console.log(
      "container",
      itemContainer,
      "editItem itemUpdate ",
      itemUpdate,
      "id ",
      id
    );
    try {
      let res = await fetch(`/api/item/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: itemUpdate,
          active: true,
        }),
      });
      let data: any = await res.json();
      console.log("edited Data from DB", data);

      // let newItem = await fetch(`/api/item/${id}`, {
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" },
      // });
      // let newItemData: any = await newItem.json();
      // console.log("newItem ", newItem);

      let newItemData = await getSingleItem(id);

      itemContainer.innerHTML = `
      <span class="item-span active-${newItemData.active} cursor-pointer" id="name-${newItemData._id}">${newItemData.name}</span>
      <button class="delete-btn btn cursor-pointer" id="delete-${newItemData._id}">DELETE</button>
      <button class="edit-btn btn cursor-pointer" id="edit-${newItemData._id}">EDIT</button>
      `;

      //add event listeners
      addEventListenersToItem(data);
    } catch (error) {
      console.log("Error", error);
    }
  }

  function startItemEdit(button: HTMLElement, oldValue: string, id: string) {
    console.log("startItemEdit input", button, oldValue, id);
    //get new value
    button.parentElement!.innerHTML = `
    <input id="edit-item-input-${id}" class="edit-item-input" type="text" value="${oldValue}" />
    <button class="edit-btn btn cursor-pointer" id="insert-edited-item-btn-${id}">EDIT</button>
    `;
    console.log("startItemEdit input ", id);
    const insertEditedItemBtn = document.getElementById(
      `insert-edited-item-btn-${id}`
    ) as HTMLElement;
    console.log("insertEditedItemBtn ", insertEditedItemBtn);

    const newItemValue = document.getElementById(
      `edit-item-input-${id}`
    ) as HTMLInputElement;
    console.log("newItemValue ", newItemValue, "id ", id);

    insertEditedItemBtn.addEventListener("click", () => {
      editItem(newItemValue.parentElement!, newItemValue.value, id);
      console.log(
        "newItemValue.parentElement!, newItemValue.value, id ",
        newItemValue.parentElement!,
        newItemValue.value,
        id
      );
    });

    // listen to Enter on edit item
    newItemValue.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        insertEditedItemBtn.click();
      }
    });
  }

  //get items from DB
  async function getItems(): Promise<any> {
    try {
      let res = await fetch(`/api/item`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let data: any = await res.json();
      data.forEach((element: responseData) => {
        addListItem(element);
      });
    } catch (error) {
      console.log("Error", error);
    }
  }

  function addPageEventListeners() {
    //add listener to hide-completed-btn
    const hideBtn = document.getElementById(
      "hide-completed-btn"
    ) as HTMLInputElement;
    hideBtn?.addEventListener("click", toggleCompletedItems);

    const insertBtn = document.getElementById(
      "insert-item-btn"
    ) as HTMLInputElement;
    insertBtn?.addEventListener("click", insertItem);

    const itemToBeInsserted = document.getElementById(
      "input-item"
    ) as HTMLInputElement;
    itemToBeInsserted.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        insertBtn.click();
      }
    });
  }

  //clear items list
  function clearItems() {
    const listItemDiv = document.getElementById(
      "list-item-div"
    ) as HTMLInputElement;
    listItemDiv.innerHTML = "";
  }
  addPageEventListeners();
  (async () => {
    clearItems();
    await getItems();
  })();
});
