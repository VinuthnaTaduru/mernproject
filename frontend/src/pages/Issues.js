import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Link } from "react-router-dom";

export default function Issues() {
  const [issues, setIssues] = useState([]);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const role = localStorage.getItem("role");

  const fetchIssues = async () => {
    const res = await api.get("/issues", {
      params: {
        status: status || undefined,
        priority: priority || undefined,
        search: search || undefined,
      },
    });

    setIssues(res.data);
  };

  useEffect(() => {
    fetchIssues();
  }, [status, priority, search]);

  const deleteIssue = async (id) => {
    try {
      await api.delete(`/issues/${id}`);
      fetchIssues();
    } catch {
      alert("Error deleting issue");
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Issues</h2>

      <div className="card">
        <Link to="/dashboard">⬅ Back</Link>{" "}
        {role === "manager" && <Link to="/add-issue">➕ Add Issue</Link>}
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: "10px" }}>
          <select onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select onChange={(e) => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {issues.length === 0 ? (
        <p style={{ textAlign: "center" }}>No issues found</p>
      ) : (
        issues.map((i) => (
          <div className="card" key={i._id}>
            <h3>{i.title}</h3>
            <p>{i.description}</p>

            <p><b>Status:</b> {i.status}</p>

            <p>
              <b>Priority:</b>{" "}
              <span style={{
                color:
                  i.priority === "high"
                    ? "red"
                    : i.priority === "medium"
                    ? "orange"
                    : "green",
                fontWeight: "bold"
              }}>
                {i.priority}
              </span>
            </p>

            {i.project && <p><b>Project:</b> {i.project.title}</p>}

            {role === "manager" && (
              <button onClick={() => deleteIssue(i._id)}>
                Delete
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}