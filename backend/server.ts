import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './db';
// import analysisRoutes from './routes/analysis';
import router from './routes/analysis'; 

const app = express();
const PORT = 5000;

connectDB();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/analysis', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
