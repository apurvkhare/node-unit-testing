const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: params => `${params.value} is not a valid email address!`
    }
  },
  age: { type: Number, required: true }
});

module.exports = mongoose.model('User', userSchema);
