const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//load restaurant model
require("../models/Menu");
const Menu = mongoose.model("menus");
//load Order model
require("../models/Order");
const Order = mongoose.model("orders");

//Order add route
router.get("/order", (req, res) => {
  res.render("menu/order");
});
//orders see route
router.get("/see", (req, res) => {
  Order.find({}).then(orders => {
    res.render("menu/see", {
      orders: orders.map(orders => orders.toJSON())
    });
  });
});

//post order
router.post("/orders", (req, res) => {
  const newOrder = {
    name: req.body.name,
    phone: req.body.phone,
    qty: req.body.qty,
    textarea: req.body.textarea
  };
  new Order(newOrder).save().then(requirement => {
    req.flash(
      "success_msg",
      "Thank You!your Order has been placed, We will reach you soon... "
    );
    res.redirect("/menu/index");
  });
});

//menu item
router.get("/", (req, res) => {
  res.render("menu/index");
});

//add menu item
router.get("/add", (req, res) => {
  res.render("menu/add");
});

//menu index
router.get("/index", (req, res) => {
  Menu.find({}).then(menus => {
    res.render("menu/index", {
      menus: menus.map(menus => menus.toJSON())
    });
  });
});

//add menu item post
router.post("/", (req, res) => {
  //console.log(req.body);
  //res.send('passes menu');
  const newMenu = {
    name: req.body.name,
    menu: req.body.menu,
    price: req.body.price,
    description: req.body.description
  };

  //create menu
  new Menu(newMenu).save().then(menu => {
    res.redirect("menu/index");
  });
});

module.exports = router;
