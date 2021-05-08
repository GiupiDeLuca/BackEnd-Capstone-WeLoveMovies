const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const review = await reviewsService.read(req.params.reviewId);

  if (review) {
    res.locals.review = review;

    return next();
  }
  next({ status: 404, message: "Review cannot be found." });
}

async function destroy(req, res) {
  const data = await reviewsService.delete(res.locals.review.review_id);
  res.status(204).json({ data });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  
  await reviewsService.update(updatedReview);

  const newData = await reviewsService.read(
    Number(res.locals.review.review_id)
  );

  const critic = {
    critic_id: res.locals.review.critic_id,
    preferred_name: res.locals.review.preferred_name,
    surname: res.locals.review.surname,
    organization_name: res.locals.review.organization_name,
  };
  const result = {
    review_id: newData.review_id,
    content: newData.content,
    created_at: new Date().toLocaleDateString(),
    updated_at: new Date().toLocaleDateString(),
    score: newData.score,
    critic_id: newData.critic_id,
    movie_id: newData.movie_id,
    critic,
  };

  res.json({ data: result });
}



module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
