const LabTest = '../../../models/LabTestModel.js';
const LabTestOrder = '../../../models/LabTestOrderModel.js';
const Sequelize = '../../../config/sequelize.js';
const axios = require('axios');
const responseResolver = require('../../../utils/responseResolver');
// const fs ="node:fs";

module.exports.handler = async (event) => {
  let transaction = await Sequelize.transaction();
  try {
    const { max_record, date_from, date_to, service_type } = event.body;
    let order = [];
    let status;
    const getOrderAPI = process.env.GET_ORDER_LAB_TEST_TRANSACTION;
    // -----------------------------------------------------
    // Start Of : Get Order Transaction Lab Test PRDA + PRDI
    // ------------------------------------------------------
    // eslint-disable-next-line no-unused-vars
    let getOrder = await axios
      .post(getOrderAPI, {
        P1: '1',
        P2: max_record,
        P3: '',
        P4: '',
        P5: '',
        P6: '',
        P7: service_type,
        P8: date_from,
        P9: date_to
      })
      .then(function (res) {
        order.push(res.data.RESPONSE2);
        status = res.data.RESPONSE1[0].CEK_STATUS;
      });
    // -----------------------------------------------------
    // End Of : Get Order Transaction Lab Test PRDA + PRDI
    // ------------------------------------------------------
    if (status == 'SUCCESS') {
      // console.log("test");
      let orderList = order[0];
      // -----------------------------------------------------
      // Start Of : Filter Only PRDI Order Transaction
      // ------------------------------------------------------
      let filterOrder = orderList.filter((orderList) => orderList.ORDER_NUMBER.includes('LTNW'));
      const cntData = filterOrder.length;
      const getOrderPrdiById = process.env.GET_ORDER_LAB_TEST_BY_ID_TRANSACTION;
      for (let i = 0; i < cntData; i++) {
        await axios
          .post(getOrderPrdiById, {
            P1: filterOrder[i].ORDER_NUMBER
          })
          .then(function (orderById) {
            if (orderById.data.RESPONSE3.length !== 0) {
              filterOrder[i]['order_by_id'] = [
                {
                  omzet: orderById.data.RESPONSE2[0].AMOUNT_ACTUAL,
                  omzet_ppn: orderById.data.RESPONSE2[0].AMOUNT_PPN,
                  payment_by: orderById.data.RESPONSE2[0].PAYMENT_CHANNEL,
                  omzet_ppn_free: orderById.data.RESPONSE2[0].AMOUNT_PPN_FREE,
                  omzet_ppn_levied: orderById.data.RESPONSE2[0].AMOUNT_PPN_LEVIED,
                  // 'tests': orderById.data.RESPONSE3[0].NAME
                  tests: orderById.data.RESPONSE3
                }
              ];
            } else {
              filterOrder[i]['order_by_id'] = [];
            }
          });
      }
      let cntFilterOrder = await filterOrder.length;
      let insTrx = [];
      let tempStatusPayment = '';
      for (let j = 0; j < cntFilterOrder; j++) {
        if (filterOrder[j]['order_by_id'].length !== 0) {
          if (filterOrder[j].CEK_STATUS == 'TOPAY') {
            tempStatusPayment = 'PENDING';
          }
          if (filterOrder[j].CEK_STATUS == 'CANCEL') {
            tempStatusPayment = 'FAILED';
          }
          if (filterOrder[j].CEK_STATUS == 'COMPLETE') {
            tempStatusPayment = 'PAID';
          }
          if (filterOrder[j].CEK_STATUS == 'PROCESS') {
            tempStatusPayment = 'PAID';
          }
          if (filterOrder[j].CEK_STATUS == 'PAID') {
            tempStatusPayment = 'PAID';
          }
          insTrx.push({
            order_id: filterOrder[j].ORDER_NUMBER,
            outlet: filterOrder[j].APPOINTMENT_OUTLET_NAME,
            patient_id: parseInt(filterOrder[j].CUSTOMER_ID),
            status_payment: tempStatusPayment,
            status_order: filterOrder[j].CEK_STATUS,
            payment_by: filterOrder[j].order_by_id[0].payment_by,
            omzet: parseInt(filterOrder[j].order_by_id[0].omzet),
            omzet_ppn: parseInt(filterOrder[j].order_by_id[0].omzet_ppn),
            omzet_ppn_free: parseInt(filterOrder[j].order_by_id[0].omzet_ppn_free),
            tests: filterOrder[j].order_by_id[0].tests,
            home_service: filterOrder[j].SERVICE_TYPE,
            referral_type_id: filterOrder[j].REFERRAL_DOCTOR_SPECIALITY,
            doctor_name: filterOrder[j].REFERRAL_DOCTOR_NAME,
            row_id: filterOrder[j].ROW_ID,
            order_date: filterOrder[j].CREATED_AT
          });
          tempStatusPayment = '';
        }
      }
      const countInsTrx = insTrx.length;
      let dataInsTrx = [];
      let dataInsTest = [];
      // -----------------------------------------------------
      // Start Of : Data Valid Transaction PRDI Will Be Store
      // ------------------------------------------------------
      let tempTrxId = '';
      let tempOrderId = '';
      for (let k = 0; k < countInsTrx; k++) {
        dataInsTrx[k] = await LabTest.create(
          {
            order_id: insTrx[k].order_id,
            outlet: insTrx[k].outlet,
            patient_id: insTrx[k].patient_id,
            status_payment: insTrx[k].status_payment,
            status_order: insTrx[k].status_order,
            payment_by: insTrx[k].payment_by,
            omzet: insTrx[k].omzet,
            omzet_ppn: insTrx[k].omzet_ppn,
            omzet_ppn_free: insTrx[k].omzet_ppn_free,
            home_service: insTrx[k].home_service,
            referral_type_id: insTrx[k].referral_type_id,
            doctor_name: insTrx[k].doctor_name,
            row_id: insTrx[k].row_id,
            order_date: insTrx[k].order_date
          },
          { transaction }
        );
        tempTrxId = dataInsTrx[k].id;
        tempOrderId = dataInsTrx[k].order_id;
        for (let jk = 0; jk < insTrx[k].tests.length; jk++) {
          await LabTestOrder.create(
            {
              order_id: tempOrderId,
              test_id: insTrx[k].tests[jk].TYPE_ID,
              test_name: insTrx[k].tests[jk].NAME,
              price_actual: insTrx[k].tests[jk].PRICE_ACTUAL,
              quantity: insTrx[k].tests[jk].QUANTITY,
              type: insTrx[k].tests[jk].TYPE,
              orderLabTestId: tempTrxId
            },
            { transaction }
          ).then(function (resData) {
            dataInsTest.push(resData);
          });
        }
        tempTrxId = '';
        tempOrderId = '';
      }
      let countDataTrxIns = dataInsTrx.length;
      let countDataOrderTest = dataInsTest.length;
      await transaction.commit();

      let result = {
        cntData,
        countDataTrxIns,
        countDataOrderTest,
        dataInsTrx,
        dataInsTest
      };
      return responseResolver({ result });
    } else {
      return responseResolver({ message: 'Data Order Not Found' }, 404);
    }
  } catch (error) {
    await transaction.rollback();
    return responseResolver({ message: error.message }, 400);
  }
};
