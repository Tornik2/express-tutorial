const Task = require('../models/Task')
const asyncWrapper = require('../middleware/async')
const { createCustomError } = require('../errors/custom-error')

const getAllTasks = asyncWrapper(async (req, res) => {
  const tasks = await Task.find({})
  res.status(200).json({ tasks })
})

const getTask = asyncWrapper(async (req, res, next ) => {
        const task = await Task.findOne({_id: req.params.id})
        if(!task) {
            return next(createCustomError(`no task with the id - ${req.params.id}`, 404))
        }
        res.json({ task })
})

const createTask = asyncWrapper (async (req, res) => {
     const task = await Task.create(req.body)
        res.status(201).json({task})
    })

const updateTask = asyncWrapper (async (req, res, next) => {
        const task = await Task.findByIdAndUpdate(
            {_id: req.params.id}, req.body,
            {new: true,
            runValidators: true
        })
        if(!task) {
            return next(createCustomError(`no task with the id - ${req.params.id}`, 404))
        }
        res.status(200).json({task})
})

const deleteTask = asyncWrapper (async (req, res, next) => {
        const taskToDelete = await Task.findByIdAndDelete({_id: req.params.id})
        if(!taskToDelete) {
            return next(createCustomError(`no task with the id - ${req.params.id}`, 404))
        }
        res.status(200).json({taskToDelete})
    
})

module.exports = {
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    createTask
}