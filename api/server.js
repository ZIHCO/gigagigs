import { config } from 'dotenv';
import cors from 'cors';
import express from 'express';
import router from './routes/index';
import {join} from 'path';

config();

const server = express();

// parses incoming requests with JSON payloads and cookieparse response
server.use(cors({
  origin: ['http://192.168.169.6:3000', 'http://localhost:3000'],
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/', router);

//serve static files
server.use('/uploads', express.static(join(__dirname, 'uploads')));

// Not found
server.use((req, res) => res.status(404).json({ error: 'Not found'}));

const port = process.env.API_PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}\n...`);
});
