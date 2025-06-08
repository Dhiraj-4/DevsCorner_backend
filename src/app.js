import express from 'express';
import morgan from 'morgan';
import apiRouter from './routes/apiRoutes.js';
import { connectDb, PORT } from './config/serverConfig.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cookieParser());

// Allow frontend origin + credentials
app.use(cors({
  origin: 'http://localhost:5173',  // frontend origin
  credentials: true,                // allow cookies
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok'})
});

app.use('/api', apiRouter);

try {
    app.listen(PORT, () => {
    connectDb();
    console.log(`Server is up on ${PORT}`);
    });
} catch (error) {
    console.log("Something went wrong!!");
    console.error(error);
}

export default app;