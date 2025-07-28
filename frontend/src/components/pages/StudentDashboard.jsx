import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StudentDashboard.css";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [appliedProjects, setAppliedProjects] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchApplications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/applications/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         const appliedIds = res.data.map(app =>
          typeof app.projectId === 'string' ? app.projectId : app.projectId._id
        );
        console.log(appliedIds);
        setAppliedProjects(appliedIds);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchProjects();
    fetchApplications();
  }, [token]);

  const handleApply = async (projectId) => {
    try {
      await axios.post("http://localhost:5000/api/applications", {
        projectId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppliedProjects(prev => [...prev, projectId]);
    } catch (error) {
      console.error("Application failed:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="student-dashboard">
      <h1>Available Projects</h1>
      <button onClick={() => navigate(`/profile/${userId}`)}>Profile</button>
      <button onClick={handleLogout}>Logout</button>
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p>No projects available.</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Uploaded By:</strong> {project.UploadedBy?.name || "Unknown"}</p>
              <button
                disabled={appliedProjects.includes(project._id)}
                onClick={() => handleApply(project._id)}
              >
                {appliedProjects.includes(project._id) ? "Applied" : "Apply"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
