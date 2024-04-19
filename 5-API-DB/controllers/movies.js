// import { MovieModel } from '../models/movie.js'
import { MovieModel } from '../models/mysql/movies.js'
import { validateMovie, validatePartialMovie } from '../schemes/movies.js'

export class MovieController {
  constructor ({ movieModel }) {
    this.movieModel = movieModel
  }

  getAll = async (req, res) => {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre })
    // que es lo que renderiza
    res.json(movies)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const movie = await MovieModel.getById({ id })
    if (movie) return res.json(movie)
    res.status(404).json({ message: 'Movie not found.' })
  }

  create = async (req, res) => {
    const result = validateMovie(req.body)
    if (!result.success) {
      // 422 Unprocessable entity
      // Bad Request
      return res.status(400).json({
        message: JSON.parse(result.error.message)
      })
    }
    const newMovie = await MovieModel.create({ input: result.data })
    res.status(201).json(newMovie) // actualizar la caché del cliente
  }

  update = async (req, res) => {
    const result = validatePartialMovie(req.body)
    if (!result.success) {
      return res.status(400).json({
        message: JSON.parse(result.error.message)
      })
    }
    const { id } = req.params
    const updatedMovie = await MovieModel.update({ id, input: result.data })
    res.json(updatedMovie)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await MovieModel.delete({ id })
    if (result) return res.json({ message: 'Movie deleted' })
    res.status(404).json({ message: 'Movie not found.' })
  }
}
