import mysql from 'mysql2/promise'
import { appendMoviesGenres } from '../../utils.js'

const config = {
  host: 'localhost',
  user: 'ETORRES',
  port: '3306',
  password: '',
  database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll ({ genre }) {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()
      const [genres] = await connection.query('SELECT id, name FROM genre WHERE LOWER(name) = ?', [lowerCaseGenre])

      if (genres.length === 0) return []
      const [{ id }] = genres
      const [movieFiltered] = await connection.query('SELECT BIN_TO_UUID(movie_id) id FROM movie_genre WHERE genre_id = ?;', [id])
      const movieIds = movieFiltered.map(({ id }) => id)
      const [movies] = await connection.query('SELECT BIN_TO_UUID(mov.id) id, mov.title, mov.year, mov.director, mov.duration, mov.poster, mov.rate, g.name FROM movie mov INNER JOIN movie_genre mg ON mov.id = mg.movie_id INNER JOIN genre g ON mg.genre_id = g.id WHERE BIN_TO_UUID(mov.id) IN (?)', [movieIds])
      const allMovies = appendMoviesGenres({ movies })
      return allMovies
    }
    const [movies] = await connection.query('SELECT BIN_TO_UUID(mov.id) id, mov.title, mov.year, mov.director, mov.duration, mov.poster, mov.rate, g.name FROM movie mov INNER JOIN movie_genre mg ON mov.id = mg.movie_id INNER JOIN genre g ON mg.genre_id = g.id;')

    const allMovies = appendMoviesGenres({ movies })
    return allMovies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [id])
    if (movies.length === 0) return null
    return movies[0]
  }

  static async create ({ input }) {
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster,
      genre
    } = input
    try {
      await connection.query('INSERT INTO movie (id, title, year, duration, director, rate, poster) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);', [uuid, title, year, duration, director, rate, poster])

      const [genres] = await connection.query('SELECT id FROM genre WHERE name IN (?)', [genre])
      genres.forEach(async ({ id }) => {
        await connection.query('INSERT INTO movie_genre (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);', [uuid, id])
      })

      const [newMovie] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [uuid])
      return newMovie
    } catch (e) {
      throw new Error('Error creating movie')
    }
  }

  static async delete ({ id }) {
    try {
      const [result] = await connection.query('DELETE FROM movie WHERE id = UUID_TO_BIN(?);', [id])
      if (result.affectedRows === 0) return false
      return true
    } catch (e) {
      throw new Error('Error deleting movie')
    }
  }

  static async update ({ id, input }) {
    const [[movie]] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', [id])
    if (movie.length === 0 || !movie) return null
    const updatedMovie = { ...movie, ...input }
    const { title, year, duration, director, rate, poster } = updatedMovie

    try {
      await connection.query('UPDATE movie SET title = ?, year = ?, duration = ?, director = ?, rate = ?, poster = ? WHERE id = UUID_TO_BIN(?);', [title, year, duration, director, rate, poster, id])
      return updatedMovie
    } catch (e) {
      throw new Error('Error updating movie')
    }
  }
}
