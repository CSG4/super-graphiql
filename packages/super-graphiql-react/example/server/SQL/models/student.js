module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('student', {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  Student.associate = (models) => {
    Student.belongsToMany(models.Subject, {
      through: 'class',
      foreignKey: {
        name: 'studentId',
        field: 'student_id',
      },
    });  
  };

  return Student;
}

