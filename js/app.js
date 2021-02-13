// --------------------------------------
// Variables, Constants
// --------------------------------------
const colors = ["#215B60", "#92D546", "#F4E12A", "#F6892F", "#EA4445"];
const lColors = ["#AB4D72", "#4E5B9F", "#CD9F63", "#0DC378"];

const board = document.querySelector("#board");
const divider = document.createElement("div");
const modalContainer = document.querySelector(".task-modal-container");
const listContainers = document.querySelectorAll(".task-list-container");
const addBtns = document.querySelectorAll(".add-btn-container");

divider.classList.add("divider");
let itemOrList = null;
let lastItemOrList = null;
let modalId = undefined;
// --------------------------------------
// Utility Functions
// --------------------------------------

// V
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

// --------------------------------------
// Events
// --------------------------------------

modalContainer.querySelector(".task-modal").addEventListener("click", (e) => {
  e.stopPropagation();
});

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

document.addEventListener("click", (e) => {
  e.stopPropagation();
  if (modalContainer.classList.contains("modal-active")) {
    const taskForm = modalContainer.querySelector(".task-form");
    const updates = {
      name: taskForm.name.value,
      type: taskForm.type.value,
      acIndex: parseInt(taskForm.accent.value),
      deadline: taskForm.deadline.value,
      progress: taskForm.progress.value / 100,
    };

    // Controller
    updateTask(modalId, updates);

    modalContainer.classList.remove("modal-active");
  }

  popviews.forEach((elem) => {
    if (elem.classList.contains("popview-active")) {
      elem.classList.remove("popview-active");
    }
  });
});

board.addEventListener("dragover", (e) => {
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
        itemOrList.parentElement.insertBefore(divider, itemOrList.nextSibling);
      }

      lastItemOrList = itemOrList;
    }
  }
});

// --------------------------------------
// end
// --------------------------------------

// --------------------------------------
// TITLE_INPUT
// --------------------------------------

const taskTitleInput = document.createElement("input");
taskTitleInput.classList.add("task-title-input");
taskTitleInput.placeholder = "New task";

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
  if (e.keyCode == 13) addNewName(e);
});

// --------------------------------------
// LOGO_BTN
// --------------------------------------

const logoBtn = document.querySelector(".logo-btn");

logoBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const colorElems = document.querySelectorAll(
  ".task-form .form-accent label:not(.item-label)"
);

for (let i = 0; i < colors.length; i++) {
  colorElems[i].setAttribute("style", `background-color: ${colors[i]}`);
}

// --------------------------------------
// MODAL
// --------------------------------------

const modalForm = document.querySelector(".task-modal form");
modalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const updates = {
    name: this.name.value,
    type: this.type.value,
    acIndex: parseInt(this.accent.value),
    deadline: this.deadline.value,
    progress: this.progress.value / 100,
  };

  // Controller
  updateTask(modalId, updates);

  modalContainer.classList.remove("modal-active");
});

// --------------------------------------
// LIST SETTINGS
// --------------------------------------
const lists = [
  {
    id: 0,
    name: "Not Started",
    acIndex: 0,
  },
  {
    id: 1,
    name: "Next Up",
    acIndex: 1,
  },
  {
    id: 2,
    name: "In Progress",
    acIndex: 2,
  },
  {
    id: 3,
    name: "Completed",
    acIndex: 3,
  },
];

function getForm(id) {
  return lists.find((t) => t.id === id);
}

// VIEW

const settings = document.querySelectorAll(".task-list-settings");
settings.forEach((setting) => {
  setting.addEventListener("click", showPopView);
});

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
        .setAttribute("style", `border-top-color: ${lColors[e.target.value]}`);
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

// UPATE ACCENT LABELS
const listFormAccent = document.querySelectorAll(".list-form .form-accent");
listFormAccent.forEach((form) => {
  let i = 0;
  form.querySelectorAll("label:not(.item-label)").forEach((elem) => {
    elem.setAttribute("style", `background-color: ${lColors[i]}`);
    i++;
  });
});

function showPopView(e) {
  e.stopPropagation();
  const listID = parseInt(
    e.target.closest(".task-list-container").dataset.listnum
  );

  const formElem = e.target.nextElementSibling.firstElementChild;
  const form = getForm(
    parseInt(e.target.parentElement.parentElement.dataset.listnum)
  );
  e.target.nextElementSibling.classList.toggle("popview-active");

  formElem.lname.value = e.target.parentElement.firstElementChild.innerHTML;
  // formElem.laccent.value = form.acIndex;

  formElem[`laccent${listID}`].value = form.acIndex;
}
