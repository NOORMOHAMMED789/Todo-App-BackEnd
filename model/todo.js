const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("TodoList", todoSchema);
