const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

async function list(req, res) {
  const data = await theatersService.list();

  const reduceMovies = reduceProperties("theater_id", {
    movie_id: ["movies", null, "movie_id"],
    title: ["movies", null, "title"],
    rating: ["movies", null, "rating"],
    runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
    description: ["movies", null, "description"],
    image_url: ["movies", null, "image_url"],
    is_showing: ["movies", null, "is_showing"],
  });

  const theaters = reduceMovies(data);

  const result = theaters.map((theaterEntry) => {
    const theater_id = theaterEntry.theater_id;
    theaterEntry.movies = theaterEntry.movies.map((movieEntry) => {
      movieEntry.theater_id = theater_id;
      return movieEntry;
    });
    return theaterEntry;
  });

  res.json({ data: result });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
