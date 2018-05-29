import { createServer } from 'http';

import api from './server';
import { PORT } from './constants';
console.log('[SERVER] Bed\'N\'Blockchain API starting....');
const SERVER_START = `[SERVER] Bed\'N\'Blockchain API sucessfully started on ${PORT}! That took`;
console.time(SERVER_START);
const server = createServer(api);
server.listen(PORT, () => console.timeEnd(SERVER_START));

if (process.env.NODE_ENV === 'development' && module.hot) {
  let currentApp = api;
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    const hotApp = require('./server').default;
    server.on('request', hotApp);
    currentApp = hotApp;
  });
}
