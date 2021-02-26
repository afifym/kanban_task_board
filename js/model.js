if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then((reg) => console.log("Registered Successfuly ", reg))
    .catch((err) => console.log("Not Registered ", err));
}

// #########################
// TASK_MODEL
// #########################
class Task {
  static lastID = 0;
  static allTasks = [];

  constructor(
    name = "",
    type = "task",
    progress = 0.0,
    deadline = null,
    list = 0,
    order = 0,
    acIndex = 0
  ) {
    this.id = Task.lastID;
    this.name = name;
    this.type = type;
    this.progress = progress;
    this.deadline = deadline;
    this.list = list;
    this.order = order;
    this.acIndex = acIndex;
    this.elemConstructor();

    Task.allTasks.push(this);
    Task.lastID++;
  }

  elemConstructor() {
    // Creating Elements
    // Adding Classes
    // Adding Events
    // Appending

    this.elem = document.createElement("li");
    this.elem.draggable = true;
    this.elem.dataset.taskid = this.id;
    this.elem.classList.add("task-item");
    this.elem.addEventListener("dragstart", this.onDragStart);
    this.elem.addEventListener("dragend", this.onDragEnd);
    this.elem.addEventListener("click", this.onClick);
    this.elem.addEventListener("blur", this.onBlur);

    this.elemName = document.createElement("h5");
    this.elemName.classList.add("task-name");

    this.elemProg = document.createElement("div");
    this.elemProg.addEventListener("click", this.onClickProgress);
    this.elemProgInner = document.createElement("div");
    this.elemProg.classList.add("task-prog-gray");
    this.elemProgInner.classList.add("task-prog-green");

    this.elemProg.appendChild(this.elemProgInner);
    this.elem.appendChild(this.elemName);

    this.elemType = document.createElement("span");
    this.elemType.classList.add("type-icon");

    this.elem.appendChild(this.elemType);
    this.appendArrows();
  }

  appendArrows() {
    // Creating
    const newArrows = document.createElement("span");
    const arrowPrevious = document.createElement("div");
    const arrowNext = document.createElement("div");

    // Editing
    newArrows.className = "task-arrows";
    arrowPrevious.innerHTML = '<i class="fas fa-arrow-left"></i>';
    arrowNext.innerHTML = '<i class="fas fa-arrow-right"></i>';

    // Events
    arrowPrevious.addEventListener("click", this.onPrevious);
    arrowNext.addEventListener("click", this.onNext);

    // Appending
    newArrows.appendChild(arrowPrevious);
    newArrows.appendChild(arrowNext);
    this.elem.appendChild(newArrows);
  }

  onNext(e) {
    e.stopPropagation();
    const taskID = parseInt(e.target.closest(".task-item").dataset.taskid);
    moveTaskToNext(taskID);
    localStorage.setItem("tasksData", JSON.stringify(Task.allTasks));
    localStorage.setItem("listsData", JSON.stringify(listsData));
  }

  onPrevious(e) {
    e.stopPropagation();
    const taskID = parseInt(e.target.closest(".task-item").dataset.taskid);
    moveTaskToPrevious(taskID);
    localStorage.setItem("tasksData", JSON.stringify(Task.allTasks));
    localStorage.setItem("listsData", JSON.stringify(listsData));
  }

  // #########################
  // VIEW
  // #########################
  onDragStart(e) {
    document
      .querySelector("#delete .delete-inner")
      .classList.add("delete-semi-active");

    document
      .querySelector(".task-modal-container")
      .classList.remove("modal-active");

    e.target.classList.add("task-dragging");

    e.dataTransfer.setData(
      "draggedID",
      parseInt(e.target.closest(".task-item").dataset.taskid)
    );
  }

  onClickProgress(e) {
    e.stopPropagation();
    const taskID = parseInt(e.target.closest(".task-item").dataset.taskid);
    updateProgress(taskID);
  }

