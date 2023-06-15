const Movie = require('../models/movie');

exports.getAddMovie = (req, res, next) => {
  res.render('admin/edit-movie', {
    pageTitle: 'Add Movie',
    path: '/admin/add-movie',
    editing: false,
  });
};

exports.postAddMovie = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const ratings = req.body.ratings;
  req.user
    .createMovie({
      title: title,
      price: price,
      imageUrl: imageUrl,
      ratings: ratings,
    })
    .then((result) => {
      console.log(result);
      res.redirect('/admin/movies');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditMovie = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const movId = req.params.movieId;
  req.user
    .getMovies({ where: { id: movId } })
    // Movie.findByPk(movId)
    .then((movies) => {
      const movie = movies[0];
      if (!movie) {
        return res.redirect('/');
      }
      res.render('admin/edit-movie', {
        pageTitle: 'Edit Movie',
        path: 'admin/edit-movie',
        editing: editMode,
        movie: movie,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditMovie = (req, res, next) => {
  const movId = req.body.movieId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedRatings = req.body.ratings;
  Movie.findByPk(movId)
    .then((movie) => {
      movie.title = updatedTitle;
      movie.price = updatedPrice;
      movie.imageUrl = updatedImageUrl;
      movie.ratings = updatedRatings;
      return movie.save();
    })
    .then((result) => {
      console.log('Updated Movie');
      res.redirect('/admin/movies');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMovies = (req, res, next) => {
  req.user
    .getMovies()
    .then((movies) => {
      res.render('admin/movies', {
        mov: movies,
        pageTitle: 'Admin Movies',
        path: '/admin/movies',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteMovie = (req, res, next) => {
  const movId = req.body.movieId;
  Movie.findByPk(movId)
    .then((movie) => {
      return movie.destroy();
    })
    .then((result) => {
      console.log('Destroyed Movie');
      res.redirect('/admin/movies');
    })
    .catch((err) => {
      console.log(err);
    });
};
