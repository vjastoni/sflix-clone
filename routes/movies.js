const express = require('express');

const movieController = require('../controllers/movies');

const router = express.Router();

router.get('/', movieController.getIndex);

router.get('/movies', movieController.getMovies);

router.get('/movies/:movieId', movieController.getMovie)

router.get('/cart', movieController.getCart);

router.post('/cart-delete-movie', movieController.postCartDeleteMovie)

router.post('/cart', movieController.postCart);

router.get('/orders', movieController.getOrders);

router.get('/checkout', movieController.getCheckout);

module.exports = router;
