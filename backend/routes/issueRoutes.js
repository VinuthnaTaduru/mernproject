const router = require("express").Router();

const {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue,
  addComment,
} = require("../controllers/issueController");

const { verifyToken } = require("../middleware/auth");

// create
router.post("/", verifyToken, createIssue);

// get
router.get("/", verifyToken, getIssues);

// update status
router.put("/:id", verifyToken, updateIssue);

// delete
router.delete("/:id", verifyToken, deleteIssue);

router.post("/:id/comment", verifyToken, addComment);

module.exports = router;