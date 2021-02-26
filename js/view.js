// #########################
// VARIABLES_AND_CONSTANTS
// #########################
const colors = ["#215B60", "#92D546", "#F4E12A", "#F6892F", "#EA4445"];
const lColors = ["#AB4D72", "#4E5B9F", "#CD9F63", "#0DC378"];

let itemOrList = null;
let selectedTaskID = undefined;

// #########################
// FUNCTIONS
// #########################

// DRAGnDROP
(function dragndrop() {
  const board = document.querySelector("#board");
  const divider = document.createElement("div");
  const listContainers = document.querySelectorAll(".task-list-container");

  divider.classList.add("divider");
  let lastItemOrList = null;

  function getItemOrList(list, y) {
    const items = [...list.querySelectorAll(".task-item:not(.task-dragging)")];
    let itemOrList = null;

    items.forEach((item) => {
      const box = item.getBoundingClientRect();
      let offset = y - box.top - box.height / 2;

      if (offset > 0) {
        itemOrList = item;
      }
    });

    if (itemOrList == null) itemOrList = list;

    return itemOrList;
  }

  board.addEventListener("dragover", (e) => {
    onDragOver(e);
  });

  board.addEventListener("touchmove", (e) => {
    onDragOver(e);
  });

  function onDragOver(e) {
    e.preventDefault();

    let elem = e.target;

    if (!elem.classList.contains("task-list-container")) {
      elem = elem.closest(".task-list-container");
    }

    if (elem == null) {
      let smallestDist = 1000;
      listContainers.forEach((container) => {
        const box = container.getBoundingClientRect();

        let dist = Math.sqrt(
          (e.clientY - box.height / 2) ** 2 + (e.clientX - box.width / 2) ** 2
        );
        if (dist < smallestDist) {
          elem = container;
          smallestDist = dist;
        }
      });
    }

    if (elem != null && elem.classList.contains("task-list-container")) {
      let insideList = elem.querySelector(".task-list");

      itemOrList = getItemOrList(insideList, e.clientY);

      if (lastItemOrList != itemOrList) {
        if (itemOrList == insideList) {
          insideList.prepend(divider);
        } else {
          itemOrList.parentElement.insertBefore(
            divider,
            itemOrList.nextSibling
          );
        }

        lastItemOrList = itemOrList;
      }
    }
  }
})();

// ADD_BTN
(function addBtns() {
  const addBtns = document.querySelectorAll(".add-btn-container");
  addBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const newTask = addNewTask(
        parseInt(e.target.parentElement.dataset.listnum)
      );
      taskTitleInput.value = "";
      newTask.elem.appendChild(taskTitleInput);
      taskTitleInput.focus();
    });
  });

  const taskTitleInput = document.createElement("input");
  taskTitleInput.classList.add("task-title-input");
  taskTitleInput.placeholder = "new task";

  taskTitleInput.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  taskTitleInput.addEventListener("blur", (e) => {
    if (!(e.keyCode == 13)) {
      addNewName(
        parseInt(e.target.closest(".task-item").dataset.taskid),
        e.target.value
      );
      e.target.remove();
    }
  });

  taskTitleInput.addEventListener("keypress", (e) => {
    if (e.keyCode == 13) e.target.blur();
  });
})();

// LOGO_BTN
(function logoBtn() {
  document.querySelector(".logo-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });
})();

(function populateFormAccents() {
  const colorElems = document.querySelectorAll(
    ".task-form .form-accent label:not(.item-label)"
  );

  for (let i = 0; i < colors.length; i++) {
    colorElems[i].setAttribute("style", `background-color: ${colors[i]}`);
  }
})();

(function deleteCircle() {
  const deleteSector = document.querySelector("#delete .delete-inner");

  deleteSector.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  deleteSector.addEventListener("dragenter", (e) => {
    e.target.classList.add("delete-active");
  });

  deleteSector.addEventListener("dragleave", (e) => {
    e.target.classList.remove("delete-active");
  });

  deleteSector.addEventListener("drop", (e) => {
    e.preventDefault();
    const taskID = parseInt(e.dataTransfer.getData("draggedID"));
    deleteTask(taskID);
  });
})();

(function () {
  const popview = document.querySelector(".popview");
  const settings = document.querySelectorAll(".task-list-settings");

  popview.addEventListener("click", (e) => {
    e.stopPropagation();
    popview.classList.remove(".popview-active");
  });

  settings.forEach((setting) => {
    setting.addEventListener("click", addShowPopview);
  });

  // Interactive
  popview.querySelector(".form-name input").addEventListener("input", (e) => {
    e.target
      .closest(".task-list-container")
      .querySelector(".task-list-title").innerHTML = e.target.value;

    const listID = parseInt(e.target.closest(".popview").dataset.listid);
    const listData = getList(listID);
    listData.name = e.target.value;

    localStorage.setItem("listsData", JSON.stringify(listsData));
  });

  // Interactive
  popview.querySelectorAll(".form-accent input").forEach((acInput) => {
    acInput.addEventListener("input", (e) => {
      const listID = parseInt(e.target.closest(".popview").dataset.listid);

      getForm(parseInt(listID)).acIndex = e.target.value;

      e.target
        .closest(".task-list-container")
        .setAttribute("style", `border-top-color: ${lColors[e.target.value]}`);

      const listData = getList(listID);
      listData.acIndex = parseInt(e.target.value);

      localStorage.setItem("listsData", JSON.stringify(listsData));
    });
  });

  // SUBMIT
  popview.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  function addShowPopview(e) {
    e.stopPropagation();
    const listElem = e.target.closest(".task-list-container");
    const listID = parseInt(listElem.dataset.listnum);
    const popForm = popview.querySelector(".list-form");
    const listData = getList(listID);

    if (parseInt(popview.dataset.listid) === listID) {
      popview.classList.toggle("popview-active");
    } else {
      popview.classList.remove("popview-active");
      listElem.insertBefore(popview, e.target.nextElementSibling);
      popview.dataset.listid = listID;

      setTimeout(() => {
        popview.classList.add("popview-active");
      }, 5);
    }

    popForm.lname.value = listData.name;
    popForm.laccent.value = listData.acIndex;
  }
})();
// TODO: Update ListsData
// Single Popview
function popviewsSetup() {
  const settings = document.querySelectorAll(".task-list-settings");
  settings.forEach((setting) => {
    setting.addEventListener("click", showPopView);
  });

  function showPopView(e) {
    e.stopPropagation();
    console.log("setting");
    console.log(e.target);

    const listElem = e.target.closest(".task-list-container");
    const listID = parseInt(listElem.dataset.listnum);
    const listForm = listElem.querySelector(".list-form");

    // listElem.querySelector(".popview").classList.toggle("popview-active");

    listForm.lname.value = listElem.querySelector(".task-list-title").innerHTML;
    listForm[`laccent${listID}`].value = getList(listID).acIndex;
  }

  const popviews = document.querySelectorAll(".popview");
  popviews.forEach((popview) => {
    // NAME INPUT
    const popNameInput = popview.querySelector(".list-form .form-name input");
    popNameInput.addEventListener("input", (e) => {
      e.target
        .closest(".task-list-container")
        .querySelector(".task-list-title").innerHTML = e.target.value;
    });

    // ACCENT INPUT
    const popAccentInputs = popview.querySelectorAll(".form-accent input");
    popAccentInputs.forEach((acInput) => {
      acInput.addEventListener("input", (e) => {
        const listID = e.target.closest(".task-list-container").dataset.listnum;
        getForm(parseInt(listID)).acIndex = e.target.value;

        e.target
          .closest(".task-list-container")
          .setAttribute(
            "style",
            `border-top-color: ${lColors[e.target.value]}`
          );
      });
    });

    // CLICK
    popview.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // SUBMIT
    popview.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
    });
  });
}

