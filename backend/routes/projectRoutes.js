const router = require("express").Router();

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
  assignMembers
} = require("../controllers/projectController");

const { verifyToken } = require("../middleware/auth");
const { allowRoles } = require("../middleware/role");

// CREATE
router.post("/", verifyToken, allowRoles("manager"), createProject);

// READ
router.get("/", verifyToken, getProjects);

// UPDATE
router.put("/:id", verifyToken, allowRoles("manager"), updateProject);

// DELETE
router.delete("/:id", verifyToken, allowRoles("manager"), deleteProject);

// ASSIGN MEMBERS
router.put("/:id/assign", verifyToken, allowRoles("manager"), assignMembers);

module.exports = router;