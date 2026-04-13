const Issue = require("../models/issue");

// CREATE ISSUE
exports.createIssue = async (req, res) => {
  try {
    const issue = await Issue.create(req.body);
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ISSUES (ROLE BASED)

exports.getIssues = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id: userId, role } = user;

    let filter = {};

    
    if (role === "member") {
      filter.assignedTo = userId;
    }

    //filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.project) filter.project = req.query.project;

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    const issues = await Issue.find(filter)
      .populate("project")
      .populate("assignedTo");

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE ISSUE

exports.updateIssue = async (req, res) => {
  try {
    const user = req.user;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // member restriction
    if (user.role === "member") {
      if (issue.assignedTo?.toString() !== user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }
    }

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE ISSUE (manager only)

exports.deleteIssue = async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== "manager") {
      return res.status(403).json({ message: "Only manager can delete issues" });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD COMMENT (TEAM MEMBER)
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // only assigned user OR manager can comment
    if (
      req.user.role === "member" &&
      issue.assignedTo?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    issue.comments.push({
      text,
      createdBy: req.user.id,
    });

    await issue.save();

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (req.user.role === "member") {
      if (issue.assignedTo?.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not allowed" });
      }

      const allowedUpdates = {
        status: req.body.status,
      };

      const updated = await Issue.findByIdAndUpdate(
        req.params.id,
        allowedUpdates,
        { new: true }
      );

      return res.json(updated);
    }

    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};