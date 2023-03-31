const HealthShop = '../../../models/HealthShopModel.js';
const HealthShopOrder = '../../../models/HealthShopOrderModel.js';
const responseResolver = require('../../../utils/responseResolver');
// const fs = "node:fs";

module.exports.handler = async (event) => {
  const { page, totalRow } = event.query;
  let currentPage = parseInt(page);
  let totalData = parseInt(totalRow);
  let curPage;
  if (currentPage > 1) {
    curPage = currentPage * totalData - totalData;
  } else {
    curPage = 0;
  }
  const healthShopDetail = await HealthShop.findAll({
    include: [
      {
        model: HealthShopOrder,
        as: 'healthshoporders',
        order: [['HealthShopOrder.id', 'ASC']]
      }
    ],
    limit: totalData,
    offset: curPage
  });
  try {
    let countData = healthShopDetail.length;
    let result = {
      page: currentPage,
      totalData: countData,
      healthShopDetail
    };
    return responseResolver({ result });
  } catch (error) {
    return responseResolver({ message: error.message }, 400);
  }
};
