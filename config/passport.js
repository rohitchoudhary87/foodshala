const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const keys = require('./keys');
// Load user model
const User = mongoose.model('users');

//load restaurant model
require('../models/Restaurant');
const Restaurant = mongoose.model('restaurants');

module.exports = function(passport){

  //local strategy for restaurants
  
  //console.log('localllll');
  //passport.use(new LocalStrategy({usernameField: 'email'} , (email,password,done) => {
    //console.log(email);
    //console.log(password);
  //}));

  passport.use(new LocalStrategy({usernameField : 'email'} , (email,password,done) => {
  
    //match restaurant
    Restaurant.findOne({email : email})
      .then(restaurant => {
        if(!restaurant){
          return done(null , false , {message: 'Restaurant not found'});
        }
  
        //match password
        bcrypt.compare(password , restaurant.password , (err ,isMatch) => {
          if(err ) throw err;
          if(isMatch){
            return done(null , restaurant);
          }else{
            return done(null , false , {message : 'Incorrect password'});
          }
        })
  
      });
   }));
  
   //serialize and deserialize user
   //passport.serializeUser(function(restaurant, done) {
    //done(null, restaurant.id);
    //});
  
  //passport.deserializeUser(function(id, done) {
  //Restaurant.findById(id, function(err, restaurant) {
    // done(err, restaurant);
    //});
  //});


  //local strategy end


  //Google strategy for users
  passport.use(
    new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret:keys.googleClientSecret,
      callbackURL:'/auth/google/callback',
      proxy: true
    }, (accessToken, refreshToken, profile, done) => {
      //console.log(accessToken);
      //console.log(profile);
      
      const newUser = {
        googleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        image: profile.photos[0].value
      }

      // Check for existing user
      User.findOne({
        googleID: profile.id
      }).then(user => {
        if(user){
          // Return user
          done(null, user);
        } else {
          // Create user
          new User(newUser)
            .save()
            .then(user => done(null, user));
        }
      })
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
}