(function populatePopviewsAccents() {
  const listFormAccent = document.querySelectorAll(".list-form .form-accent");
  listFormAccent.forEach((form) => {
    let i = 0;
    form.querySelectorAll("label:not(.item-label)").forEach((elem) => {
      elem.setAttribute("style", `background-color: ${lColors[i]}`);
      i++;
    });
  });
})();

(function documentEvents() {
  const modalContainer = document.querySelector(".task-modal-container");
  const popview = document.querySelector(".popview");

  document.addEventListener("click", (e) => {
    e.stopPropagation();
    if (modalContainer.classList.contains("modal-active")) {
      modalContainer.classList.remove("modal-active");
      document.querySelectorAll(".task-item").forEach((taskElem) => {
        taskElem.classList.remove("task-active");
        taskElem
          .querySelector(".task-arrows")
          .classList.remove("arrows-active");
      });

      const taskForm = modalContainer.querySelector(".task-form");
      const updates = {
        name: taskForm.name.value,
        type: taskForm.type.value,
        acIndex: parseInt(taskForm.accent.value),
        deadline: taskForm.deadline.value,
      };

      // Controller
      updateTask(selectedTaskID, updates);
    }

    popview.classList.remove("popview-active");
  });
})();

// MODAL
(function interactiveModal() {
  const modalContainer = document.querySelector(".task-modal-container");

  // MODAL
  modalContainer.querySelector(".task-modal").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // MODAL_SUBMIT => TASK UPDATE
  const modalForm = document.querySelector(".task-modal form");
  const taskNameInput = modalForm.querySelector(".form-name input");
  taskNameInput.addEventListener("input", (e) => {
    const taskElemName = document.querySelector(
      `.task-item[data-taskid='${selectedTaskID}'] .task-name`
    );

    taskElemName.innerHTML = e.target.value;
  });

  const taskTypeInputs = modalForm.querySelectorAll(".form-type input");
  taskTypeInputs.forEach((typeInput) => {
    typeInput.addEventListener("input", (e) => {
      const taskElemType = document.querySelector(
        `.task-item[data-taskid='${selectedTaskID}'] .type-icon`
      );

      const selectedType = e.target.value;

      if (selectedType === "task") {
        taskElemType.innerHTML = '<i class="fas fa-hammer"></i>';
        taskElemType.className = `type-icon task`;
      } else if (selectedType === "bug") {
        taskElemType.innerHTML = '<i class="fas fa-bug"></i>';
        taskElemType.className = `type-icon bug`;
      } else if (selectedType === "epic") {
        taskElemType.innerHTML = '<i class="fas fa-mountain"></i>';
        taskElemType.className = `type-icon epic`;
      }
    });
  });

  const taskAccentInputs = modalForm.querySelectorAll(".form-accent input");
  taskAccentInputs.forEach((accentInput) => {
    accentInput.addEventListener("input", (e) => {
      const selectedAccent = e.target.value;
      const taskElem = document.querySelector(
        `.task-item[data-taskid='${selectedTaskID}']`
      );

      taskElem.setAttribute(
        "style",
        `border-left-color: ${colors[selectedAccent]};`
      );
    });
  });

  const deleteBtn = document.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const taskID = selectedTaskID;
    deleteTask(taskID);
    modalContainer.classList.remove("modal-active");
  });
})();
