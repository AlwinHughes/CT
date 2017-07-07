const mongoose = require('mongoose');

const SolveSchema = new mongoose.Schema({
  solve_time: Number,
  time: String,
  scramble: {type: String, default: ''},
  user_id: String,
  penalty: {type: String, default: '' }
});


module.exports = mongoose.model('Solve', SolveSchema);
