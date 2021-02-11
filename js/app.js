// --------------------------------------
// Variables, Constants
// --------------------------------------
const colors = ["#215B60", "#92D546", "#F4E12A", "#F6892F", "#EA4445"];

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
    modalContainer.classList.remove("modal-active");
  }
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

const task = new Task("Working");
task.render();
task.renderProgress();

// const taskTemplate = document.querySelector('script[data-template="task"]')
//   .innerHTML;

const logoBtn = document.querySelector(".logo-btn");

logoBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const colorElems = document.querySelectorAll(
  ".form-accent label:not(.item-label)"
);

for (let i = 0; i < colors.length; i++) {
  colorElems[i].setAttribute("style", `background-color: ${colors[i]}`);
}

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
