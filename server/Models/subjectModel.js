const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String },
  professor: { type: String },
})

const Subject = mongoose.model('subject', subjectSchema);

module.exports = Subject;