import express from 'express';
import AnalysisResult from '../models/AnalysisResult';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newEntry = new AnalysisResult(req.body);
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save analysis result' });
  }
});

router.get('/', async (_req, res) => {
  try {
    const results = await AnalysisResult.find().sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analysis results' });
  }
});

export default router;
