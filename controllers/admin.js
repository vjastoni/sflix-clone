const Movie = require('../models/movie');

exports.getAddMovie = (req, res, next) => {
  res.render('admin/edit-movie', {
    pageTitle: 'Add Movie',
    path: '/admin/add-movie',
    editing: false
  });
};

exports.postAddMovie = (req, res, next) => {
  const movie = new Movie( 
    null,
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.ratings
  );
  movie.save();
  res.redirect('/');
};

exports.getEditMovie = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode){
    return res.redirect('/')
  }
  const movId = req.params.movieId;
  Movie.findById(movId, movie =>{
    if(!movie){
      return res.redirect('/')
    }
    res.render('admin/edit-movie', {
      pageTitle: 'Edit Movie',
      path: 'admin/edit-movie',
      editing: editMode,
      movie: movie
    })
  })
}

exports.postEditMovie = (req, res, next) => {
   const movId = req.body.movieId;
   const updatedTitle = req.body.title;
   const updatedPrice = req.body.price;
   const updatedImageUrl = req.body.description;
   const updatedRatings = req.body.ratings;
   const updatedMovie = new Movie(
    movId,updatedTitle, updatedPrice,updatedImageUrl, updatedRatings
   )
   updatedMovie.save();
   res.redirect('/admin/movies')
}

exports.getMovies = (req, res, next) => {
  Movie.fetchAll((movies) => {
    res.render('admin/movies', {
      mov: movies,
      pageTitle: 'Admin Movies',
      path: '/admin/movies',
    });
  });
};

exports.postDeleteMovie = (req, res, next) => {
  const movId = req.body.movieId;
  Movie.deleteById(movId);
  res.redirect('/admin/movies')
}
