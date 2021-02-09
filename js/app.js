// --------------------------------------
// Variables, Constants
// --------------------------------------
const board = document.querySelector("#board");
const divider = document.createElement("div");
const modalContainer = document.querySelector(".task-modal-container");
const listContainers = document.querySelectorAll(".task-list-container");
const addBtns = document.querySelectorAll(".add-btn-container");
divider.classList.add("divider");
let prevCard = null;
let lastPrevCard = null;
let modalId = undefined;
// --------------------------------------
// Utility Functions
// --------------------------------------

// V
function getprevCard(taskList, y) {
  const listTasks = [
    ...taskList.querySelectorAll(".task-item:not(.task-dragging)"),
  ];
  let offset = 0;
  prevCard = null;

  listTasks.forEach((task) => {
    const box = task.getBoundingClientRect();
    offset = y - box.top - box.height / 2;

    if (offset > 0) {
      prevCard = task;
    }
  });

  if (prevCard == null) prevCard = taskList;

  return prevCard;
}

// --------------------------------------
// Events
// --------------------------------------

modalContainer.querySelector(".task-modal").addEventListener("click", (e) => {
  e.stopPropagation();
});

// Controller
const addNewTask = (list) => {
  // Update Model
  const newTask = new Task();
  newTask.list = list;

  // Update View
  newTask.render();

  return newTask.elem;
};

addBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const newElem = addNewTask(
      parseInt(e.target.parentElement.dataset.listnum)
    );
    taskTitleInput.value = "";
    newElem.appendChild(taskTitleInput);
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

    let prevCard = getprevCard(insideList, e.clientY);

    if (lastPrevCard != prevCard) {
      if (prevCard == insideList) {
        insideList.prepend(divider);
      } else {
        prevCard.parentElement.insertBefore(divider, prevCard.nextSibling);
      }

      lastPrevCard = prevCard;
    }
  }
});

// --------------------------------------
// end
// --------------------------------------

const taskTitleInput = document.createElement("input");
taskTitleInput.classList.add("task-title-input");
taskTitleInput.placeholder = "New task";

// controller
const addNewName = (id, name) => {
  // Update the Model
  const task = Task.allTasks.find((t) => t.id === id);
  task.name = name ? name : "New task";

  // Update the view
  task.render();
};

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

// const taskTemplate = document.querySelector('script[data-template="task"]')
//   .innerHTML;

const logoBtn = document.querySelector(".logo-btn");

logoBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

const colors = ["#215B60", "#92D546", "#F4E12A", "#F6892F", "#EA4445"];

const modalForm = document.querySelector(".task-modal form");

modalForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const updates = {
    name: this.name.value,
    type: this.type.value,
    bg: colors[parseInt(this.bg.value)],
    ac: colors[parseInt(this.accent.value)],
    deadline: this.deadline.value,
  };

  // Controller
  updateTask(modalId, updates);

  modalContainer.classList.remove("modal-active");
});

function updateTask(id, updates) {
  // Update Model
  const task = Task.allTasks.find((t) => t.id === id);
  const { name, type, bg, ac, deadline } = updates;

  task.name = name;
  task.type = type;
  task.bg = bg;
  task.ac = ac;
  task.deadline = deadline;

  // Update View
  task.render();
}
