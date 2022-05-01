const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayjs = require('dayjs')

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },

  date: {
    type: String,
    default: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  },

});

module.exports = User = mongoose.model("users", UserSchema);
