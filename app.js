const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const adminData = require('./routes/admin');
const movieRoutes = require('./routes/movies');

app.use('/admin', adminData.routes);
app.use(movieRoutes);

// Error Handling
app.use(errorController.get404);

app.listen(3000);
