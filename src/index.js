document.addEventListener("DOMContentLoaded", () => {
  (async () => {
    try {
      let res = await fetch("http://localhost:5000/api/item", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      let data = await res.json();
      console.log("data: ", data);

      //THE OTHER WAY
      // data.forEach((element) => {
      //   const container = document.getElementById("container");
      //   const listDiv = document.createElement("div");
      //   const p_id = document.createElement("p");
      //   p_id.innerHTML = element._id;
      //   listDiv.appendChild(p_id);
      //   container.appendChild(listDiv);
      // });

      data.forEach((element) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p>id: ${element._id}</p>
          <p>name: ${element.name}</p>
          <p>amount: ${element.amount}</p>
          <p>author: ${element.author}</p>
          <p>active: ${element.active}</p>
          <br>
          `;
        container.appendChild(div);
      });
    } catch (error) {
      console.log("Error", error);
    }
  })();
});
