const people = require('../data')

const getPeople = (req, res) => {
    res.status(200).json({ success: true, data: people })
}

const createPerson = (req, res) => {
    const { name } = req.body
  if (!name) {
    return res
      .status(400)
      .json({ success: false, msg: 'please provide name value' })
  }
  res.status(201).json({ success: true, person: name })
}

const getSinglePerson = (req, res) => {
    const { id } =  req.params
      const person = people.find((person) => person.id === Number(id))

      res.json(person)
}
module.exports = {
    getPeople,
    createPerson,
    getSinglePerson
}