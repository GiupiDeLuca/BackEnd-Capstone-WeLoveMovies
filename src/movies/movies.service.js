const knex = require("../db/connection");

function list(is_showing) {
  let result = knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*", "mt.is_showing");

  if (is_showing) {
    result.where({ "mt.is_showing": true });
  }
  return result;
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function readMoviesTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select("t.*", "m.movie_id")
    .where({ "m.movie_id": movieId });
}

function readMoviesReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "m.movie_id", "c.*")
    .where({ "m.movie_id": movieId });
}

module.exports = {
  read,
  list,
  readMoviesTheaters,
  readMoviesReviews,
};
