import express from 'express';
import socketIO from 'socket.io';
import initIoClient from 'socket.io-client';
import { Server } from 'http';
import cors from 'cors';

import { PORT } from './utils/config';
import Arranger from './server';

const app = express();
app.use(cors());

const http = Server(app);
const io = socketIO(http);
const ioSocket = initIoClient(`http://localhost:5051`, {
  query: {
    type: 'ARRANGER_WORKER',
  },
});

export default function() {
  return Arranger({ io, ioSocket }).then(router => {
    app.use(router);
    http.listen(PORT, async () => {
      console.log(`⚡️⚡️⚡️ Listening on port ${PORT} ⚡️⚡️⚡️`);
    });
  });
}
