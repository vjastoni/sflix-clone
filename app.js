const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

//Models
const Movie = require('./models/movie');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

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
// One to One
User.hasOne(Cart);
Cart.belongsTo(User);
//Many to many
Cart.belongsToMany(Movie, { through: CartItem });
Movie.belongsToMany(Cart, { through: CartItem });
//One to many
Order.belongsTo(User);
User.hasMany(Order);
//Many to many
Order.belongsToMany(Movie, { through: OrderItem });

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
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
