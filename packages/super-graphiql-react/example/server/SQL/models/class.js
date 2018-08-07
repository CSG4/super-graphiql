module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define('class', {
    attend: {
      type: DataTypes.BOOLEAN
    },
    student_id: { type: DataTypes.INTEGER },
    subject_id: { type: DataTypes.INTEGER }
  });

  return Class;
}