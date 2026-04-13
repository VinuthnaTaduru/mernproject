const Project = require("../models/project");
const Issue = require("../models/issue");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    //manager dashboard
    if (role === "manager") {
      const totalProjects = await Project.countDocuments();
      const totalIssues = await Issue.countDocuments();

      const pending = await Issue.countDocuments({ status: "pending" });
      const completed = await Issue.countDocuments({ status: "completed" });

      const overdue = await Issue.countDocuments({
        dueDate: { $lt: new Date() },
        status: { $ne: "completed" },
      });

      return res.json({
        role,
        totalProjects,
        totalIssues,
        pending,
        completed,
        overdue,
      });
    }
//member dashboard
    const totalAssigned = await Issue.countDocuments({ assignedTo: userId });
    const inProgress = await Issue.countDocuments({
      assignedTo: userId,
      status: "in-progress",
    });

    const completed = await Issue.countDocuments({
      assignedTo: userId,
      status: "completed",
    });

    const upcomingDeadlines = await Issue.countDocuments({
      assignedTo: userId,
      dueDate: { $gte: new Date() },
      status: { $ne: "completed" },
    });

    return res.json({
      role,
      totalAssigned,
      inProgress,
      completed,
      upcomingDeadlines,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};