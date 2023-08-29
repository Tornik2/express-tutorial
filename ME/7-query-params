const express = require('express')
const { products } = require('./data')

const app = express()


app.get('/', (req, res) => {
  res.send('<h1>HOME</h1> <a href="/api/products"> PRODUCTS</a>')
})

app.get('/api/products', (req, res) => {
  const productsNew = products.map(product => {
    const { id, name, image } = product
    return { id, name, image }
  })

  res.json(productsNew)
})

app.get('/api/products/:id', (req, res) => {
  const prodId =  req.params
  const chosenProduct = products.filter(prod => {
    
    return parseInt(prodId.id) === prod.id})

  if (chosenProduct.length) {
    res.json(chosenProduct)
  } else {
    res.status(404).send('not found')
  }
})

app.get('/api/v1/search', (req, res) => {
  // console.log(req.query)
  const {howMany, firstLetter} = req.query 
  let productsToShow = products

  if (firstLetter) {
    productsToShow = products.filter(prod => prod.name.startsWith(firstLetter))
  } 

  if (howMany) {
   productsToShow = productsToShow.slice(0, howMany)
  }
  
  if (productsToShow.length < 1) {
    // res.status(200).send('no products matched your search');
    return res.status(200).json({ sucess: true, data: [] })
  }
  res.status(200).json(productsToShow)
})

app.listen(5000, () => {
  console.log('Server is listening on port 5000....')
})
