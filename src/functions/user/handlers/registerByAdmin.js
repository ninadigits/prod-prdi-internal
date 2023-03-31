const Users = '../../../models/UserModel.js';
const bcrypt = 'bcrypt';
const getAdminIdByJWT = '../services/getAdminIdByJWT.js';
const responseResolver = require('../../../utils/responseResolver');

module.exports.handler = async (event) => {
  const authHeader = event.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return responseResolver({}, 401);
  let getUser = getAdminIdByJWT(token);
  let userId;
  await getUser.then(function (result) {
    userId = result;
  });
  if (userId == false) {
    console.log('FALSE : ', userId);
    return responseResolver({ message: 'You are not allowed to get this action' }, 403);
  } else {
    const { name, email, password, confPassword, role } = event.body;
    if (password !== confPassword) {
      console.log('password : ', password);
      console.log('confpassword : ', confPassword);
      // eslint-disable-next-line quotes
      return responseResolver({ message: `Password doesn't match` }, 400);
    }
    let checkEmail = await Users.findOne({
      where: {
        email: email
      }
    });
    if (checkEmail) return responseResolver({ message: 'Email Already Used' }, 400);
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    console.log('same : ', hashPassword);
    try {
      let roleLowerCase = role.toLowerCase();
      const userCreate = await Users.create({
        name: name,
        email: email,
        password: hashPassword,
        role: roleLowerCase
      });
      return responseResolver({ result: userCreate });
    } catch (error) {
      return responseResolver({ message: error.message }, 400);
    }
  }
};
