const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, uploadAttachment } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../lib/cloudinary');

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTask);

// GET tasks for a specific project
router.route('/project/:projectId')
  .get(getTasks);

// UPDATE and DELETE specific task by id
router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

// POST attachment
router.route('/:id/attachment')
  .post(upload.single('file'), uploadAttachment);

module.exports = router;
