const { Sequelize } = 'sequelize';
const db = '../config/sequelize.js';

 { DataTypes } = Sequelize;

 Users = db.define(
  'Users',
  {
    name: {
      type: DataTypes.STRING(50)
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    refresh_token: {
      type: DataTypes.TEXT
    }
  },
  {
    freezeTableName: true
  }
);

export default Users;
