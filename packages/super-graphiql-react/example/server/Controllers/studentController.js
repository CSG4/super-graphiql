const Student = require(".././Models/studentModel");

const studentController = {};

studentController.addStudent = function(req, res) {
  let { id, name, subjectId } = req.body;

  Student.create({ id, name, subjectId }, (err, doc) => {
    if (err || !doc) return err ? res.send(err) : res.sendStatus(500);
    return res.json(doc);
  });
};

studentController.rmStudent = function(req, res) {
  let { id } = req.body;

  Student.findOneAndRemove({ id }, (err, doc) => {
    if (err || !doc) return err ? res.send(err) : res.sendStatus(500);
    return res.json(doc);
  });
};

module.exports = studentController;
