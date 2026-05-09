const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('id name email role createdAt').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ...user, id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// PUT /api/users/me
const updateMe = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name) user.name = name;
    if (email) {
      // Check if new email is used
      if (email !== user.email) {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email is already in use' });
      }
      user.email = email;
    }

    // Password change logic
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new one' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET /api/users/my-tasks
const getMyTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    let projectIds;
    if (isAdmin) {
      const allProjects = await Project.find().select('_id');
      projectIds = allProjects.map(p => p._id);
    } else {
      const userProjects = await Project.find({ ownerId: userId }).select('_id');
      projectIds = userProjects.map(p => p._id);
    }

    const tasks = await Task.find({ projectId: { $in: projectIds } })
      .populate('projectId', 'id name')
      .sort({ status: 1, createdAt: -1 })
      .lean();

    const formattedTasks = tasks.map(t => ({
      ...t,
      id: t._id,
      project: t.projectId
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET /api/users/analytics
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    let projects;
    if (isAdmin) {
      projects = await Project.find().lean();
    } else {
      projects = await Project.find({ ownerId: userId }).lean();
    }

    const projectIds = projects.map(p => p._id);
    const tasks = await Task.find({ projectId: { $in: projectIds } }).lean();

    const projectStatusCounts = {
      PLANNED: projects.filter(p => p.status === 'PLANNED').length,
      ACTIVE: projects.filter(p => p.status === 'ACTIVE').length,
      COMPLETED: projects.filter(p => p.status === 'COMPLETED').length,
    };

    const taskStatusCounts = {
      TODO: tasks.filter(t => t.status === 'TODO').length,
      IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      DONE: tasks.filter(t => t.status === 'DONE').length,
    };

    const taskPriorityCounts = {
      LOW: tasks.filter(t => t.priority === 'LOW').length,
      MEDIUM: tasks.filter(t => t.priority === 'MEDIUM').length,
      HIGH: tasks.filter(t => t.priority === 'HIGH').length,
    };

    // Tasks due in the next 7 days
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    const upcomingTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) >= now && new Date(t.dueDate) <= nextWeek);
    const overdueTasksCount = tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== 'DONE').length;

    res.json({
      totalProjects: projects.length,
      totalTasks: tasks.length,
      completedTasks: taskStatusCounts.DONE,
      upcomingTasksCount: upcomingTasks.length,
      overdueTasksCount,
      projectStatusCounts,
      taskStatusCounts,
      taskPriorityCounts,
      isAdmin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('id name email role').lean();
    res.json(users.map(u => ({ ...u, id: u._id })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// GET /api/users/calendar-tasks
const getCalendarTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    let projectIds;
    if (isAdmin) {
      const allProjects = await Project.find().select('_id');
      projectIds = allProjects.map(p => p._id);
    } else {
      const userProjects = await Project.find({ ownerId: userId }).select('_id');
      projectIds = userProjects.map(p => p._id);
    }

    const tasks = await Task.find({
      projectId: { $in: projectIds },
      dueDate: { $ne: null }
    })
      .populate('projectId', 'id name')
      .sort({ dueDate: 1 })
      .lean();

    res.json(tasks.map(t => ({ ...t, id: t._id, project: t.projectId })));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { getMe, updateMe, getUsers, getMyTasks, getAnalytics, getCalendarTasks };
