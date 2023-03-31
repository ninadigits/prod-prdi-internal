//  unescapeArray = require('../utils/unescapeArray');
//  mysql = require('mysql');

//  pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   user: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   // queueLimit: 0,
//   connectionLimit: 100,
//   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//   idleTimeout: 5000, // idle connections timeout, in milliseconds, the default value 60000
//   queueLimit: 0,
//   timezone: '+07.00'
// });

// module.exports = {
//   query: async (queryString, options) => {
//     if (Array.isArray(options)) {
//       options = unescapeArray(options);
//     }
//     return new Promise((resolve, reject) => {
//       pool.query(queryString, options, function (err, results) {
//         if (err) {
//           reject(err);
//         }
//         resolve(results);
//       });
//     });
//   },
//   quit: async () => {
//     pool.getConnection(function (err, conn) {
//       conn.release();
//     });
//   }
// };

// /*  unescapeArray = require('../utils/unescapeArray');

//  mysql = require('serverless-mysql')({
//   config: {
//     host: process.env.MYSQL_DATABASE_HOST,
//     database: process.env.MYSQL_DATABASE_NAME,
//     user: process.env.MYSQL_DATABASE_USERNAME,
//     password: process.env.MYSQL_DATABASE_PASSWORD,
//     queueLimit: 0,
//     timezone: 'utc+7' // Thailand Timezone
//   },
//   idleTimeout: 5000
// });

// module.exports = {
//   query: async (queryString, options) => {
//     if (Array.isArray(options)) {
//       options = unescapeArray(options);
//     }
//      result = await mysql.query(queryString, options);
//     return result;
//   },
//   cmd: async (queryString, values) => {
//     return await mysql.transaction().query(queryString, values).commit();
//   },
//   end: async () => {
//     return await mysql.end();
//   },
//   quit: () => {
//     return mysql.quit();
//   },
//   getClient: () => {
//     return mysql.getClient();
//   }
// }; */
