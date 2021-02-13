const tasksData = [
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
    progress: 0.7,
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

// #########################
// TASK_MODEL
// #########################
function getTask(id) {
  return Task.allTasks.find((t) => t.id === id);
}

// Controller
const addNewTask = (list) => {
  // Update Model
  lists[list].nTasks++;
  const newTask = new Task();
  newTask.list = list;
  newTask.type = "task";
  newTask.order = lists[list].nTasks;

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
  task.render();
}

function incrementOrder(id) {
  const task = getTask(id);
  task.order++;
  task.render();
}

function updateModal(id) {
  const task = getTask(id);
  modalContainer.querySelector(".modal-title").innerHTML = task.name;
  const modalForm = modalContainer.querySelector(".task-modal form");

  modalForm.name.value = task.name;
  modalForm.type.value = task.type;
  modalForm.accent.value = task.acIndex;
  modalForm.deadline.value = task.deadline;
  modalForm.progress.value = task.progress * 100;
}

function renderTasks(tasks) {
  tasks.forEach((task) => {
    task.render();
  });
}

function createTasks(tasksData) {
  tasksData.forEach((item) => {
    let { name, type, progress, deadline, list, order, acIndex } = item;
    let task = new Task(name, type, progress, deadline, list, order, acIndex);

    task.render();
    task.renderProgress();
  });
}

createTasks(tasksData);

function getForm(id) {
  return lists.find((t) => t.id === id);
}
