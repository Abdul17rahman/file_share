const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  isVerified: {
    type: Boolean,
    default: false,
  },
  uploaded: {
    type: Array,
    default: [],
  },
  sharedWithMe: {
    type: Array,
    default: [],
  },
  veri_token: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
