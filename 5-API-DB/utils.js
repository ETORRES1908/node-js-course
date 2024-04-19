import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

export const readJSON = (path) => require(path)

export const appendMoviesGenres = ({ movies }) => {
  const allMovies = []
  movies.forEach(movie => {
    const { id, title, year, director, duration, poster, rate, name } = movie
    if (!allMovies.find(m => m.id === id)) {
      allMovies.push({ id, title, year, director, duration, poster, rate, genre: [name] })
    } else {
      allMovies.find(m => m.id === id).genre.push(name)
    }
  })
  return allMovies
}
