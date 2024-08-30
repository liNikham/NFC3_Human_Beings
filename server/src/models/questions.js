const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: String,
  choices: [String],
  correctAnswer: String,
  strict: Boolean // True for strict questions, false for flexible
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
