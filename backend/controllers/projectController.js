import Project from "../models/Project.js";

// CREATE a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: "Fill all details" });
    }

    const newProject = new Project({
      name,
      description,
      UploadedBy: req.user._id,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Create Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET all projects (for student)
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("UploadedBy", "name email");
    res.status(200).json(projects);
  } catch (error) {
    console.error("Fetch Projects Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET projects by professor (for their dashboard)
export const getProfessorProjects = async (req, res) => {
  try {
    const projects = await Project.find({ UploadedBy: req.user._id });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Fetch Professor Projects Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// GET single project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("UploadedBy", "name email");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    console.error("Get Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE a project
export const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProject) return res.status(404).json({ message: "Project not found" });
    if (
      req.user.role === "professor" &&
      updatedProject.UploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "You are not authorized" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Update Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateProjectByProfessor = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    
    if (project.UploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const { name, description } = req.body;

    if (name) project.name = name;
    if (description) project.description = description;

    await project.save();
    res.status(200).json({ message: "Project updated", project });
  } catch (err) {
    console.error("Professor Project Update Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("Delete Project Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteProjectByProfessor = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    
    if (project.UploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await project.remove();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Professor Project Delete Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

