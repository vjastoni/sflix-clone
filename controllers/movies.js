const Movie = require('../models/movie');

exports.getMovies = (req, res, next) => {
  Movie.findAll()
    .then((movies) => {
      res.render('shop/movie-list', {
        mov: movies,
        pageTitle: 'All Movies',
        path: '/movies',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getMovie = (req, res, next) => {
  const movId = req.params.movieId;
  Movie.findByPk(movId).then((movie) => {
    res.render('shop/movie-details', {
      movie: movie,
      pageTitle: movie.title,
      path: '/movies',
    });
  });
};

exports.getIndex = (req, res, next) => {
  Movie.findAll()
    .then((movies) => {
      res.render('shop/index', {
        mov: movies,
        pageTitle: 'Sflix',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      return cart
        .getMovies()
        .then((movies) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            movies: movies,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCart = (req, res, next) => {
  const movId = req.body.movieId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getMovies({ where: { id: movId } });
    })
    .then((movies) => {
      let movie;
      if (movies.length > 0) {
        movie = movies[0];
      }
      if (movie) {
        const oldQuantity = movie.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return movie;
      }
      //adding new movie for the first time
      return Movie.findByPk(movId);
    })
    .then((movie) => {
      return fetchedCart.addMovie(movie, { through: { quantity: newQuantity } });
    })
    .then(() => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postCartDeleteMovie = (req, res, next) => {
  const movId = req.body.movieId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getMovies({ where: { id: movId } });
    })
    .then((movies) => {
      const movie = movies[0];
      movie.cartItem.destroy();
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      //fetched the cart to reuse to the other promise down
      fetchedCart = cart;
      return cart.getMovies();
    })
    .then((movies) => {
      //magic method createOrder()
      return req.user
        .createOrder()
        .then((order) => {
          //addMovies will pick the movies to get add to the order
          return order.addMovies(
            //Returning new items in the order item
            movies.map((movie) => {
              movie.orderItem = { quantity: movie.cartItem.quantity };
              return movie;
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .then((result) => {
      return fetchedCart.setMovies(null);
    })
    .then((result) => {
      res.redirect('/orders');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['movies'] })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
