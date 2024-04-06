import express, { json } from 'express'
// import movies from './movies.json'
import { corsMiddleware } from './middleware/cors.js'
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))
import { moviesRouter } from './routes/movies.js'

const app = express()
const PORT = process.env.PORT ?? 1234
app.disable('x-powered-by') // deshabilitar el header X-POWERED-BY
app.use(json())

app.use(corsMiddleware())

// métodos normales: GET/HEAD/POST
// metodos con complejos: PUT/PATCH/DELETE

// CORS PRE-FLIGHT
// OPTIONS

app.get('/', (req, res) => {
  res.json({ message: 'Hola mundo' })
})

app.use('/movies', moviesRouter)

// app.options('/movies/:id', (req, res) => {
//   const origin = req.header('origin')
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
//   }
//   res.sendStatus(200)
// })

app.listen(PORT, () => {
  console.log(`Server listening on PORT http://localhost:${PORT}`)
})
