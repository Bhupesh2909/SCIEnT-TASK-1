import express from "express";
import {
  createProject,
  getAllProjects,
  getProfessorProjects,
  getProjectById,
  updateProject,
  updateProjectByProfessor,
  deleteProject,
  deleteProjectByProfessor
} from "../controllers/projectController.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllProjects);

router.post("/", protect, restrictTo("professor", "admin"), createProject);
router.get("/my-projects", protect, restrictTo("professor"), getProfessorProjects);
router.get("/:id", protect, getProjectById);


router.put("/:id", protect, restrictTo("admin"), updateProject);
router.delete("/:id", protect, restrictTo("admin"), deleteProject);

export default router;
