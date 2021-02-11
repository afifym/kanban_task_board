function getTask(id) {
  return Task.allTasks.find((t) => t.id === id);
}

// Controller
const addNewTask = (list) => {
  // Update Model
  const newTask = new Task();
  newTask.list = list;

  // Update View
  newTask.render();

  return newTask;
};

// controller
const addNewName = (id, name) => {
  // Update the Model
  const task = getTask(id);
  task.name = name ? name : "New task";

  // Update the view
  task.render();
  task.renderProgress();
};

// Controller
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
