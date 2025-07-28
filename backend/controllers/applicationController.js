import Application from "../models/Application.js";
import Project from "../models/Project.js";


export const createApplication = async (req, res) => {
  try {
    const { projectId } = req.body;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    
    const alreadyApplied = await Application.findOne({
      studentId: req.user._id,
      projectId: projectId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this project" });
    }

    const newApplication = new Application({
      studentId: req.user._id,
      projectId: projectId,
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (error) {
    console.error("Error creating application:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getApplicationsByStudent = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate("projectId", "name description UploadedBy")
      .populate("studentId", "name email");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching student applications:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getApplicationsByProfessor = async (req, res) => {
  try {
    const professorId = req.user._id;

    
    const projects = await Project.find({ UploadedBy: professorId }).select("_id");
    console.log("Professor Projects:", projects);

    const projectIds = projects.map((p) => p._id);
  

    const applications = await Application.find({ projectId: { $in: projectIds } })
      .populate("projectId", "name")
      .populate("studentId", "name email");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching professor applications:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "name email")
      .populate("projectId", "name description");

    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching all applications:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateApplicationByAdmin = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { studentId, projectId } = req.body;

    const updatedApp = await Application.findByIdAndUpdate(
      applicationId,
      {  student: studentId, project: projectId },
      { new: true }
    ).populate("student", "name email").populate("project", "name");

    if (!updatedApp) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json(updatedApp);
  } catch (err) {
    console.error("Error updating application:", err);
    res.status(500).json({ message: "Server Error" });
  }
};



export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.deleteOne();

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error while deleting application" });
  }
};
