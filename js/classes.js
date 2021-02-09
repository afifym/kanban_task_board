// --------------------------------------
// Only For Dynamic Elements
// --------------------------------------

// --------------------------------------
// TASK
// --------------------------------------
class Task {
  static lastID = 0;
  static allTasks = [];

  constructor(
    name = "",
    priority = "3",
    type = null,
    progress = 0.0,
    deadline = null,
    list = 0,
    order = 0,
    bg = "#ffffff",
    ac = "#ffffff"
  ) {
    this.id = Task.lastID;
    this.name = name;
    this.type = type;
    this.priority = priority;
    this.progress = progress;
    this.deadline = deadline;
    this.list = list;
    this.order = order;
    this.bg = bg;
    this.ac = ac;
    this.elemConstructor();

    Task.allTasks.push(this);
    Task.lastID++;
  }

  elemConstructor() {
    this.elem = document.createElement("li");
    this.elem.draggable = true;
    this.elem.dataset.taskid = this.id;
    this.elem.classList.add("task-item");
    this.elem.addEventListener("dragstart", this.onDragStart);
    this.elem.addEventListener("dragend", this.onDragEnd);
    this.elem.addEventListener("click", this.onClick);

    this.elemName = document.createElement("h5");
    this.elemName.classList.add("task-name");

    this.elem.appendChild(this.elemName);
  }

  // ---------
  // VIEW
  // ---------
  onDragStart(e) {
    e.target.classList.add("task-dragging");
  }

  onDragEnd(e) {
    if (prevCard.classList.contains("task-list")) {
      prevCard.prepend(e.target);
    } else if (prevCard.classList.contains("task-item")) {
      prevCard.classList.remove("border-bottom");
      prevCard.parentElement.insertBefore(e.target, prevCard.nextSibling);
    }

    e.target.classList.remove("task-dragging");
    divider.remove();
  }

  onClick(e) {
    e.stopPropagation();

    modalContainer.classList.add("modal-active");
    modalContainer.querySelector(".task-modal").focus = true;

    modalContainer.querySelector(".modal-title").innerHTML = getTask(
      parseInt(this.dataset.taskid)
    ).name;

    modalId = parseInt(this.dataset.taskid);
  }

  render() {
    this.elemName.innerHTML = this.name;
    this.elem.setAttribute(
      "style",
      `background-color: ${this.bg}; border-left-color: ${this.ac};`
    );
    document
      .querySelector(`[data-listnum="${this.list}"]`)
      .querySelector(".task-list")
      .appendChild(this.elem);
  }
}

function getTask(id) {
  return Task.allTasks.find((t) => t.id === id);
}

// --------------------------------------
// NameInput
// --------------------------------------
class NameInput {
  constructor() {
    this.elemConstructor();
  }

  elemConstructor() {
    this.elem = document.createElement("input");
    this.elem.placeholder = "New Task";
    this.elem.classList.add("task-title-input");

    this.elem.addEventListener("blur", (e) => {
      if (!(e.keyCode == 13)) onAddName(e);
    });

    this.elem.addEventListener("keypress", (e) => {
      if (e.keyCode == 13) onAddName(e);
    });

    this.elem.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  onAddName(e) {
    const newTitle = e.target.value;
    const taskId = e.target.parentElement.dataset.taskId;

    this.updateUI(taskId, newTitle);
    e.target.remove();
  }

  updateUI(taskId, newTitle) {
    e.target.parentElement.querySelector(".task-title").innerHTML = newTitle;
  }

  updateData() {}
}

// --------------------------------------
// TaskModal
// --------------------------------------

// class Task {
//   static idCounter = 0;
//   constructor(
//     title = "",
//     priority = "3",
//     type = null,
//     progress = 0.0,
//     deadline = null
//   ) {
//     this.title = title;
//     this.priority = priority;
//     this.type = type;
//     this.progress = progress;
//     this.deadline = deadline;
//     this.id = Task.taskId;
//     Task.idCounter++;
//   }

//   taskDragStart(e) {
//     e.target.classList.add("task-dragging");
//   }

//   taskDragEnd(e) {
//     if (prevCard.classList.contains("task-list")) {
//       prevCard.prepend(e.target);
//     } else if (prevCard.classList.contains("task-item")) {
//       prevCard.classList.remove("border-bottom");
//       prevCard.parentElement.insertBefore(e.target, prevCard.nextSibling);
//     }
//     e.target.classList.remove("task-dragging");
//     divider.remove();
//   }

//   taskClick(e) {
//     e.stopPropagation();
//     modalContainer.classList.add("modal-active");
//     modalContainer.querySelector(".task-modal").focus = true;
//   }

//   addToDom(listNum) {
//     const parentList = document
//       .querySelector(`[data-listnum="${listNum}"]`)
//       .querySelector(".task-list");
//     const newTask = document.createElement("li");
//     const newTitle = document.createElement("h5");

//     newTitle.innerHTML = this.title;
//     newTitle.classList.add("task-title");
//     newTask.appendChild(newTitle);
//     newTask.draggable = true;
//     newTask.classList.add("task-item");
//     newTask.dataset.taskId = this.id;
//     newTask.addEventListener("dragstart", this.taskDragStart);
//     newTask.addEventListener("dragend", this.taskDragEnd);
//     newTask.addEventListener("click", this.taskClick);

//     parentList.appendChild(newTask);

//     return newTask;
//   }
// }
