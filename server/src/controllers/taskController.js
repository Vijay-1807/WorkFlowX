const Task = require('../models/Task');
const Project = require('../models/Project');

// GET /api/tasks/project/:projectId
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { search, priority, status } = req.query;

    let query = { projectId };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (priority && priority !== 'ALL') {
      query.priority = priority;
    }
    if (status && status !== 'ALL') {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate('assigneeId', 'id name')
      .sort({ createdAt: -1 })
      .lean();

    const formattedTasks = tasks.map(t => ({
      ...t,
      id: t._id,
      assignee: t.assigneeId
    }));

    res.json(formattedTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, projectId, assigneeId, dueDate, reminder } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and Project ID are required' });
    }

    if (title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` });
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = new Task({
      title: title.trim(),
      description: description?.trim() || null,
      status: status || 'TODO',
      priority: priority || 'MEDIUM',
      projectId,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate ? new Date(dueDate) : null,
      reminder: reminder || false
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id).populate('assigneeId', 'id name').lean();
    
    res.status(201).json({
      ...populatedTask,
      id: populatedTask._id,
      assignee: populatedTask.assigneeId
    });
  } catch (error) {
    console.error('Create Task Error:', error.message);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assigneeId, priority, dueDate, reminder } = req.body;

    // Check task exists
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Validate enums if provided
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` });
    }
    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description?.trim() || null;
    if (status !== undefined) task.status = status;
    if (assigneeId !== undefined) task.assigneeId = assigneeId || undefined;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (reminder !== undefined) task.reminder = reminder;

    await task.save();

    const populatedTask = await Task.findById(task._id).populate('assigneeId', 'id name').lean();
    
    res.json({
      ...populatedTask,
      id: populatedTask._id,
      assignee: populatedTask.assigneeId
    });
  } catch (error) {
    console.error('Update Task Error:', error.message);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST /api/tasks/:id/attachment
const uploadAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    task.attachmentUrl = req.file.path;
    task.attachmentName = req.file.originalname;
    
    await task.save();

    const populatedTask = await Task.findById(task._id).populate('assigneeId', 'id name').lean();
    res.json({
      ...populatedTask,
      id: populatedTask._id,
      assignee: populatedTask.assigneeId
    });
  } catch (error) {
    console.error('Attachment Error:', error.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  uploadAttachment
};
