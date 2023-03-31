const Users = '../../../models/UserModel.js';
const bcrypt = 'bcrypt';
const jwt = 'jsonwebtoken';
const responseResolver = require('../../../utils/responseResolver');

module.exports.handler = async (event) => {
  try {
    const user = await Users.findAll({
      where: {
        email: event.body.email
      }
    });
    const match = await bcrypt.compare(event.body.password, user[0].password);
    if (!match) return responseResolver({ message: 'Wrong Password' }, 400);
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;
    const role = user[0].role;
    const accessToken = jwt.sign({ userId, name, email, role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h'
    });
    await Users.update(
      { refresh_token: accessToken },
      {
        where: {
          id: userId
        }
      }
    );
    return responseResolver({ result: accessToken });
  } catch (error) {
    return responseResolver({ message: 'Email not found' }, 404);
  }
};
