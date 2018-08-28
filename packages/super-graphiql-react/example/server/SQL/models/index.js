// TODO => Join queries functionality


const Sequelize = require('sequelize');

// Introduce your database connection information.
const sequelize = new Sequelize('<your database>', '<db user>', '<password>', {
  dialect: 'postgres',
  define: {
    underscored: true,
  },
});

// The database model:
// Table student
// Table subject
// Join table class 

const models = {
  Student: sequelize.import('./student'),
  Subject: sequelize.import('./subject'),
  Class: sequelize.import('./class')
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
