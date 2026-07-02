// ==========================
// TaskFlow Pro - script.js
// Part 1
// ==========================

const modal = document.getElementById("taskModal");
const newTaskBtn = document.getElementById("newTaskBtn");
const closeModal = document.getElementById("closeModal");
const taskForm = document.getElementById("taskForm");
const taskContainer = document.getElementById("taskContainer");

let tasks = [];
let editIndex = -1;

// Open Modal
newTaskBtn.addEventListener("click", () => {
    taskForm.reset();
    editIndex = -1;
    modal.style.display = "flex";
});

// Close Modal
closeModal.addEventListener("click", () => {
    modal.style.display = "flex";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "flex";
    }
});

// Add / Update Task
taskForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const priority = document.getElementById("taskPriority").value;
    const date = document.getElementById("taskDate").value;

    if (title === "") {
        alert("Task title is required.");
        return;
    }

    const task = {
        title,
        description,
        priority,
        date,
        completed: false
    };

    if (editIndex === -1) {
        tasks.push(task);
    } else {
        task.completed = tasks[editIndex].completed;
        tasks[editIndex] = task;
    }

    modal.style.display = "none";

    renderTasks();

});

// Render Tasks

function renderTasks() {

    taskContainer.innerHTML = "";

    tasks.forEach((task, index) => {

        const card = document.createElement("div");
        card.className = "task-card";

        if (task.completed)
            card.classList.add("completed");

        card.innerHTML = `

        <h3>${task.title}</h3>

        <p>${task.description}</p>

        <span class="priority ${task.priority.toLowerCase()}">
            ${task.priority}
        </span>

        <p>📅 ${task.date || "No Due Date"}</p>

        <div class="actions">

            <button onclick="toggleComplete(${index})">

                ${task.completed ? "Undo" : "Complete"}

            </button>

            <button onclick="editTask(${index})">

                Edit

            </button>

            <button onclick="deleteTask(${index})">

                Delete

            </button>

        </div>

        `;

        taskContainer.appendChild(card);

    });

}

// Complete Task

function toggleComplete(index) {

    tasks[index].completed = !tasks[index].completed;

    renderTasks();

}

// Delete Task

function deleteTask(index) {

    if (confirm("Delete this task?")) {

        tasks.splice(index, 1);

        renderTasks();

    }

}

// Edit Task

function editTask(index) {

    editIndex = index;

    document.getElementById("taskTitle").value =
        tasks[index].title;

    document.getElementById("taskDescription").value =
        tasks[index].description;

    document.getElementById("taskPriority").value =
        tasks[index].priority;

    document.getElementById("taskDate").value =
        tasks[index].date;

    modal.style.display = "flex";

}
// ==========================
// TaskFlow Pro - script.js
// Part 2
// ==========================

// Load tasks from Local Storage
if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    renderTasks();
}

const searchInput = document.getElementById("search");
const filters = document.querySelectorAll(".filter");
const darkModeBtn = document.getElementById("darkMode");

let currentFilter = "all";

// ---------- Save ----------

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ---------- Statistics ----------

function updateStats() {

    document.getElementById("totalTasks").textContent = tasks.length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;

}

// ---------- Override Render ----------

const oldRender = renderTasks;

renderTasks = function () {

    taskContainer.innerHTML = "";

    let filtered = [...tasks];

    // Search

    const keyword = searchInput.value.toLowerCase();

    if (keyword !== "") {

        filtered = filtered.filter(task =>

            task.title.toLowerCase().includes(keyword) ||

            task.description.toLowerCase().includes(keyword)

        );

    }

    // Filter

    if (currentFilter === "completed") {

        filtered = filtered.filter(task => task.completed);

    }

    else if (currentFilter === "pending") {

        filtered = filtered.filter(task => !task.completed);

    }

    else if (currentFilter === "high") {

        filtered = filtered.filter(task => task.priority === "High");

    }

    else if (currentFilter === "medium") {

        filtered = filtered.filter(task => task.priority === "Medium");

    }

    else if (currentFilter === "low") {

        filtered = filtered.filter(task => task.priority === "Low");

    }

    filtered.forEach((task) => {

        const index = tasks.indexOf(task);

        const card = document.createElement("div");

        card.className = "task-card";

        if (task.completed)
            card.classList.add("completed");

        card.innerHTML = `

        <h3>${task.title}</h3>

        <p>${task.description}</p>

        <span class="priority ${task.priority.toLowerCase()}">
        ${task.priority}
        </span>

        <p>📅 ${task.date || "No Due Date"}</p>

        <div class="actions">

        <button onclick="toggleComplete(${index})">

        ${task.completed ? "Undo" : "Complete"}

        </button>

        <button onclick="editTask(${index})">

        Edit

        </button>

        <button onclick="deleteTask(${index})">

        Delete

        </button>

        </div>

        `;

        taskContainer.appendChild(card);

    });

    updateStats();

    saveTasks();

};

// ---------- Search ----------

searchInput.addEventListener("keyup", renderTasks);

// ---------- Filters ----------

filters.forEach(btn => {

    btn.addEventListener("click", () => {

        filters.forEach(x => x.classList.remove("active"));

        btn.classList.add("active");

        currentFilter = btn.dataset.filter;

        renderTasks();

    });

});

// ---------- Dark Mode ----------

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

    darkModeBtn.innerHTML = "☀";

}

darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        darkModeBtn.innerHTML = "☀";

    }

    else {

        localStorage.setItem("theme", "light");

        darkModeBtn.innerHTML = "🌙";

    }

});

// ---------- Override Actions ----------

const oldDelete = deleteTask;

deleteTask = function(index){

    if(confirm("Delete this task?")){

        tasks.splice(index,1);

        renderTasks();

    }

}

const oldToggle = toggleComplete;

toggleComplete = function(index){

    tasks[index].completed = !tasks[index].completed;

    renderTasks();

}

const oldEdit = editTask;

editTask = function(index){

    editIndex = index;

    document.getElementById("taskTitle").value = tasks[index].title;

    document.getElementById("taskDescription").value = tasks[index].description;

    document.getElementById("taskPriority").value = tasks[index].priority;

    document.getElementById("taskDate").value = tasks[index].date;

    modal.style.display = "flex";

}

// Initial Load

renderTasks();