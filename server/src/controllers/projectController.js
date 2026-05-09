const Project = require('../models/Project');
const Task = require('../models/Task');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const whereClause = req.user.role === 'ADMIN' ? {} : { ownerId: req.user.userId };
    
    const projects = await Project.find(whereClause)
      .populate('ownerId', 'id name email')
      .sort({ createdAt: -1 })
      .lean();

    const formattedProjects = await Promise.all(projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ projectId: p._id });
      return {
        ...p,
        id: p._id,
        owner: p.ownerId,
        _count: { tasks: taskCount }
      };
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = new Project({
      name,
      description,
      status: status || 'PLANNED',
      ownerId: req.user.userId,
    });
    
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role !== 'ADMIN' && project.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;

    await project.save();

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (req.user.role !== 'ADMIN' && project.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(id);
    // Cascade delete tasks
    await Task.deleteMany({ projectId: id });

    res.json({ message: 'Project removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject
};
