const Sequelize = require('../../../config/sequelize.js');
const axios = require('axios');
const responseResolver = require('../../../utils/responseResolver');
// const fs = "node:fs";

module.exports.handler = async () => {
  let transaction = await Sequelize.transaction();
  try {
    await axios
      .post(
        'https://192.168.106.187:18065/api/prdi/get/notification/reg?ParamIn=0&ParamOut=1',
        {
          // rejectUnauthorized: false,
          // key: fs.readFileSync('./certificates/key.pem'),
          // cert: fs.readFileSync('./certificates/certificate.pem')
        },
        { transaction }
      )
      .then(function (response) {
        const result = response.data.RESPONSE1;
        transaction.commit();
        return responseResolver({ result });
      });
  } catch (error) {
    await transaction.rollback();
    return responseResolver({ message: error.message }, 400);
  }
};
