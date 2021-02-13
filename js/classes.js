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
    this.elem = document.createElement("li");
    this.elem.draggable = true;
    this.elem.dataset.taskid = this.id;
    this.elem.classList.add("task-item");
    this.elem.addEventListener("dragstart", this.onDragStart);
    this.elem.addEventListener("dragend", this.onDragEnd);
    this.elem.addEventListener("click", this.onClick);

    this.elemName = document.createElement("h5");
    this.elemName.classList.add("task-name");

    this.elemProg = document.createElement("div");
    this.elemProgInner = document.createElement("div");

    this.elemProg.classList.add("task-prog-gray");
    this.elemProgInner.classList.add("task-prog-green");

    this.elemProg.appendChild(this.elemProgInner);
    this.elem.appendChild(this.elemName);

    this.elemType = document.createElement("span");
    this.elemType.classList.add("type-icon");

    this.elem.appendChild(this.elemType);
  }
  renderProgress() {
    this.elem.appendChild(this.elemProg);
    this.elemProgInner.setAttribute("style", `width: ${this.progress * 100}%`);
  }
  // #########################
  // VIEW
  // #########################
  onDragStart(e) {
    e.target.classList.add("task-dragging");
    e.dataTransfer.setData("text", 1);
  }

  onDragEnd(e) {
    divider.remove();
    e.target.classList.remove("task-dragging");

    let nextSibling = e.target.nextElementSibling;
    while (nextSibling) {
      decrementOrder(parseInt(nextSibling.dataset.taskid));
      nextSibling = nextSibling.nextElementSibling;
    }

    if (itemOrList.classList.contains("task-list")) {
      [...itemOrList.children].forEach((itemElem) => {
        incrementOrder(parseInt(itemElem.dataset.taskid));
      });
      itemOrList.prepend(e.target);
      updateTask(parseInt(this.dataset.taskid), {
        order: 0,
        list: parseInt(itemOrList.parentElement.dataset.listnum),
      });
    } else if (itemOrList.classList.contains("task-item")) {
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
        list: parseInt(itemOrList.parentElement.parentElement.dataset.listnum),
      });

      itemOrList.parentElement.insertBefore(e.target, itemOrList.nextSibling);
    }
  }

  onClick(e) {
    e.stopPropagation();
    updateModal(parseInt(this.dataset.taskid));
    modalContainer.classList.add("modal-active");
    modalContainer.querySelector(".task-modal").focus = true;

    modalId = parseInt(this.dataset.taskid);
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
  }
}
