const mongoose = require("mongoose");

const todoSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  isDone: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Todo", todoSchema);
