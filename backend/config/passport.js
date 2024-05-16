const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
  // Local strategy
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Find user by email
    User.findOne({ email: email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }
        // Check password
        user.comparePassword(password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid email or password' });
          }
        });
      })
      .catch(err => console.log(err));
  }));

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
