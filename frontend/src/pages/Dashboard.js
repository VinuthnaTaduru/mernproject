import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/dashboard/stats").then(res => setStats(res.data));
  }, []);

  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>
        Dashboard ({stats?.role || "loading..."})
      </h2>

      <div className="card" style={{ textAlign: "center" }}>
        <button onClick={logout} style={{ background: "crimson" }}>
          Logout
        </button>
      </div>

      {stats?.role === "manager" && (
        <div className="card">
          <h3>Manager Overview</h3>
          <p>Total Projects: {stats.totalProjects}</p>
          <p>Total Issues: {stats.totalIssues}</p>
          <p>Pending Issues: {stats.pending}</p>
          <p>Completed Issues: {stats.completed}</p>
          <p>Overdue Tasks: {stats.overdue}</p>
        </div>
      )}

      {stats?.role === "member" && (
        <div className="card">
          <h3>My Tasks Overview</h3>
          <p>Total Assigned: {stats.totalAssigned}</p>
          <p>In Progress: {stats.inProgress}</p>
          <p>Completed: {stats.completed}</p>
          <p>Upcoming Deadlines: {stats.upcomingDeadlines}</p>
        </div>
      )}

      <div className="card">
        <h3>Navigation</h3>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {stats?.role === "manager" && (
            <>
              <Link to="/projects">📁 Projects</Link>
              <Link to="/add-project">➕ Add Project</Link>
              <Link to="/add-issue">➕ Add Issue</Link>
            </>
          )}

          <Link to="/issues">🐞 Issues</Link>
        </div>
      </div>
    </div>
  );
}