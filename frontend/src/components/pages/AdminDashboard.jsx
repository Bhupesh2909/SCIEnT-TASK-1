import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingAppId, setEditingAppId] = useState(null);
  const [editedProject, setEditedProject] = useState({ title: "", description: "" });
  const [editedApplication, setEditedApplication] = useState({ status: "" });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, projectRes, appRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/applications", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setUsers(userRes.data);
      setProjects(projectRes.data);
      setApplications(appRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  // ---------------------- DELETE HANDLERS ----------------------

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Delete User Error:", err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Delete Project Error:", err);
    }
  };

  const handleDeleteApplication = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error("Delete Application Error:", err);
    }
  };

  // ---------------------- UPDATE HANDLERS ----------------------

  const handleEditProject = (proj) => {
    setEditingProjectId(proj._id);
    setEditedProject({ title: proj.name, description: proj.description });
  };

  const handleUpdateProject = async (e, id) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, editedProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProjectId(null);
      fetchData();
    } catch (err) {
      console.error("Update Project Error:", err);
    }
  };

  const handleEditApplication = (app) => {
    setEditingAppId(app._id);
    setEditedApplication({ status: app.status || "" });
  };

  const handleUpdateApplication = async (e, id) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/applications/${id}`, editedApplication, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingAppId(null);
      fetchData();
    } catch (err) {
      console.error("Update Application Error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <button className="create-project-btn" onClick={() => navigate("/admin/create-project")}>
        Create New Project
      </button>
      <button onClick={handleLogout}>Logout</button>

      {/* Users */}
      <div className="admin-section">
        <h3>All Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} ({user.email}) - {user.role}
              <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Projects */}
      <div className="admin-section">
        <h3>All Projects</h3>
        {projects.map((proj) => (
          <div key={proj._id} className="admin-project-card">
            {editingProjectId === proj._id ? (
              <form onSubmit={(e) => handleUpdateProject(e, proj._id)}>
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                  placeholder="Name"
                />
                <textarea
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  placeholder="Description"
                />
                <button type="submit">Save</button>
                <button onClick={() => setEditingProjectId(null)}>Cancel</button>
              </form>
            ) : (
              <>
                <h4>{proj.name}</h4>
                <p>{proj.description}</p>
                <p>Uploaded by: {proj?.UploadedBy?.name || "Unknown"}</p>
                <button onClick={() => handleEditProject(proj)}>Edit</button>
                <button onClick={() => handleDeleteProject(proj._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Applications */}
      <div className="admin-section">
        <h3>All Applications</h3>
        <ul>
          {applications.map((app) => (
            <li key={app._id}>
              {editingAppId === app._id ? (
                <form onSubmit={(e) => handleUpdateApplication(e, app._id)}>
                  <input
                    type="text"
                    value={editedApplication.status}
                    onChange={(e) => setEditedApplication({ ...editedApplication, status: e.target.value })}
                    placeholder="Status"
                  />
                  <button type="submit">Save</button>
                  <button onClick={() => setEditingAppId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  Student: {app?.studentId?.name || "Unknown"} | Project: {app?.projectId?.name || "Unknown"}
                  <button onClick={() => handleEditApplication(app)}>Edit</button>
                  <button onClick={() => handleDeleteApplication(app._id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
