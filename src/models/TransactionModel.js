const { Sequelize } = 'sequelize';
const db = '../config/sequelize.js';

 { DataTypes } = Sequelize;

 Transaction = db.define(
  'transaction',
  {
    amount: {
      type: DataTypes.DOUBLE
    },
    content: {
      type: DataTypes.STRING
    },
    paymentType: {
      type: DataTypes.STRING(50) // CC, VA, Bank Transafer, E_Wallet
    },
    merchantId: {
      type: DataTypes.INTEGER
    },
    adminId: {
      type: DataTypes.INTEGER
    }
  },
  {
    freezeTableName: true
  }
);

export default Transaction;
