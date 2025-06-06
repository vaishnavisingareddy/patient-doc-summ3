import mongoose from 'mongoose';

const AnalysisResultSchema = new mongoose.Schema({
  transcription: String,
  patientInfo: {
    name: String,
    age: String,
    gender: String,
  },
  symptoms: [String],
  detailedAnalysis: {
    possibleCauses: String,
    medications: String,
    prescriptions: String,
    lifestyle: String,
  },
  followUp: String,
}, { timestamps: true });

export default mongoose.model('AnalysisResult', AnalysisResultSchema);
