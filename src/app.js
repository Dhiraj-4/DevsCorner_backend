import express from 'express';
import morgan from 'morgan';
import apiRouter from './routes/apiRoutes.js';
import { connectDb, FRONTEND_URL, PORT } from './config/serverConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { createServer } from "http";
import { Server } from 'socket.io';
import registerSocketHandlers from './socket/index.js';

const app = express();

app.use(cookieParser());

// Allow frontend origin + credentials
app.use(cors({
  origin: FRONTEND_URL,  // frontend origin
  credentials: true,                // allow cookies
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok'})
});

app.use('/api', apiRouter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

registerSocketHandlers(io);

try {
    server.listen(PORT, () => {
    connectDb();
    console.log(`Server is up on ${PORT}`);
    });
} catch (error) {
    console.log("Something went wrong!!");
    console.error(error);
}

export default app;