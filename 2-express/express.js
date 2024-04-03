const express = require('express')
const app = express()
const dittoJSON = require('./pokeapi/ditto.json')
const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

app.use('/', (req, res, next) => {
  console.log('mi primer middleware')
  next()
})

app.use(express.json())

// app.use('/', (req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   // solo llega request que son POST y que tienen header content-type: application/json
//   let body = ''
//   // escuchar el evento data
//   req.on('data', chunk => {
//     body += chunk.toString()
//   })
//   req.on('end', () => {
//     const data = JSON.parse(body)
//     // mutar la request y meter la informacion en el req.body
//     req.body = data
//     next()
//   })
// })

app.get('/', (req, res) => {
  res.send('<h1>Mi página</h1>')
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(dittoJSON)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
