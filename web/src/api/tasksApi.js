const BASE_URL = "http://127.0.0.1:4000";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch tasks");
  }

  return res.json();
}

export async function createTask(payload) {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create task");
  }

  return res.json();
}
export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete task");
  }

  return res.json();
}
export async function updateTask(id, payload) {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update task");
  }

  return res.json();
}