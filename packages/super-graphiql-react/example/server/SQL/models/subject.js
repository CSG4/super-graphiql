module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('subject', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teacher: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Subject.associate = (models) => {
    Subject.belongsToMany(models.Student, {
      through: 'class',
      foreignKey: {
        name: 'subjectId',
        field: 'subject_id',
      },
    });
  };

  return Subject;
}
