const bcrypt = require('bcrypt');
const db = require('../db/meeting');

module.exports = (app) => {
  const passport = require('passport');
  const LocalStrategy = require('passport-local').Strategy;

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((id, done) => {
    done(null, id);
  });

  passport.deserializeUser((id, done) => {
    const sql = 'select * from user where id = ?';
    db.query(sql, [id], (err, result) => {
      done(null, result[0].id);
    });
  });

  passport.use(new LocalStrategy({
    usernameField: 'name',
    passwordField: 'password',
  },
  (name, password, done) => {
    const sql = 'select * from user where user_id = ?';
    db.query(sql, [name], (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (errBcrypt, res) => {
          if (res) {
            return done(null, result[0].id);
          }
          return done(null, false, {
            message: 'login failed',
          });
        });
      } else {
        return done(null, false, { message: 'login failed' });
      }
    });
  }));

  return passport;
};
