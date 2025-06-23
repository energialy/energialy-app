//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const { app, server } = require('./src/server.js');
const { conn } = require('./src/db.js');

const port = process.env.PORT ?? 3001;

// Only use alter: true in development
const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };

conn.sync(syncOptions).then(() => {
  server.listen(port, () => {
    console.log(`%s listening at ${port}`); // eslint-disable-line no-console
  });
}).catch((error) => {
  console.error('Database sync failed:', error);
  // In production, try to start the server anyway
  if (process.env.NODE_ENV === 'production') {
    server.listen(port, () => {
      console.log(`%s listening at ${port} (without DB sync)`); // eslint-disable-line no-console
    });
  }
});

module.exports = app;
