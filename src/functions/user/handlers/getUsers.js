const Users = '../../../models/UserModel.js';
const responseResolver = require('../../../utils/responseResolver');

module.exports.handler = async () => {
  try {
    let users = await Users.findAll({
      attributes: ['id', 'name', 'email']
    });
    //
    return responseResolver({ result: users });
  } catch (error) {
    return responseResolver({ message: error.message }, 400);
  }
};
