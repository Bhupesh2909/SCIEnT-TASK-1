import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProfessorDashboard.css";
import { useNavigate } from "react-router-dom";

const ProfessorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editedProject, setEditedProject] = useState({});

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyProjects();
    fetchMyApplications();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/projects/my-projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err.message);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/applications/professor`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyProjects();
    } catch (err) {
      console.error("Error deleting project:", err.message);
    }
  };

  const startEditing = (project) => {
    setEditingProjectId(project._id);
    setEditedProject({ name: project.name, description: project.description });
  };

  const cancelEditing = () => {
    setEditingProjectId(null);
    setEditedProject({});
  };

  const handleEditChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  const saveProject = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/projects/${id}`, editedProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingProjectId(null);
      setEditedProject({});
      fetchMyProjects();
    } catch (err) {
      console.error("Error updating project:", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="professor-dashboard-container">
      <h2>Professor Dashboard</h2>

      <div className="btn-group">
        <button className="create-btn" onClick={() => navigate("/professor/upload")}>
          Create New Project
        </button>
        <button onClick={() => navigate(`/profile/${userId}`)}>Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <section>
        <h3>My Projects</h3>
        {projects.length === 0 ? (
          <p>No projects uploaded yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="professor-card">
              {editingProjectId === project._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editedProject.name}
                    onChange={handleEditChange}
                  />
                  <textarea
                    name="description"
                    value={editedProject.description}
                    onChange={handleEditChange}
                  />
                  <button onClick={() => saveProject(project._id)}>Save</button>
                  <button onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                  <button onClick={() => startEditing(project)}>Edit</button>
                  <button onClick={() => deleteProject(project._id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </section>

      <section>
        <h3>Applications to My Projects</h3>
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="professor-card">
              <p><strong>Student:</strong> {app.studentId?.name}</p>
              <p><strong>Email:</strong> {app.studentId?.email}</p>
              <p><strong>Project:</strong> {app.projectId?.name}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ProfessorDashboard;
