const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add-movie', adminController.getAddMovie);

router.get('/movies', adminController.getMovies);

router.post('/add-movie', adminController.postAddMovie);

router.get('/edit-movie/:movieId', adminController.getEditMovie);

router.post('/edit-movie', adminController.postEditMovie);

router.post('/delete-product', adminController.postDeleteMovie)

exports.routes = router;
