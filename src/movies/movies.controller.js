const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await moviesService.read(req.params.movieId);

  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function read(req, res) {
  const data = await moviesService.read(Number(res.locals.movie.movie_id));
  res.json({ data });
}

async function list(req, res) {
  const { is_showing = null } = req.query;
  const data = await moviesService.list(is_showing);
  const uniqueMovies = []
  data.forEach(movieEntry => {
    if (!uniqueMovies.find(movie => movie.movie_id === movieEntry.movie_id)) {
      uniqueMovies.push(movieEntry)
    }
  })
  res.json({ data: uniqueMovies });
}

async function readMoviesTheaters(req, res) {
  const data = await moviesService.readMoviesTheaters(
    res.locals.movie.movie_id
  );
  res.json({ data });
}

async function readMoviesReviews(req, res) {
  const data = await moviesService.readMoviesReviews(res.locals.movie.movie_id);
  const result = data.map((entry) => {
    const critic = {
      critic_id: entry.critic_id,
      preferred_name: entry.preferred_name,
      surname: entry.surname,
      organization_name: entry.organization_name,
    };
    return {
      "review_id": entry.review_id,
      "content": entry.content,
      "score": entry.score,
      "critic_id": entry.critic_id,
      "movie_id": entry.movie_id,
      critic
    }
  });
  res.json({ data: result });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  readMoviesTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMoviesTheaters),
  ],
  readMoviesReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readMoviesReviews),
  ],
};
