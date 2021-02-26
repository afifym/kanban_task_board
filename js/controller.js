const useStorage = true;

const tData = [
  {
    name: "This",
    type: "task",
    progress: 0,
    deadline: "2021-02-10",
    list: 0,
    order: 0,
    acIndex: 4,
  },
  {
    name: "is",
    type: "bug",
    progress: 0,
    deadline: "2021-02-10",
    list: 1,
    order: 0,
    acIndex: 0,
  },

  {
    name: "a Kanban",
    type: "epic",
    progress: 0.5,
    deadline: "2021-02-10",
    list: 2,
    order: 0,
    acIndex: 3,
  },
  {
    name: "Board",
    type: "task",
    progress: 1,
    deadline: "2021-02-10",
    list: 3,
    order: 0,
    acIndex: 1,
  },
];

const lData = [
  {
    id: 0,
    name: "Not Started",
    acIndex: 0,
    nTasks: 0,
  },
  {
    id: 1,
    name: "Next Up",
    acIndex: 1,
    nTasks: 0,
  },
  {
    id: 2,
    name: "In Progress",
    acIndex: 2,
    nTasks: 0,
  },
  {
    id: 3,
    name: "Completed",
    acIndex: 3,
    nTasks: 0,
  },
];

const tStored = JSON.parse(localStorage.getItem("tasksData"));
const lStored = JSON.parse(localStorage.getItem("listsData"));

// #########################
// TASK_MODEL
// #########################
function getTask(id) {
  return Task.allTasks.find((t) => t.id === id);
}

function getList(id) {
  return listsData.find((l) => l.id === id);
}

// Controller
const addNewTask = (list) => {
  // Update Model
  listsData[list].nTasks++;
  const newTask = new Task();
  newTask.list = list;
  newTask.type = "task";
  newTask.order = listsData[list].nTasks;

  // Update View
  newTask.render();

  return newTask;
};

const addNewName = (id, name) => {
  // Update the Model
  const task = getTask(id);
  task.name = name ? name : "new task";

  // Update the view
  task.render();
  task.renderProgress();
};

function updateTask(id, updates) {
  // Update The Model
  const task = getTask(id);

  for (const prop in updates) {
    task[prop] = updates[prop];
  }

  // Update The View
  task.render();
  task.renderProgress();
}

function getPropertyValue(id, prop) {
  const task = getTask(id);
  return task[prop];
}

function decrementOrder(id) {
  const task = getTask(id);
  task.order--;

  if (task.order < 0) {
    console.log("NEGATIVE ORDER");
  }
  task.render();
}

function incrementOrder(id) {
  const task = getTask(id);
  task.order++;
  task.render();
}

function updateModal(id) {
  const task = getTask(id);
  const modalForm = document.querySelector(".task-modal form");

  modalForm.name.value = task.name;
  modalForm.type.value = task.type;
  modalForm.accent.value = task.acIndex;
  modalForm.deadline.value = task.deadline;
}

function renderTasks(tasks) {
  tasks.forEach((task) => {
    task.render();
  });
}

function getForm(id) {
  return listsData.find((t) => t.id === id);
}

function deleteTask(id) {
  const taskToDelete = getTask(id);
  taskToDelete.elem.remove();

  Task.allTasks = Task.allTasks.filter((task) => task.id !== id);
  localStorage.setItem("tasksData", JSON.stringify(Task.allTasks));
}

function updateProgress(id) {
  const task = getTask(id);
  task.progress == 1 ? (task.progress = 0) : (task.progress += 0.25);

  task.elemProgInner.className = `task-prog-green prog-${task.progress * 100}`;

  localStorage.setItem("tasksData", JSON.stringify(Task.allTasks));
}

function moveTaskToNext(id) {
  const task = getTask(id);
  const currentTaskOrder = task.order;
  const currentListID = task.list;
  const nextListID = task.list + 1;

  if (nextListID <= 3) {
    getList(currentListID).nTasks--;
    task.list = nextListID;
    getList(nextListID).nTasks++;
    task.order = getList(nextListID).nTasks - 1;

    reorderCurrentList(currentListID, currentTaskOrder);
    task.render();
  }
}

function reorderCurrentList(listID, taskOrder) {
  // lowering the heigher order of the tasks in the previous list
  const tasks = Task.allTasks.filter(
    (t) => t.list === listID && t.order > taskOrder
  );

  tasks.forEach((task) => {
    task.order--;
    task.render();
  });
}

function moveTaskToPrevious(taskID) {
  const task = getTask(taskID);
  const currentTaskOrder = task.order;
  const currentListID = task.list;
  const nextListID = task.list - 1;

  if (nextListID >= 0) {
    task.list = nextListID;

    getList(currentListID).nTasks--;
    getList(nextListID).nTasks++;
    task.order = getList(nextListID).nTasks - 1;

    reorderCurrentList(currentListID, currentTaskOrder);
    task.render();
  }
}

function getTasksFromList(listID) {
  const tasks = tasks.filter((t) => t.list === listID);
}

function createTasks(tasks) {
  tasks.sort((a, b) => {
    return a.order - b.order;
  });

  tasks.forEach((item) => {
    let { name, type, progress, deadline, list, order, acIndex } = item;
    let task = new Task(name, type, progress, deadline, list, order, acIndex);

    let currentList = getList(list);
    currentList.nTasks++;

    task.render();
    task.renderProgress();
  });
}

function constructLists(data) {
  document.querySelectorAll(".task-list-container").forEach((listElem) => {
    let listID = parseInt(listElem.dataset.listnum);
    let listData = getList(listID);

    listElem.querySelector(".task-list-title").innerHTML = listData.name;
    listElem.setAttribute(
      "style",
      `border-top: 4px solid ${lColors[listData.acIndex]};`
    );
  });
}

const tasksData = tStored ? tStored : tData;
const listsData = lStored ? lStored : lData;
constructLists(listsData);
createTasks(tasksData);
