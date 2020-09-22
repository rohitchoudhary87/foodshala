const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  name : {
    type: String,
    required : true
  },
  phone : {
    type : String,
    required : true
  },
  qty : {
    type : Number,
    required : true
  },
  textarea : {
    type : String,
    required : true
  },
  date : {
    type : Date,
    default : Date.now
  }
});

mongoose.model('orders' , OrderSchema);