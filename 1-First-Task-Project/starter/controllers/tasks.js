const getAllTasks = (req, res) => {
    res.send('all the tasks')
}

const getTask = (req, res) => {
    res.send('get one task')
}

const createTask = (req, res) => {
    res.json(req.body)
}

const updateTask = (req, res) => {
    res.send('update task')
}

const deleteTask = (req, res) => {
    res.send('delete task')
}

module.exports = {
    getAllTasks,
    getTask,
    updateTask,
    deleteTask,
    createTask
}