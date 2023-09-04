const notFound = (req, res) => {
    return res.status(404).send('page not found')
}

module.exports = notFound