// web/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { fetchTasks, createTask, deleteTask, updateTask } from "../api/tasksApi";
import CreateTaskForm from "../components/CreateTaskForm";
import EditTaskModal from "../components/EditTaskModal";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // modal state
  const [editingTask, setEditingTask] = useState(null);

  async function load() {
    try {
      setError("");
      setLoading(true);

      const data = await fetchTasks();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreateTask(data) {
    await createTask(data);
    await load();
  }

  async function handleDeleteTask(id) {
    await deleteTask(id);
    await load();
  }

  async function handleUpdateTask(id, data) {
    await updateTask(id, data);
    await load();
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p style={{ color: "#666" }}>
        You are logged in. Below are your tasks fetched from the backend.
      </p>

      {/* CREATE TASK FORM */}
      <CreateTaskForm onCreate={handleCreateTask} />

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <div style={{ marginTop: 20 }}>
          <h2 style={{ marginBottom: 10 }}>Tasks ({tasks.length})</h2>

          {tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            <ul style={{ paddingLeft: 18 }}>
              {tasks.map((t) => (
                <li key={t._id} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 600 }}>
                    {t.title || "Untitled task"}
                  </div>

                  {t.description && (
                    <div style={{ color: "#555" }}>{t.description}</div>
                  )}

                  <div style={{ fontSize: 12, color: "#777" }}>
                    Priority: <b>{t.priority}</b>
                  </div>

                  <div style={{ fontSize: 12, color: "#777" }}>
                    Status: <b>{t.status}</b>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => handleDeleteTask(t._id)}>
                      Delete
                    </button>

                    <button
                      onClick={() => setEditingTask(t)}
                      style={{ marginLeft: 8 }}
                    >
                      Update
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* EDIT MODAL */}
      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />
    </div>
  );
}
