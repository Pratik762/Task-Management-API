const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('./auth');

router.get('/', auth.verifyToken, async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  res.send(tasks);
});

// for creating all task 
router.post('/' ,auth.verifyToken , async (req , res)=>{
    const {title , description , dueDate } = req.body;
    const task = new Task({title , description , dueDate , assignedTo : req.user._id})
    try{
        await task.save();
        res.status(201).send({message : 'Task created successfully'})   
    }
    catch(err){
        res.status(400).send({message : 'Error creating task'})
    }
});

router.get('/:id', auth.verifyToken, async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send(task);
  });
  
  router.put('/:id', auth.verifyToken, async (req, res) => {
    const id = req.params.id;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    const { title, description, dueDate } = req.body;
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    try {
      await task.save();
      res.send({ message: 'Task updated successfully' });
    } catch (err) {
      res.status(400).send({ message: 'Error updating task' });
    }
  });
  
  router.delete('/:id', auth.verifyToken, async (req, res) => {
    const id = req.params.id;
    const task = await Task.findByIdAndRemove(id);
    if (!task) {
      return res.status(404).send({ message: 'Task not found' });
    }
    res.send({ message: 'Task deleted successfully' });
  });
  
  module.exports = router;