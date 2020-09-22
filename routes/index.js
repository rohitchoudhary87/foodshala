const express = require('express');
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/restrict');
const router = express.Router();

//Home route
router.get('/' , (req,res) => {
  res.render('index/welcome');
});

//dashboard restaurants
router.get('/dashboard/restaurants' , (req,res) => {
  res.render('dashboard/restaurant');
});

//dashboard customers
router.get('/dashboard/customers' , ensureAuthenticated , (req,res) => {
  res.render('dashboard/customers');
});

//About page
router.get('/about' , (req,res) => {
  res.render('index/about');
});


module.exports = router;