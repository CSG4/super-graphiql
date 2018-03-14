const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    id: { type: Number, required: true, unique: true},
    name: { type: String },
    subjectId: { type: String },
})

const Student = mongoose.model('student', studentSchema);

module.exports = Student;