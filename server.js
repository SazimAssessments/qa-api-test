const express = require("express")
const bodyParser = require("body-parser")

const app = express()
const PORT = 3050

const hardcodedUser = {
  username: "testuser",
  password: "password123",
}

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (token === "dummy_token") {
    next()
  } else {
    res.status(401).send("Unauthorized")
  }
}

app.use(bodyParser.json())

app.post("/authenticate", (req, res) => {
  const { username, password } = req.body

  if (username === hardcodedUser.username && password === hardcodedUser.password) {
    res.json({ token: "dummy_token" })
    res.status(401).send("Unauthorized")
  }
})

app.use(authenticate)

let products = []

app.post("/products", (req, res) => {
  const { name, price } = req.body
  const product = { id: products.length + 1, name, price }
  products.push(product)
  res.json(product)
})

app.get("/products", (req, res) => {
  const productsText = products.map((product) => `${product.name}: $${product.price}`).join("\n")
  res.type("text").send(productsText)
})

app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const product = products.find((product) => product.id === id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).send("Product not found")
  }
})

app.patch("/products/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const { name, price } = req.body
  const productIndex = products.findIndex((product) => product.id === id)
  if (productIndex !== -1) {
    products[productIndex] = { ...products[productIndex], name, price }
    res.json(products[productIndex])
  } else {
    res.status(404).send("Product not found")
  }
})

app.delete("/products/:id", (req, res) => {
  const id = parseInt(req.params.id)
  const productIndex = products.findIndex((product) => product.id === id)
  if (productIndex !== -1) {
    const deletedProduct = products.splice(productIndex, 1)
    res.json(deletedProduct)
  } else {
    res.status(404).send("Product not found")
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
