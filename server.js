const express = require('express');                                               // Marvin
const app = express();                                                            // Marvin
const port = 8000;                                                                // Marvin
const bodyParser = require('body-parser');                                        // Marvin
const urlencodedParser = bodyParser.urlencoded({ extended: true });               // Marvin
const mongoose = require('mongoose');                                             // Marvin
const passport = require('passport');                                             // Inge
require('dotenv').config();                                                       // Marvin

// Connect to database trough Mongoose
mongoose.connect(                                                                 // Marvin
  process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);

// Create Mongoose connection
const db = mongoose.connection;                                                   // Marvin
db.on('error', console.error.bind(console, 'connection error:'));

// Create user model
const userSchema = require('./routes/Schemas/users');
const Users = mongoose.model('users', userSchema, 'users');

// Function to create user instance in database
const createUser = (email, password, firstName, lastName, age, gender, pets, smoke, kids) => {
  Users.create({
    email: email,
    password: password,
    profile: {
      name: {
        firstName: firstName,
        lastName: lastName
      },
      age: age,
      gender: gender,
      pets: pets,
      smoke: smoke,
      kids: kids
    }
  });
};

// Middleware
app
  .set('view engine', 'ejs')                                                      // Marvin
  .set('views', 'views')                                                          // Marvin
  .use(express.static(__dirname + '/public'))                                     // Marvin
  .use(passport.initialize())                                                     // Inge
  .use(passport.session())                                                        // Inge
  .use('/', require('./routes/signup'))                                           // Marvin
  .use('/feed', require('./routes/feed'))                                         // Marvin
  .use('/login', require('./routes/login'))                                       // Marvin
  .post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
      res.redirect('/feed');
    })
  .listen(port, () => console.log(`Server is running on localhost:${port}`));     // Marvin

// Export variables and arrays
exports.db = db;
exports.Users = Users;

// Export functions
exports.urlencodedParser = urlencodedParser;
exports.createUser = createUser;