  onDragEnd(e) {
    const deleteSector = document.querySelector("#delete .delete-inner");
    const divider = document.querySelector(".divider");
    divider ? divider.remove() : "";

    e.target.classList.remove("task-dragging");
    deleteSector.classList.remove("delete-semi-active");

    if (deleteSector.classList.contains("delete-active")) {
      deleteSector.classList.remove("delete-active");
    } else {
      const prevListID = parseInt(
        e.target.closest(".task-list-container").dataset.listnum
      );
      const prevListData = getList(prevListID);
      prevListData.nTasks--;

      let nextSibling = e.target.nextElementSibling;
      while (nextSibling) {
        decrementOrder(parseInt(nextSibling.dataset.taskid));
        nextSibling = nextSibling.nextElementSibling;
      }

      if (itemOrList.classList.contains("task-list")) {
        const nextListID = parseInt(
          itemOrList.closest(".task-list-container").dataset.listnum
        );
        const nextListData = getList(nextListID);
        nextListData.nTasks++;

        [...itemOrList.children].forEach((itemElem) => {
          incrementOrder(parseInt(itemElem.dataset.taskid));
        });
        itemOrList.prepend(e.target);
        updateTask(parseInt(this.dataset.taskid), {
          order: 0,
          list: parseInt(itemOrList.parentElement.dataset.listnum),
        });
      } else if (itemOrList.classList.contains("task-item")) {
        const nextListID = parseInt(
          itemOrList.closest(".task-list-container").dataset.listnum
        );
        const nextListData = getList(nextListID);
        nextListData.nTasks++;

        const toChange = [];

        nextSibling = itemOrList.nextElementSibling;
        while (nextSibling) {
          toChange.push(parseInt(nextSibling.dataset.taskid));
          nextSibling = nextSibling.nextElementSibling;
        }

        toChange.forEach((id) => {
          incrementOrder(id);
        });

        const currentOrder = getPropertyValue(
          parseInt(itemOrList.dataset.taskid),
          "order"
        );

        updateTask(parseInt(this.dataset.taskid), {
          order: currentOrder + 1,
          list: parseInt(
            itemOrList.parentElement.parentElement.dataset.listnum
          ),
        });

        itemOrList.parentElement.insertBefore(e.target, itemOrList.nextSibling);
      }
    }

    localStorage.setItem("listsData", JSON.stringify(listsData));
  }

  // Submit Updates on Click
  onClick(e) {
    e.stopPropagation();
    const clickedTask = e.target.closest(".task-item");
    const taskArrows = clickedTask.querySelector(".task-arrows");
    const modalContainer = document.querySelector(".task-modal-container");

    if (clickedTask.classList.contains("task-active")) {
      clickedTask.classList.remove("task-active");
      modalContainer.classList.remove("modal-active");
      taskArrows.classList.remove("arrows-active");
    } else {
      document.querySelectorAll(".task-item").forEach((taskElem) => {
        taskElem.classList.remove("task-active");
        taskElem
          .querySelector(".task-arrows")
          .classList.remove("arrows-active");
      });
      modalContainer.classList.add("modal-active");
      modalContainer.querySelector(".task-modal").focus = true;
      clickedTask.classList.add("task-active");
      taskArrows.classList.add("arrows-active");
    }

    updateModal(parseInt(this.dataset.taskid));
    selectedTaskID = parseInt(this.dataset.taskid);
  }

  renderProgress() {
    this.elem.appendChild(this.elemProg);

    this.elemProgInner.className = `task-prog-green prog-${
      this.progress * 100
    }`;
  }

  render() {
    this.elemName.innerHTML = this.name;
    this.elem.setAttribute(
      "style",
      `border-left-color: ${colors[this.acIndex]};`
    );

    if (this.type === "task") {
      this.elemType.innerHTML = '<i class="fas fa-hammer"></i>';
      this.elemType.className = `type-icon task`;
    } else if (this.type === "bug") {
      this.elemType.innerHTML = '<i class="fas fa-bug"></i>';
      this.elemType.className = `type-icon bug`;
    } else if (this.type === "epic") {
      this.elemType.innerHTML = '<i class="fas fa-mountain"></i>';
      this.elemType.className = `type-icon epic`;
    }

    const list = document
      .querySelector(`[data-listnum="${this.list}"]`)
      .querySelector(".task-list");

    list.insertBefore(this.elem, list.children[this.order + 1]);
    localStorage.setItem("tasksData", JSON.stringify(Task.allTasks));
  }
}
