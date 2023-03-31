import Users from '../../../models/UserModel.js';
import jwt from 'jsonwebtoken';
import responseResolver from '../../../utils/responseResolver.js';

const getAdminIdByJWT = async (token) => {
  let userId;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return responseResolver({}, 403);
    userId = decoded.userId;
  });
  let role;
  let response;
  await Users.findOne({
    where: {
      id: userId
    }
  }).then(function (result) {
    role = result.role;
  });
  if (role == 'admin') {
    response = userId;
    return response;
  } else {
    return false;
  }
};

module.exports = getAdminIdByJWT;
