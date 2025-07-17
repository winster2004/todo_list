import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbiAIBN6Ko0aD-xK4DalqxCIK9xJXtdUg",
  authDomain: "todo-list-6032c.firebaseapp.com",
  projectId: "todo-list-6032c",
  storageBucket: "todo-list-6032c.appspot.com",
  messagingSenderId: "511174999556",
  appId: "1:511174999556:web:2a3766a6cfdd6299323f51",
  measurementId: "G-7Q7M2CM7EC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUser = null;
let editingIndex = null;

// DOM References
const authSection = document.getElementById("authSection");
const todoSection = document.getElementById("todoSection");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const form = document.getElementById("form");

const nameField = document.getElementById("nameField");
const emailField = document.getElementById("emailField");
const passwordField = document.getElementById("passwordField");
const confirmField = document.getElementById("confirmField");
const submitBtn = form.querySelector(".submit-btn");

const taskInput = document.getElementById("taskInput");
const taskPriority = document.getElementById("taskPriority");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const logoutBtn = document.getElementById("logoutBtn");

const editMenu = document.getElementById("editMenu");
const editTaskName = document.getElementById("editTaskName");
const editTaskNotes = document.getElementById("editTaskNotes");
const editTaskCategory = document.getElementById("editTaskCategory");
const editTaskPriority = document.getElementById("editTaskPriority");
const editTaskDueDate = document.getElementById("editTaskDueDate");
const editTaskStatus = document.getElementById("editTaskStatus");
const saveEdit = document.getElementById("saveEdit");
const deleteTask = document.getElementById("deleteTask");
const closeEdit = document.getElementById("closeEdit");

// Login / Signup Toggle
let isLogin = true;

loginBtn.onclick = () => {
  isLogin = true;
  loginBtn.classList.add("active");
  signupBtn.classList.remove("active");
  nameField.style.display = "none";
  confirmField.style.display = "none";
  submitBtn.textContent = "Login";
};

signupBtn.onclick = () => {
  isLogin = false;
  signupBtn.classList.add("active");
  loginBtn.classList.remove("active");
  nameField.style.display = "block";
  confirmField.style.display = "block";
  submitBtn.textContent = "Signup";
};

// Auth Form Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = emailField.value.trim();
  const password = passwordField.value.trim();
  const confirm = confirmField.value.trim();

  try {
    if (isLogin) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      if (password !== confirm) return alert("Passwords do not match!");
      await createUserWithEmailAndPassword(auth, email, password);
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Logout
logoutBtn.onclick = async () => {
  await signOut(auth);
};

// Load Tasks
function loadTasks() {
  const key = currentUser?.uid || "guest";
  const tasks = JSON.parse(localStorage.getItem(key)) || [];
  taskList.innerHTML = "";

  tasks.forEach((task, i) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    li.innerHTML = `
      <span>${task.text}</span>
      <button class="edit-btn" data-index="${i}">⋮</button>
    `;
    li.onclick = () => {
      task.completed = !task.completed;
      localStorage.setItem(key, JSON.stringify(tasks));
      loadTasks();
    };

    const btn = li.querySelector(".edit-btn");
    btn.onclick = (e) => {
      e.stopPropagation();
      editingIndex = i;
      openEditMenu(task);
    };

    taskList.appendChild(li);
  });
}

// Add Task
addTaskButton.onclick = () => {
  const text = taskInput.value.trim();
  const priority = taskPriority.value;
  if (!text) return;

  const key = currentUser?.uid || "guest";
  const tasks = JSON.parse(localStorage.getItem(key)) || [];

  const newTask = {
    text,
    completed: false,
    notes: "",
    category: "",
    priority,
    dueDate: "",
    status: "active"
  };

  tasks.push(newTask);
  localStorage.setItem(key, JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();
};

// Edit Menu Functions
function openEditMenu(task) {
  editTaskName.value = task.text || "";
  editTaskNotes.value = task.notes || "";
  editTaskCategory.value = task.category || "";
  editTaskPriority.value = task.priority || "normal";
  editTaskDueDate.value = task.dueDate || "";
  editTaskStatus.value = task.completed ? "completed" : "active";

  editMenu.classList.remove("hidden");
  editMenu.style.display = "flex";
}

function closeEditMenu() {
  editMenu.classList.add("hidden");
  editMenu.style.display = "none";
  editingIndex = null;
}

saveEdit.onclick = () => {
  const key = currentUser?.uid || "guest";
  const tasks = JSON.parse(localStorage.getItem(key)) || [];

  if (editingIndex !== null) {
    const t = tasks[editingIndex];
    t.text = editTaskName.value.trim();
    t.notes = editTaskNotes.value;
    t.category = editTaskCategory.value;
    t.priority = editTaskPriority.value;
    t.dueDate = editTaskDueDate.value;
    t.completed = editTaskStatus.value === "completed";
    localStorage.setItem(key, JSON.stringify(tasks));
    loadTasks();
    closeEditMenu();
  }
};

deleteTask.onclick = () => {
  const key = currentUser?.uid || "guest";
  const tasks = JSON.parse(localStorage.getItem(key)) || [];
  if (editingIndex !== null) {
    tasks.splice(editingIndex, 1);
    localStorage.setItem(key, JSON.stringify(tasks));
    loadTasks();
    closeEditMenu();
  }
};

closeEdit.onclick = closeEditMenu;

// Auth State Change
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (user) {
    authSection.style.display = "none";
    todoSection.style.display = "block";
    loadTasks();
  } else {
    authSection.style.display = "block";
    todoSection.style.display = "none";
  }
});




