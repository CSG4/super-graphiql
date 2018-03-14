const Subject = require('.././Models/subjectModel');

const subjectController = {};

subjectController.addSubject = function(req, res) {
  let { id, name, professor } = req.body;

  Subject.create({ id, name, professor }, (err, doc) => {
    if (err || !doc) return (err) ? res.send(err) : res.sendStatus(500);
    return res.json(doc);
  });
};

subjectController.rmSubject = function(req, res) {
  let { id } = req.body;

  Subject.findOneAndRemove({ id }, (err, doc) =>{
    if (err || !doc) return (err) ? res.send(err) : res.sendStatus(500);
    return res.json(doc);
  })
};

subjectController.editSubject = function(req, res) {
  // let { id } = req.body;

  // Subject.findOneAndUpdate({ id }, (err, doc) => {
  //   if (err || !doc) return (err) ? res.send(err) : res.sendStatus(500);
  //   return res.json(doc);
  // })
};

module.exports = subjectController;