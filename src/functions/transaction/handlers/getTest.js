'use strict';

const LabTest = '../../../models/LabTestModel.js';
const LabTestOrder = '../../../models/LabTestOrderModel.js';
const getAdminIdByJWT = '../../user/services/getAdminIdByJWT.js';
const responseResolver = require('../../../utils/responseResolver');
// const fs = "node:fs";

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
    return responseResolver({ message: 'You are not allowed to access this API' }, 403);
  } else {
    const { page, totalRow } = event.query;
    let currentPage = parseInt(page);
    let totalData = parseInt(totalRow);
    let curPage;
    if (currentPage > 1) {
      curPage = currentPage * totalData - totalData;
    } else {
      curPage = 0;
    }
    const labTest = await LabTest.findAll({
      include: [
        {
          model: LabTestOrder,
          as: 'labtestorders',
          order: [['LabTest.updatedAt', 'DESC']]
        }
      ],
      limit: totalData,
      offset: curPage
    });
    try {
      let countData = labTest.length;
      let result = {
        totalData: countData,
        page: currentPage,
        data: labTest
      };
      return responseResolver({ result });
    } catch (error) {
      return responseResolver({ message: error.message }, 400);
    }
  }
};
