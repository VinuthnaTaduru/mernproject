import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import Issues from "./pages/Issues";
import AddIssue from "./pages/AddIssue";

const getRole = () => localStorage.getItem("role");

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = getRole();

  if (!role) return <Navigate to="/" />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/projects"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <Projects />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-project"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <AddProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute allowedRoles={["manager", "member"]}>
              <Issues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-issue"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <AddIssue />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;