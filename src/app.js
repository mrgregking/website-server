const path = require("path")
const express = require("express")
const hbs = require("hbs")
const geocode = require("./utils/geocode")
const forecast = require("./utils/forecast")

const app = express()
const port = process.env.PORT || 3000

// - Define paths for Express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

// - Setup handlebars engine and views location
app.set("view engine", "hbs")
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

// - Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: "You must provide a address",
    })
  }
  // - The second parameter below in geocode we destructured
  geocode(
    req.query.address,
    // - The empty object below helps insure the code continues to run
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error: error })
      }
      forecast(latitude, longitude, (error, forcastData) => {
        if (error) {
          // - error below has the shorter syntax
          return res.send({ error })
        }
        res.send({
          forecast: forcastData,
          location,
          address: req.query.address,
        })
      })
    }
  )
})

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search",
    })
  }
  console.log(req.query.search)
  res.send({
    products: [],
  })
})

app.get("", (req, res) => {
  res.render("index", {
    title: "Weather Forecast",
    name: "Greg King",
  })
})

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    name: "Greg King",
  })
})

app.get("/help", (req, res) => {
  res.render("help", {
    helpText:
      "This is a make believe help page, don't plan on this page doing anything for you - haha!",
    title: "Help Page",
    name: "Greg King",
  })
})
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    errorMessage: "Help article not found error!",
  })
})
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 Error",
    name: "Greg King",
    errorMessage: "Page not found error!",
  })
})

// - Starts up the server on port or port 3000
app.listen(port, () => {
  console.log("Server is up on port " + port + "!")
})
