import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const nav = useNavigate();

  // load projects
  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
  }, []);

  // load users
  useEffect(() => {
    api.get("/auth/users").then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/issues", {
        title,
        description,
        priority,
        status,
        dueDate,
        project,
        assignedTo,
      });

      nav("/issues");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Error creating issue");
    }
  };

  return (
    <div className="container">
      <h2>Add Issue</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        <input
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select value={project} onChange={(e) => setProject(e.target.value)} required>
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Assign To</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button type="submit">Create Issue</button>
      </form>
    </div>
  );
}