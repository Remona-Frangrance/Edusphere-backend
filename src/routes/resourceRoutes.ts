import express from "express";
import {
  createResource,
  getResourcesBySubject,
  updateResource,
  deleteResource,
  getAllResources,
} from "../controllers/resourceController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

// Resource routes
router.post("/", createResource);
router.get("/", getAllResources);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);
  
// Move subject-specific routes to a clear path
router.get("/:subjectId", protect, getResourcesBySubject);

export default router;
