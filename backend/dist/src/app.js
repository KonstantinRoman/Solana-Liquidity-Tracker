import express from 'express';
import router from './modules/pools/pools.routes.js';
export const app = express();
app.use(express.json());
app.use('/api', router);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString });
});
