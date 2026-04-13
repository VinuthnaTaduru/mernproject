import { useEffect, useState } from "react";
import api from "../utils/axiosConfig";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get("/projects").then(res => setProjects(res.data));
  }, []);

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`);
    setProjects(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: "center" }}>Projects</h2>

      <div className="card">
        <Link to="/add-project">➕ Add Project</Link>
      </div>

      {projects.map((p) => (
        <div className="card" key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>

          <p><b>Status:</b> {p.status}</p>
          <p><b>Start:</b> {p.startDate?.slice(0,10)}</p>
          <p><b>End:</b> {p.endDate?.slice(0,10)}</p>

          <p>
            <b>Members:</b>{" "}
            {p.members?.map(m => m.name).join(", ")}
          </p>

          <button onClick={() => deleteProject(p._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}