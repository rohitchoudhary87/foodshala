const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');
const router = express.Router();

//load restaurant model
require('../models/Restaurant');
const Restaurant = mongoose.model('restaurants');


//restaurant login route
router.get('/login' , (req,res) => {
  res.render('restaurant/login');
});

//restaurant login form process
router.post('/login' , (req,res,next) => {
  passport.authenticate('local' , {
    successRedirect : '/dashboard/restaurants',
    failureRedirect : '/restaurant/login',
    failureFlash : true,
  })(req,res,next);
});


//restaurant register route
router.get('/register' , (req,res) => {
  res.render('restaurant/register');
});

//restaurant register form POST
router.post('/register' , (req,res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({ text: 'uh-oh! passwords do not match' })
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'password must be atleast 4 characters' });
  }

  if(errors.length > 0){
    res.render('restaurant/register' , {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  }else{
    //res.send('passed');

    Restaurant.findOne({ email: req.body.email })
      .then(restaurant => {
        if (restaurant) {
          req.flash('error_msg', 'Restaurant already exists');
          res.redirect('/restaurant/register');
        } else {
          const newRestaurant = new Restaurant({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newRestaurant.password, salt, (err, hash) => {
              if (err) throw err;
              newRestaurant.password = hash;

              newRestaurant.save()
                .then(restaurant => {
                  req.flash('success_msg', 'Restaurant registered successfully.Please login.');
                  res.redirect('/restaurant/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });

  }

});



module.exports = router;