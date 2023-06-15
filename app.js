const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

//Models
const Movie = require('./models/movie');
const User = require('./models/user');

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Dummy User Middleware
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

const adminData = require('./routes/admin');
const movieRoutes = require('./routes/movies');

app.use('/admin', adminData.routes);
app.use(movieRoutes);

// Error Handling
app.use(errorController.get404);

//Associations
// One to Many
Movie.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Movie);

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: 'Jas', email: 'test@test.com' });
    }
    return user;
  })
  .then((user) => {
    // console.log(user);
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
