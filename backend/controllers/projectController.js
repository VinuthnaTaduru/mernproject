const Project = require("../models/project");
exports.createProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, members } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description required" });
    }

    const project = await Project.create({
      title,
      description,
      startDate,
      endDate,
      status,
      members,
    });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getProjects = async (req, res) => {
  const projects = await Project.find().populate("members");
  res.json(projects);
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    res.json({ msg: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignMembers = async (req, res) => {
  try {
    const { members } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { members },
      { new: true }
    ).populate("members");

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};