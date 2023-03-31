const Sequelize = '../../../config/sequelize.js';
const axios = require('axios');
const HealthShop = '../../../models/HealthShopModel.js';
const HealthShopOrder = '../../../models/HealthShopOrderModel.js';
const responseResolver = require('../../../utils/responseResolver');
// const fs = "node:fs";

module.exports.handler = async (event) => {
  let transaction = await Sequelize.transaction();
  const { dateFrom, dateTo } = event.body;
  try {
    let orders = [];
    let orderLength;
    await axios
      .get(process.env.GET_ORDER_HEALTH_SHOP, {
        params: {
          fromDate: dateFrom,
          toDate: dateTo
        }
      })
      .then(function (res) {
        orderLength = res.data.length;
        const drug = 'Drug';
        if (orderLength > 0) {
          for (let i = 0; i < orderLength; i++) {
            if (res.data[i].orderType == drug) {
              orders.push(res.data[i]);
            }
          }
        } else {
          orders = [];
        }
      });
    const ordersLength = orders.length;
    if (orderLength > 0) {
      let insOrders = [];
      let insOrderDetail = [];
      let paymentMethod = '';
      let taxAmount = '';
      let vendorOrderReference = '';
      let trackingUrl = '';
      let rejectCode;
      let rejectReason = '';
      let tempTrxId;
      let tempOrderId;
      for (let i = 0; i < ordersLength; i++) {
        if (orders[i].paymentMethod == '') {
          paymentMethod = '';
        } else {
          paymentMethod = orders[i].paymentMethod;
        }
        if (orders[i].channel == '') {
          paymentMethod = '';
        } else {
          paymentMethod = orders[i].channel;
        }
        if (orders[i].taxAmount == '') {
          taxAmount = '';
        } else {
          taxAmount = orders[i].taxAmount;
        }
        if (orders[i].vendorOrderReference == '') {
          vendorOrderReference = '';
        } else {
          vendorOrderReference = orders[i].vendorOrderReference;
        }
        if (orders[i].trackingUrl == '') {
          trackingUrl = '';
        } else {
          trackingUrl = orders[i].trackingUrl;
        }
        if (orders[i].rejectCode == '') {
          rejectCode = '';
        } else {
          rejectCode = orders[i].rejectCode;
        }
        if (orders[i].rejectReason == '') {
          rejectReason = '';
        } else {
          rejectReason = orders[i].rejectReason;
        }
        insOrders[i] = await HealthShop.create(
          {
            order_id: orders[i].orderId,
            patient_id: orders[i].patientId,
            patient_name: orders[i].patientName,
            patient_mobile: orders[i].patientMobile,
            patient_email: orders[i].patientEmail,
            order_status: orders[i].orderStatus,
            order_type: orders[i].orderType,
            payment_method: paymentMethod,
            vendor_id: orders[i].vendorId,
            order_amount: orders[i].orderAmount,
            tax_amount: taxAmount,
            order_date: orders[i].orderDate,
            order_time: orders[i].orderTime,
            update_time: orders[i].updateTime,
            vendor_order_reference: vendorOrderReference,
            total_price: orders[i].totalPrice,
            latitude: orders[i].geolocation['latitude'],
            longitude: orders[i].geolocation['longitude'],
            address_note: orders[i].addressNote,
            store_id: orders[i].storeId,
            shipping_fee: orders[i].shippingFee,
            delivery_status: orders[i].deliveryStatus,
            tracking_url: trackingUrl,
            reject_code: rejectCode,
            reject_reason: rejectReason
          },
          { transaction }
        );
        tempTrxId = insOrders[i].id;
        tempOrderId = insOrders[i].order_id;
        for (let j = 0; j < orders[i].drugOrderItems.length; j++) {
          await HealthShopOrder.create(
            {
              item_id: orders[i].drugOrderItems[j].id,
              order_id: tempOrderId,
              item_name: orders[i].drugOrderItems[j].name,
              image: orders[i].drugOrderItems[j].image,
              qty: orders[i].drugOrderItems[j].qty,
              price: orders[i].drugOrderItems[j].price,
              orderHealthShopId: tempTrxId
            },
            { transaction }
          ).then(function (resData) {
            insOrderDetail.push(resData);
          });
        }
        tempTrxId = '';
        tempOrderId = '';
      }
      let insertHealthShopCount = insOrders.length;
      let insertHealthShopDetailCount = insOrderDetail.length;
      await transaction.commit();
      let result = {
        orderFetchCount: orderLength,
        insertHealthShopCount,
        insertHealthShopDetailCount,
        dataHealthShopDetail: insOrderDetail
      };
      return responseResolver({ result });
    } else {
      return responseResolver(
        { message: 'Health Shop Order Not Found in date : ' + dateFrom + ' - ' + dateTo },
        404
      );
    }
  } catch (error) {
    await transaction.rollback();
    return responseResolver({ message: error.message }, 400);
  }
};
